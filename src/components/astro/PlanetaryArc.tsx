"use client";

import { useMemo, useState } from "react";
import { SIGNS, buildChartMarkers, planetGlyph } from "@/lib/astro/display";

interface PlanetaryArcProps {
  points: Record<string, number | undefined>;
}

export function PlanetaryArc({ points }: PlanetaryArcProps) {
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const markers = useMemo(() => {
    return buildChartMarkers(points).map((marker) => ({
      ...marker,
      x: (marker.lon / 360) * 100
    }));
  }, [points]);

  return (
    <div className="relative border-y border-[color:var(--copper)]/35 py-5">
      <p className="mb-3 text-xs uppercase tracking-[0.12em] text-[color:var(--mist)]">
        Planetary Arc
      </p>
      <div className="relative h-28 w-full">
        <svg viewBox="0 0 100 42" className="h-full w-full" aria-label="Planetary arc visualization">
          <defs>
            <linearGradient id="astroArcGlow" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="var(--gilt)" stopOpacity="0.2" />
              <stop offset="50%" stopColor="var(--gilt)" stopOpacity="0.75" />
              <stop offset="100%" stopColor="var(--gilt)" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          <path d="M 4 32 Q 50 2 96 32" fill="none" stroke="url(#astroArcGlow)" strokeWidth="0.9" />

          {Array.from({ length: 12 }, (_, idx) => {
            const x = 4 + idx * (92 / 11);
            return (
              <g key={`tick-${idx}`}>
                <line x1={x} y1={29.5} x2={x} y2={34.5} stroke="var(--bone)" strokeOpacity="0.4" strokeWidth="0.35" />
                <text
                  x={x}
                  y={39.5}
                  textAnchor="middle"
                  fontSize="2.5"
                  fill="var(--bone)"
                  fillOpacity="0.62"
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
                  fill="var(--gilt)"
                  fillOpacity={isActive ? 1 : 0.85}
                  stroke="var(--obsidian)"
                  strokeOpacity="0.9"
                  strokeWidth="0.55"
                />
              </g>
            );
          })}
        </svg>

      </div>
      <ul className="mt-3 grid grid-cols-4 gap-px border-y border-[color:var(--copper)]/20 sm:grid-cols-6">
        {markers.map((marker) => {
          const isActive = activeKey === marker.key;
          return (
            <li key={`hit-${marker.key}`} className="min-w-0">
              <button
                type="button"
                className={`flex min-h-[44px] min-w-[44px] w-full items-center justify-center gap-1 px-1 text-xs transition-[background-color,color] focus-visible:outline focus-visible:outline-1 focus-visible:outline-[color:var(--gilt)] ${isActive ? "bg-[color:var(--gilt)]/12 text-[color:var(--bone)]" : "text-[color:var(--mist)]"}`}
                onMouseEnter={() => setActiveKey(marker.key)}
                onFocus={() => setActiveKey(marker.key)}
                onMouseLeave={() => setActiveKey(null)}
                onBlur={() => setActiveKey(null)}
                onClick={() => setActiveKey((prev) => (prev === marker.key ? null : marker.key))}
                aria-label={`${marker.key} ${marker.sign} ${marker.degree}`}
              >
                <span className="font-ritual text-base text-[color:var(--gilt)]" aria-hidden="true">{planetGlyph[marker.key] ?? marker.key.slice(0, 1).toUpperCase()}</span>
                <span className="truncate">{marker.sign.slice(0, 3)} {marker.degree}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
