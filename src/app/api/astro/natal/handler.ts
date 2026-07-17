import { NextRequest, NextResponse } from "next/server";
import { geocodeBirthPlace } from "@/lib/astro/geocode";
import { getAstroServiceSecret, AstroServiceConfigurationError } from "@/lib/astro/serviceAuth";
import { convertBirthLocalToUtc } from "@/lib/astro/time";
import {
  astroChartSchema,
  natalInputSchema,
  type AstroChart,
  type AstroServiceRequest,
  type GeocodeResult
} from "@/lib/astro/types";
import {
  astroProtectionEnabled,
  astroProtectionRequired,
  hasAstroSession,
  setAstroSession,
  verifyTurnstileToken
} from "@/lib/astro/protection";
import { deriveBigThreeFromChart, derivePlacementFacts } from "@/lib/astro/derive";
import { requestNatalReading } from "@/lib/openai/respond";
import {
  checkDailyUsage,
  DAILY_USAGE_COOKIE,
  DailyUsageConfigurationError,
  incrementDailyUsage,
  readDailyUsage,
  serializeDailyUsage
} from "@/lib/usage/dailyUsage";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 12;

type TurnstileResult = { success: boolean; errorCodes: string[] };

type ProtectionDependencies = {
  enabled: () => boolean;
  required: () => boolean;
  hasSession: (request: NextRequest) => boolean;
  setSession: (response: NextResponse) => void;
  verifyTurnstile: (input: {
    token: string;
    ip?: string;
    userAgent?: string | null;
  }) => Promise<TurnstileResult>;
};

export type NatalHandlerDependencies = {
  now: () => Date;
  geocode: (place: string) => Promise<GeocodeResult>;
  fetchChart: (url: string, body: AstroServiceRequest, serviceSecret: string) => Promise<unknown>;
  generateReading: typeof requestNatalReading;
  protection: ProtectionDependencies;
  getServiceSecret: () => string;
};

const getClientIp = (request: NextRequest): string => {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";

  return request.headers.get("x-real-ip") || "unknown";
};

const createRateLimit = () => {
  const entries = new Map<string, { count: number; resetAt: number }>();

  return (ip: string, now: number): { allowed: boolean; retryAfter: number } => {
    const current = entries.get(ip);
    if (!current || current.resetAt <= now) {
      entries.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
      return { allowed: true, retryAfter: 0 };
    }

    if (current.count >= RATE_LIMIT_MAX) {
      return { allowed: false, retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000)) };
    }

    current.count += 1;
    entries.set(ip, current);
    return { allowed: true, retryAfter: 0 };
  };
};

const jsonError = (
  code: string,
  message: string,
  status: number,
  details?: unknown,
  headers?: Record<string, string>
) => NextResponse.json({ code, error: message, details }, { status, headers });

const fetchChart = async (url: string, body: AstroServiceRequest, serviceSecret: string): Promise<unknown> => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12_000);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Astro-Service-Secret": serviceSecret
      },
      body: JSON.stringify(body),
      cache: "no-store",
      signal: controller.signal
    });

    if (!response.ok) {
      const detail = await response.text();
      throw new Error(`Upstream request failed (${response.status}): ${detail.slice(0, 240)}`);
    }

    return response.json();
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("Astro service timed out");
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
};

const defaultDependencies: NatalHandlerDependencies = {
  now: () => new Date(),
  geocode: geocodeBirthPlace,
  fetchChart,
  generateReading: requestNatalReading,
  protection: {
    enabled: astroProtectionEnabled,
    required: astroProtectionRequired,
    hasSession: hasAstroSession,
    setSession: setAstroSession,
    verifyTurnstile: verifyTurnstileToken
  },
  getServiceSecret: getAstroServiceSecret
};

const scrubTimedChartData = (chart: AstroChart): AstroChart => {
  const sanitized = structuredClone(chart);
  sanitized.houses = null;
  delete sanitized.points.asc;
  delete sanitized.points.mc;
  return sanitized;
};

