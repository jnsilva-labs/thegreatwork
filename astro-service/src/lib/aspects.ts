import type { NatalAspect, NatalChartPoints } from "../types/chart";
import { angularDistance, roundTo } from "./math";

const aspectTargets = [
  { type: "conjunction", angle: 0 },
  { type: "sextile", angle: 60 },
  { type: "square", angle: 90 },
  { type: "trine", angle: 120 },
  { type: "opposition", angle: 180 }
] as const;

const luminaries = new Set(["sun", "moon"]);

const pointOrder = [
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

export interface AspectOptions {
  orbDefault: number;
  orbLuminary: number;
}

export const calculateAspects = (
  points: NatalChartPoints,
  options: AspectOptions
): NatalAspect[] => {
  const presentKeys = pointOrder.filter(
    (key) => typeof points[key as keyof NatalChartPoints] === "number"
  );

  const output: NatalAspect[] = [];

  for (let i = 0; i < presentKeys.length; i += 1) {
    for (let j = i + 1; j < presentKeys.length; j += 1) {
      const a = presentKeys[i];
      const b = presentKeys[j];
      const lonA = points[a as keyof NatalChartPoints] as number;
      const lonB = points[b as keyof NatalChartPoints] as number;
      const distance = angularDistance(lonA, lonB);

      let chosen:
        | { type: NatalAspect["type"]; orb: number }
        | undefined;

      for (const target of aspectTargets) {
        const orb = Math.abs(distance - target.angle);
        if (!chosen || orb < chosen.orb) {
          chosen = { type: target.type, orb };
        }
      }

      if (!chosen) continue;

      const allowedOrb =
        luminaries.has(a) || luminaries.has(b)
          ? options.orbLuminary
          : options.orbDefault;

      if (chosen.orb <= allowedOrb) {
        output.push({
          a,
          b,
          type: chosen.type,
          orb: roundTo(chosen.orb, 6)
        });
      }
    }
  }

  return output.sort((left, right) => {
    if (left.a !== right.a) return left.a.localeCompare(right.a);
    if (left.b !== right.b) return left.b.localeCompare(right.b);
    if (left.type !== right.type) return left.type.localeCompare(right.type);
    return left.orb - right.orb;
  });
};
