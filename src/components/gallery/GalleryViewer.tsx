"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Group, PerspectiveCamera } from "three";
import { Vector2, Vector3 } from "three";
import type { LineSet } from "@/lib/geometry";
import { LineParticles } from "@/components/gallery/LineParticles";
import { useMotionPreference } from "@/components/motion/useMotionPreference";
import { useHermeticStore } from "@/lib/hermeticStore";
import { AfterimagePass, EffectComposer, RenderPass, UnrealBloomPass } from "three-stdlib";

export type CameraMode = "orbit" | "cinematic";

type GalleryViewerProps = {
  accessibleLabel?: string;
  lines: LineSet;
  cameraMode: CameraMode;
  debugForceVisible?: boolean;
  containerClassName?: string;
  forceStillness?: boolean;
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
  accessibleLabel,
  lines,
  cameraMode,
  debugForceVisible,
  containerClassName,
  forceStillness = false,
  particleSize,
  particleAlpha,
  particleDensity,
  flowStrength,
  trailAmount,
  scale,
  boundsRadius,
  fitKey,
}: GalleryViewerProps) {
  const storeStillnessMode = useHermeticStore((state) => state.stillnessMode);
  const clarity = useHermeticStore((state) => state.clarity);
  const qualityTier = useHermeticStore((state) => state.qualityTier);
  const { motionOk } = useMotionPreference();
  const [dpr, setDpr] = useState<[number, number]>([1, 1.5]);
  const motion = resolveGalleryMotion({
    motionOk,
    hermeticStillness: storeStillnessMode,
    forceStillness,
  });

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
    <div
      role="img"
      aria-label={accessibleLabel ?? "Interactive sacred geometry rendering"}
      className={`pointer-events-auto relative w-full overflow-hidden border border-[color:var(--stone)]/28 bg-[color:var(--obsidian)]/60 ${
        containerClassName ?? "h-[70vh]"
      }`}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45, near: 0.1, far: 50 }}
        dpr={dpr}
        frameloop={motion.frameloop}
        fallback={
          <p className="grid h-full place-items-center px-8 text-center text-sm leading-relaxed text-[color:var(--mist)]">
            Interactive WebGL is unavailable. Use the engraved static plate below as the
            complete construction reference.
          </p>
        }
        className="pointer-events-auto"
      >
        <SceneContent
          lines={lines}
          cameraMode={cameraMode}
          motion={motion}
          clarity={clarity}
          debugForceVisible={debugForceVisible}
          particleSize={particleSize}
          particleAlpha={particleAlpha}
          particleDensity={particleDensity}
          flowStrength={flowStrength}
          trailAmount={trailAmount}
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
  motion: GalleryMotionResolution;
  clarity: number;
  debugForceVisible?: boolean;
  particleSize: number;
  particleAlpha: number;
  particleDensity: number;
  flowStrength: number;
  trailAmount: number;
  qualityTier: string;
  scale: number;
  boundsRadius: number;
  fitKey: number;
};

function SceneContent({
  lines,
  cameraMode,
  motion,
  clarity,
  debugForceVisible,
  particleSize,
  particleAlpha,
  particleDensity,
  flowStrength,
  trailAmount,
  qualityTier,
  scale,
  boundsRadius,
  fitKey,
}: SceneContentProps) {
  const groupRef = useRef<Group | null>(null);
  const { camera, invalidate } = useThree();

  useEffect(() => {
    if (!("fov" in camera)) {
      return;
    }
    fitGalleryCamera(camera as PerspectiveCamera, boundsRadius, scale);
    invalidate();
  }, [boundsRadius, camera, fitKey, invalidate, scale]);
  const path = useMemo(
    () => [
      new Vector3(0, 0.2, 4.6),
      new Vector3(0.6, 0.2, 4.2),
      new Vector3(-0.5, -0.2, 4.4),
    ],
    []
  );

  useFrame((state) => {
    if (cameraMode === "cinematic" && motion.enabled) {
      const t = (state.clock.elapsedTime * 0.1) % 1;
      const idx = Math.floor(t * (path.length - 1));
      const next = (idx + 1) % path.length;
      const local = (t * (path.length - 1)) % 1;
      const position = new Vector3().lerpVectors(path[idx], path[next], local);
      camera.position.lerp(position, 0.05);
      camera.lookAt(0, 0, 0);
    }

    if (groupRef.current && motion.enabled) {
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
          motionEnabled={motion.shaderTime}
          renderOrder={1}
        />
      </group>
      {cameraMode === "orbit" && (
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={motion.autoRotate}
          autoRotateSpeed={0.4}
        />
      )}
      {shouldMountGalleryPost(debugForceVisible) ? (
        <GalleryPost
          trailAmount={trailAmount}
          motionEnabled={motion.trails}
          qualityTier={qualityTier}
        />
      ) : null}
    </>
  );
}

type GalleryPostProps = {
  trailAmount: number;
  motionEnabled: boolean;
  qualityTier: string;
};

function GalleryPost({
  trailAmount,
  motionEnabled,
  qualityTier,
}: GalleryPostProps) {
  const { gl, scene, camera, size } = useThree();
  const composerRef = useRef<EffectComposer | null>(null);
  const afterimageRef = useRef<AfterimagePass | null>(null);
  const bloomRef = useRef<UnrealBloomPass | null>(null);

  useEffect(() => {
    const composer = new EffectComposer(gl);
    const renderPass = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(
      new Vector2(size.width, size.height),
      motionEnabled ? 0.45 : 0.2,
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
      composerRef.current = null;
      afterimageRef.current = null;
      bloomRef.current = null;
    };
  }, [camera, gl, motionEnabled, scene, size.height, size.width]);

  useEffect(() => {
    const bloom = bloomRef.current;
    if (!bloom) return;
    bloom.setSize(size.width, size.height);
    bloom.strength = motionEnabled ? 0.45 : 0.2;
  }, [motionEnabled, size]);

  useEffect(() => {
    const afterimage = afterimageRef.current;
    if (!afterimage) return;
    afterimage.uniforms.damp.value = 0.85 + trailAmount * 0.12;
  }, [trailAmount]);

  useFrame(() => {
    if (afterimageRef.current) {
      afterimageRef.current.enabled = motionEnabled && qualityTier !== "low" && trailAmount > 0;
    }
    composerRef.current?.render();
  }, 1);

  return null;
}

type GalleryMotionInput = {
  motionOk: boolean;
  hermeticStillness: boolean;
  forceStillness: boolean;
};

export type GalleryMotionResolution = {
  enabled: boolean;
  frameloop: "always" | "demand";
  autoRotate: boolean;
  trails: boolean;
  shaderTime: boolean;
};

export function resolveGalleryMotion({
  motionOk,
  hermeticStillness,
  forceStillness,
}: GalleryMotionInput): GalleryMotionResolution {
  const enabled = motionOk && !hermeticStillness && !forceStillness;
  return {
    enabled,
    frameloop: enabled ? "always" : "demand",
    autoRotate: enabled,
    trails: enabled,
    shaderTime: enabled,
  };
}

export function fitGalleryCamera(camera: PerspectiveCamera, boundsRadius: number, scale: number) {
  const fov = (camera.fov * Math.PI) / 180;
  const fitDistance = boundsRadius / Math.tan(fov / 2);
  const distance = Math.max(3, fitDistance * 1.25 * scale);
  camera.position.set(0, 0, distance);
  camera.lookAt(0, 0, 0);
  return distance;
}

export function shouldMountGalleryPost(debugForceVisible?: boolean) {
  return !debugForceVisible;
}
