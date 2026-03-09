import type { AspectType, NatalChartPoints } from "../types/chart";
import type {
  LunarPhase,
  LunarStageEvent,
  MonthAheadHighlight,
  MonthAheadRequest,
  MonthAheadResponse,
  SkyShiftEvent,
  TransitContactEvent,
  TransitNatalPoint,
  TransitPlanet,
} from "../types/transits";
import { normalizeDegrees, roundTo } from "./math";
import { calcPlanetState, planets, toJulianDayUtc } from "./swissEphemeris";
import { CalculationError } from "./natalChart";

const SAMPLE_HOURS = 6;
const SAMPLE_MS = SAMPLE_HOURS * 60 * 60 * 1000;
const CONTACT_REFINE_STEP_MS = 30 * 60 * 1000;
const SEARCH_TOLERANCE_MS = 60 * 1000;

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

const LUNAR_PHASES: Array<{ phase: LunarPhase; angle: number; priority: number }> = [
  { phase: "newMoon", angle: 0, priority: 100 },
  { phase: "firstQuarter", angle: 90, priority: 92 },
  { phase: "fullMoon", angle: 180, priority: 98 },
  { phase: "lastQuarter", angle: 270, priority: 90 }
];

const INGRESS_PLANETS: TransitPlanet[] = [
  "sun",
  "mercury",
  "venus",
  "mars",
  "jupiter",
  "saturn",
  "uranus",
  "neptune",
  "pluto"
];

const STATION_PLANETS: TransitPlanet[] = [
  "mercury",
  "venus",
  "mars",
  "jupiter",
  "saturn",
  "uranus",
  "neptune",
  "pluto"
];

const CONTACT_PLANETS: TransitPlanet[] = [
  "mercury",
  "venus",
  "mars",
  "jupiter",
  "saturn",
  "uranus",
  "neptune",
  "pluto"
];

const CONTACT_ASPECTS: Array<{ type: AspectType; angle: number }> = [
  { type: "conjunction", angle: 0 },
  { type: "sextile", angle: 60 },
  { type: "square", angle: 90 },
  { type: "trine", angle: 120 },
  { type: "opposition", angle: 180 }
];

const planetPriority = (planet: TransitPlanet): number => {
  switch (planet) {
    case "jupiter":
    case "saturn":
      return 86;
    case "uranus":
    case "neptune":
    case "pluto":
      return 82;
    case "mars":
      return 72;
    case "venus":
    case "mercury":
      return 68;
    default:
      return 60;
  }
};

const aspectPriority = (aspect: AspectType): number => {
  switch (aspect) {
    case "conjunction":
      return 8;
    case "opposition":
      return 7;
    case "square":
      return 6;
    case "trine":
      return 5;
    case "sextile":
      return 4;
  }
};

const contactOrbLimit = (planet: TransitPlanet): number => {
  switch (planet) {
    case "jupiter":
    case "saturn":
      return 1.5;
    case "uranus":
    case "neptune":
    case "pluto":
      return 1.0;
    default:
      return 0.85;
  }
};

const signIndexFromLongitude = (longitude: number): number => {
  return Math.floor(normalizeDegrees(longitude) / 30);
};

const signNameFromLongitude = (longitude: number): string => {
  return SIGNS[signIndexFromLongitude(longitude)] ?? "Unknown";
};

const toUtcIsoSeconds = (value: number | Date): string => {
  const date = typeof value === "number" ? new Date(value) : value;
  return date.toISOString().replace(/\.\d{3}Z$/, "Z");
};

const signedCircularDelta = (value: number, target: number): number => {
  return ((value - target + 540) % 360) - 180;
};

const contactOrb = (transitLongitude: number, natalLongitude: number, aspectAngle: number): number => {
  const relative = normalizeDegrees(transitLongitude - natalLongitude);
  const primary = Math.abs(signedCircularDelta(relative, aspectAngle));
  const mirror = aspectAngle === 0 || aspectAngle === 180
    ? Number.POSITIVE_INFINITY
    : Math.abs(signedCircularDelta(relative, 360 - aspectAngle));
  return Math.min(primary, mirror);
};

type PlanetState = {
  longitude: number;
  speed: number;
};

const planetIdByName: Record<TransitPlanet, number> = {
  sun: planets.sun,
  moon: planets.moon,
  mercury: planets.mercury,
  venus: planets.venus,
  mars: planets.mars,
  jupiter: planets.jupiter,
  saturn: planets.saturn,
  uranus: planets.uranus,
  neptune: planets.neptune,
  pluto: planets.pluto
};

