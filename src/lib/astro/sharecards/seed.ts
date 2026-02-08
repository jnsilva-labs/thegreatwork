import type { AstroChart } from "../types";
import { normalizeLongitude } from "../derive";

const HASH_KEYS = [
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
  "asc"
] as const;

const fnv1a = (input: string): number => {
  let hash = 0x811c9dc5;

  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }

  return hash >>> 0;
};

export const hashPlacements = (chart: AstroChart): number => {
  const serialized = HASH_KEYS.map((key) => {
    const value = chart.points[key];
    if (typeof value !== "number") return `${key}:na`;

    const rounded = Math.round(normalizeLongitude(value) * 10) / 10;
    return `${key}:${rounded.toFixed(1)}`;
  }).join("|");

  return fnv1a(serialized) || 1;
};

export const prng = (seed: number): (() => number) => {
  let t = seed >>> 0;

  return () => {
    t += 0x6d2b79f5;
    let r = t;
    r = Math.imul(r ^ (r >>> 15), r | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
};
