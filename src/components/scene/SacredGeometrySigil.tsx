"use client";

import { useMemo } from "react";
import { MathUtils, Vector3 } from "three";
import {
  flowerOfLife,
  goldenSpiral,
  metatronsCube,
  fibonacciRectangles,
  vesicaPiscis,
} from "@/lib/sacredGeometry";
import { EngravedPath } from "@/components/scene/EngravedPath";
import { HaloNodes } from "@/components/scene/HaloNodes";

type SacredGeometrySigilProps = {
  chapterIndex: number;
  progress: number;
  reducedMotion: boolean;
};

const geometries = [
  () => vesicaPiscis(1.1),
  () => flowerOfLife(0.9, 6),
  () => goldenSpiral(3, 220),
  () => fibonacciRectangles(0.5, 6),
  () => metatronsCube(2.6),
  () => flowerOfLife(1.1, 12),
  () => vesicaPiscis(1.6),
];

export function SacredGeometrySigil({
  chapterIndex,
  progress,
  reducedMotion,
}: SacredGeometrySigilProps) {
  const currentIndex = MathUtils.clamp(chapterIndex, 0, geometries.length - 1);
  const nextIndex = Math.min(currentIndex + 1, geometries.length - 1);
  const transition = easeBreath(MathUtils.clamp((progress - 0.55) / 0.4, 0, 1));
  const currentOpacity = MathUtils.lerp(0.15, 0.7, 1 - transition);
  const nextOpacity = MathUtils.lerp(0, 0.65, transition);
  const baseScale = MathUtils.lerp(0.85, 1.05, progress);
  const polarityShift = chapterIndex === 3 ? MathUtils.lerp(0.2, 0.8, transition) : 0;
  const colorPrimary = chapterIndex === 3 ? "#252435" : "#b89b5e";
  const emissive = chapterIndex === 3 ? "#b89b5e" : "#2b6f6a";

  const currentPoints = useMemo(() => geometries[currentIndex](), [currentIndex]);
  const nextPoints = useMemo(() => geometries[nextIndex](), [nextIndex]);
  const currentNodes = useMemo(() => sigilNodes[currentIndex](), [currentIndex]);
  const nextNodes = useMemo(() => sigilNodes[nextIndex](), [nextIndex]);

  return (
    <group scale={new Vector3(baseScale, baseScale, baseScale)}>
      <EngravedPath
        points={currentPoints}
        opacity={currentOpacity}
        radius={0.014}
        roughness={0.4}
        metalness={0.65}
        jitter={0.018}
        color={colorPrimary}
        emissive={emissive}
        emissiveIntensity={0.08 + polarityShift * 0.2}
      />
      <EngravedPath
        points={nextPoints}
        opacity={nextOpacity}
        radius={0.012}
        roughness={0.38}
        metalness={0.7}
        jitter={0.016}
        color={colorPrimary}
        emissive={emissive}
        emissiveIntensity={0.06 + polarityShift * 0.2}
      />
      <HaloNodes nodes={currentNodes} opacity={currentOpacity * 0.6} color={colorPrimary} />
      <HaloNodes nodes={nextNodes} opacity={nextOpacity * 0.55} color={colorPrimary} />
      {chapterIndex === 1 && (
        <group scale={[1, -1, 1]}>
          <EngravedPath
            points={currentPoints}
            opacity={currentOpacity * 0.4}
            radius={0.012}
            roughness={0.5}
            metalness={0.5}
            jitter={0.02}
            color="#2b6f6a"
            emissive="#b89b5e"
            emissiveIntensity={0.08}
          />
        </group>
      )}
      {chapterIndex === 5 && (
        <>
          {[0.08, 0.15, 0.22].map((offset, index) => (
            <group key={`ghost-${offset}`} position={[offset, -offset * 0.4, -0.05 * index]}>
              <EngravedPath
                points={currentPoints}
                opacity={currentOpacity * (0.35 - index * 0.08)}
                radius={0.01}
                roughness={0.6}
                metalness={0.4}
                jitter={0.025}
                color="#7a6a45"
                emissive="#2b6f6a"
                emissiveIntensity={0.05}
              />
            </group>
          ))}
        </>
      )}
      {chapterIndex === 6 && (
        <>
          <EngravedPath
            points={goldenSpiral(2.2, 160)}
            opacity={MathUtils.lerp(0.1, 0.5, progress)}
            radius={0.012}
            roughness={0.4}
            metalness={0.6}
            jitter={0.02}
            color="#2b6f6a"
            emissive="#b89b5e"
            emissiveIntensity={0.12}
          />
          <EngravedPath
            points={fibonacciRectangles(0.4, 5)}
            opacity={MathUtils.lerp(0.1, 0.45, progress)}
            radius={0.013}
            roughness={0.45}
            metalness={0.5}
            jitter={0.018}
            color="#b89b5e"
            emissive="#2b6f6a"
            emissiveIntensity={0.1}
          />
        </>
      )}
      {!reducedMotion && (
        <mesh rotation={[0, 0, Math.PI / 3]}>
          <torusGeometry args={[2.2, 0.01, 8, 220]} />
          <meshStandardMaterial
            color="#e8e3d8"
            metalness={0.4}
            roughness={0.6}
            transparent
            opacity={MathUtils.lerp(0, 0.25, progress)}
          />
        </mesh>
      )}
    </group>
  );
}

function easeBreath(value: number) {
  return 0.5 - Math.cos(value * Math.PI) / 2;
}

const sigilNodes = [
  () => [new Vector3(-0.65, 0, 0), new Vector3(0.65, 0, 0), new Vector3(0, 0, 0)],
  () => {
    const nodes: Vector3[] = [new Vector3(0, 0, 0)];
    const step = (Math.PI * 2) / 6;
    for (let i = 0; i < 6; i += 1) {
      nodes.push(new Vector3(Math.cos(step * i) * 0.9, Math.sin(step * i) * 0.9, 0));
    }
    return nodes;
  },
  () => {
    const nodes: Vector3[] = [];
    for (let i = 0; i < 6; i += 1) {
      const t = (i / 6) * Math.PI * 2;
      nodes.push(new Vector3(Math.cos(t) * (0.5 + i * 0.25), Math.sin(t) * (0.5 + i * 0.25), 0));
    }
    return nodes;
  },
  () => [
    new Vector3(-0.5, -0.5, 0),
    new Vector3(0.5, -0.5, 0),
    new Vector3(0.5, 0.5, 0),
    new Vector3(-0.5, 0.5, 0),
  ],
  () => {
    const nodes: Vector3[] = [new Vector3(0, 0, 0)];
    const step = (Math.PI * 2) / 6;
    for (let ring = 1; ring <= 2; ring += 1) {
      for (let i = 0; i < 6; i += 1) {
        nodes.push(new Vector3(Math.cos(step * i) * ring * 0.85, Math.sin(step * i) * ring * 0.85, 0));
      }
    }
    return nodes;
  },
  () => {
    const nodes: Vector3[] = [];
    const step = (Math.PI * 2) / 12;
    for (let i = 0; i < 12; i += 1) {
      nodes.push(new Vector3(Math.cos(step * i) * 1.1, Math.sin(step * i) * 1.1, 0));
    }
    return nodes;
  },
  () => [new Vector3(-0.9, 0, 0), new Vector3(0.9, 0, 0), new Vector3(0, 0, 0)],
];
