import { describe, expect, it } from "vitest";
import { natalInputSchema } from "../lib/astro/types";

describe("natalInputSchema", () => {
  const basePayload = {
    name: "Ariel",
    birthDate: "1990-01-01",
    birthTime: "09:30",
    timeUnknown: false,
    birthPlace: "New York, NY, USA",
    houseSystem: "wholeSign",
    zodiac: "tropical"
  } as const;

  it("accepts valid payload", () => {
    expect(() => natalInputSchema.parse(basePayload)).not.toThrow();
  });

  it("requires birthTime when timeUnknown is false", () => {
    const parsed = natalInputSchema.safeParse({
      ...basePayload,
      birthTime: undefined
    });

    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.flatten().fieldErrors.birthTime?.[0]).toContain("required");
    }
  });

  it("allows missing birthTime when timeUnknown is true", () => {
    expect(() =>
      natalInputSchema.parse({
        ...basePayload,
        timeUnknown: true,
        birthTime: undefined
      })
    ).not.toThrow();
  });

  it("rejects invalid date and time formats", () => {
    expect(() =>
      natalInputSchema.parse({
        ...basePayload,
        birthDate: "01-01-1990"
      })
    ).toThrow();

    expect(() =>
      natalInputSchema.parse({
        ...basePayload,
        birthTime: "9:30"
      })
    ).toThrow();
  });
});
