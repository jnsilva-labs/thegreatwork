import { NextRequest, NextResponse } from "next/server";
import {
  astroMonthAheadReadingResponseSchema,
  astroMonthAheadRequestSchema,
  astroMonthAheadResponseSchema,
  type AstroChart,
  type AstroMonthAheadResponse
} from "@/lib/astro/types";
import { deriveBigThreeFromChart, derivePlacementFacts } from "@/lib/astro/derive";
import { resolveTransitHouse } from "@/lib/astro/houses";
import {
  astroProtectionEnabled,
  astroProtectionRequired,
  hasAstroSession,
  setAstroSession,
  verifyTurnstileToken
} from "@/lib/astro/protection";
import { requestMonthAheadReading } from "@/lib/openai/respond";

export const runtime = "nodejs";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 12;

const ipRateLimit = new Map<string, { count: number; resetAt: number }>();

const getClientIp = (request: NextRequest): string => {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  return "unknown";
};

const consumeRateLimit = (ip: string): { allowed: boolean; retryAfter: number } => {
  const now = Date.now();
  const current = ipRateLimit.get(ip);

  if (!current || current.resetAt <= now) {
    ipRateLimit.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, retryAfter: 0 };
  }

  if (current.count >= RATE_LIMIT_MAX) {
    return {
      allowed: false,
      retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000))
    };
  }

  current.count += 1;
  ipRateLimit.set(ip, current);

  return { allowed: true, retryAfter: 0 };
};

const jsonError = (
  code: string,
  message: string,
  status: number,
  details?: unknown,
  headers?: Record<string, string>
) => {
  return NextResponse.json(
    {
      code,
      error: message,
      details
    },
    {
      status,
      headers
    }
  );
};

const fetchJsonWithTimeout = async <T>(
  url: string,
  init: RequestInit,
  timeoutMs: number,
  timeoutMessage: string
): Promise<T> => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...init,
      signal: controller.signal
    });

    if (!response.ok) {
      const detail = await response.text();
      throw new Error(`Upstream request failed (${response.status}): ${detail.slice(0, 240)}`);
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error(timeoutMessage);
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
};

const sanitizeChartForTransit = (chart: AstroChart, timeUnknown: boolean): AstroChart => {
  if (!timeUnknown) {
    return chart;
  }

  const sanitized = structuredClone(chart);
  sanitized.houses = null;
  delete sanitized.points.asc;
  delete sanitized.points.mc;
  return sanitized;
};

const toUtcIsoSeconds = (date: Date): string => {
  return date.toISOString().replace(/\.\d{3}Z$/, "Z");
};

const resolveHouseSystemFromChart = (chart: AstroChart): "wholeSign" | "placidus" | null => {
  const explicit = chart.meta?.houseSystem;
  if (explicit === "wholeSign" || explicit === "placidus") {
    return explicit;
  }

  const nestedInput = (chart.meta?.input as { houseSystem?: unknown } | undefined)?.houseSystem;
  if (nestedInput === "wholeSign" || nestedInput === "placidus") {
    return nestedInput;
  }

  return null;
};

const enrichTransitHouses = (
  payload: AstroMonthAheadResponse,
  chart: AstroChart
) => {
  const cusps = chart.houses?.cusps;
  if (!cusps || cusps.length !== 12) {
    return payload;
  }

  return {
    ...payload,
    skyShifts: payload.skyShifts.map((event) => ({
      ...event,
      transitHouse: resolveTransitHouse(event.longitude, cusps) ?? undefined
    })),
    transitContacts: payload.transitContacts.map((event) => ({
      ...event,
      transitHouse: resolveTransitHouse(event.transitLongitude, cusps) ?? undefined
    })),
    highlights: payload.highlights.map((event) => {
      if (event.kind === "skyShift") {
        return {
          ...event,
          transitHouse: resolveTransitHouse(event.longitude, cusps) ?? undefined
        };
      }

      if (event.kind === "transitContact") {
        return {
          ...event,
          transitHouse: resolveTransitHouse(event.transitLongitude, cusps) ?? undefined
        };
      }

      return event;
    })
  };
};

