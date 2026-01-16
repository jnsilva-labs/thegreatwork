"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Mesh } from "three";
import { useHermeticStore } from "@/lib/hermeticStore";
import { useThemeStore } from "@/lib/themeStore";

type SigilCoreProps = {
  reducedMotion: boolean;
};

export function SigilCore({ reducedMotion }: SigilCoreProps) {
  const meshRef = useRef<Mesh | null>(null);
  const intensity = useHermeticStore((state) => state.intensity);
  const clarity = useHermeticStore((state) => state.clarity);
  const themeColors = useThemeStore((state) => state.colors);
  const materialProps = useMemo(
    () => ({
      color: themeColors.line,
      metalness: Math.min(1, 0.5 + clarity * 0.4),
      roughness: Math.max(0.2, 0.55 - clarity * 0.3),
      emissive: themeColors.glow,
      emissiveIntensity: 0.15 + intensity * 0.2,
    }),
    [clarity, intensity, themeColors]
  );

  useFrame((state, delta) => {
    if (!meshRef.current || reducedMotion) return;
    meshRef.current.rotation.x += delta * 0.1;
    meshRef.current.rotation.y += delta * 0.12;
  });

  return (
    <mesh ref={meshRef} position={[0, -0.2, 0]}>
      <torusKnotGeometry args={[1.1, 0.35, 220, 16]} />
      <meshStandardMaterial {...materialProps} />
    </mesh>
  );
}
