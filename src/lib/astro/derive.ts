import type { AstroChart } from "./types";

const SIGNS = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces"
] as const;

export const normalizeLongitude = (value: number): number => {
  const normalized = value % 360;
  return normalized < 0 ? normalized + 360 : normalized;
};

export const longitudeToSign = (longitude: number): { sign: string; degree: string } => {
  const normalized = normalizeLongitude(longitude);
  const signIndex = Math.floor(normalized / 30);
  const degreeInSign = normalized - signIndex * 30;

  return {
    sign: SIGNS[signIndex] ?? "Unknown",
    degree: `${degreeInSign.toFixed(2)}°`
  };
};

export interface CanonicalBigThree {
  sun: string;
  moon: string;
  rising: string | null;
}

export const deriveBigThreeFromChart = (
  chart: AstroChart,
  timeUnknown: boolean
): CanonicalBigThree => {
  const sunLon = chart.points.sun;
  const moonLon = chart.points.moon;

  if (typeof sunLon !== "number" || typeof moonLon !== "number") {
    throw new Error("Chart missing required sun/moon longitudes");
  }

  const sun = longitudeToSign(sunLon).sign;
  const moon = longitudeToSign(moonLon).sign;

  let rising: string | null = null;
  if (!timeUnknown && typeof chart.points.asc === "number") {
    rising = longitudeToSign(chart.points.asc).sign;
  }

  return { sun, moon, rising };
};

export interface DerivedPlacementFact {
  key: string;
  sign: string;
  degree: string;
  longitude: number;
}

const placementKeys = [
  "sun",
  "moon",
  "mercury",
  "venus",
  "mars",
  "jupiter",
  "saturn",
  "uranus",
  "neptune",
  "pluto",
  "node",
  "chiron",
  "asc",
  "mc"
] as const;

export const derivePlacementFacts = (chart: AstroChart): DerivedPlacementFact[] => {
  return placementKeys
    .map((key) => {
      const longitude = chart.points[key];
      if (typeof longitude !== "number") return null;

      const parsed = longitudeToSign(longitude);

      return {
        key,
        sign: parsed.sign,
        degree: parsed.degree,
        longitude: Number(normalizeLongitude(longitude).toFixed(6))
      };
    })
    .filter(Boolean) as DerivedPlacementFact[];
};
