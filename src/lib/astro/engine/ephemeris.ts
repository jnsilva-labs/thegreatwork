import {
  Body,
  EclipticGeoMoon,
  GeoMoonState,
  GeoVector,
  RotateVector,
  Rotation_EQD_ECT,
  Rotation_EQJ_ECT,
  SiderealTime,
  SphereFromVector,
  SunPosition,
  Vector
} from "astronomy-engine";
import { normalizeDegrees, roundTo } from "./math";
import { calcPlacidusHouses } from "./houses";

// Same adapter surface the swisseph-backed astro-service exposed, so
// natalChart.ts and transits.ts port verbatim. Longitudes are tropical:
// true ecliptic of date, geocentric, light-time and aberration corrected.

export type PlanetId =
  | "sun"
  | "moon"
  | "mercury"
  | "venus"
  | "mars"
  | "jupiter"
  | "saturn"
  | "uranus"
  | "neptune"
  | "pluto"
  | "node";

export const planets: Record<PlanetId, PlanetId> = {
  sun: "sun",
  moon: "moon",
  mercury: "mercury",
  venus: "venus",
  mars: "mars",
  jupiter: "jupiter",
  saturn: "saturn",
  uranus: "uranus",
  neptune: "neptune",
  pluto: "pluto",
  node: "node"
};

const PLANET_BODIES: Partial<Record<PlanetId, Body>> = {
  mercury: Body.Mercury,
  venus: Body.Venus,
  mars: Body.Mars,
  jupiter: Body.Jupiter,
  saturn: Body.Saturn,
  uranus: Body.Uranus,
  neptune: Body.Neptune,
  pluto: Body.Pluto
};

const JD_UNIX_EPOCH = 2440587.5;
const MS_PER_DAY = 86_400_000;

export const toJulianDayUtc = (datetimeUtc: string): number => {
  const ms = Date.parse(datetimeUtc);
  if (!Number.isFinite(ms)) {
    throw new Error("Failed to compute Julian day");
  }
  return roundTo(ms / MS_PER_DAY + JD_UNIX_EPOCH, 8);
};

export const julianDayToDate = (jdUt: number): Date => {
  return new Date((jdUt - JD_UNIX_EPOCH) * MS_PER_DAY);
};

const RAD = Math.PI / 180;
const DEG = 180 / Math.PI;

/** Osculating (true) lunar node from the Moon's geocentric state vector. */
const trueNodeLongitude = (date: Date): number => {
  const state = GeoMoonState(date);
  const rotation = Rotation_EQJ_ECT(date);
  const position = RotateVector(rotation, new Vector(state.x, state.y, state.z, state.t));
  const velocity = RotateVector(rotation, new Vector(state.vx, state.vy, state.vz, state.t));

  // Orbital plane normal in the ecliptic frame; the ascending node points
  // along z-hat cross n = (-n.y, n.x, 0).
  const nx = position.y * velocity.z - position.z * velocity.y;
  const ny = position.z * velocity.x - position.x * velocity.z;

  return normalizeDegrees(Math.atan2(nx, -ny) * DEG);
};

const eclipticLongitudeOfDate = (planet: PlanetId, date: Date): number => {
  if (planet === "sun") {
    return SunPosition(date).elon;
  }
  if (planet === "moon") {
    return EclipticGeoMoon(date).lon;
  }
  if (planet === "node") {
    return trueNodeLongitude(date);
  }
  const body = PLANET_BODIES[planet];
  if (!body) {
    throw new Error(`Unknown planet: ${planet}`);
  }
  const vector = GeoVector(body, date, true);
  const ecliptic = RotateVector(Rotation_EQJ_ECT(date), vector);
  return SphereFromVector(ecliptic).lon;
};

export const calcPlanetLongitude = async (
  jdUt: number,
  planet: PlanetId
): Promise<number> => {
  return roundTo(normalizeDegrees(eclipticLongitudeOfDate(planet, julianDayToDate(jdUt))));
};

export const calcPlanetState = async (
  jdUt: number,
  planet: PlanetId
): Promise<{ longitude: number; speed: number }> => {
  const deltaDays = 0.125;
  const [longitude, backward, forward] = await Promise.all([
    calcPlanetLongitude(jdUt, planet),
    calcPlanetLongitude(jdUt - deltaDays, planet),
    calcPlanetLongitude(jdUt + deltaDays, planet)
  ]);
  const signedDelta = ((forward - backward + 540) % 360) - 180;

  return {
    longitude,
    speed: roundTo(signedDelta / (deltaDays * 2))
  };
};

/** True obliquity of date, extracted from the equator-of-date to
 * true-ecliptic-of-date rotation (a pure rotation about the x-axis). */
const trueObliquityDegrees = (date: Date): number => {
  const rotation = Rotation_EQD_ECT(date);
  return Math.acos(rotation.rot[2][2]) * DEG;
};

/** Right ascension of the local meridian, in degrees. */
const localSiderealDegrees = (date: Date, lonDeg: number): number => {
  return normalizeDegrees(SiderealTime(date) * 15 + lonDeg);
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
  const date = julianDayToDate(jdUt);
  const ramc = localSiderealDegrees(date, lon);
  const obliquity = trueObliquityDegrees(date);
  const result = calcPlacidusHouses(ramc, lat, obliquity);

  return {
    cusps: result.cusps.map((value) => roundTo(normalizeDegrees(value))),
    asc: roundTo(normalizeDegrees(result.asc)),
    mc: roundTo(normalizeDegrees(result.mc))
  };
};

export { RAD, DEG };
