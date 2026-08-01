import { NextResponse } from 'next/server';
import { createHash } from 'node:crypto';
import { Interpretation } from '@/features/tarot/types';
import { createBurstLimiter, type BurstLimiter } from '@/lib/usage/burstLimit';
import {
  checkDailyUsage,
  DAILY_TAROT_LIMIT,
  DAILY_USAGE_COOKIE,
  DailyUsageConfigurationError,
  incrementDailyUsage,
  readDailyUsage,
  readVerifiedDailyUsage,
  serializeDailyUsage,
} from '@/lib/usage/dailyUsage';
import { classifyInterpretError } from './classifier';
import {
  InvalidInterpretationRequest,
  parseSharedInterpretationRequest,
  type SharedInterpretationRequest,
} from './request';

export type InterpretGenerator = (request: SharedInterpretationRequest) => Promise<Interpretation>;

export type InterpretHandlerDependencies = {
  generate: InterpretGenerator;
  now?: () => Date;
  burstLimiter?: BurstLimiter;
};

export const SHARED_TAROT_BURST_LIMIT = {
  windowMs: 60_000,
  inFlightMs: 60_000,
  maxAttempts: 2,
  maxEntries: 10_000,
} as const;

const defaultBurstLimiter = createBurstLimiter(SHARED_TAROT_BURST_LIMIT);

const errorResponse = (code: string, error: string, status: number, retryAfter?: number) =>
  NextResponse.json(
    { code, error },
    {
      status,
      headers: retryAfter ? { 'Retry-After': String(retryAfter) } : undefined,
    },
  );

const readCookie = (request: Request, name: string): string | undefined => {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) {
    return undefined;
  }

  const prefix = `${name}=`;
  const entry = cookieHeader.split(';').map((part) => part.trim()).find((part) => part.startsWith(prefix));
  if (!entry) {
    return undefined;
  }

  try {
    return decodeURIComponent(entry.slice(prefix.length));
  } catch {
    return undefined;
  }
};

const visitorKey = (request: Request, signedUsageId: string | undefined, now: Date): string => {
  if (signedUsageId) {
    return signedUsageId;
  }

  const forwardedFor = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const day = now.toISOString().slice(0, 10);
  return createHash('sha256').update(`${forwardedFor}:${day}`).digest('base64url');
};

/** Creates a testable HTTP boundary around trusted tarot interpretation input. */
export function createInterpretHandler({
  generate,
  now = () => new Date(),
  burstLimiter = defaultBurstLimiter,
}: InterpretHandlerDependencies) {
  return async function handleInterpretation(request: Request): Promise<NextResponse> {
    let parsedRequest: SharedInterpretationRequest;
    try {
      parsedRequest = parseSharedInterpretationRequest(await request.json());
    } catch (error) {
      if (error instanceof InvalidInterpretationRequest || error instanceof SyntaxError) {
        return errorResponse('INVALID_REQUEST', 'Invalid tarot interpretation request.', 400);
      }

      return errorResponse('INVALID_REQUEST', 'Invalid tarot interpretation request.', 400);
    }

    const currentTime = now();
    let usage;
    let signedUsageId: string | undefined;
    try {
      const cookie = readCookie(request, DAILY_USAGE_COOKIE);
      const signedUsage = readVerifiedDailyUsage({ cookie, now: currentTime });
      usage = signedUsage ?? readDailyUsage({ cookie, now: currentTime });
      signedUsageId = signedUsage?.id;
    } catch (error) {
      if (!(error instanceof DailyUsageConfigurationError)) {
        console.error('[tarot/interpret] unable to read daily usage', error);
      }
      return errorResponse(
        'SHARED_SERVICE_UNAVAILABLE',
        'The shared reading service is temporarily unavailable.',
        503,
      );
    }

    const quota = checkDailyUsage({ usage, kind: 'tarot', now: currentTime });
    if (!quota.allowed) {
      return errorResponse(
        'SHARED_QUOTA_EXCEEDED',
        `Your ${DAILY_TAROT_LIMIT} shared Tarot readings for today are complete. Return tomorrow or add a personal Gemini key in Settings.`,
        429,
        quota.retryAfter,
      );
    }

    const reservation = burstLimiter.reserve(visitorKey(request, signedUsageId, currentTime), currentTime);
    if (!reservation.allowed) {
      return errorResponse('SHARED_RATE_LIMITED', 'The shared reading service is busy. Please retry shortly.', 429, reservation.retryAfter);
    }

    try {
      const interpretation = await generate(parsedRequest);
      const updatedUsage = incrementDailyUsage(usage, 'tarot');
      const serializedUsage = serializeDailyUsage(updatedUsage, currentTime);
      const response = NextResponse.json(interpretation);
      response.cookies.set({
        name: DAILY_USAGE_COOKIE,
        value: serializedUsage.value,
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
        expires: serializedUsage.expires,
      });
      return response;
    } catch (error) {
      const classified = classifyInterpretError(error);
      console.error(
        `[tarot/interpret] ${classified.code} (${classified.status})`,
        error instanceof Error ? error.message : error,
      );
      return errorResponse(classified.code, classified.message, classified.status);
    } finally {
      reservation.release();
    }
  };
}
