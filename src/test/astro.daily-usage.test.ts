import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createNatalHandler } from "@/app/api/astro/natal/handler";
import { readDailyUsage, serializeDailyUsage, type DailyUsage } from "@/lib/usage/dailyUsage";

const SECRET = "natal-handler-test-secret";
const SERVICE_SECRET = "astro-service-test-secret";
const NOW = new Date("2030-04-05T12:00:00.000Z");
const originalUsageSecret = process.env.DAILY_USAGE_COOKIE_SECRET;
const originalServiceSecret = process.env.ASTRO_SERVICE_SECRET;
const originalServiceUrl = process.env.ASTRO_SERVICE_URL;

const input = {
  name: "Aurelia",
  birthDate: "1990-01-01",
  birthTime: "12:00",
  timeUnknown: false,
  birthPlace: "New York, NY",
  houseSystem: "wholeSign",
  zodiac: "tropical" as const
};

const chart = {
  meta: {},
  points: { sun: 10, moon: 40, asc: 70 },
  houses: { cusps: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330] },
  aspects: []
};

const reading = {
  title: "A reading",
  bigThree: { sun: "Aries", moon: "Taurus", rising: "Gemini" },
  snapshot: "A steady beginning.",
  coreThemes: ["Theme"],
  strengths: ["Strength"],
  shadows: ["Shadow"],
  relationships: "Relationship reflection.",
  careerCalling: "Calling reflection.",
  growthKeys: [{ label: "Practice", practice: "Practice it." }],
  paradox: { tension: "Tension", gift: "Gift" },
  mantra: "Attend.",
  disclaimer: "For reflection only."
};

const usage = (natalUsed: number): DailyUsage => ({
  v: 1,
  id: "c447fccb-2ac5-4e5c-b156-55b6cbc2ba81",
  day: "2030-04-05",
  tarotUsed: 0,
  natalUsed
});

const request = (body: unknown = input, headers: HeadersInit = {}) =>
  new NextRequest("https://example.test/api/astro/natal", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify(body)
  });

const createHandler = (overrides: Record<string, unknown> = {}) => {
  const geocode = vi.fn().mockResolvedValue({
    lat: 40.7128,
    lon: -74.006,
    timezone: "America/New_York",
    provider: "test",
    displayName: "New York, NY"
  });
  const fetchChart = vi.fn().mockResolvedValue(chart);
  const generateReading = vi.fn().mockResolvedValue(reading);
  const verifyTurnstile = vi.fn();

  const handler = createNatalHandler({
    now: () => NOW,
    geocode,
    fetchChart,
    generateReading,
    protection: {
      enabled: () => true,
      required: () => true,
      hasSession: () => true,
      setSession: vi.fn(),
      verifyTurnstile
    },
    ...overrides
  });

  return { handler, geocode, fetchChart, generateReading, verifyTurnstile };
};

beforeEach(() => {
  process.env.DAILY_USAGE_COOKIE_SECRET = SECRET;
  process.env.ASTRO_SERVICE_SECRET = SERVICE_SECRET;
  process.env.ASTRO_SERVICE_URL = "https://astro.example.test";
});

afterEach(() => {
  if (originalUsageSecret === undefined) delete process.env.DAILY_USAGE_COOKIE_SECRET;
  else process.env.DAILY_USAGE_COOKIE_SECRET = originalUsageSecret;

  if (originalServiceSecret === undefined) delete process.env.ASTRO_SERVICE_SECRET;
  else process.env.ASTRO_SERVICE_SECRET = originalServiceSecret;

  if (originalServiceUrl === undefined) delete process.env.ASTRO_SERVICE_URL;
  else process.env.ASTRO_SERVICE_URL = originalServiceUrl;
});

describe("natal daily usage handler", () => {
  it("accepts the third authenticated natal reading and signs its usage cookie", async () => {
    const { handler, fetchChart, generateReading, verifyTurnstile } = createHandler();
    const cookie = serializeDailyUsage(usage(2), NOW).value;

    const response = await handler(request(input, { cookie: `ap_daily_usage=${cookie}` }));

    expect(response.status).toBe(200);
    expect(fetchChart).toHaveBeenCalledWith(
      "https://astro.example.test/chart/natal",
      expect.any(Object),
      SERVICE_SECRET
    );
    expect(generateReading).toHaveBeenCalledTimes(1);
    expect(verifyTurnstile).not.toHaveBeenCalled();
    const setCookie = response.headers.get("set-cookie");
    const value = setCookie?.match(/ap_daily_usage=([^;]+)/)?.[1];
    expect(setCookie).toMatch(/Path=\/; .*Max-Age=43200; HttpOnly; SameSite=lax/);
    expect(value).toBeDefined();
    expect(readDailyUsage({ cookie: decodeURIComponent(value ?? ""), now: NOW }).natalUsed).toBe(3);
  });

  it("rejects a fourth natal reading before geocoding", async () => {
    const { handler, geocode, fetchChart, generateReading } = createHandler();
    const cookie = serializeDailyUsage(usage(3), NOW).value;

    const response = await handler(request(input, { cookie: `ap_daily_usage=${cookie}` }));

    expect(response.status).toBe(429);
    await expect(response.json()).resolves.toEqual({
      code: "DAILY_NATAL_LIMIT",
      error: "Your 3 natal readings for today are complete. Return tomorrow to begin again."
    });
    expect(response.headers.get("retry-after")).toBe("43200");
    expect(geocode).not.toHaveBeenCalled();
    expect(fetchChart).not.toHaveBeenCalled();
    expect(generateReading).not.toHaveBeenCalled();
  });

  it("does not consume usage for invalid input", async () => {
    const { handler, geocode } = createHandler();

    const response = await handler(request({ ...input, birthDate: "not-a-date" }));

    expect(response.status).toBe(400);
    expect(response.headers.get("set-cookie")).toBeNull();
    expect(geocode).not.toHaveBeenCalled();
  });

  it("does not consume usage when the Render request fails", async () => {
    const { handler, generateReading } = createHandler({
      fetchChart: vi.fn().mockRejectedValue(new Error("Upstream request failed (502)"))
    });

    const response = await handler(request());

    expect(response.status).toBe(502);
    expect(response.headers.get("set-cookie")).toBeNull();
    expect(generateReading).not.toHaveBeenCalled();
  });

  it("returns a generic 503 without the usage secret", async () => {
    delete process.env.DAILY_USAGE_COOKIE_SECRET;
    const { handler, geocode } = createHandler();

    const response = await handler(request());

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({
      code: "SERVICE_UNAVAILABLE",
      error: "The astrology service is temporarily unavailable."
    });
    expect(geocode).not.toHaveBeenCalled();
  });
});
