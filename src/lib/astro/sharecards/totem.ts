import { deriveBigThreeFromChart, derivePlacementFacts } from "../derive";
import type { AstroChart } from "../types";
import {
  ELEMENT_ORDER,
  ELEMENT_TO_ICON,
  ELEMENT_TO_LABEL,
  PLANET_ORDER,
  PLANET_TO_GLYPH,
  SIGN_TO_ELEMENT,
  SIGN_TO_GLYPH,
  type ShareCardOptions,
  type ShareCardBackground,
  type ZodiacSign
} from "./constants";
import { renderWatermark } from "./watermark";
import { renderZodiacIcon } from "./zodiacIcons";

const defaultWidth = 1080;
const defaultHeight = 1350;

interface ThemeTokens {
  cardFill: string;
  panelFill: string;
  panelStroke: string;
  textMain: string;
  textMuted: string;
  accent: string;
  divider: string;
}

const themeForBackground = (background: ShareCardBackground): ThemeTokens => {
  if (background === "light") {
    return {
      cardFill: "#f4efe4",
      panelFill: "rgba(255,255,255,0.78)",
      panelStroke: "rgba(55,58,64,0.26)",
      textMain: "#11141b",
      textMuted: "#404854",
      accent: "#6d5a2f",
      divider: "rgba(40,45,52,0.2)"
    };
  }

  if (background === "transparent") {
    return {
      cardFill: "none",
      panelFill: "rgba(10,12,18,0.58)",
      panelStroke: "rgba(232,227,216,0.3)",
      textMain: "#ece8df",
      textMuted: "#b9b3a7",
      accent: "#c6a86a",
      divider: "rgba(232,227,216,0.22)"
    };
  }

  return {
    cardFill: "#0a0d14",
    panelFill: "rgba(13,18,32,0.84)",
    panelStroke: "rgba(232,227,216,0.24)",
    textMain: "#ece8df",
    textMuted: "#b9b3a7",
    accent: "#c6a86a",
    divider: "rgba(232,227,216,0.22)"
  };
};

const asZodiacSign = (value: string): ZodiacSign | null => {
  return value in SIGN_TO_GLYPH ? (value as ZodiacSign) : null;
};

const dominantElement = (
  signs: ZodiacSign[]
): { element: (typeof ELEMENT_ORDER)[number]; count: number } => {
  const counts: Record<(typeof ELEMENT_ORDER)[number], number> = {
    fire: 0,
    earth: 0,
    air: 0,
    water: 0
  };

  for (const sign of signs) {
    counts[SIGN_TO_ELEMENT[sign]] += 1;
  }

  let chosen: (typeof ELEMENT_ORDER)[number] = ELEMENT_ORDER[0];
  for (const key of ELEMENT_ORDER) {
    if (counts[key] > counts[chosen]) {
      chosen = key;
    }
  }

  return {
    element: chosen,
    count: counts[chosen]
  };
};

