import { NextRequest, NextResponse } from "next/server";
import { geocodeBirthPlace } from "@/lib/astro/geocode";
import { convertBirthLocalToUtc } from "@/lib/astro/time";
import {
  astroChartSchema,
  natalInputSchema,
  type AstroChart,
  type AstroServiceRequest
} from "@/lib/astro/types";
import { requestNatalReading } from "@/lib/openai/respond";
import { deriveBigThreeFromChart, derivePlacementFacts } from "@/lib/astro/derive";
import { hasAstroBetaAccess } from "@/lib/astro/auth";

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

const scrubTimedChartData = (chart: AstroChart): AstroChart => {
  const sanitized = structuredClone(chart);
  sanitized.houses = null;

  const mutablePoints = sanitized.points as Record<string, number | undefined>;
  delete mutablePoints.asc;
  delete mutablePoints.mc;

  return sanitized;
};

export async function POST(request: NextRequest) {
  if (!hasAstroBetaAccess(request.cookies)) {
    return jsonError("UNAUTHORIZED", "Private beta access required.", 401);
  }

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

  const parsedInput = natalInputSchema.safeParse(body);
  if (!parsedInput.success) {
    return jsonError(
      "VALIDATION_ERROR",
      "Request payload failed validation.",
      400,
      parsedInput.error.flatten()
    );
  }

  const input = parsedInput.data;

  let geocodeMs = 0;
  let conversionMs = 0;
  let astroMs = 0;
  let openaiMs = 0;

  try {
    const geocodeStart = performance.now();
    const geocoded = await geocodeBirthPlace(input.birthPlace);
    geocodeMs = performance.now() - geocodeStart;

    const convertStart = performance.now();
    const utcInfo = convertBirthLocalToUtc({
      birthDate: input.birthDate,
      birthTime: input.birthTime,
      timeUnknown: input.timeUnknown,
      timezone: geocoded.timezone
    });
    conversionMs = performance.now() - convertStart;

    const astroRequestBody: AstroServiceRequest = {
      datetimeUtc: utcInfo.datetimeUtc,
      lat: geocoded.lat,
      lon: geocoded.lon,
      zodiac: input.zodiac,
      houseSystem: input.houseSystem,
      aspects: {
        orbDefault: 6,
        orbLuminary: 8
      }
    };

    const astroServiceUrl = process.env.ASTRO_SERVICE_URL;
    if (!astroServiceUrl) {
      return jsonError(
        "CONFIG_ERROR",
        "ASTRO_SERVICE_URL is not configured on the server.",
        503
      );
    }

    const astroStart = performance.now();
    const astroRaw = await fetchJsonWithTimeout<unknown>(
      `${astroServiceUrl.replace(/\/$/, "")}/chart/natal`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(astroRequestBody),
        cache: "no-store"
      },
      12000,
      "Astro service timed out"
    );
    astroMs = performance.now() - astroStart;

    const parsedChart = astroChartSchema.safeParse(astroRaw);
    if (!parsedChart.success) {
      return jsonError(
        "ASTRO_RESPONSE_INVALID",
        "Astro service returned malformed data.",
        502,
        parsedChart.error.flatten()
      );
    }

    const chart = input.timeUnknown
      ? scrubTimedChartData(parsedChart.data)
      : parsedChart.data;

    const canonicalBigThree = deriveBigThreeFromChart(chart, input.timeUnknown);
    const placements = derivePlacementFacts(chart);

    const openaiStart = performance.now();
    const reading = await requestNatalReading({
      name: input.name,
      chart,
      timeUnknown: input.timeUnknown,
      houseSystem: input.houseSystem,
      zodiac: input.zodiac,
      canonicalBigThree,
      placements,
      timeoutMs: 16000
    });
    openaiMs = performance.now() - openaiStart;

    const totalMs = performance.now() - routeStart;

    console.info("[api/astro/natal] success", {
      totalMs: Math.round(totalMs),
      geocodeMs: Math.round(geocodeMs),
      conversionMs: Math.round(conversionMs),
      astroMs: Math.round(astroMs),
      openaiMs: Math.round(openaiMs),
      timeUnknown: input.timeUnknown
    });

    return NextResponse.json({
      chart,
      reading,
      meta: {
        timeUnknown: input.timeUnknown,
        houseSystem: input.houseSystem,
        zodiac: input.zodiac
      }
    });
  } catch (error) {
    const totalMs = performance.now() - routeStart;
    const message = error instanceof Error ? error.message : "Unexpected error";

    console.warn("[api/astro/natal] failure", {
      totalMs: Math.round(totalMs),
      geocodeMs: Math.round(geocodeMs),
      conversionMs: Math.round(conversionMs),
      astroMs: Math.round(astroMs),
      openaiMs: Math.round(openaiMs),
      message
    });

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
}
