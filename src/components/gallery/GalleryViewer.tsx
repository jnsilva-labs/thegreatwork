"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Group, PerspectiveCamera } from "three";
import { Vector2, Vector3 } from "three";
import type { LineSet } from "@/lib/geometry";
import { LineParticles } from "@/components/gallery/LineParticles";
import { useHermeticStore } from "@/lib/hermeticStore";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { AfterimagePass, EffectComposer, RenderPass, UnrealBloomPass } from "three-stdlib";

export type CameraMode = "orbit" | "cinematic";

type GalleryViewerProps = {
  lines: LineSet;
  cameraMode: CameraMode;
  debugForceVisible?: boolean;
  particleSize: number;
  particleAlpha: number;
  particleDensity: number;
  flowStrength: number;
  trailAmount: number;
  scale: number;
  boundsRadius: number;
  fitKey: number;
};

export function GalleryViewer({
  lines,
  cameraMode,
  debugForceVisible,
  particleSize,
  particleAlpha,
  particleDensity,
  flowStrength,
  trailAmount,
  scale,
  boundsRadius,
  fitKey,
}: GalleryViewerProps) {
  const stillnessMode = useHermeticStore((state) => state.stillnessMode);
  const clarity = useHermeticStore((state) => state.clarity);
  const qualityTier = useHermeticStore((state) => state.qualityTier);
  const reducedMotion = usePrefersReducedMotion();
  const [dpr, setDpr] = useState<[number, number]>([1, 1.5]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const update = () => {
      const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
      const isMobile = window.matchMedia("(max-width: 768px)").matches;
      const maxDpr = memory <= 4 || isMobile ? 1.25 : 1.6;
      setDpr([1, maxDpr]);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <div className="pointer-events-auto relative h-[70vh] w-full rounded-2xl border border-[color:var(--copper)]/40 bg-[color:var(--obsidian)]/60">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45, near: 0.1, far: 50 }}
        dpr={dpr}
        frameloop={stillnessMode ? "demand" : "always"}
        className="pointer-events-auto"
      >
        <SceneContent
          lines={lines}
          cameraMode={cameraMode}
          stillnessMode={stillnessMode}
          clarity={clarity}
          debugForceVisible={debugForceVisible}
          particleSize={particleSize}
          particleAlpha={particleAlpha}
          particleDensity={particleDensity}
          flowStrength={flowStrength}
          trailAmount={trailAmount}
          reducedMotion={reducedMotion}
          qualityTier={qualityTier}
          scale={scale}
          boundsRadius={boundsRadius}
          fitKey={fitKey}
        />
      </Canvas>
    </div>
  );
}

type SceneContentProps = {
  lines: LineSet;
  cameraMode: CameraMode;
  stillnessMode: boolean;
  clarity: number;
  debugForceVisible?: boolean;
  particleSize: number;
  particleAlpha: number;
  particleDensity: number;
  flowStrength: number;
  trailAmount: number;
  reducedMotion: boolean;
  qualityTier: string;
  scale: number;
  boundsRadius: number;
  fitKey: number;
};

function SceneContent({
  lines,
  cameraMode,
  stillnessMode,
  clarity,
  debugForceVisible,
  particleSize,
  particleAlpha,
  particleDensity,
  flowStrength,
  trailAmount,
  reducedMotion,
  qualityTier,
  scale,
  boundsRadius,
  fitKey,
}: SceneContentProps) {
  const groupRef = useRef<Group | null>(null);
  const { camera } = useThree();

  useEffect(() => {
    if (!("fov" in camera)) {
      return;
    }
    const perspective = camera as PerspectiveCamera;
    const fov = (perspective.fov * Math.PI) / 180;
    const fitDistance = boundsRadius / Math.tan(fov / 2);
    const distance = Math.max(3, fitDistance * 1.25 * scale);
    perspective.position.set(0, 0, distance);
    perspective.lookAt(0, 0, 0);
  }, [boundsRadius, camera, fitKey, scale]);
  const path = useMemo(
    () => [
      new Vector3(0, 0.2, 4.6),
      new Vector3(0.6, 0.2, 4.2),
      new Vector3(-0.5, -0.2, 4.4),
    ],
    []
  );

  useFrame((state) => {
    if (cameraMode === "cinematic" && !stillnessMode) {
      const t = (state.clock.elapsedTime * 0.1) % 1;
      const idx = Math.floor(t * (path.length - 1));
      const next = (idx + 1) % path.length;
      const local = (t * (path.length - 1)) % 1;
      const position = new Vector3().lerpVectors(path[idx], path[next], local);
      camera.position.lerp(position, 0.05);
      camera.lookAt(0, 0, 0);
    }

    if (groupRef.current && !stillnessMode) {
      groupRef.current.rotation.y += 0.0015;
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} color="#d7c6a4" />
      <directionalLight position={[4, 6, 3]} intensity={0.8} color="#f3d9a9" />
      <group ref={groupRef} scale={scale}>
        <LineParticles
          lines={lines}
          clarity={clarity}
          size={particleSize}
          alpha={particleAlpha}
          density={particleDensity}
          flow={flowStrength}
          renderOrder={1}
        />
      </group>
      {cameraMode === "orbit" && (
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.4} />
      )}
      <GalleryPost
        enabled={!debugForceVisible}
        trailAmount={trailAmount}
        stillnessMode={stillnessMode}
        reducedMotion={reducedMotion}
        qualityTier={qualityTier}
      />
    </>
  );
}

type GalleryPostProps = {
  enabled: boolean;
  trailAmount: number;
  stillnessMode: boolean;
  reducedMotion: boolean;
  qualityTier: string;
};

function GalleryPost({
  enabled,
  trailAmount,
  stillnessMode,
  reducedMotion,
  qualityTier,
}: GalleryPostProps) {
  const { gl, scene, camera, size } = useThree();
  const composerRef = useRef<EffectComposer | null>(null);
  const afterimageRef = useRef<AfterimagePass | null>(null);
  const bloomRef = useRef<UnrealBloomPass | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const composer = new EffectComposer(gl);
    const renderPass = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(
      new Vector2(size.width, size.height),
      stillnessMode ? 0.2 : 0.45,
      0.6,
      0.2
    );
    const afterimagePass = new AfterimagePass();

    composer.addPass(renderPass);
    composer.addPass(bloomPass);
    composer.addPass(afterimagePass);

    composerRef.current = composer;
    afterimageRef.current = afterimagePass;
    bloomRef.current = bloomPass;

    return () => {
      composer.dispose();
    };
  }, [camera, enabled, gl, scene, size.height, size.width, stillnessMode]);

  useEffect(() => {
    const bloom = bloomRef.current;
    if (!bloom) return;
    bloom.setSize(size.width, size.height);
    bloom.strength = stillnessMode ? 0.2 : 0.45;
  }, [size, stillnessMode]);

  useEffect(() => {
    const afterimage = afterimageRef.current;
    if (!afterimage) return;
    afterimage.uniforms.damp.value = 0.85 + trailAmount * 0.12;
  }, [trailAmount]);

  useFrame(() => {
    if (!enabled) return;
    if (reducedMotion || qualityTier === "low") {
      const afterimage = afterimageRef.current;
      if (afterimage) {
        afterimage.enabled = false;
      }
    } else if (afterimageRef.current) {
      afterimageRef.current.enabled = trailAmount > 0;
    }
    composerRef.current?.render();
  }, 1);

  return null;
}