const createPlanetStateCache = () => {
  const cache = new Map<string, Promise<PlanetState>>();

  return async (planet: TransitPlanet, timestampMs: number): Promise<PlanetState> => {
    const iso = toUtcIsoSeconds(timestampMs);
    const key = `${planet}:${iso}`;
    const existing = cache.get(key);
    if (existing) {
      return existing;
    }

    const jdUt = toJulianDayUtc(iso);
    const next = calcPlanetState(jdUt, planetIdByName[planet]);
    cache.set(key, next);
    return next;
  };
};

const buildSampleTimeline = (startMs: number, endMs: number): number[] => {
  const timeline: number[] = [];
  for (let current = startMs; current <= endMs; current += SAMPLE_MS) {
    timeline.push(current);
  }

  if (timeline[timeline.length - 1] !== endMs) {
    timeline.push(endMs);
  }

  return timeline;
};

const refineBoundary = async (
  startMs: number,
  endMs: number,
  resolver: (timestampMs: number) => Promise<number>,
  startBucket: number
): Promise<number> => {
  let lo = startMs;
  let hi = endMs;

  while (hi - lo > SEARCH_TOLERANCE_MS) {
    const mid = Math.floor((lo + hi) / 2);
    const bucket = await resolver(mid);
    if (bucket === startBucket) {
      lo = mid;
    } else {
      hi = mid;
    }
  }

  return hi;
};

const refineZeroCrossing = async (
  startMs: number,
  endMs: number,
  fn: (timestampMs: number) => Promise<number>
): Promise<number> => {
  let lo = startMs;
  let hi = endMs;
  let loValue = await fn(lo);

  while (hi - lo > SEARCH_TOLERANCE_MS) {
    const mid = Math.floor((lo + hi) / 2);
    const midValue = await fn(mid);

    if (midValue === 0) {
      return mid;
    }

    if (Math.sign(midValue) === Math.sign(loValue)) {
      lo = mid;
      loValue = midValue;
    } else {
      hi = mid;
    }
  }

  return Math.floor((lo + hi) / 2);
};

const computeLunarStages = async (
  timeline: number[],
  getState: ReturnType<typeof createPlanetStateCache>
): Promise<LunarStageEvent[]> => {
  const rawElongations = await Promise.all(
    timeline.map(async (timestampMs) => {
      const [sun, moon] = await Promise.all([
        getState("sun", timestampMs),
        getState("moon", timestampMs)
      ]);
      return normalizeDegrees(moon.longitude - sun.longitude);
    })
  );

  const unwrapped: number[] = [];
  for (let index = 0; index < rawElongations.length; index += 1) {
    const value = rawElongations[index];
    if (index === 0) {
      unwrapped.push(value);
      continue;
    }

    let adjusted = value;
    const previousRaw = rawElongations[index - 1];
    if (adjusted < previousRaw) {
      adjusted += 360;
    }

    while (adjusted < unwrapped[index - 1]) {
      adjusted += 360;
    }

    unwrapped.push(adjusted);
  }

  const results: LunarStageEvent[] = [];

  for (const phase of LUNAR_PHASES) {
    let target = phase.angle;
    while (target < unwrapped[0]) {
      target += 360;
    }

    while (target <= unwrapped[unwrapped.length - 1]) {
      const intervalIndex = unwrapped.findIndex((value, index) => {
        if (index === unwrapped.length - 1) return false;
        return value <= target && unwrapped[index + 1] >= target;
      });

      if (intervalIndex === -1) {
        break;
      }

      let loMs = timeline[intervalIndex];
      let hiMs = timeline[intervalIndex + 1];
      let loValue = unwrapped[intervalIndex];
      while (hiMs - loMs > SEARCH_TOLERANCE_MS) {
        const midMs = Math.floor((loMs + hiMs) / 2);
        const [sun, moon] = await Promise.all([
          getState("sun", midMs),
          getState("moon", midMs)
        ]);
        let midValue = normalizeDegrees(moon.longitude - sun.longitude);

        while (midValue < loValue) {
          midValue += 360;
        }

        if (midValue < target) {
          loMs = midMs;
          loValue = midValue;
        } else {
          hiMs = midMs;
        }
      }

      const exactMs = Math.floor((loMs + hiMs) / 2);
      const [sun, moon] = await Promise.all([
        getState("sun", exactMs),
        getState("moon", exactMs)
      ]);
      let exactValue = normalizeDegrees(moon.longitude - sun.longitude);
      while (exactValue < loValue) {
        exactValue += 360;
      }

      results.push({
        kind: "lunarStage",
        phase: phase.phase,
        timestampUtc: toUtcIsoSeconds(exactMs),
        orb: roundTo(Math.abs(exactValue - target), 6),
        priority: phase.priority
      });

      target += 360;
    }
  }

  return results.sort((left, right) => left.timestampUtc.localeCompare(right.timestampUtc));
};

