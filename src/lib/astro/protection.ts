import { createHmac, timingSafeEqual } from "node:crypto";
import type { NextRequest, NextResponse } from "next/server";

const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const ASTRO_SESSION_COOKIE = "ap_astro_session";
const ASTRO_SESSION_TTL_SECONDS = 30 * 60;

type TurnstileVerifyResult = {
  success: boolean;
  errorCodes: string[];
};

const getProtectionSecret = (): string | null => {
  return process.env.TURNSTILE_SECRET_KEY?.trim() || null;
};

const getSessionSignature = (payload: string): string => {
  const secret = getProtectionSecret();
  if (!secret) {
    throw new Error("TURNSTILE_SECRET_KEY is not configured.");
  }

  return createHmac("sha256", `${secret}:astro-session`).update(payload).digest("base64url");
};

const buildSessionCookieValue = (): string => {
  const expiresAt = String(Date.now() + ASTRO_SESSION_TTL_SECONDS * 1000);
  const signature = getSessionSignature(expiresAt);
  return `${expiresAt}.${signature}`;
};

export const astroProtectionEnabled = (): boolean => {
  return Boolean(getProtectionSecret());
};

export const astroProtectionRequired = (): boolean => {
  return process.env.NODE_ENV === "production" || astroProtectionEnabled();
};

export const hasAstroSession = (request: NextRequest): boolean => {
  const raw = request.cookies.get(ASTRO_SESSION_COOKIE)?.value;
  if (!raw) {
    return false;
  }

  const [expiresAt, signature] = raw.split(".");
  if (!expiresAt || !signature) {
    return false;
  }

  const expiration = Number(expiresAt);
  if (!Number.isFinite(expiration) || expiration <= Date.now()) {
    return false;
  }

  try {
    const expected = getSessionSignature(expiresAt);
    if (expected.length !== signature.length) {
      return false;
    }

    return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
};

export const setAstroSession = (response: NextResponse): void => {
  response.cookies.set(ASTRO_SESSION_COOKIE, buildSessionCookieValue(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ASTRO_SESSION_TTL_SECONDS
  });
};

export const verifyTurnstileToken = async ({
  token,
  ip,
  userAgent
}: {
  token: string;
  ip?: string;
  userAgent?: string | null;
}): Promise<TurnstileVerifyResult> => {
  const secret = getProtectionSecret();
  if (!secret) {
    return { success: false, errorCodes: ["missing-input-secret"] };
  }

  const body = new URLSearchParams({
    secret,
    response: token
  });

  if (ip) {
    body.set("remoteip", ip);
  }

  const response = await fetch(TURNSTILE_VERIFY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      ...(userAgent ? { "User-Agent": userAgent } : {})
    },
    body,
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Turnstile verification failed (${response.status})`);
  }

  const payload = (await response.json()) as {
    success?: boolean;
    "error-codes"?: string[];
  };

  return {
    success: Boolean(payload.success),
    errorCodes: payload["error-codes"] ?? []
  };
};
