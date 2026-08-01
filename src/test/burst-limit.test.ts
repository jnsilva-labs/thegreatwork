import { describe, expect, it } from "vitest";
import { createBurstLimiter } from "@/lib/usage/burstLimit";

const START = new Date("2030-04-05T12:00:00.000Z");

const createLimiter = () =>
  createBurstLimiter({
    windowMs: 60_000,
    inFlightMs: 120_000,
    maxAttempts: 2,
    maxEntries: 2
  });

describe("burst limiter", () => {
  it("allows two reservations in a 60-second window and rejects the third", () => {
    const limiter = createLimiter();

    const first = limiter.reserve("visitor", START);
    first.release();
    const second = limiter.reserve("visitor", START);
    second.release();
    const third = limiter.reserve("visitor", START);

    expect(first).toMatchObject({ allowed: true, retryAfter: 0 });
    expect(second).toMatchObject({ allowed: true, retryAfter: 0 });
    expect(third).toMatchObject({ allowed: false });
    expect(third.retryAfter).toBeGreaterThan(0);
  });

  it("blocks a duplicate reservation while work is active", () => {
    const limiter = createLimiter();

    const first = limiter.reserve("visitor", START);
    const duplicate = limiter.reserve("visitor", START);

    expect(first.allowed).toBe(true);
    expect(duplicate.allowed).toBe(false);
    expect(duplicate.retryAfter).toBe(120);
  });

  it("keeps an active reservation blocked after the attempt window expires", () => {
    const limiter = createLimiter();
    limiter.reserve("visitor", START);

    const duplicate = limiter.reserve("visitor", new Date(START.getTime() + 60_000));

    expect(duplicate.allowed).toBe(false);
    expect(duplicate.retryAfter).toBe(60);
  });

  it("allows another reservation after release", () => {
    const limiter = createLimiter();
    const first = limiter.reserve("visitor", START);

    first.release();
    const next = limiter.reserve("visitor", START);

    expect(next).toMatchObject({ allowed: true, retryAfter: 0 });
  });

  it("removes expired entries before accepting new keys", () => {
    const limiter = createBurstLimiter({
      windowMs: 60_000,
      maxAttempts: 2,
      maxEntries: 1
    });
    const first = limiter.reserve("first", START);
    first.release();

    const nextWindow = new Date(START.getTime() + 60_000);
    expect(limiter.reserve("second", nextWindow)).toMatchObject({ allowed: true, retryAfter: 0 });
  });

  it("does not grow beyond the configured entry limit", () => {
    const limiter = createBurstLimiter({
      windowMs: 60_000,
      inFlightMs: 120_000,
      maxAttempts: 2,
      maxEntries: 1
    });
    const active = limiter.reserve("first", START);

    const overflow = limiter.reserve("second", START);

    expect(active.allowed).toBe(true);
    expect(overflow.allowed).toBe(false);
    expect(overflow.retryAfter).toBe(120);
  });

  it("recovers capacity after an abandoned reservation lease expires", () => {
    const limiter = createBurstLimiter({
      windowMs: 60_000,
      inFlightMs: 10_000,
      maxAttempts: 2,
      maxEntries: 1
    });
    limiter.reserve("abandoned", START);

    const recovered = limiter.reserve("next", new Date(START.getTime() + 10_000));

    expect(recovered).toMatchObject({ allowed: true, retryAfter: 0 });
  });

  it("does not let an abandoned reservation release its replacement", () => {
    const limiter = createBurstLimiter({
      windowMs: 60_000,
      inFlightMs: 10_000,
      maxAttempts: 2,
      maxEntries: 1
    });
    const abandoned = limiter.reserve("visitor", START);
    const replacement = limiter.reserve("visitor", new Date(START.getTime() + 10_000));

    abandoned.release();
    const duplicate = limiter.reserve("visitor", new Date(START.getTime() + 10_001));

    expect(replacement.allowed).toBe(true);
    expect(duplicate.allowed).toBe(false);
  });
});