const computeSkyShifts = async (
  timeline: number[],
  getState: ReturnType<typeof createPlanetStateCache>
): Promise<SkyShiftEvent[]> => {
  const results: SkyShiftEvent[] = [];

  for (const planet of INGRESS_PLANETS) {
    for (let index = 0; index < timeline.length - 1; index += 1) {
      const current = timeline[index];
      const next = timeline[index + 1];
      const [stateA, stateB] = await Promise.all([
        getState(planet, current),
        getState(planet, next)
      ]);

      const signA = signIndexFromLongitude(stateA.longitude);
      const signB = signIndexFromLongitude(stateB.longitude);

      if (signA !== signB) {
        const exactMs = await refineBoundary(
          current,
          next,
          async (timestampMs) => signIndexFromLongitude((await getState(planet, timestampMs)).longitude),
          signA
        );
        const exactState = await getState(planet, exactMs);
        results.push({
          kind: "skyShift",
          eventType: "ingress",
          planet,
          timestampUtc: toUtcIsoSeconds(exactMs),
          longitude: roundTo(exactState.longitude, 6),
          speed: roundTo(exactState.speed, 6),
          priority: 78 + Math.max(0, planetPriority(planet) - 60),
          fromSign: SIGNS[signA],
          toSign: signNameFromLongitude(exactState.longitude)
        });
      }
    }
  }

  for (const planet of STATION_PLANETS) {
    for (let index = 0; index < timeline.length - 1; index += 1) {
      const current = timeline[index];
      const next = timeline[index + 1];
      const [stateA, stateB] = await Promise.all([
        getState(planet, current),
        getState(planet, next)
      ]);

      const signA = Math.sign(stateA.speed);
      const signB = Math.sign(stateB.speed);

      if (signA === 0 || signB === 0 || signA !== signB) {
        const exactMs = await refineZeroCrossing(current, next, async (timestampMs) => {
          return (await getState(planet, timestampMs)).speed;
        });
        const exactState = await getState(planet, exactMs);
        results.push({
          kind: "skyShift",
          eventType: stateA.speed > 0 ? "stationRetrograde" : "stationDirect",
          planet,
          timestampUtc: toUtcIsoSeconds(exactMs),
          longitude: roundTo(exactState.longitude, 6),
          speed: roundTo(exactState.speed, 6),
          priority: 88 + Math.max(0, planetPriority(planet) - 68),
          sign: signNameFromLongitude(exactState.longitude)
        });
      }
    }
  }

  return results.sort((left, right) => left.timestampUtc.localeCompare(right.timestampUtc));
};

const refineContactCandidate = async (
  planet: TransitPlanet,
  natalLongitude: number,
  aspectAngle: number,
  centerMs: number,
  windowStartMs: number,
  windowEndMs: number,
  getState: ReturnType<typeof createPlanetStateCache>
) => {
  let bestMs = centerMs;
  let bestState = await getState(planet, centerMs);
  let bestOrb = contactOrb(bestState.longitude, natalLongitude, aspectAngle);

  const start = Math.max(windowStartMs, centerMs - SAMPLE_MS);
  const end = Math.min(windowEndMs, centerMs + SAMPLE_MS);

  for (let current = start; current <= end; current += CONTACT_REFINE_STEP_MS) {
    const state = await getState(planet, current);
    const orb = contactOrb(state.longitude, natalLongitude, aspectAngle);
    if (orb < bestOrb) {
      bestOrb = orb;
      bestMs = current;
      bestState = state;
    }
  }

  return {
    timestampMs: bestMs,
    longitude: bestState.longitude,
    orb: roundTo(bestOrb, 6)
  };
};

const dedupeContacts = (events: TransitContactEvent[]): TransitContactEvent[] => {
  const deduped: TransitContactEvent[] = [];

  for (const event of events.sort((left, right) => left.timestampUtc.localeCompare(right.timestampUtc))) {
    const previous = deduped[deduped.length - 1];
    if (
      previous &&
      previous.transitPlanet === event.transitPlanet &&
      previous.natalPoint === event.natalPoint &&
      previous.aspect === event.aspect &&
      Math.abs(Date.parse(previous.timestampUtc) - Date.parse(event.timestampUtc)) <= 18 * 60 * 60 * 1000
    ) {
      if (event.orb < previous.orb) {
        deduped[deduped.length - 1] = event;
      }
      continue;
    }

    deduped.push(event);
  }

  return deduped;
};

