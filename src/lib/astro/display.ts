// Shared presentation constants for natal chart visuals (2D fallback and the
// 3D instrument). Pure data, safe on server and client.

export const SIGNS = [
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

export const SIGN_GLYPHS = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"] as const;

export const planetOrder = [
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
  "chiron"
] as const;

export const planetGlyph: Record<string, string> = {
  sun: "☉",
  moon: "☽",
  mercury: "☿",
  venus: "♀",
  mars: "♂",
  jupiter: "♃",
  saturn: "♄",
  uranus: "♅",
  neptune: "♆",
  pluto: "♇",
  node: "☊",
  chiron: "⚷"
};

export const degreeToLabel = (lon: number) => {
  const normalized = ((lon % 360) + 360) % 360;
  const signIndex = Math.floor(normalized / 30);
  const degreeInSign = normalized - signIndex * 30;
  return {
    sign: SIGNS[signIndex],
    degree: `${degreeInSign.toFixed(2)}°`
  };
};

export interface ChartMarker {
  key: string;
  lon: number;
  sign: string;
  degree: string;
}

export const buildChartMarkers = (points: Record<string, number | undefined>): ChartMarker[] => {
  return planetOrder
    .map((key) => {
      const value = points[key];
      if (typeof value !== "number") return null;
      return { key, lon: value, ...degreeToLabel(value) };
    })
    .filter(Boolean) as ChartMarker[];
};
