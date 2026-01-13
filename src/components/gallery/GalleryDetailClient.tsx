"use client";

import { useMemo, useState } from "react";
import type { Vector3 } from "three";
import { GalleryViewer, CameraMode } from "@/components/gallery/GalleryViewer";
import { StillnessListener } from "@/components/ui/StillnessListener";
import { generateGeometry } from "@/lib/geometry/generators";
import { geometryToLineSet } from "@/lib/geometry/convertToLineSet";
import type { GeometryItem } from "@/data/geometryCatalog";
import { PlateSVG } from "@/components/PlateSVG";
import type { GeometrySlug } from "@/data/geometryCatalog";

export function GalleryDetailClient({ plate }: { plate: GeometryItem }) {
  const [cameraMode, setCameraMode] = useState<CameraMode>("cinematic");
  const [debugVisible, setDebugVisible] = useState(false);
  const showDebug = process.env.NODE_ENV !== "production";
  const defaults = getParticleDefaults(plate.slug);
  const [particleSize, setParticleSize] = useState(defaults.size);
  const [particleAlpha, setParticleAlpha] = useState(defaults.alpha);
  const [particleDensity, setParticleDensity] = useState(defaults.density);
  const [flowStrength, setFlowStrength] = useState(defaults.flow);
  const [trailAmount, setTrailAmount] = useState(0.25);
  const [scale, setScale] = useState(plate.defaultScale);
  const [fitKey, setFitKey] = useState(0);
  const { lines, radius } = useMemo(() => {
    const geometry = generateGeometry(plate.generatorId, { size: 2.4, detail: 160 });
    const lines = geometryToLineSet(geometry, 180);
    return { lines, radius: getBoundsRadius(lines) };
  }, [plate.generatorId]);

  return (
    <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[2fr_1fr]">
      <StillnessListener />
      <div className="space-y-6">
        <GalleryViewer
          lines={lines}
          cameraMode={cameraMode}
          debugForceVisible={debugVisible}
          particleSize={particleSize}
          particleAlpha={particleAlpha}
          particleDensity={particleDensity}
          flowStrength={flowStrength}
          trailAmount={trailAmount}
          scale={scale}
          boundsRadius={radius}
          fitKey={fitKey}
        />
        <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.35em] text-[color:var(--mist)]">
          <span className="rounded-full border border-[color:var(--copper)]/60 px-4 py-2">
            Particle Infusion
          </span>
          <button
            type="button"
            onClick={() => setCameraMode(cameraMode === "orbit" ? "cinematic" : "orbit")}
            className="rounded-full border border-[color:var(--copper)]/60 px-4 py-2 transition hover:border-[color:var(--gilt)]"
          >
            {cameraMode === "orbit" ? "Orbit" : "Cinematic"}
          </button>
          {showDebug && (
            <button
              type="button"
              onClick={() => setDebugVisible((prev) => !prev)}
              className={`rounded-full border px-4 py-2 transition ${
                debugVisible
                  ? "border-[color:var(--gilt)] text-[color:var(--bone)]"
                  : "border-[color:var(--copper)]/60"
              }`}
            >
              Debug Visible
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              setParticleSize(defaults.size);
              setParticleAlpha(defaults.alpha);
              setParticleDensity(defaults.density);
              setFlowStrength(defaults.flow);
              setTrailAmount(0.25);
              setScale(plate.defaultScale);
              setFitKey((prev) => prev + 1);
            }}
            className="rounded-full border border-[color:var(--copper)]/60 px-4 py-2 transition hover:border-[color:var(--gilt)]"
          >
            Reset View
          </button>
        </div>
        <div className="grid gap-4 rounded-2xl border border-[color:var(--copper)]/40 bg-[color:var(--char)]/40 p-4 text-xs uppercase tracking-[0.3em] text-[color:var(--mist)] sm:grid-cols-2">
          <label className="space-y-2 sm:col-span-2">
            <span>Scale</span>
            <input
              type="range"
              min={0.6}
              max={1.8}
              step={0.05}
              value={scale}
              onChange={(event) => setScale(Number(event.target.value))}
              className="h-1 w-full cursor-pointer appearance-none rounded-full bg-[color:var(--copper)]/40"
            />
          </label>
          <label className="space-y-2">
            <span>Particle Size</span>
            <input
              type="range"
              min={8}
              max={28}
              step={1}
              value={particleSize}
              onChange={(event) => setParticleSize(Number(event.target.value))}
              className="h-1 w-full cursor-pointer appearance-none rounded-full bg-[color:var(--copper)]/40"
            />
          </label>
          <label className="space-y-2">
            <span>Brightness</span>
            <input
              type="range"
              min={0.4}
              max={1.4}
              step={0.05}
              value={particleAlpha}
              onChange={(event) => setParticleAlpha(Number(event.target.value))}
              className="h-1 w-full cursor-pointer appearance-none rounded-full bg-[color:var(--copper)]/40"
            />
          </label>
          <label className="space-y-2">
            <span>Density</span>
            <input
              type="range"
              min={0.5}
              max={2}
              step={0.1}
              value={particleDensity}
              onChange={(event) => setParticleDensity(Number(event.target.value))}
              className="h-1 w-full cursor-pointer appearance-none rounded-full bg-[color:var(--copper)]/40"
            />
          </label>
          <label className="space-y-2">
            <span>Flow Strength</span>
            <input
              type="range"
              min={0}
              max={1.2}
              step={0.05}
              value={flowStrength}
              onChange={(event) => setFlowStrength(Number(event.target.value))}
              className="h-1 w-full cursor-pointer appearance-none rounded-full bg-[color:var(--copper)]/40"
            />
          </label>
          <label className="space-y-2 sm:col-span-2">
            <span>Trail Amount</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={trailAmount}
              onChange={(event) => setTrailAmount(Number(event.target.value))}
              className="h-1 w-full cursor-pointer appearance-none rounded-full bg-[color:var(--copper)]/40"
            />
          </label>
        </div>
      </div>

      <aside className="space-y-6">
        <div className="rounded-2xl border border-[color:var(--copper)]/40 bg-[color:var(--char)]/50 p-6">
          <div className="flex items-center justify-center">
            <div className="w-full max-w-[240px] sm:max-w-[320px] lg:max-w-[360px]">
              <div className="rounded-2xl border border-[color:var(--copper)]/40 bg-[color:var(--obsidian)]/60 p-4">
                <div className="flex items-center justify-center rounded-xl border border-[color:var(--copper)]/30 bg-[color:var(--char)]/40 p-2">
                  <div className="w-full max-w-full">
                    <PlateSVG slug={plate.slug} variant="detail" className="w-full h-auto" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <h1 className="mt-4 font-ritual text-3xl">{plate.title}</h1>
          <p className="mt-2 text-sm text-[color:var(--mist)]">{plate.caption}</p>
          <div className="mt-4 space-y-3 text-sm text-[color:var(--mist)]">
            <p>{plate.description[0]}</p>
            <p>{plate.description[1]}</p>
          </div>
            <div className="mt-4 border-t border-[color:var(--copper)]/30 pt-4">
              <p className="text-xs uppercase tracking-[0.4em] text-[color:var(--mist)]">
                Construction Notes
              </p>
              <ul className="mt-3 space-y-2 text-xs text-[color:var(--bone)]">
                {plate.tags.map((note) => (
                  <li key={note}>— {note}</li>
                ))}
              </ul>
            </div>
        </div>
      </aside>
    </div>
  );
}

function getParticleDefaults(slug: GeometrySlug) {
  switch (slug) {
    case "golden-spiral":
      return { size: 18, alpha: 1.1, density: 1.3, flow: 0.8 };
    case "sphere-lattice":
      return { size: 16, alpha: 0.95, density: 1.4, flow: 0.6 };
    case "torus":
      return { size: 17, alpha: 1, density: 1.2, flow: 0.7 };
    default:
      return { size: 16, alpha: 0.9, density: 1.1, flow: 0.6 };
  }
}

function getBoundsRadius(lines: Vector3[][]) {
  let maxDistance = 0;

  for (const line of lines) {
    for (const point of line) {
      const length = point.length();
      if (Number.isFinite(length)) {
        maxDistance = Math.max(maxDistance, length);
      }
    }
  }

  return maxDistance > 0 ? maxDistance : 1;
}
