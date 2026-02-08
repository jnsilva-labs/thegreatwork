export const SIGN_ORDER = [
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

export type ZodiacSign = (typeof SIGN_ORDER)[number];

export const SIGN_TO_GLYPH: Record<ZodiacSign, string> = {
  Aries: "\u2648",
  Taurus: "\u2649",
  Gemini: "\u264A",
  Cancer: "\u264B",
  Leo: "\u264C",
  Virgo: "\u264D",
  Libra: "\u264E",
  Scorpio: "\u264F",
  Sagittarius: "\u2650",
  Capricorn: "\u2651",
  Aquarius: "\u2652",
  Pisces: "\u2653"
};

export const PLANET_ORDER = [
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
  "node"
] as const;

export type PlanetKey = (typeof PLANET_ORDER)[number];

export const PLANET_TO_GLYPH: Record<PlanetKey, string> = {
  sun: "\u2609",
  moon: "\u263D",
  mercury: "\u263F",
  venus: "\u2640",
  mars: "\u2642",
  jupiter: "\u2643",
  saturn: "\u2644",
  uranus: "\u2645",
  neptune: "\u2646",
  pluto: "\u2647",
  node: "\u260A"
};

export const SIGN_TO_ELEMENT: Record<ZodiacSign, "fire" | "earth" | "air" | "water"> = {
  Aries: "fire",
  Taurus: "earth",
  Gemini: "air",
  Cancer: "water",
  Leo: "fire",
  Virgo: "earth",
  Libra: "air",
  Scorpio: "water",
  Sagittarius: "fire",
  Capricorn: "earth",
  Aquarius: "air",
  Pisces: "water"
};

export const ELEMENT_ORDER = ["fire", "earth", "air", "water"] as const;

export const ELEMENT_TO_LABEL: Record<(typeof ELEMENT_ORDER)[number], string> = {
  fire: "Fire",
  earth: "Earth",
  air: "Air",
  water: "Water"
};

export const ELEMENT_TO_ICON: Record<(typeof ELEMENT_ORDER)[number], string> = {
  fire: "\u25B3",
  earth: "\u25BD",
  air: "\u25C7",
  water: "\u25CB"
};

export type ShareCardStyle = "totem" | "constellation";
export type ShareCardBackground = "dark" | "light" | "transparent";

export interface ShareCardOptions {
  width?: number;
  height?: number;
  watermark?: boolean;
  background?: ShareCardBackground;
  includeAspects?: boolean;
}