const computeTransitContacts = async (
  timeline: number[],
  natalPoints: NatalChartPoints,
  timeUnknown: boolean,
  getState: ReturnType<typeof createPlanetStateCache>
): Promise<TransitContactEvent[]> => {
  const targets: TransitNatalPoint[] = timeUnknown ? ["sun", "moon"] : ["sun", "moon", "asc"];
  const rawEvents: TransitContactEvent[] = [];
  const startMs = timeline[0];
  const endMs = timeline[timeline.length - 1];

  for (const planet of CONTACT_PLANETS) {
    const orbLimit = contactOrbLimit(planet);

    for (const natalPoint of targets) {
      const natalLongitude = natalPoints[natalPoint];
      if (typeof natalLongitude !== "number") {
        continue;
      }

      for (const aspect of CONTACT_ASPECTS) {
        const orbs: Array<{ timestampMs: number; orb: number }> = [];

        for (const timestampMs of timeline) {
          const state = await getState(planet, timestampMs);
          orbs.push({
            timestampMs,
            orb: contactOrb(state.longitude, natalLongitude, aspect.angle)
          });
        }

        for (let index = 1; index < orbs.length - 1; index += 1) {
          const previous = orbs[index - 1];
          const current = orbs[index];
          const next = orbs[index + 1];

          if (current.orb > orbLimit) continue;
          if (current.orb > previous.orb) continue;
          if (current.orb >= next.orb) continue;

          const refined = await refineContactCandidate(
            planet,
            natalLongitude,
            aspect.angle,
            current.timestampMs,
            startMs,
            endMs,
            getState
          );

          if (refined.orb > orbLimit) continue;

          rawEvents.push({
            kind: "transitContact",
            transitPlanet: planet,
            natalPoint,
            aspect: aspect.type,
            timestampUtc: toUtcIsoSeconds(refined.timestampMs),
            orb: refined.orb,
            transitLongitude: roundTo(refined.longitude, 6),
            natalLongitude: roundTo(natalLongitude, 6),
            priority: planetPriority(planet) + aspectPriority(aspect.type) - refined.orb * 10
          });
        }
      }
    }
  }

  return dedupeContacts(rawEvents).sort((left, right) => {
    if (right.priority !== left.priority) {
      return right.priority - left.priority;
    }
    return left.timestampUtc.localeCompare(right.timestampUtc);
  });
};

const buildHighlights = (
  lunarStages: LunarStageEvent[],
  skyShifts: SkyShiftEvent[],
  transitContacts: TransitContactEvent[]
): MonthAheadHighlight[] => {
  const topContacts = transitContacts
    .slice()
    .sort((left, right) => {
      if (right.priority !== left.priority) {
        return right.priority - left.priority;
      }
      return left.orb - right.orb;
    })
    .slice(0, 6);

  return [...lunarStages, ...skyShifts, ...topContacts].sort((left, right) =>
    left.timestampUtc.localeCompare(right.timestampUtc)
  );
};

export const buildMonthAheadTransits = async (
  input: MonthAheadRequest
): Promise<MonthAheadResponse> => {
  try {
    const startMs = Date.parse(input.startDateUtc);
    if (!Number.isFinite(startMs)) {
      throw new Error("Invalid month-ahead start date");
    }

    const endMs = startMs + input.durationDays * 24 * 60 * 60 * 1000;
    const timeline = buildSampleTimeline(startMs, endMs);
    const getState = createPlanetStateCache();

    const [lunarStages, skyShifts, transitContacts] = await Promise.all([
      computeLunarStages(timeline, getState),
      computeSkyShifts(timeline, getState),
      computeTransitContacts(timeline, input.natalPoints, input.timeUnknown, getState)
    ]);

    return {
      meta: {
        startDateUtc: input.startDateUtc,
        endDateUtc: toUtcIsoSeconds(endMs),
        durationDays: input.durationDays,
        generatedAt: new Date().toISOString(),
        sampleHours: SAMPLE_HOURS,
        zodiac: "tropical"
      },
      lunarStages,
      skyShifts,
      transitContacts,
      highlights: buildHighlights(lunarStages, skyShifts, transitContacts)
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown month-ahead transit error";
    throw new CalculationError(message);
  }
};
