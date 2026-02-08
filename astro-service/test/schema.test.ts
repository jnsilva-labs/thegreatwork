import { describe, expect, it } from "vitest";
import { chartRequestSchema } from "../src/validation/chartRequest";

describe("chartRequestSchema", () => {
  const validPayload = {
    datetimeUtc: "1990-01-01T12:34:56Z",
    lat: 40.7128,
    lon: -74.006,
    zodiac: "tropical",
    houseSystem: "wholeSign",
    aspects: {
      orbDefault: 6,
      orbLuminary: 8
    }
  } as const;

  it("accepts a valid payload", () => {
    expect(() => chartRequestSchema.parse(validPayload)).not.toThrow();
  });

  it("rejects non-UTC datetime format", () => {
    expect(() =>
      chartRequestSchema.parse({
        ...validPayload,
        datetimeUtc: "1990-01-01T12:34:56+02:00"
      })
    ).toThrow();
  });

  it("rejects invalid latitude/longitude ranges", () => {
    expect(() =>
      chartRequestSchema.parse({
        ...validPayload,
        lat: -91
      })
    ).toThrow();

    expect(() =>
      chartRequestSchema.parse({
        ...validPayload,
        lon: 181
      })
    ).toThrow();
  });

  it("rejects unsupported zodiac and house system", () => {
    expect(() =>
      chartRequestSchema.parse({
        ...validPayload,
        zodiac: "sidereal"
      })
    ).toThrow();

    expect(() =>
      chartRequestSchema.parse({
        ...validPayload,
        houseSystem: "koch"
      })
    ).toThrow();
  });
});
