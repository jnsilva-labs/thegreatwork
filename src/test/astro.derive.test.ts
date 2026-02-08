import { describe, expect, it } from "vitest";
import {
  deriveBigThreeFromChart,
  derivePlacementFacts,
  longitudeToSign,
  normalizeLongitude
} from "../lib/astro/derive";

describe("astro derive helpers", () => {
  it("normalizes longitudes", () => {
    expect(normalizeLongitude(370)).toBe(10);
    expect(normalizeLongitude(-20)).toBe(340);
  });

  it("maps longitude to sign and degree", () => {
    expect(longitudeToSign(223.15)).toEqual({ sign: "Scorpio", degree: "13.15°" });
    expect(longitudeToSign(130.75)).toEqual({ sign: "Leo", degree: "10.75°" });
  });

  it("derives canonical big three from chart", () => {
    const chart = {
      meta: {},
      points: {
        sun: 223.15,
        moon: 130.75,
        asc: 291.17
      },
      houses: { cusps: [] },
      aspects: []
    };

    expect(deriveBigThreeFromChart(chart, false)).toEqual({
      sun: "Scorpio",
      moon: "Leo",
      rising: "Capricorn"
    });

    expect(deriveBigThreeFromChart(chart, true)).toEqual({
      sun: "Scorpio",
      moon: "Leo",
      rising: null
    });
  });

  it("derives placement facts from chart points", () => {
    const chart = {
      meta: {},
      points: {
        sun: 223.15,
        moon: 130.75,
        jupiter: 308.9,
        asc: 291.17
      },
      houses: { cusps: [] },
      aspects: []
    };

    const placements = derivePlacementFacts(chart);
    expect(placements.find((item) => item.key === "sun")?.sign).toBe("Scorpio");
    expect(placements.find((item) => item.key === "moon")?.sign).toBe("Leo");
    expect(placements.find((item) => item.key === "asc")?.sign).toBe("Capricorn");
  });
});
