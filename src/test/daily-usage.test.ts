import { createHmac } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  DailyUsageConfigurationError,
  DAILY_TAROT_LIMIT,
  checkDailyUsage,
  incrementDailyUsage,
  readDailyUsage,
  serializeDailyUsage,
  type DailyUsage
} from "@/lib/usage/dailyUsage";

const SECRET = "daily-usage-test-secret";
const NOW = new Date("2030-04-05T12:00:00.000Z");
const ID = "c447fccb-2ac5-4e5c-b156-55b6cbc2ba81";
const originalSecret = process.env.DAILY_USAGE_COOKIE_SECRET;

const usage = (overrides: Partial<DailyUsage> = {}): DailyUsage => ({
  v: 1,
  id: ID,
  day: "2030-04-05",
  tarotUsed: 0,
  natalUsed: 0,
  ...overrides
});

const signEncodedPayload = (encoded: string): string => {
  const signature = createHmac("sha256", SECRET).update(encoded).digest("base64url");
  return `${encoded}.${signature}`;
};

const signPayload = (payload: unknown): string =>
  signEncodedPayload(Buffer.from(JSON.stringify(payload)).toString("base64url"));

beforeEach(() => {
  process.env.DAILY_USAGE_COOKIE_SECRET = SECRET;
});

afterEach(() => {
  if (originalSecret === undefined) {
    delete process.env.DAILY_USAGE_COOKIE_SECRET;
  } else {
    process.env.DAILY_USAGE_COOKIE_SECRET = originalSecret;
  }
});

describe("daily usage", () => {
  it("creates a fresh allowance for a visitor without a cookie", () => {
    expect(readDailyUsage({ cookie: undefined, now: NOW })).toMatchObject({
      v: 1,
      day: "2030-04-05",
      tarotUsed: 0,
      natalUsed: 0
    });
  });

  it("reads a valid signed usage cookie", () => {
    const expected = usage({ tarotUsed: 4, natalUsed: 2 });
    const cookie = serializeDailyUsage(expected, NOW).value;

    expect(readDailyUsage({ cookie, now: NOW })).toEqual(expected);
  });

  it("resets a tampered cookie to a fresh allowance", () => {
    const cookie = serializeDailyUsage(usage({ tarotUsed: 7 }), NOW).value;
    const tampered = `${cookie.slice(0, -1)}${cookie.endsWith("a") ? "b" : "a"}`;

    expect(readDailyUsage({ cookie: tampered, now: NOW })).toMatchObject({
      day: "2030-04-05",
      tarotUsed: 0,
      natalUsed: 0
    });
  });

  it("resets malformed JSON and structurally invalid signed cookies", () => {
    expect(readDailyUsage({ cookie: "not-a-cookie", now: NOW })).toMatchObject({
      tarotUsed: 0,
      natalUsed: 0
    });

    expect(
      readDailyUsage({
        cookie: signEncodedPayload(Buffer.from("this is not JSON").toString("base64url")),
        now: NOW
      })
    ).toMatchObject({ tarotUsed: 0, natalUsed: 0 });

    expect(
      readDailyUsage({
        cookie: signPayload({ ...usage(), unexpected: true }),
        now: NOW
      })
    ).toMatchObject({ tarotUsed: 0, natalUsed: 0 });

    expect(
      readDailyUsage({
        cookie: signPayload(usage({ tarotUsed: Number.MAX_SAFE_INTEGER + 1 })),
        now: NOW
      })
    ).toMatchObject({ tarotUsed: 0, natalUsed: 0 });
  });

  it("resets a signed cookie from a previous UTC day", () => {
    const yesterday = usage({ day: "2030-04-04", tarotUsed: 10, natalUsed: 3 });

    expect(readDailyUsage({ cookie: serializeDailyUsage(yesterday, NOW).value, now: NOW })).toMatchObject({
      day: "2030-04-05",
      tarotUsed: 0,
      natalUsed: 0
    });
  });

  it("throws a typed configuration error when the usage secret is missing or blank", () => {
    delete process.env.DAILY_USAGE_COOKIE_SECRET;
    expect(() => readDailyUsage({ now: NOW })).toThrow(DailyUsageConfigurationError);

    process.env.DAILY_USAGE_COOKIE_SECRET = "   ";
    expect(() => readDailyUsage({ now: NOW })).toThrow(DailyUsageConfigurationError);
  });

  it("allows the tenth tarot reading and rejects the eleventh until UTC midnight", () => {
    const ninth = usage({ tarotUsed: DAILY_TAROT_LIMIT - 1 });
    expect(checkDailyUsage({ usage: ninth, kind: "tarot", now: NOW })).toEqual({
      allowed: true,
      remaining: 1,
      retryAfter: 43_200
    });

    const tenth = incrementDailyUsage(ninth, "tarot");
    expect(tenth.tarotUsed).toBe(DAILY_TAROT_LIMIT);
    expect(checkDailyUsage({ usage: tenth, kind: "tarot", now: NOW })).toEqual({
      allowed: false,
      remaining: 0,
      retryAfter: 43_200
    });
  });

  it("allows the third natal reading and rejects the fourth until UTC midnight", () => {
    const second = usage({ natalUsed: 2 });
    expect(checkDailyUsage({ usage: second, kind: "natal", now: NOW })).toEqual({
      allowed: true,
      remaining: 1,
      retryAfter: 43_200
    });

    const third = incrementDailyUsage(second, "natal");
    expect(third.natalUsed).toBe(3);
    expect(checkDailyUsage({ usage: third, kind: "natal", now: NOW })).toEqual({
      allowed: false,
      remaining: 0,
      retryAfter: 43_200
    });
  });

  it("serializes a signed cookie with the next UTC midnight as its expiry", () => {
    const now = new Date("2030-04-05T23:59:30.000Z");
    const serialized = serializeDailyUsage(usage(), now);

    expect(serialized.value).toContain(".");
    expect(serialized.expires.toISOString()).toBe("2030-04-06T00:00:00.000Z");
    expect(serialized.maxAge).toBe(30);
  });
});
