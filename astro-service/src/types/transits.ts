import type { AspectType, NatalChartPoints } from "./chart";

export type TransitPlanet =
  | "sun"
  | "moon"
  | "mercury"
  | "venus"
  | "mars"
  | "jupiter"
  | "saturn"
  | "uranus"
  | "neptune"
  | "pluto";

export type TransitNatalPoint = "sun" | "moon" | "asc";

export type LunarPhase = "newMoon" | "firstQuarter" | "fullMoon" | "lastQuarter";

export type SkyShiftType = "ingress" | "stationRetrograde" | "stationDirect";

export interface MonthAheadRequest {
  startDateUtc: string;
  durationDays: number;
  timeUnknown: boolean;
  natalPoints: NatalChartPoints;
}

export interface MonthAheadMeta {
  startDateUtc: string;
  endDateUtc: string;
  durationDays: number;
  generatedAt: string;
  sampleHours: number;
  zodiac: "tropical";
}

export interface LunarStageEvent {
  kind: "lunarStage";
  phase: LunarPhase;
  timestampUtc: string;
  orb: number;
  priority: number;
}

export interface SkyShiftEvent {
  kind: "skyShift";
  eventType: SkyShiftType;
  planet: TransitPlanet;
  timestampUtc: string;
  longitude: number;
  speed: number;
  priority: number;
  fromSign?: string;
  toSign?: string;
  sign?: string;
}

export interface TransitContactEvent {
  kind: "transitContact";
  transitPlanet: TransitPlanet;
  natalPoint: TransitNatalPoint;
  aspect: AspectType;
  timestampUtc: string;
  orb: number;
  transitLongitude: number;
  natalLongitude: number;
  priority: number;
}

export type MonthAheadHighlight = LunarStageEvent | SkyShiftEvent | TransitContactEvent;

export interface MonthAheadResponse {
  meta: MonthAheadMeta;
  lunarStages: LunarStageEvent[];
  skyShifts: SkyShiftEvent[];
  transitContacts: TransitContactEvent[];
  highlights: MonthAheadHighlight[];
}
