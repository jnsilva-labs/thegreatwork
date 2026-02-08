import { derivePlacementFacts } from "../derive";
import type { AstroChart, AstroAspect } from "../types";
import {
  PLANET_ORDER,
  SIGN_ORDER,
  type ShareCardBackground,
  type ShareCardOptions,
  type ZodiacSign
} from "./constants";
import { hashPlacements, prng } from "./seed";
import { renderWatermark } from "./watermark";
import { renderZodiacIcon } from "./zodiacIcons";

const defaultWidth = 1080;
const defaultHeight = 1080;

interface Theme {
  bgFill: string;
  textMain: string;
  textMuted: string;
  nodeStroke: string;
  starColor: string;
  markerColor: string;
  sealColor: string;
}

const themeFor = (background: ShareCardBackground): Theme => {
  if (background === "light") {
    return {
      bgFill: "#f4efe4",
      textMain: "#121722",
      textMuted: "#47505f",
      nodeStroke: "rgba(41,49,62,0.32)",
      starColor: "rgba(31,39,52,0.45)",
      markerColor: "#1f2f57",
      sealColor: "rgba(41,50,66,0.34)"
    };
  }

  if (background === "transparent") {
    return {
      bgFill: "none",
      textMain: "#ece8df",
      textMuted: "#b9b3a7",
      nodeStroke: "rgba(232,227,216,0.32)",
      starColor: "rgba(232,227,216,0.52)",
      markerColor: "#d8be81",
      sealColor: "rgba(232,227,216,0.22)"
    };
  }

  return {
    bgFill: "#070b15",
    textMain: "#ece8df",
    textMuted: "#b9b3a7",
    nodeStroke: "rgba(232,227,216,0.26)",
    starColor: "rgba(232,227,216,0.48)",
    markerColor: "#d8be81",
    sealColor: "rgba(232,227,216,0.22)"
  };
};

const asSign = (value: string): ZodiacSign | null => {
  return (SIGN_ORDER as readonly string[]).includes(value) ? (value as ZodiacSign) : null;
};

const pseudoHash = (text: string): number => {
  let hash = 2166136261;

  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
};

const aspectStroke = (type: AstroAspect["type"]): { dash: string; opacity: number; width: number } => {
  switch (type) {
    case "opposition":
      return { dash: "none", opacity: 0.38, width: 2.2 };
    case "square":
      return { dash: "10 8", opacity: 0.32, width: 2 };
    case "trine":
      return { dash: "none", opacity: 0.2, width: 1.7 };
    case "sextile":
      return { dash: "2 8", opacity: 0.26, width: 1.8 };
    case "conjunction":
      return { dash: "none", opacity: 0.42, width: 2.6 };
    default:
      return { dash: "none", opacity: 0.25, width: 1.6 };
  }
};

const PLANET_TO_LABEL: Record<string, string> = {
  sun: "SUN",
  moon: "MOON",
  mercury: "MERC",
  venus: "VEN",
  mars: "MARS",
  jupiter: "JUP",
  saturn: "SAT",
  uranus: "URA",
  neptune: "NEP",
  pluto: "PLU",
  node: "NODE"
};

