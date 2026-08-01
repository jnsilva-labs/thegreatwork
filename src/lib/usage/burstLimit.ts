type BurstLimitEntry = {
  attempts: number;
  resetAt: number;
  active: boolean;
  activeUntil: number;
  activeToken: number | undefined;
};

export type BurstLimiterOptions = {
  windowMs: number;
  inFlightMs?: number;
  maxAttempts: number;
  maxEntries: number;
};

export type BurstReservation = {
  allowed: boolean;
  retryAfter: number;
  release: () => void;
};

export type BurstLimiter = {
  reserve: (key: string, now: Date) => BurstReservation;
};

const retryAfter = (resetAt: number, now: number): number =>
  Math.max(1, Math.ceil((resetAt - now) / 1_000));

/**
 * Creates a process-local burst limiter. It is best-effort protection for a
 * single runtime instance, not persistent or distributed rate limiting.
 */
export function createBurstLimiter({
  windowMs,
  inFlightMs = windowMs,
  maxAttempts,
  maxEntries
}: BurstLimiterOptions): BurstLimiter {
  const entries = new Map<string, BurstLimitEntry>();
  let nextActiveToken = 0;

  const clearExpiredEntries = (now: number) => {
    for (const [key, entry] of entries) {
      if (entry.active && entry.activeUntil <= now) {
        entry.active = false;
        entry.activeToken = undefined;
      }

      if (!entry.active && entry.resetAt <= now) {
        entries.delete(key);
      }
    }
  };

  const evictInactiveEntry = (): boolean => {
    for (const [key, entry] of entries) {
      if (!entry.active) {
        entries.delete(key);
        return true;
      }
    }

    return false;
  };

  const reject = (resetAt: number, now: number): BurstReservation => ({
    allowed: false,
    retryAfter: retryAfter(resetAt, now),
    release: () => undefined
  });

  return {
    reserve(key, now) {
      const currentTime = now.getTime();
      clearExpiredEntries(currentTime);

      let entry = entries.get(key);
      if (entry) {
        if (entry.active) {
          return reject(entry.activeUntil, currentTime);
        }

        if (entry.attempts >= maxAttempts) {
          return reject(entry.resetAt, currentTime);
        }
      } else {
        if (entries.size >= maxEntries && !evictInactiveEntry()) {
          const earliestActiveUntil = Math.min(
            ...Array.from(entries.values(), ({ activeUntil }) => activeUntil)
          );
          return reject(earliestActiveUntil, currentTime);
        }

        entry = {
          attempts: 0,
          resetAt: currentTime + windowMs,
          active: false,
          activeUntil: 0,
          activeToken: undefined
        };
        entries.set(key, entry);
      }

      entry.attempts += 1;
      entry.active = true;
      entry.activeUntil = currentTime + inFlightMs;
      const activeToken = ++nextActiveToken;
      entry.activeToken = activeToken;
      let released = false;

      return {
        allowed: true,
        retryAfter: 0,
        release: () => {
          if (!released && entries.get(key) === entry && entry.activeToken === activeToken) {
            entry.active = false;
            entry.activeToken = undefined;
          }

          released = true;
        }
      };
    }
  };
}
