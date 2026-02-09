import { timingSafeEqual } from "node:crypto";

export const ASTRO_ACCESS_COOKIE_NAME = "astro_beta_access";

const ASTRO_ACCESS_COOKIE_VALUE = "granted";
const DEFAULT_BETA_PASSWORD = "closefriends";

type CookieReader = {
  get: (name: string) => { value: string } | undefined;
};

const safeEqual = (left: string, right: string): boolean => {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
};

export const getAstroBetaPassword = (): string => {
  return process.env.ASTRO_BETA_PASSWORD ?? DEFAULT_BETA_PASSWORD;
};

export const verifyAstroBetaPassword = (password: string): boolean => {
  return safeEqual(password.trim(), getAstroBetaPassword());
};

export const hasAstroBetaAccess = (cookieStore: CookieReader): boolean => {
  return cookieStore.get(ASTRO_ACCESS_COOKIE_NAME)?.value === ASTRO_ACCESS_COOKIE_VALUE;
};

export const astroAccessCookie = {
  name: ASTRO_ACCESS_COOKIE_NAME,
  value: ASTRO_ACCESS_COOKIE_VALUE,
  maxAge: 60 * 60 * 24 * 30,
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/"
};
