"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { WebGLGuard } from "@/components/ui/WebGLGuard";
import { useThemeStore } from "@/lib/themeStore";
import { buildChartMarkers, findHouse, formatDegreeMinute, planetGlyph } from "@/lib/astro/display";
import { PlanetaryArc } from "./PlanetaryArc";
import type { AstroAspect } from "@/lib/astro/types";

const NatalChartScene = dynamic(() => import("./chart3d/NatalChartScene"), { ssr: false });

interface NatalChartInstrumentProps {
  points: Record<string, number | undefined>;
  cusps: number[] | null;
  aspects: AstroAspect[];
}

/**
 * The Celestial Instrument: a 3D natal chart with the engraved 2D arc as the
 * fallback for reduced-motion, low-power, or WebGL-less visitors.
 */
export function NatalChartInstrument({ points, cusps, aspects }: NatalChartInstrumentProps) {
  const colors = useThemeStore((state) => state.colors);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const markers = useMemo(() => buildChartMarkers(points), [points]);

  const activeDetail = useMemo(() => {
    if (!activeKey) return null;
    const marker = markers.find((entry) => entry.key === activeKey);
    if (!marker) return null;
    const house = findHouse(marker.lon, cusps);
    const related = aspects
      .filter((aspect) => aspect.a === activeKey || aspect.b === activeKey)
      .map((aspect) => {
        const other = aspect.a === activeKey ? aspect.b : aspect.a;
        return `${aspect.type} ${other}`;
      });
    return { marker, house, related };
  }, [activeKey, markers, cusps, aspects]);

  if (markers.length === 0) {
    return null;
  }

  return (
    <WebGLGuard fallback={<PlanetaryArc points={points} />}>
      <div className="relative border-y border-[color:var(--copper)]/35 py-5">
        <div className="mb-3 flex items-baseline justify-between gap-4">
          <p className="text-xs uppercase tracking-[0.12em] text-[color:var(--mist)]">
            The celestial instrument
          </p>
          <p className="hidden text-xs text-[color:var(--mist)]/70 sm:block">
            Drag to turn · select a body to trace its aspects
          </p>
        </div>
        <div className="relative h-[320px] w-full sm:h-[400px]">
          <NatalChartScene
            markers={markers}
            cusps={cusps}
            aspects={aspects}
            colors={colors}
            activeKey={activeKey}
            onSelect={setActiveKey}
          />
        </div>
        <p
          className="mt-3 min-h-[1.5rem] text-center text-xs text-[color:var(--mist)]"
          role="status"
          aria-live="polite"
        >
          {activeDetail ? (
            <>
              <span className="font-ritual text-sm text-[color:var(--gilt)]" aria-hidden="true">
                {planetGlyph[activeDetail.marker.key]}
              </span>{" "}
              <span className="capitalize text-[color:var(--bone)]">{activeDetail.marker.key}</span>
              {" · "}
              {formatDegreeMinute(activeDetail.marker.lon)} {activeDetail.marker.sign}
              {activeDetail.house ? ` · House ${activeDetail.house}` : ""}
              {activeDetail.related.length > 0 ? ` · ${activeDetail.related.join(", ")}` : ""}
            </>
          ) : (
            "Select a body to read its exact degree, house, and aspects."
          )}
        </p>
        <ul className="mt-3 grid grid-cols-4 gap-px border-y border-[color:var(--copper)]/20 sm:grid-cols-6">
          {markers.map((marker) => {
            const isActive = activeKey === marker.key;
            return (
              <li key={`hit-${marker.key}`} className="min-w-0">
                <button
                  type="button"
                  className={`flex min-h-[44px] min-w-[44px] w-full items-center justify-center gap-1 px-1 text-xs transition-[background-color,color] focus-visible:outline focus-visible:outline-1 focus-visible:outline-[color:var(--gilt)] ${isActive ? "bg-[color:var(--gilt)]/12 text-[color:var(--bone)]" : "text-[color:var(--mist)]"}`}
                  onClick={() => setActiveKey((prev) => (prev === marker.key ? null : marker.key))}
                  aria-label={`${marker.key} ${marker.sign} ${marker.degree}`}
                  aria-pressed={isActive}
                >
                  <span className="font-ritual text-base text-[color:var(--gilt)]" aria-hidden="true">
                    {planetGlyph[marker.key] ?? marker.key.slice(0, 1).toUpperCase()}
                  </span>
                  <span className="truncate">
                    {marker.sign.slice(0, 3)} {marker.degree}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </WebGLGuard>
  );
}
