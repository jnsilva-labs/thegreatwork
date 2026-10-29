import type {
  NatalChartRequest,
  NatalChartResponse,
  NatalChartPoints,
  HouseSystem
} from "./chartTypes";
import { calculateAspects } from "./aspects";
import { normalizeDegrees, roundTo } from "./math";
import {
  calcHousesPlacidus,
  calcPlanetLongitude,
  planets,
  toJulianDayUtc
} from "./ephemeris";

export class CalculationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CalculationError";
  }
}

const makeWholeSignCusps = (asc: number): number[] => {
  const ascSignStart = Math.floor(normalizeDegrees(asc) / 30) * 30;
  return Array.from({ length: 12 }, (_, index) =>
    roundTo(normalizeDegrees(ascSignStart + index * 30))
  );
};

const resolveHouseCusps = (
  houseSystem: HouseSystem,
  placidusCusps: number[],
  asc: number
): number[] => {
  if (houseSystem === "placidus") {
    return placidusCusps;
  }

  return makeWholeSignCusps(asc);
};

export const buildNatalChart = async (
  input: NatalChartRequest
): Promise<NatalChartResponse> => {
  try {
    const jdUt = toJulianDayUtc(input.datetimeUtc);

    const [
      sun,
      moon,
      mercury,
      venus,
      mars,
      jupiter,
      saturn,
      uranus,
      neptune,
      pluto,
      node,
      houses
    ] = await Promise.all([
      calcPlanetLongitude(jdUt, planets.sun),
      calcPlanetLongitude(jdUt, planets.moon),
      calcPlanetLongitude(jdUt, planets.mercury),
      calcPlanetLongitude(jdUt, planets.venus),
      calcPlanetLongitude(jdUt, planets.mars),
      calcPlanetLongitude(jdUt, planets.jupiter),
      calcPlanetLongitude(jdUt, planets.saturn),
      calcPlanetLongitude(jdUt, planets.uranus),
      calcPlanetLongitude(jdUt, planets.neptune),
      calcPlanetLongitude(jdUt, planets.pluto),
      calcPlanetLongitude(jdUt, planets.node),
      calcHousesPlacidus(jdUt, input.lat, input.lon)
    ]);

    // Chiron is intentionally absent: the swisseph service never shipped the
    // asteroid data file, so it was already missing from production output,
    // and every consuming schema keeps it optional.
    const points: NatalChartPoints = {
      sun,
      moon,
      mercury,
      venus,
      mars,
      jupiter,
      saturn,
      uranus,
      neptune,
      pluto,
      node,
      asc: houses.asc,
      mc: houses.mc
    };

    const cusps = resolveHouseCusps(input.houseSystem, houses.cusps, houses.asc);

    return {
      meta: {
        input,
        jdUt,
        zodiac: input.zodiac,
        houseSystem: input.houseSystem,
        ephemeris: {
          backend: "astronomy-engine",
          trueNode: true,
          houseSource:
            input.houseSystem === "placidus"
              ? "placidus"
              : "whole-sign-from-asc"
        },
        generatedAt: new Date().toISOString()
      },
      points,
      houses: { cusps },
      aspects: calculateAspects(points, input.aspects)
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown natal chart error";
    throw new CalculationError(message);
  }
};
