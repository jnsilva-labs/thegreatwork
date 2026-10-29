import { normalizeDegrees } from "./math";

// Ascendant, Midheaven, and Placidus house cusps from the right ascension of
// the meridian (RAMC), geographic latitude, and true obliquity, all in
// degrees. The Placidus cusps are found numerically from the defining
// condition (each intermediate cusp trisects the semi-diurnal or
// semi-nocturnal arc of its ecliptic point) rather than the classical
// fixed-point iteration; the golden swisseph fixtures pin the results.

const RAD = Math.PI / 180;
const DEG = 180 / Math.PI;

const wrap180 = (value: number): number => {
  const wrapped = normalizeDegrees(value);
  return wrapped > 180 ? wrapped - 360 : wrapped;
};

/** Right ascension (degrees) of the ecliptic point at longitude lambda. */
const rightAscension = (lambdaDeg: number, epsDeg: number): number => {
  const lambda = lambdaDeg * RAD;
  const eps = epsDeg * RAD;
  return normalizeDegrees(Math.atan2(Math.sin(lambda) * Math.cos(eps), Math.cos(lambda)) * DEG);
};

/** Declination (degrees) of the ecliptic point at longitude lambda. */
const declination = (lambdaDeg: number, epsDeg: number): number => {
  return Math.asin(Math.sin(epsDeg * RAD) * Math.sin(lambdaDeg * RAD)) * DEG;
};

export const computeMc = (ramcDeg: number, epsDeg: number): number => {
  const theta = ramcDeg * RAD;
  const eps = epsDeg * RAD;
  return normalizeDegrees(Math.atan2(Math.sin(theta), Math.cos(theta) * Math.cos(eps)) * DEG);
};

export const computeAsc = (ramcDeg: number, latDeg: number, epsDeg: number): number => {
  const theta = ramcDeg * RAD;
  const eps = epsDeg * RAD;
  const phi = latDeg * RAD;
  return normalizeDegrees(
    Math.atan2(Math.cos(theta), -(Math.sin(theta) * Math.cos(eps) + Math.tan(phi) * Math.sin(eps))) * DEG
  );
};

interface CuspSpec {
  /** Target hour angle as a function of the point's ascensional difference. */
  target: (adDeg: number) => number;
}

/**
 * Hour angle of the ecliptic point at longitude lambda relative to the
 * meridian: 0 at upper culmination, -SDA at rising, +SDA at setting.
 */
const hourAngle = (lambdaDeg: number, ramcDeg: number, epsDeg: number): number => {
  return wrap180(ramcDeg - rightAscension(lambdaDeg, epsDeg));
};

const ascensionalDifference = (lambdaDeg: number, latDeg: number, epsDeg: number): number => {
  const value = Math.tan(latDeg * RAD) * Math.tan(declination(lambdaDeg, epsDeg) * RAD);
  if (Math.abs(value) >= 1) {
    throw new Error("Placidus houses undefined at this latitude (circumpolar ecliptic point)");
  }
  return Math.asin(value) * DEG;
};

const solveCusp = (
  spec: CuspSpec,
  ramcDeg: number,
  latDeg: number,
  epsDeg: number
): number => {
  const residual = (lambdaDeg: number): number => {
    const ad = ascensionalDifference(lambdaDeg, latDeg, epsDeg);
    return wrap180(hourAngle(lambdaDeg, ramcDeg, epsDeg) - spec.target(ad));
  };

  // Scan the circle for a bracketing sign change away from the wrap branch,
  // then bisect it down to well below fixture tolerance.
  const stepDeg = 0.5;
  let previousLambda = 0;
  let previousValue = residual(0);

  for (let lambda = stepDeg; lambda <= 360 + stepDeg; lambda += stepDeg) {
    const current = normalizeDegrees(lambda);
    const value = residual(current);
    const isBranchJump = Math.abs(previousValue) + Math.abs(value) > 90;

    if (!isBranchJump && previousValue === 0) {
      return previousLambda;
    }
    if (!isBranchJump && previousValue * value < 0) {
      let low = previousLambda;
      let high = previousLambda + stepDeg;
      let lowValue = previousValue;
      for (let i = 0; i < 60; i += 1) {
        const mid = (low + high) / 2;
        const midValue = residual(normalizeDegrees(mid));
        if (lowValue * midValue <= 0) {
          high = mid;
        } else {
          low = mid;
          lowValue = midValue;
        }
      }
      return normalizeDegrees((low + high) / 2);
    }

    previousLambda = lambda;
    previousValue = value;
  }

  throw new Error("Placidus cusp iteration failed to converge");
};

export interface PlacidusResult {
  /** Cusps 1..12 in order (index 0 is house 1). */
  cusps: number[];
  asc: number;
  mc: number;
}

export const calcPlacidusHouses = (
  ramcDeg: number,
  latDeg: number,
  epsDeg: number
): PlacidusResult => {
  const asc = computeAsc(ramcDeg, latDeg, epsDeg);
  const mc = computeMc(ramcDeg, epsDeg);

  // Diurnal cusps east of the meridian trisect the semi-diurnal arc
  // (SDA = 90 + AD); nocturnal cusps below the horizon trisect the
  // semi-nocturnal arc (SNA = 90 - AD).
  const cusp11 = solveCusp({ target: (ad) => -(90 + ad) / 3 }, ramcDeg, latDeg, epsDeg);
  const cusp12 = solveCusp({ target: (ad) => (-2 * (90 + ad)) / 3 }, ramcDeg, latDeg, epsDeg);
  const cusp2 = solveCusp(
    { target: (ad) => wrap180(-(90 + ad) - (90 - ad) / 3) },
    ramcDeg,
    latDeg,
    epsDeg
  );
  const cusp3 = solveCusp(
    { target: (ad) => wrap180(-(90 + ad) - (2 * (90 - ad)) / 3) },
    ramcDeg,
    latDeg,
    epsDeg
  );

  const opposite = (value: number) => normalizeDegrees(value + 180);

  const cusps = [
    asc,
    cusp2,
    cusp3,
    opposite(mc),
    opposite(cusp11),
    opposite(cusp12),
    opposite(asc),
    opposite(cusp2),
    opposite(cusp3),
    mc,
    cusp11,
    cusp12
  ];

  return { cusps, asc, mc };
};