export const generateConstellationSvg = (
  chart: AstroChart,
  opts: ShareCardOptions = {}
): string => {
  const width = opts.width ?? defaultWidth;
  const height = opts.height ?? defaultHeight;
  const background = opts.background ?? "dark";
  const includeAspects = opts.includeAspects ?? true;
  const theme = themeFor(background);

  const cx = width / 2;
  const cy = height / 2;
  const wheelRadius = Math.min(width, height) * 0.38;

  const seed = hashPlacements(chart);
  const rand = prng(seed);

  const signNodes = SIGN_ORDER.map((sign, index) => {
    const angle = ((-90 + index * 30) * Math.PI) / 180;
    return {
      sign,
      index,
      angle,
      x: cx + Math.cos(angle) * wheelRadius,
      y: cy + Math.sin(angle) * wheelRadius
    };
  });

  const signNodeByName = new Map(signNodes.map((node) => [node.sign, node]));

  const placementFacts = derivePlacementFacts(chart).filter(
    (entry): entry is typeof entry & { sign: ZodiacSign } => {
      return (
        PLANET_ORDER.includes(entry.key as (typeof PLANET_ORDER)[number]) &&
        asSign(entry.sign) !== null
      );
    }
  );

  const placementsBySign = new Map<ZodiacSign, typeof placementFacts>();
  for (const sign of SIGN_ORDER) {
    placementsBySign.set(sign, []);
  }

  for (const fact of placementFacts) {
    const sign = asSign(fact.sign);
    if (!sign) continue;
    placementsBySign.get(sign)?.push(fact);
  }

  for (const sign of SIGN_ORDER) {
    placementsBySign.get(sign)?.sort((a, b) => a.key.localeCompare(b.key));
  }

  const planetMarkers: Array<{
    key: string;
    x: number;
    y: number;
    radius: number;
    sign: ZodiacSign;
    label: string;
  }> = [];

  for (const sign of SIGN_ORDER) {
    const node = signNodeByName.get(sign);
    if (!node) continue;

    const facts = placementsBySign.get(sign) ?? [];
    const tangentX = -Math.sin(node.angle);
    const tangentY = Math.cos(node.angle);
    const radialX = Math.cos(node.angle);
    const radialY = Math.sin(node.angle);

    facts.forEach((fact, idx) => {
      const hash = pseudoHash(`${fact.key}:${seed}`);
      const localRand = prng(hash);
      const centerOffset = (idx - (facts.length - 1) / 2) * 26;
      const jitter = (localRand() - 0.5) * 8;
      const radial = wheelRadius - 80 - idx * 3 + localRand() * 6;

      const x = cx + radialX * radial + tangentX * (centerOffset + jitter);
      const y = cy + radialY * radial + tangentY * (centerOffset + jitter);

      planetMarkers.push({
        key: fact.key,
        x,
        y,
        radius: fact.key === "sun" || fact.key === "moon" ? 8.6 : 6.2,
        sign,
        label: PLANET_TO_LABEL[fact.key] ?? fact.key.slice(0, 3).toUpperCase()
      });
    });
  }

  const markerByKey = new Map(planetMarkers.map((item) => [item.key, item]));

  const aspectLines = includeAspects
    ? chart.aspects
        .filter((aspect) => aspect.orb <= 4)
        .filter((aspect) => markerByKey.has(aspect.a) && markerByKey.has(aspect.b))
        .sort((a, b) => a.orb - b.orb)
        .slice(0, 10)
    : [];

  const starfield = Array.from({ length: 170 }, (_, index) => {
    const x = rand() * width;
    const y = rand() * height;
    const radius = 0.45 + rand() * 1.85;
    const opacity = 0.08 + rand() * 0.4;

    return `<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${radius.toFixed(2)}" fill="${theme.starColor}" opacity="${opacity.toFixed(3)}" />`;
  }).join("\n");

  const signClusters = signNodes
    .map((node) => {
      const localRand = prng(seed ^ ((node.index + 1) * 2654435761));
      const stars = 3 + Math.floor(localRand() * 4);

      const cluster = Array.from({ length: stars }, () => {
        const angle = localRand() * Math.PI * 2;
        const radius = 8 + localRand() * 22;
        const x = node.x + Math.cos(angle) * radius;
        const y = node.y + Math.sin(angle) * radius;
        const size = 1 + localRand() * 1.6;

        return `<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${size.toFixed(2)}" fill="${theme.starColor}" opacity="0.68" />`;
      }).join("\n");

      return `
        <g>
          ${cluster}
          <circle cx="${node.x.toFixed(2)}" cy="${node.y.toFixed(2)}" r="28" fill="none" stroke="${theme.nodeStroke}" stroke-width="1.2" />
          ${renderZodiacIcon({
            sign: node.sign,
            x: Number(node.x.toFixed(2)),
            y: Number(node.y.toFixed(2)),
            size: 42,
            stroke: theme.textMain,
            opacity: 0.9
          })}
        </g>
      `;
    })
    .join("\n");

  const renderedAspectLines = aspectLines
    .map((aspect) => {
      const a = markerByKey.get(aspect.a);
      const b = markerByKey.get(aspect.b);

      if (!a || !b) return "";

      const style = aspectStroke(aspect.type);
      const dash = style.dash === "none" ? "" : `stroke-dasharray=\"${style.dash}\"`;

      return `<line x1="${a.x.toFixed(2)}" y1="${a.y.toFixed(2)}" x2="${b.x.toFixed(2)}" y2="${b.y.toFixed(2)}" stroke="${theme.markerColor}" stroke-width="${style.width}" opacity="${style.opacity}" ${dash} />`;
    })
    .join("\n");

  const renderedMarkers = planetMarkers
    .map((marker) => {
      return `
        <g>
          <circle cx="${marker.x.toFixed(2)}" cy="${marker.y.toFixed(2)}" r="${marker.radius.toFixed(2)}" fill="${theme.markerColor}" opacity="0.9" />
          <circle cx="${marker.x.toFixed(2)}" cy="${marker.y.toFixed(2)}" r="${(marker.radius + 5.2).toFixed(2)}" fill="none" stroke="${theme.markerColor}" opacity="0.22" stroke-width="1" />
          <text x="${(marker.x + marker.radius + 8).toFixed(2)}" y="${(marker.y + 4).toFixed(2)}" fill="${theme.textMuted}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="11" letter-spacing="1.1">${marker.label}</text>
        </g>
      `;
    })
    .join("\n");

  const backgroundFill =
    background === "transparent"
      ? "none"
      : background === "light"
        ? "url(#constellationLightBg)"
        : "url(#constellationDarkBg)";

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="Zodiac constellation map">
  <defs>
    <radialGradient id="constellationDarkBg" cx="50%" cy="42%" r="78%">
      <stop offset="0%" stop-color="#13203f" />
      <stop offset="60%" stop-color="#0a1022" />
      <stop offset="100%" stop-color="#060912" />
    </radialGradient>
    <radialGradient id="constellationLightBg" cx="50%" cy="42%" r="78%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="60%" stop-color="#efe7d7" />
      <stop offset="100%" stop-color="#e4dac6" />
    </radialGradient>
  </defs>

  <rect x="0" y="0" width="${width}" height="${height}" fill="${backgroundFill}" />
  ${starfield}

  <circle cx="${cx}" cy="${cy}" r="${wheelRadius + 46}" fill="none" stroke="${theme.sealColor}" stroke-width="1" />
  <circle cx="${cx}" cy="${cy}" r="${wheelRadius}" fill="none" stroke="${theme.nodeStroke}" stroke-width="1.4" />

  ${signClusters}
  ${renderedAspectLines}
  ${renderedMarkers}

  <g>
    <circle cx="${cx}" cy="${cy}" r="96" fill="none" stroke="${theme.sealColor}" stroke-width="1.4" />
    <circle cx="${cx}" cy="${cy}" r="66" fill="none" stroke="${theme.sealColor}" stroke-width="1" />
    <text x="${cx}" y="${cy - 4}" text-anchor="middle" fill="${theme.textMain}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="20" letter-spacing="4">NATAL CONSTELLATION</text>
    <text x="${cx}" y="${cy + 26}" text-anchor="middle" fill="${theme.textMuted}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="12" letter-spacing="3">PROCEDURAL STAR WHEEL</text>
  </g>

  ${renderWatermark({ enabled: opts.watermark ?? true, width, height, color: background === "light" ? "rgba(25,32,45,0.33)" : "rgba(232,227,216,0.3)" })}
</svg>
  `.trim();
};
