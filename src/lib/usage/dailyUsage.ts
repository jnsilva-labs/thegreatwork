import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";

export const DAILY_USAGE_COOKIE = "ap_daily_usage";

const LIMITS = {
  tarot: 10,
  natal: 3
} as const;

const USAGE_KEYS = ["v", "id", "day", "tarotUsed", "natalUsed"] as const;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export type UsageKind = "tarot" | "natal";

export type DailyUsage = {
  v: 1;
  id: string;
  day: string;
  tarotUsed: number;
  natalUsed: number;
};

export class DailyUsageConfigurationError extends Error {
  constructor() {
    super("DAILY_USAGE_COOKIE_SECRET is not configured.");
    this.name = "DailyUsageConfigurationError";
  }
}

const getSecret = (): string => {
  const secret = process.env.DAILY_USAGE_COOKIE_SECRET?.trim();
  if (!secret) {
    throw new DailyUsageConfigurationError();
  }

  return secret;
};

const utcDay = (now: Date): string => now.toISOString().slice(0, 10);

const nextUtcMidnight = (now: Date): Date =>
  new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));

const secondsUntil = (expires: Date, now: Date): number =>
  Math.max(1, Math.ceil((expires.getTime() - now.getTime()) / 1000));

const sign = (payload: string): string =>
  createHmac("sha256", getSecret()).update(payload).digest("base64url");

const isUtcDate = (value: string): boolean => {
  if (!DATE_PATTERN.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  return (
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day
  );
};

const isDailyUsage = (value: unknown): value is DailyUsage => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const record = value as Record<string, unknown>;
  const keys = Object.keys(record);
  if (keys.length !== USAGE_KEYS.length || keys.some((key) => !USAGE_KEYS.includes(key as (typeof USAGE_KEYS)[number]))) {
    return false;
  }

  return (
    record.v === 1 &&
    typeof record.id === "string" &&
    UUID_PATTERN.test(record.id) &&
    typeof record.day === "string" &&
    isUtcDate(record.day) &&
    Number.isSafeInteger(record.tarotUsed) &&
    record.tarotUsed >= 0 &&
    Number.isSafeInteger(record.natalUsed) &&
    record.natalUsed >= 0
  );
};

const freshUsage = (now: Date): DailyUsage => ({
  v: 1,
  id: randomUUID(),
  day: utcDay(now),
  tarotUsed: 0,
  natalUsed: 0
});

export function readDailyUsage({ cookie, now }: { cookie?: string; now: Date }): DailyUsage {
  const secret = getSecret();
  if (!cookie) {
    return freshUsage(now);
  }

  const parts = cookie.split(".");
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    return freshUsage(now);
  }

  const [payload, signature] = parts;
  const expected = createHmac("sha256", secret).update(payload).digest("base64url");
  const signatureBytes = Buffer.from(signature);
  const expectedBytes = Buffer.from(expected);
  if (signatureBytes.length !== expectedBytes.length || !timingSafeEqual(signatureBytes, expectedBytes)) {
    return freshUsage(now);
  }

  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as unknown;
    if (!isDailyUsage(parsed) || parsed.day !== utcDay(now)) {
      return freshUsage(now);
    }

    return parsed;
  } catch {
    return freshUsage(now);
  }
}

export function checkDailyUsage({
  usage,
  kind,
  now
}: {
  usage: DailyUsage;
  kind: UsageKind;
  now: Date;
}): { allowed: boolean; retryAfter: number; remaining: number } {
  const limit = LIMITS[kind];
  const used = kind === "tarot" ? usage.tarotUsed : usage.natalUsed;
  const expires = nextUtcMidnight(now);

  return {
    allowed: used < limit,
    retryAfter: secondsUntil(expires, now),
    remaining: Math.max(0, limit - used)
  };
}

export function incrementDailyUsage(usage: DailyUsage, kind: UsageKind): DailyUsage {
  return kind === "tarot"
    ? { ...usage, tarotUsed: usage.tarotUsed + 1 }
    : { ...usage, natalUsed: usage.natalUsed + 1 };
}

export function serializeDailyUsage(
  usage: DailyUsage,
  now: Date
): { value: string; maxAge: number; expires: Date } {
  const payload = Buffer.from(JSON.stringify(usage)).toString("base64url");
  const expires = nextUtcMidnight(now);

  return {
    value: `${payload}.${sign(payload)}`,
    maxAge: secondsUntil(expires, now),
    expires
  };
}