const renderPanel = ({
  x,
  y,
  width,
  height,
  title,
  sign,
  theme,
  fallback
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  title: string;
  sign: ZodiacSign | null;
  theme: ThemeTokens;
  fallback?: string;
}): string => {
  const glyph = sign ? SIGN_TO_GLYPH[sign] : "?";

  return `
    <g>
      <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="42" fill="${theme.panelFill}" stroke="${theme.panelStroke}" stroke-width="1.5" />
      <text x="${x + 58}" y="${y + 62}" fill="${theme.textMuted}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="26" letter-spacing="7" text-transform="uppercase">${title}</text>
      <text x="${x + 66}" y="${y + 208}" fill="${theme.textMain}" font-family="'Times New Roman', Georgia, serif" font-size="154">${glyph}</text>
      ${
        sign
          ? `<text x="${x + 256}" y="${y + 196}" fill="${theme.textMain}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="50" letter-spacing="3">${sign}</text>
             ${renderZodiacIcon({ sign, x: x + width - 180, y: y + height / 2 + 10, size: 126, stroke: theme.accent, opacity: 0.9 })}`
          : `<text x="${x + 256}" y="${y + 186}" fill="${theme.textMain}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="44" letter-spacing="2">Birth time needed</text>
             <text x="${x + 256}" y="${y + 236}" fill="${theme.textMuted}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="24" letter-spacing="2">${fallback ?? "Ascendant unavailable"}</text>`
      }
    </g>
  `;
};

export const generateTotemSvg = (chart: AstroChart, opts: ShareCardOptions = {}): string => {
  const width = opts.width ?? defaultWidth;
  const height = opts.height ?? defaultHeight;
  const background = opts.background ?? "dark";
  const theme = themeForBackground(background);

  const timeUnknown = typeof chart.points.asc !== "number";
  const bigThree = deriveBigThreeFromChart(chart, timeUnknown);
  const placements = derivePlacementFacts(chart);

  const placementByKey = new Map(placements.map((item) => [item.key, item]));
  const compactPlacements = PLANET_ORDER.map((key) => {
    const item = placementByKey.get(key);
    const sign = item ? asZodiacSign(item.sign) : null;
    return {
      key,
      planetGlyph: PLANET_TO_GLYPH[key],
      signGlyph: sign ? SIGN_TO_GLYPH[sign] : "?"
    };
  });

  const elementSigns = compactPlacements
    .map((entry) => placementByKey.get(entry.key)?.sign)
    .map((sign) => (sign ? asZodiacSign(sign) : null))
    .filter(Boolean) as ZodiacSign[];

  const dominant = dominantElement(elementSigns);

  const mainFill =
    background === "transparent"
      ? "none"
      : background === "light"
        ? "url(#totemLightBg)"
        : "url(#totemDarkBg)";

  const sunSign = asZodiacSign(bigThree.sun);
  const moonSign = asZodiacSign(bigThree.moon);
  const risingSign = bigThree.rising ? asZodiacSign(bigThree.rising) : null;

  const footerStartX = 96;
  const footerStartY = height - 172;
  const rowWidth = width - footerStartX * 2;
  const entryWidth = rowWidth / 6;

  const placementRows = compactPlacements
    .map((entry, index) => {
      const row = Math.floor(index / 6);
      const col = index % 6;
      const x = footerStartX + col * entryWidth;
      const y = footerStartY + row * 54;

      return `
        <text x="${x}" y="${y}" fill="${theme.textMain}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="26" letter-spacing="1.8">${entry.planetGlyph} ${entry.signGlyph}</text>
      `;
    })
    .join("\n");

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="Natal big three totem">
  <defs>
    <radialGradient id="totemDarkBg" cx="38%" cy="4%" r="95%">
      <stop offset="0%" stop-color="#11192e" />
      <stop offset="55%" stop-color="#0b101c" />
      <stop offset="100%" stop-color="#05080f" />
    </radialGradient>
    <radialGradient id="totemLightBg" cx="38%" cy="4%" r="95%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="70%" stop-color="#f0e9da" />
      <stop offset="100%" stop-color="#e7dfcf" />
    </radialGradient>
  </defs>

  <rect x="0" y="0" width="${width}" height="${height}" fill="${mainFill}" />
  <rect x="38" y="38" width="${width - 76}" height="${height - 76}" rx="50" fill="none" stroke="${theme.divider}" stroke-width="1.2" />

  <text x="96" y="126" fill="${theme.textMuted}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="22" letter-spacing="8">NATAL TOTEM</text>
  <text x="96" y="174" fill="${theme.textMain}" font-family="'Times New Roman', Georgia, serif" font-size="64">Big Three Signature</text>

  ${renderPanel({ x: 76, y: 224, width: width - 152, height: 276, title: "Solar Self", sign: sunSign, theme })}
  ${renderPanel({ x: 76, y: 536, width: width - 152, height: 276, title: "Lunar Heart", sign: moonSign, theme })}
  ${renderPanel({ x: 76, y: 848, width: width - 152, height: 276, title: "Ascendant Mask", sign: risingSign, theme, fallback: "Exact birth time required" })}

  <g>
    <rect x="76" y="1176" width="${width - 152}" height="116" rx="30" fill="${theme.panelFill}" stroke="${theme.panelStroke}" stroke-width="1.4" />
    <text x="106" y="1212" fill="${theme.textMuted}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="18" letter-spacing="4.5">PLANET SIGNATURES</text>
    ${placementRows}
    <text x="${width - 310}" y="1212" fill="${theme.accent}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="19" letter-spacing="2.5">${ELEMENT_TO_ICON[dominant.element]} ${ELEMENT_TO_LABEL[dominant.element]} ${dominant.count}</text>
  </g>

  ${renderWatermark({ enabled: opts.watermark ?? true, width, height, color: background === "light" ? "rgba(25,32,45,0.32)" : "rgba(232,227,216,0.3)" })}
</svg>
  `.trim();
};