export async function POST(request: NextRequest) {
  const routeStart = performance.now();
  const ip = getClientIp(request);
  const rate = consumeRateLimit(ip);

  if (!rate.allowed) {
    return jsonError(
      "RATE_LIMITED",
      "Too many requests. Please wait before trying again.",
      429,
      null,
      { "Retry-After": String(rate.retryAfter) }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("INVALID_JSON", "Request body must be valid JSON.", 400);
  }

  const parsedInput = astroMonthAheadRequestSchema.safeParse(body);
  if (!parsedInput.success) {
    return jsonError(
      "VALIDATION_ERROR",
      "Request payload failed validation.",
      400,
      parsedInput.error.flatten()
    );
  }

  const input = parsedInput.data;
  const protectionSatisfiedByCookie = hasAstroSession(request);
  let shouldIssueAstroSession = false;

  if (!protectionSatisfiedByCookie && astroProtectionRequired()) {
    if (!astroProtectionEnabled()) {
      return jsonError(
        "PROTECTION_UNAVAILABLE",
        "Astrology verification is not configured on the server.",
        503
      );
    }

    if (!input.turnstileToken) {
      return jsonError(
        "TURNSTILE_REQUIRED",
        "Please complete the verification check before reading the month ahead.",
        400
      );
    }

    try {
      const verification = await verifyTurnstileToken({
        token: input.turnstileToken,
        ip: ip === "unknown" ? undefined : ip,
        userAgent: request.headers.get("user-agent")
      });

      if (!verification.success) {
        return jsonError(
          "TURNSTILE_FAILED",
          "Verification failed. Please try again.",
          403,
          verification.errorCodes
        );
      }

      shouldIssueAstroSession = true;
    } catch {
      return jsonError(
        "TURNSTILE_UNAVAILABLE",
        "Verification service is temporarily unavailable. Please try again.",
        503
      );
    }
  }

  const chart = sanitizeChartForTransit(input.chart, input.timeUnknown);
  const houseSystem = resolveHouseSystemFromChart(chart);
  const canonicalBigThree = deriveBigThreeFromChart(chart, input.timeUnknown);
  const placements = derivePlacementFacts(chart);

  const startDateUtc = input.startDateUtc
    ? new Date(input.startDateUtc)
    : new Date();

  if (!Number.isFinite(startDateUtc.getTime())) {
    return jsonError("INVALID_START_DATE", "startDateUtc must be a valid ISO datetime.", 400);
  }

  const astroServiceUrl = process.env.ASTRO_SERVICE_URL;
  if (!astroServiceUrl) {
    return jsonError("CONFIG_ERROR", "ASTRO_SERVICE_URL is not configured on the server.", 503);
  }

  try {
    const payload = await fetchJsonWithTimeout<unknown>(
      `${astroServiceUrl.replace(/\/$/, "")}/transits/month-ahead`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startDateUtc: toUtcIsoSeconds(startDateUtc),
          durationDays: 30,
          timeUnknown: input.timeUnknown,
          natalPoints: chart.points
        }),
        cache: "no-store"
      },
      12000,
      "Astro service timed out"
    );

    const parsedPayload = astroMonthAheadResponseSchema.safeParse(payload);
    if (!parsedPayload.success) {
      return jsonError(
        "ASTRO_RESPONSE_INVALID",
        "Astro service returned malformed month-ahead data.",
        502,
        parsedPayload.error.flatten()
      );
    }

    const enrichedPayload = enrichTransitHouses(parsedPayload.data, chart);

    const reading = await requestMonthAheadReading({
      chart,
      timeUnknown: input.timeUnknown,
      houseSystem,
      canonicalBigThree,
      placements,
      transits: enrichedPayload,
      timeoutMs: 18000
    });

    const responsePayload = {
      ...enrichedPayload,
      reading
    };

    const validatedResponse = astroMonthAheadReadingResponseSchema.safeParse(responsePayload);
    if (!validatedResponse.success) {
      return jsonError(
        "MONTH_AHEAD_INVALID",
        "Month-ahead reading response failed validation.",
        502,
        validatedResponse.error.flatten()
      );
    }

    const totalMs = performance.now() - routeStart;
    console.info("[api/astro/month-ahead] success", {
      totalMs: Math.round(totalMs),
      timeUnknown: input.timeUnknown,
      highlights: enrichedPayload.highlights.length
    });

    const response = NextResponse.json(validatedResponse.data);

    if (shouldIssueAstroSession) {
      setAstroSession(response);
    }

    return response;
  } catch (error) {
    const totalMs = performance.now() - routeStart;
    const message = error instanceof Error ? error.message : "Unexpected error";

    console.warn("[api/astro/month-ahead] failure", {
      totalMs: Math.round(totalMs),
      message
    });

    if (message.includes("Astro service timed out")) {
      return jsonError("ASTRO_TIMEOUT", "Astro service timed out. Please try again.", 504);
    }

    if (message.includes("Upstream request failed")) {
      return jsonError("UPSTREAM_ERROR", "A required upstream service failed to respond successfully.", 502);
    }

    return jsonError("INTERNAL_ERROR", "Unexpected error while generating the month-ahead events.", 500);
  }
}
