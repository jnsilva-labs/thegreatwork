"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { MathUtils, Vector3 } from "three";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Group } from "three";
import { SigilCore } from "@/components/scene/SigilCore";
import { VellumPlane } from "@/components/scene/VellumPlane";
import { SacredGeometrySigil } from "@/components/scene/SacredGeometrySigil";
import { useHermeticStore } from "@/lib/hermeticStore";
import { useThemeStore, type ThemeName } from "@/lib/themeStore";
import { AetherField } from "@/components/scene/AetherField";
import { FractalVeil } from "@/components/scene/FractalVeil";

const HOMEPAGE_HYBRID_SCENE = true;

type SceneShellProps = {
  reducedMotion: boolean;
};

export function SceneShell({ reducedMotion }: SceneShellProps) {
  const groupRef = useRef<Group | null>(null);
  const { camera } = useThree();
  const activeChapter = useHermeticStore((state) => state.activeChapter);
  const progressByChapter = useHermeticStore((state) => state.progressByChapter);
  const overallProgress = useHermeticStore((state) => state.scrollProgress);
  const heroProgress = useHermeticStore((state) => state.heroProgress);
  const pointer = useHermeticStore((state) => state.pointer);
  const shift = useHermeticStore((state) => state.shift);
  const activeAlchemyStage = useHermeticStore((state) => state.activeAlchemyStage);
  const cameraOverride = useHermeticStore((state) => state.cameraOverride);
  const lineOpacityScale = useHermeticStore((state) => state.lineOpacityScale);
  const lineRadiusScale = useHermeticStore((state) => state.lineRadiusScale);
  const theme = useThemeStore((state) => state.theme);
  const sceneColors = useSceneColors(theme);
  const cameraTargets = useMemo(
    () => [
      new Vector3(0, 0, 7),
      new Vector3(0.6, 0.4, 6.4),
      new Vector3(-0.4, 0.2, 6.8),
      new Vector3(0.2, -0.3, 6.2),
      new Vector3(-0.6, 0.1, 6.6),
      new Vector3(0.2, 0.5, 6.3),
      new Vector3(0, 0, 6.8),
    ],
    []
  );
  const tempVector = useRef(new Vector3());

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const settle = 1 - overallProgress * 0.85;
    const targetX = reducedMotion ? 0 : pointer.x * 0.15;
    const targetY = reducedMotion ? 0 : pointer.y * 0.12;
    const horizontalDrift = reducedMotion ? 0 : MathUtils.lerp(-0.2, 0.65, overallProgress);
    const breathe = reducedMotion ? 0 : Math.sin(state.clock.elapsedTime * 0.8) * 0.02;

    if (reducedMotion) {
      group.rotation.set(0, 0, 0);
      group.position.set(horizontalDrift, 0, -0.4 + overallProgress * 0.8);
      group.scale.setScalar(1);
    } else {
      group.rotation.y = MathUtils.lerp(group.rotation.y, targetX, 0.08);
      group.rotation.x = MathUtils.lerp(group.rotation.x, targetY, 0.08);
      group.position.x = MathUtils.lerp(
        group.position.x,
        state.pointer.x * 0.24 + horizontalDrift,
        0.05
      );
      group.position.y = MathUtils.lerp(group.position.y, state.pointer.y * 0.2, 0.05);
      group.position.z = MathUtils.lerp(group.position.z, -0.4 + overallProgress * 0.8, 0.05);
      group.scale.setScalar(MathUtils.lerp(group.scale.x, 1 + breathe, 0.08));
    }

    if (!reducedMotion) {
      group.rotation.z += delta * 0.03 * settle;
    }

    const currentTarget = cameraTargets[activeChapter] ?? cameraTargets[0];
    const nextTarget =
      cameraTargets[Math.min(activeChapter + 1, cameraTargets.length - 1)] ??
      cameraTargets[0];
    const transition = easeBreath(MathUtils.clamp((shift - 0.5) / 0.45, 0, 1));
    tempVector.current.lerpVectors(currentTarget, nextTarget, transition);
    if (cameraOverride) {
      const overridePosition = new Vector3(...cameraOverride.position);
      tempVector.current.lerp(overridePosition, reducedMotion ? 0.05 : 0.12);
    }
    if (activeChapter === 4 && !reducedMotion) {
      tempVector.current.x += Math.sin(state.clock.elapsedTime * 0.4) * 0.15;
      tempVector.current.y += Math.cos(state.clock.elapsedTime * 0.35) * 0.12;
    }
    if (reducedMotion) {
      camera.position.copy(tempVector.current);
    } else {
      camera.position.lerp(tempVector.current, 0.08);
    }
    if (cameraOverride) {
      camera.lookAt(
        cameraOverride.target[0],
        cameraOverride.target[1],
        cameraOverride.target[2]
      );
    } else {
      camera.lookAt(0, 0, 0);
    }
  });

  const chapterProgress = progressByChapter[activeChapter] ?? 0;

  return (
    <>
      <color attach="background" args={[sceneColors.background]} />
      <fog attach="fog" args={[sceneColors.background, 8, 22]} />
      <ambientLight intensity={0.3} color={sceneColors.ambient} />
      <directionalLight position={[5, 6, 4]} intensity={0.9} color={sceneColors.key} />
      <directionalLight position={[-6, -3, -2]} intensity={0.4} color={sceneColors.fill} />
      <group ref={groupRef}>
        <VellumPlane />
        <FractalVeil />
        <AetherField reducedMotion={reducedMotion} />
        <SigilCore
          reducedMotion={reducedMotion}
          scrollProgress={overallProgress}
          heroProgress={heroProgress}
          activeAlchemyStage={activeAlchemyStage}
          hybrid={HOMEPAGE_HYBRID_SCENE}
        />
        <SacredGeometrySigil
          reducedMotion={reducedMotion}
          chapterIndex={activeChapter}
          progress={chapterProgress}
          lineOpacityScale={lineOpacityScale}
          lineRadiusScale={lineRadiusScale}
        />
      </group>
    </>
  );
}

type SceneColors = {
  background: string;
  ambient: string;
  key: string;
  fill: string;
};

const sceneColorFallbacks: SceneColors = {
  background: "#0b0c10",
  ambient: "#c8c1b5",
  key: "#b89b5e",
  fill: "#2b6f6a",
};

export function useSceneColors(theme: ThemeName): SceneColors {
  const [colors, setColors] = useState<SceneColors>(sceneColorFallbacks);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const computed = window.getComputedStyle(document.documentElement);
      setColors(resolveSceneColors((name) => computed.getPropertyValue(name)));
    });

    return () => window.cancelAnimationFrame(frame);
  }, [theme]);

  return colors;
}

export function resolveSceneColors(read: (name: string) => string): SceneColors {
  const value = (name: string, fallback: string) => read(name).trim() || fallback;
  return {
    background: value("--bg", sceneColorFallbacks.background),
    ambient: value("--muted", sceneColorFallbacks.ambient),
    key: value("--accent", sceneColorFallbacks.key),
    fill: value("--border", sceneColorFallbacks.fill),
  };
}

function easeBreath(value: number) {
  return 0.5 - Math.cos(value * Math.PI) / 2;
}
