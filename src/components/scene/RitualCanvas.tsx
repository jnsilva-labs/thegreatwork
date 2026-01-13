"use client";

import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr } from "@react-three/drei";
import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import { Suspense, useEffect, useState } from "react";
import { SceneShell } from "@/components/scene/SceneShell";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { useUiStore } from "@/lib/uiStore";
import { useHermeticStore } from "@/lib/hermeticStore";

export function RitualCanvas() {
  const reducedMotion = usePrefersReducedMotion();
  const stillness = useUiStore((state) => state.stillness);
  const clarity = useHermeticStore((state) => state.clarity);
  const intensity = useHermeticStore((state) => state.intensity);
  const stillnessMode = useHermeticStore((state) => state.stillnessMode);
  const qualityTier = useHermeticStore((state) => state.qualityTier);
  const autoQuality = useHermeticStore((state) => state.autoQuality);
  const postBoost = useHermeticStore((state) => state.postBoost);
  const [paused, setPaused] = useState(false);
  const [dpr, setDpr] = useState<[number, number]>([1, 1.5]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const update = () => {
      const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
      const isMobile = window.matchMedia("(max-width: 768px)").matches;
      const maxDpr = reducedMotion || memory <= 4 || isMobile ? 1.25 : 1.6;
      setDpr([1, maxDpr]);
      if (autoQuality) {
        const qualityTier = memory <= 4 || isMobile ? "low" : memory <= 6 ? "medium" : "high";
        useHermeticStore.getState().setState({ qualityTier });
      }
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [autoQuality, reducedMotion]);

  useEffect(() => {
    const update = () => setPaused(document.hidden);
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  const motionDisabled = reducedMotion || stillness || stillnessMode;
  const noiseOpacity = motionDisabled ? 0.05 : Math.max(0.06, 0.16 - clarity * 0.1);
  const bloomIntensityBase =
    motionDisabled || qualityTier === "low" ? 0.12 : 0.2 + intensity * 0.2;
  const bloomIntensity = Math.min(0.6, bloomIntensityBase + postBoost);
  const chromaOffset = motionDisabled || qualityTier === "low" ? 0 : 0.0015;

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas
        dpr={dpr}
        frameloop={paused ? "never" : motionDisabled ? "demand" : "always"}
        camera={{ position: [0, 0, 7], fov: 42, near: 0.1, far: 80 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <Suspense fallback={null}>
          <SceneShell reducedMotion={motionDisabled} />
          {!motionDisabled && <AdaptiveDpr pixelated />}
          <EffectComposer multisampling={0}>
            <Bloom luminanceThreshold={0.2} intensity={bloomIntensity} mipmapBlur />
            <Noise opacity={noiseOpacity} />
            <Vignette eskil={false} offset={0.2} darkness={0.5} />
            {chromaOffset > 0 ? (
              <ChromaticAberration offset={[chromaOffset, chromaOffset * 0.6]} />
            ) : (
              <></>
            )}
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}
