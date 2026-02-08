"use client";

import { useMemo, useState } from "react";

interface PlanetaryArcProps {
  points: Record<string, number | undefined>;
}

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
];

const planetOrder = [
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

const planetGlyph: Record<string, string> = {
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

const degreeToLabel = (lon: number) => {
  const normalized = ((lon % 360) + 360) % 360;
  const signIndex = Math.floor(normalized / 30);
  const degreeInSign = normalized - signIndex * 30;
  return {
    sign: SIGNS[signIndex],
    degree: `${degreeInSign.toFixed(2)}°`
  };
};

export function PlanetaryArc({ points }: PlanetaryArcProps) {
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const markers = useMemo(() => {
    return planetOrder
      .map((key) => {
        const value = points[key];
        if (typeof value !== "number") return null;

        const x = (value / 360) * 100;
        const details = degreeToLabel(value);

        return {
          key,
          x,
          lon: value,
          ...details
        };
      })
      .filter(Boolean) as Array<{ key: string; x: number; lon: number; sign: string; degree: string }>;
  }, [points]);

  return (
    <div className="relative rounded-2xl border border-[color:var(--copper)]/35 bg-[color:var(--char)]/35 p-4 backdrop-blur-sm">
      <p className="mb-3 text-[10px] uppercase tracking-[0.32em] text-[color:var(--mist)]">
        Planetary Arc
      </p>
      <div className="relative h-28 w-full">
        <svg viewBox="0 0 100 42" className="h-full w-full" aria-label="Planetary arc visualization">
          <defs>
            <linearGradient id="astroArcGlow" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="rgba(184,155,94,0.2)" />
              <stop offset="50%" stopColor="rgba(184,155,94,0.75)" />
              <stop offset="100%" stopColor="rgba(184,155,94,0.2)" />
            </linearGradient>
          </defs>

          <path d="M 4 32 Q 50 2 96 32" fill="none" stroke="url(#astroArcGlow)" strokeWidth="0.9" />

          {Array.from({ length: 12 }, (_, idx) => {
            const x = 4 + idx * (92 / 11);
            return (
              <g key={`tick-${idx}`}>
                <line x1={x} y1={29.5} x2={x} y2={34.5} stroke="rgba(232,227,216,0.4)" strokeWidth="0.35" />
                <text
                  x={x}
                  y={39.5}
                  textAnchor="middle"
                  fontSize="2.5"
                  fill="rgba(232,227,216,0.62)"
                  letterSpacing="0.45"
                >
                  {SIGNS[idx].slice(0, 3).toUpperCase()}
                </text>
              </g>
            );
          })}

          {markers.map((marker) => {
            const x = 4 + (marker.x / 100) * 92;
            const y = 32 - Math.sin((marker.x / 100) * Math.PI) * 25;
            const isActive = activeKey === marker.key;

            return (
              <g key={marker.key}>
                <circle
                  cx={x}
                  cy={y}
                  r={isActive ? 1.8 : 1.45}
                  fill={isActive ? "rgba(184,155,94,1)" : "rgba(184,155,94,0.85)"}
                  stroke="rgba(11,12,16,0.9)"
                  strokeWidth="0.55"
                />
              </g>
            );
          })}
        </svg>

        {markers.map((marker) => {
          const left = `${marker.x}%`;
          const isActive = activeKey === marker.key;

          return (
            <button
              key={`hit-${marker.key}`}
              type="button"
              className="absolute top-0 -translate-x-1/2 rounded-full"
              style={{ left, width: 28, height: 28 }}
              onMouseEnter={() => setActiveKey(marker.key)}
              onFocus={() => setActiveKey(marker.key)}
              onMouseLeave={() => setActiveKey(null)}
              onBlur={() => setActiveKey(null)}
              onClick={() => setActiveKey((prev) => (prev === marker.key ? null : marker.key))}
              aria-label={`${marker.key} ${marker.sign} ${marker.degree}`}
            >
              <span className="sr-only">{marker.key}</span>
              {isActive ? (
                <span className="pointer-events-none absolute left-1/2 top-[-36px] w-max -translate-x-1/2 rounded-lg border border-[color:var(--copper)]/40 bg-[color:var(--bg)]/95 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-[color:var(--bone)] shadow-lg">
                  {planetGlyph[marker.key] ?? marker.key.slice(0, 1).toUpperCase()} {marker.key}: {marker.sign} {marker.degree}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
