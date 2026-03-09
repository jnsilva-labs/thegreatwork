import { describe, expect, it } from "vitest";
import { monthAheadRequestSchema } from "../src/validation/monthAheadRequest";

describe("monthAheadRequestSchema", () => {
  const validPayload = {
    startDateUtc: "2026-03-09T00:00:00Z",
    durationDays: 30,
    timeUnknown: false,
    natalPoints: {
      sun: 281.17,
      moon: 330.42,
      mercury: 296.01,
      venus: 306.55,
      mars: 250.12,
      jupiter: 95.31,
      saturn: 284.66,
      uranus: 275.03,
      neptune: 282.27,
      pluto: 226.91,
      node: 310.4,
      asc: 187.14,
      mc: 98.63
    }
  } as const;

  it("accepts a valid payload", () => {
    expect(() => monthAheadRequestSchema.parse(validPayload)).not.toThrow();
  });

  it("rejects invalid date formats and duration", () => {
    expect(() =>
      monthAheadRequestSchema.parse({
        ...validPayload,
        startDateUtc: "2026-03-09"
      })
    ).toThrow();

    expect(() =>
      monthAheadRequestSchema.parse({
        ...validPayload,
        durationDays: 90
      })
    ).toThrow();
  });

  it("rejects missing natal points", () => {
    expect(() =>
      monthAheadRequestSchema.parse({
        ...validPayload,
        natalPoints: {
          moon: 330.42
        }
      })
    ).toThrow();
  });
});
