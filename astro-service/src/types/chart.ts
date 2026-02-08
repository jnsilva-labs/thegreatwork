export type Zodiac = "tropical";
export type HouseSystem = "wholeSign" | "placidus";

export type AspectType =
  | "conjunction"
  | "sextile"
  | "square"
  | "trine"
  | "opposition";

export interface AspectRequestConfig {
  orbDefault: number;
  orbLuminary: number;
}

export interface NatalChartRequest {
  datetimeUtc: string;
  lat: number;
  lon: number;
  zodiac: Zodiac;
  houseSystem: HouseSystem;
  aspects: AspectRequestConfig;
}

export interface NatalChartMeta {
  input: NatalChartRequest;
  jdUt: number;
  zodiac: Zodiac;
  houseSystem: HouseSystem;
  ephemeris: {
    backend: "swisseph";
    calcUtFlags: number;
    trueNode: true;
    houseSource: "placidus" | "whole-sign-from-asc";
  };
  generatedAt: string;
}

export interface NatalChartPoints {
  sun: number;
  moon: number;
  mercury: number;
  venus: number;
  mars: number;
  jupiter: number;
  saturn: number;
  uranus: number;
  neptune: number;
  pluto: number;
  node: number;
  chiron?: number;
  asc?: number;
  mc?: number;
}

export interface NatalAspect {
  a: string;
  b: string;
  type: AspectType;
  orb: number;
}

export interface NatalChartResponse {
  meta: NatalChartMeta;
  points: NatalChartPoints;
  houses: { cusps: number[] } | null;
  aspects: NatalAspect[];
}
