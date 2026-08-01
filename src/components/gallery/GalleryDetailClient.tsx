"use client";

import { useId, useMemo, useState } from "react";
import type { Vector3 } from "three";
import { GalleryViewer, type CameraMode } from "@/components/gallery/GalleryViewer";
import { PlateSVG } from "@/components/PlateSVG";
import { StillnessListener } from "@/components/ui/StillnessListener";
import { GEOMETRY, type GeometryItem, type GeometrySlug } from "@/data/geometryCatalog";
import { geometryToLineSet } from "@/lib/geometry/convertToLineSet";
import { generateGeometry } from "@/lib/geometry/generators";

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
  const plateNumber = GEOMETRY.findIndex((item) => item.slug === plate.slug) + 1;
  const { lines, radius } = useMemo(() => {
    const geometry = generateGeometry(plate.generatorId, { size: 2.4, detail: 160 });
    const lines = geometryToLineSet(geometry, 180);
    return { lines, radius: getBoundsRadius(lines) };
  }, [plate.generatorId]);

  const resetCalibration = () => {
    setParticleSize(defaults.size);
    setParticleAlpha(defaults.alpha);
    setParticleDensity(defaults.density);
    setFlowStrength(defaults.flow);
    setTrailAmount(0.25);
    setScale(plate.defaultScale);
    setFitKey((previous) => previous + 1);
  };

  return (
    <article className="gallery-instrument mx-auto max-w-6xl">
      <StillnessListener />
      <header className="max-w-4xl border-b border-[color:var(--stone)]/22 pb-8">
        <p className="type-eyebrow text-[color:var(--gilt)]">
          Plate {String(plateNumber).padStart(2, "0")} · Living line study
        </p>
        <h1 className="mt-3 font-ritual text-5xl leading-none sm:text-6xl lg:text-7xl">
          {plate.title}
        </h1>
        <p className="mt-4 max-w-2xl font-ritual text-xl italic leading-relaxed text-[color:var(--mist)] sm:text-2xl">
          {plate.caption}
        </p>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.9fr)_minmax(17rem,0.8fr)] lg:items-start">
        <section aria-labelledby="instrument-heading" className="min-w-0">
          <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="type-eyebrow text-[color:var(--gilt)]">Live instrument</p>
              <h2 id="instrument-heading" className="mt-1 font-ritual text-2xl">
                Particle field
              </h2>
            </div>
            <p className="text-xs uppercase tracking-[0.16em] text-[color:var(--mist)]">
              Drag in orbit view to inspect
            </p>
          </div>
          <GalleryViewer
            accessibleLabel={`${plate.title} interactive geometry instrument`}
            containerClassName="gallery-instrument__viewport"
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
          <p className="mt-3 border-t border-[color:var(--stone)]/18 pt-3 text-xs leading-relaxed text-[color:var(--mist)]">
            A real-time rendering of the plate geometry. The engraved plate below remains available
            as a still reference when WebGL or motion is unavailable.
          </p>
        </section>

        <CalibrationField
          cameraMode={cameraMode}
          debugVisible={debugVisible}
          flowStrength={flowStrength}
          particleAlpha={particleAlpha}
          particleDensity={particleDensity}
          particleSize={particleSize}
          scale={scale}
          showDebug={showDebug}
          trailAmount={trailAmount}
          onCameraMode={setCameraMode}
          onDebugVisible={() => setDebugVisible((visible) => !visible)}
          onFlowStrength={setFlowStrength}
          onParticleAlpha={setParticleAlpha}
          onParticleDensity={setParticleDensity}
          onParticleSize={setParticleSize}
          onReset={resetCalibration}
          onScale={setScale}
          onTrailAmount={setTrailAmount}
        />
      </div>

      <div className="mt-16 grid gap-10 border-t border-[color:var(--stone)]/22 pt-10 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.72fr)]">
        <section aria-labelledby="plate-reading-heading" className="max-w-2xl">
          <p className="type-eyebrow text-[color:var(--gilt)]">Reading the construction</p>
          <h2 id="plate-reading-heading" className="mt-2 font-ritual text-3xl sm:text-4xl">
            Measure, relation, emergence
          </h2>
          <div className="mt-5 space-y-4 text-base leading-relaxed text-[color:var(--mist)]">
            <p>{plate.description[0]}</p>
            <p>{plate.description[1]}</p>
          </div>
          <div className="mt-8 border-l border-[color:var(--gilt)]/52 pl-5">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--gilt)]">
              Construction notes
            </h3>
            <ul className="mt-4 grid gap-3 text-sm text-[color:var(--bone)] sm:grid-cols-3">
              {plate.tags.map((note, index) => (
                <li key={note} className="border-t border-[color:var(--stone)]/20 pt-3">
                  <span className="mr-2 font-ritual text-[color:var(--gilt)]">{index + 1}.</span>
                  {note}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <figure className="gallery-instrument__static-plate">
          <div className="border border-[color:var(--stone)]/24 bg-[color:var(--paper)]/90 p-3">
            <PlateSVG slug={plate.slug} variant="detail" className="h-auto w-full" />
          </div>
          <figcaption className="plate-caption">
            <span>Static plate</span>
            <span>{plate.title}, construction view</span>
          </figcaption>
        </figure>
      </div>
    </article>
  );
}

type CalibrationFieldProps = {
  cameraMode: CameraMode;
  debugVisible: boolean;
  flowStrength: number;
  particleAlpha: number;
  particleDensity: number;
  particleSize: number;
  scale: number;
  showDebug: boolean;
  trailAmount: number;
  onCameraMode: (mode: CameraMode) => void;
  onDebugVisible: () => void;
  onFlowStrength: (value: number) => void;
  onParticleAlpha: (value: number) => void;
  onParticleDensity: (value: number) => void;
  onParticleSize: (value: number) => void;
  onReset: () => void;
  onScale: (value: number) => void;
  onTrailAmount: (value: number) => void;
};

function CalibrationField(props: CalibrationFieldProps) {
  return (
    <fieldset className="gallery-instrument__controls border-y border-[color:var(--stone)]/24 py-5">
      <legend className="px-2 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--gilt)]">
        Calibration field
      </legend>

      <div role="group" aria-label="Camera path" className="mt-2 grid grid-cols-2 border border-[color:var(--stone)]/24">
        {(["cinematic", "orbit"] as const).map((mode) => (
          <button
            key={mode}
            type="button"
            aria-pressed={props.cameraMode === mode}
            onClick={() => props.onCameraMode(mode)}
            className="min-h-[44px] border-r border-[color:var(--stone)]/24 px-3 text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--mist)] last:border-r-0 aria-pressed:bg-[color:var(--gilt)]/12 aria-pressed:text-[color:var(--bone)]"
          >
            {mode === "cinematic" ? "Cinematic view" : "Orbit view"}
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-4">
        <CalibrationControl label="Scale" min={0.6} max={1.8} step={0.05} value={props.scale} onChange={props.onScale} display={`${props.scale.toFixed(2)}×`} />
        <CalibrationControl label="Particle size" min={8} max={28} step={1} value={props.particleSize} onChange={props.onParticleSize} display={`${props.particleSize} px`} />
        <CalibrationControl label="Brightness" min={0.4} max={1.4} step={0.05} value={props.particleAlpha} onChange={props.onParticleAlpha} display={props.particleAlpha.toFixed(2)} />
        <CalibrationControl label="Density" min={0.5} max={2} step={0.1} value={props.particleDensity} onChange={props.onParticleDensity} display={props.particleDensity.toFixed(2)} />
        <CalibrationControl label="Flow strength" min={0} max={1.2} step={0.05} value={props.flowStrength} onChange={props.onFlowStrength} display={props.flowStrength.toFixed(2)} />
        <CalibrationControl label="Trail amount" min={0} max={1} step={0.05} value={props.trailAmount} onChange={props.onTrailAmount} display={`${Math.round(props.trailAmount * 100)}%`} />
      </div>

      <div className="mt-6 grid gap-2">
        {props.showDebug ? (
          <button
            type="button"
            aria-pressed={props.debugVisible}
            onClick={props.onDebugVisible}
            className="min-h-[44px] border border-[color:var(--stone)]/24 px-3 text-left text-xs uppercase tracking-[0.14em] text-[color:var(--mist)] aria-pressed:border-[color:var(--gilt)]/60 aria-pressed:text-[color:var(--bone)]"
          >
            {props.debugVisible ? "Hide diagnostic overlay" : "Show diagnostic overlay"}
          </button>
        ) : null}
        <button
          type="button"
          onClick={props.onReset}
          aria-label="Reset calibration and refit geometry"
          className="min-h-[44px] border border-[color:var(--gilt)]/44 px-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--gilt)] hover:border-[color:var(--gilt)]"
        >
          Reset calibration · Refit
        </button>
      </div>
    </fieldset>
  );
}

type CalibrationControlProps = {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  display: string;
  onChange: (value: number) => void;
};

function CalibrationControl({ label, min, max, step, value, display, onChange }: CalibrationControlProps) {
  const id = useId();
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4 text-xs">
        <label htmlFor={id} className="font-semibold text-[color:var(--bone)]">{label}</label>
        <output htmlFor={id} className="font-mono text-[color:var(--gilt)]">{display}</output>
      </div>
      <div className="flex min-h-[44px] items-center">
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className="gallery-instrument__range w-full cursor-pointer appearance-none"
        />
      </div>
    </div>
  );
}

export function getParticleDefaults(slug: GeometrySlug) {
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
      if (Number.isFinite(length)) maxDistance = Math.max(maxDistance, length);
    }
  }
  return maxDistance > 0 ? maxDistance : 1;
}
