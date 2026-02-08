import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { signToRowCol, type ZodiacSign } from "../lib/astro/assets/zodiacGrid";

const expectedPositions: Record<ZodiacSign, { row: number; col: number }> = {
  aquarius: { row: 0, col: 0 },
  gemini: { row: 0, col: 1 },
  libra: { row: 0, col: 2 },
  pisces: { row: 1, col: 0 },
  cancer: { row: 1, col: 1 },
  scorpio: { row: 1, col: 2 },
  aries: { row: 2, col: 0 },
  leo: { row: 2, col: 1 },
  sagittarius: { row: 2, col: 2 },
  capricorn: { row: 3, col: 0 },
  virgo: { row: 3, col: 1 },
  taurus: { row: 3, col: 2 }
};

describe("zodiac grid sign mapping", () => {
  it("maps all signs to expected row and column", () => {
    for (const [sign, position] of Object.entries(expectedPositions)) {
      expect(signToRowCol(sign as ZodiacSign)).toEqual(position);
    }
  });
});
