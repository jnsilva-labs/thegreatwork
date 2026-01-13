"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { MathUtils, Vector3 } from "three";
import { useMemo, useRef } from "react";
import type { Group } from "three";
import { SigilCore } from "@/components/scene/SigilCore";
import { VellumPlane } from "@/components/scene/VellumPlane";
import { SacredGeometrySigil } from "@/components/scene/SacredGeometrySigil";
import { useHermeticStore } from "@/lib/hermeticStore";
import { AetherField } from "@/components/scene/AetherField";
import { FractalVeil } from "@/components/scene/FractalVeil";

type SceneShellProps = {
  reducedMotion: boolean;
};

export function SceneShell({ reducedMotion }: SceneShellProps) {
  const groupRef = useRef<Group | null>(null);
  const { camera } = useThree();
  const activeChapter = useHermeticStore((state) => state.activeChapter);
  const progressByChapter = useHermeticStore((state) => state.progressByChapter);
  const overallProgress = useHermeticStore((state) => state.scrollProgress);
  const pointer = useHermeticStore((state) => state.pointer);
  const shift = useHermeticStore((state) => state.shift);
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

    const targetX = pointer.x * 0.15;
    const targetY = pointer.y * 0.12;

    group.rotation.y = MathUtils.lerp(group.rotation.y, targetX, 0.08);
    group.rotation.x = MathUtils.lerp(group.rotation.x, targetY, 0.08);
    group.position.x = MathUtils.lerp(group.position.x, state.pointer.x * 0.4, 0.05);
    group.position.y = MathUtils.lerp(group.position.y, state.pointer.y * 0.2, 0.05);
    group.position.z = MathUtils.lerp(group.position.z, -0.4 + overallProgress * 0.8, 0.05);

    if (!reducedMotion) {
      group.rotation.z += delta * 0.03;
    }

    const currentTarget = cameraTargets[activeChapter] ?? cameraTargets[0];
    const nextTarget =
      cameraTargets[Math.min(activeChapter + 1, cameraTargets.length - 1)] ??
      cameraTargets[0];
    const transition = easeBreath(MathUtils.clamp((shift - 0.5) / 0.45, 0, 1));
    tempVector.current.lerpVectors(currentTarget, nextTarget, transition);
    if (activeChapter === 4 && !reducedMotion) {
      tempVector.current.x += Math.sin(state.clock.elapsedTime * 0.4) * 0.15;
      tempVector.current.y += Math.cos(state.clock.elapsedTime * 0.35) * 0.12;
    }
    camera.position.lerp(tempVector.current, reducedMotion ? 0.04 : 0.08);
    camera.lookAt(0, 0, 0);
  });

  const chapterProgress = progressByChapter[activeChapter] ?? 0;

  return (
    <>
      <color attach="background" args={["#0b0c10"]} />
      <fog attach="fog" args={["#0b0c10", 8, 22]} />
      <ambientLight intensity={0.3} color="#cbb894" />
      <directionalLight position={[5, 6, 4]} intensity={0.9} color="#f0d7a5" />
      <directionalLight position={[-6, -3, -2]} intensity={0.4} color="#6c4a2a" />
      <group ref={groupRef}>
        <VellumPlane />
        <FractalVeil />
        <AetherField reducedMotion={reducedMotion} />
        <SigilCore reducedMotion={reducedMotion} />
        <SacredGeometrySigil
          reducedMotion={reducedMotion}
          chapterIndex={activeChapter}
          progress={chapterProgress}
        />
      </group>
    </>
  );
}

function easeBreath(value: number) {
  return 0.5 - Math.cos(value * Math.PI) / 2;
}