export const createNatalHandler = (overrides: Partial<NatalHandlerDependencies> = {}) => {
  const dependencies: NatalHandlerDependencies = {
    ...defaultDependencies,
    ...overrides,
    protection: { ...defaultDependencies.protection, ...overrides.protection }
  };
  // This per-instance limiter is only burst control; the signed cookie is the soft daily allowance.
  const consumeRateLimit = createRateLimit();

  return async function handleNatal(request: NextRequest): Promise<NextResponse> {
    const routeStart = performance.now();
    const ip = getClientIp(request);
    const rate = consumeRateLimit(ip, Date.now());
    if (!rate.allowed) {
      return jsonError("RATE_LIMITED", "Too many requests. Please wait before trying again.", 429, null, {
        "Retry-After": String(rate.retryAfter)
      });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return jsonError("INVALID_JSON", "Request body must be valid JSON.", 400);
    }

    const parsedInput = natalInputSchema.safeParse(body);
    if (!parsedInput.success) {
      return jsonError("VALIDATION_ERROR", "Request payload failed validation.", 400, parsedInput.error.flatten());
    }

    const input = parsedInput.data;
    const protectionSatisfiedByCookie = dependencies.protection.hasSession(request);
    let shouldIssueAstroSession = false;

    if (!protectionSatisfiedByCookie && dependencies.protection.required()) {
      if (!dependencies.protection.enabled()) {
        return jsonError("PROTECTION_UNAVAILABLE", "Astrology verification is not configured on the server.", 503);
      }
      if (!input.turnstileToken) {
        return jsonError("TURNSTILE_REQUIRED", "Please complete the verification check before generating a reading.", 400);
      }

      try {
        const verification = await dependencies.protection.verifyTurnstile({
          token: input.turnstileToken,
          ip: ip === "unknown" ? undefined : ip,
          userAgent: request.headers.get("user-agent")
        });
        if (!verification.success) {
          return jsonError("TURNSTILE_FAILED", "Verification failed. Please try again.", 403, verification.errorCodes);
        }
        shouldIssueAstroSession = true;
      } catch {
        return jsonError("TURNSTILE_UNAVAILABLE", "Verification service is temporarily unavailable. Please try again.", 503);
      }
    }

    const currentTime = dependencies.now();
    let usage;
    try {
      usage = readDailyUsage({ cookie: request.cookies.get(DAILY_USAGE_COOKIE)?.value, now: currentTime });
    } catch (error) {
      if (!(error instanceof DailyUsageConfigurationError)) {
        console.error("[api/astro/natal] unable to read daily usage", error);
      }
      return jsonError("SERVICE_UNAVAILABLE", "The astrology service is temporarily unavailable.", 503);
    }

    const quota = checkDailyUsage({ usage, kind: "natal", now: currentTime });
    if (!quota.allowed) {
      return jsonError(
        "DAILY_NATAL_LIMIT",
        "Your 3 natal readings for today are complete. Return tomorrow to begin again.",
        429,
        undefined,
        { "Retry-After": String(quota.retryAfter) }
      );
    }

    let serviceSecret: string;
    try {
      serviceSecret = dependencies.getServiceSecret();
    } catch (error) {
      if (!(error instanceof AstroServiceConfigurationError)) {
        console.error("[api/astro/natal] unable to read astro service secret", error);
      }
      return jsonError("SERVICE_UNAVAILABLE", "The astrology service is temporarily unavailable.", 503);
    }

    let geocodeMs = 0;
    let conversionMs = 0;
    let astroMs = 0;
    let openaiMs = 0;

    try {
      const geocodeStart = performance.now();
      const geocoded = await dependencies.geocode(input.birthPlace);
      geocodeMs = performance.now() - geocodeStart;

      const conversionStart = performance.now();
      const utcInfo = convertBirthLocalToUtc({
        birthDate: input.birthDate,
        birthTime: input.birthTime,
        timeUnknown: input.timeUnknown,
        timezone: geocoded.timezone
      });
      conversionMs = performance.now() - conversionStart;

      const astroServiceUrl = process.env.ASTRO_SERVICE_URL?.trim();
      if (!astroServiceUrl) {
        return jsonError("SERVICE_UNAVAILABLE", "The astrology service is temporarily unavailable.", 503);
      }
      const astroRequest: AstroServiceRequest = {
        datetimeUtc: utcInfo.datetimeUtc,
        lat: geocoded.lat,
        lon: geocoded.lon,
        zodiac: input.zodiac,
        houseSystem: input.houseSystem,
        aspects: { orbDefault: 6, orbLuminary: 8 }
      };

      const astroStart = performance.now();
      const astroRaw = await dependencies.fetchChart(
        `${astroServiceUrl.replace(/\/$/, "")}/chart/natal`,
        astroRequest,
        serviceSecret
      );
      astroMs = performance.now() - astroStart;

      const parsedChart = astroChartSchema.safeParse(astroRaw);
      if (!parsedChart.success) {
        return jsonError("ASTRO_RESPONSE_INVALID", "Astro service returned malformed data.", 502, parsedChart.error.flatten());
      }

      const chart = input.timeUnknown ? scrubTimedChartData(parsedChart.data) : parsedChart.data;
      const canonicalBigThree = deriveBigThreeFromChart(chart, input.timeUnknown);
      const placements = derivePlacementFacts(chart);

      const openaiStart = performance.now();
      const reading = await dependencies.generateReading({
        name: input.name,
        chart,
        timeUnknown: input.timeUnknown,
        houseSystem: input.houseSystem,
        zodiac: input.zodiac,
        canonicalBigThree,
        placements,
        timeoutMs: 16_000
      });
      openaiMs = performance.now() - openaiStart;

      console.info("[api/astro/natal] success", {
        totalMs: Math.round(performance.now() - routeStart),
        geocodeMs: Math.round(geocodeMs),
        conversionMs: Math.round(conversionMs),
        astroMs: Math.round(astroMs),
        openaiMs: Math.round(openaiMs),
        timeUnknown: input.timeUnknown
      });

      const response = NextResponse.json({
        chart,
        reading,
        meta: { timeUnknown: input.timeUnknown, houseSystem: input.houseSystem, zodiac: input.zodiac }
      });
      const serializedUsage = serializeDailyUsage(incrementDailyUsage(usage, "natal"), currentTime);
      response.cookies.set({
        name: DAILY_USAGE_COOKIE,
        value: serializedUsage.value,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        expires: serializedUsage.expires,
        maxAge: serializedUsage.maxAge
      });
      if (shouldIssueAstroSession) dependencies.protection.setSession(response);
      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unexpected error";
      console.warn("[api/astro/natal] failure", {
        totalMs: Math.round(performance.now() - routeStart),
        geocodeMs: Math.round(geocodeMs),
        conversionMs: Math.round(conversionMs),
        astroMs: Math.round(astroMs),
        openaiMs: Math.round(openaiMs),
        message
      });

      if (error instanceof AstroServiceConfigurationError) {
        return jsonError("SERVICE_UNAVAILABLE", "The astrology service is temporarily unavailable.", 503);
      }
      if (message.includes("Geocode") || message.includes("timezone from geocoded")) {
        return jsonError("GEOCODE_FAILED", "Could not resolve that birthplace. Try a more specific location.", 422);
      }
      if (message.includes("Astro service timed out")) {
        return jsonError("ASTRO_TIMEOUT", "Astro service timed out. Please try again.", 504);
      }
      if (message.includes("OpenAI request timed out")) {
        return jsonError("READING_TIMEOUT", "Reading generation timed out. Please try again.", 504);
      }
      if (message.includes("OpenAI request failed")) {
        return jsonError("READING_UPSTREAM_ERROR", "Reading service returned an error. Please try again.", 502);
      }
      if (message.includes("OPENAI_API_KEY")) {
        return jsonError("CONFIG_ERROR", "OPENAI_API_KEY is not configured on the server.", 503);
      }
      if (
        message.includes("Invalid birthDate") ||
        message.includes("Invalid birthTime") ||
        message.includes("Invalid local birth date/time") ||
        message.includes("Invalid timezone")
      ) {
        return jsonError("INVALID_BIRTH_DATETIME", "Birth date/time could not be interpreted for that location.", 400);
      }
      if (message.includes("Upstream request failed")) {
        return jsonError("UPSTREAM_ERROR", "A required upstream service failed to respond successfully.", 502);
      }
      return jsonError("INTERNAL_ERROR", "Unexpected error while generating natal reading.", 500);
    }
  };
};
