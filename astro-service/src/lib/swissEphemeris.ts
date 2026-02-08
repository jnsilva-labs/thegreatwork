import { roundTo, normalizeDegrees } from "./math";

// No official type package is available for swisseph.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const swe = require("swisseph");

export type SwissEphemeris = typeof swe;

const getNumber = (...values: unknown[]): number | undefined => {
  for (const value of values) {
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }
  }
  return undefined;
};

const extractLongitude = (payload: any): number => {
  const longitude = getNumber(
    payload?.longitude,
    payload?.lon,
    payload?.xx?.[0],
    payload?.data?.[0]
  );

  if (longitude === undefined) {
    throw new Error("Swiss Ephemeris did not return longitude");
  }

  return roundTo(normalizeDegrees(longitude));
};

const parseCuspArray = (houseData: unknown): number[] => {
  if (!Array.isArray(houseData)) {
    throw new Error("Swiss Ephemeris house data was not an array");
  }

  const maybeCusps =
    houseData.length >= 13
      ? houseData.slice(1, 13)
      : houseData.length >= 12
        ? houseData.slice(0, 12)
        : [];

  if (maybeCusps.length !== 12) {
    throw new Error("Swiss Ephemeris did not return 12 house cusps");
  }

  return maybeCusps.map((value) => {
    if (typeof value !== "number" || !Number.isFinite(value)) {
      throw new Error("Swiss Ephemeris returned invalid house cusp value");
    }
    return roundTo(normalizeDegrees(value));
  });
};

const callSwe = <T>(
  method: string,
  args: unknown[],
  parser: (payload: any) => T
): Promise<T> => {
  return new Promise((resolve, reject) => {
    const fn = swe[method];

    if (typeof fn !== "function") {
      reject(new Error(`Swiss Ephemeris method missing: ${method}`));
      return;
    }

    fn(...args, (result: any) => {
      if (!result) {
        reject(new Error(`Swiss Ephemeris returned empty payload for ${method}`));
        return;
      }

      if (result.error) {
        reject(new Error(String(result.error)));
        return;
      }

      try {
        resolve(parser(result));
      } catch (error) {
        reject(error);
      }
    });
  });
};

export const calcUtFlags: number =
  (swe.SEFLG_SWIEPH ?? 2) | (swe.SEFLG_SPEED ?? 256);

export const toJulianDayUtc = (datetimeUtc: string): number => {
  const date = new Date(datetimeUtc);
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const hour =
    date.getUTCHours() +
    date.getUTCMinutes() / 60 +
    date.getUTCSeconds() / 3600 +
    date.getUTCMilliseconds() / 3600000;

  const julianDay = swe.swe_julday(
    year,
    month,
    day,
    hour,
    swe.SE_GREG_CAL ?? 1
  );

  if (!Number.isFinite(julianDay)) {
    throw new Error("Failed to compute Julian day");
  }

  return roundTo(julianDay, 8);
};

export const calcPlanetLongitude = async (
  jdUt: number,
  planetId: number,
  flags = calcUtFlags
): Promise<number> => {
  return callSwe("swe_calc_ut", [jdUt, planetId, flags], extractLongitude);
};

export interface PlacidusHousesResult {
  cusps: number[];
  asc: number;
  mc: number;
}

export const calcHousesPlacidus = async (
  jdUt: number,
  lat: number,
  lon: number
): Promise<PlacidusHousesResult> => {
  return callSwe("swe_houses", [jdUt, lat, lon, "P"], (payload) => {
    const cusps = parseCuspArray(payload.house);
    const asc = getNumber(payload.ascmc?.[0], payload.ascendant);
    const mc = getNumber(payload.ascmc?.[1], payload.mc);

    if (asc === undefined || mc === undefined) {
      throw new Error("Swiss Ephemeris did not return asc/mc values");
    }

    return {
      cusps,
      asc: roundTo(normalizeDegrees(asc)),
      mc: roundTo(normalizeDegrees(mc))
    };
  });
};

export const planets = {
  sun: swe.SE_SUN,
  moon: swe.SE_MOON,
  mercury: swe.SE_MERCURY,
  venus: swe.SE_VENUS,
  mars: swe.SE_MARS,
  jupiter: swe.SE_JUPITER,
  saturn: swe.SE_SATURN,
  uranus: swe.SE_URANUS,
  neptune: swe.SE_NEPTUNE,
  pluto: swe.SE_PLUTO,
  nodeTrue: swe.SE_TRUE_NODE,
  chiron: swe.SE_CHIRON
} as const;
