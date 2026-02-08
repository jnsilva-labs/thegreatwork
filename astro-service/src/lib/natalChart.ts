import type {
  NatalChartRequest,
  NatalChartResponse,
  NatalChartPoints,
  HouseSystem
} from "../types/chart";
import { calculateAspects } from "./aspects";
import { normalizeDegrees, roundTo } from "./math";
import {
  calcHousesPlacidus,
  calcPlanetLongitude,
  calcUtFlags,
  planets,
  toJulianDayUtc
} from "./swissEphemeris";

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
      houses,
      chironResult
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
      calcPlanetLongitude(jdUt, planets.nodeTrue),
      calcHousesPlacidus(jdUt, input.lat, input.lon),
      calcPlanetLongitude(jdUt, planets.chiron).catch(() => undefined)
    ]);

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

    if (typeof chironResult === "number" && Number.isFinite(chironResult)) {
      points.chiron = chironResult;
    }

    const cusps = resolveHouseCusps(input.houseSystem, houses.cusps, houses.asc);

    return {
      meta: {
        input,
        jdUt,
        zodiac: input.zodiac,
        houseSystem: input.houseSystem,
        ephemeris: {
          backend: "swisseph",
          calcUtFlags,
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
