"use client";

import { useMemo } from "react";
import { MeshStandardMaterial, TubeGeometry, Vector3 } from "three";
import { applyEtchingJitter, curveFromPoints } from "@/lib/sacredGeometry";

type EngravedPathProps = {
  points: Vector3[];
  opacity?: number;
  radius?: number;
  segments?: number;
  color?: string;
  metalness?: number;
  roughness?: number;
  jitter?: number;
  emissive?: string;
  emissiveIntensity?: number;
};

export function EngravedPath({
  points,
  opacity = 0.6,
  radius = 0.015,
  segments = 240,
  color = "#b89b5e",
  metalness = 0.7,
  roughness = 0.45,
  jitter = 0.02,
  emissive = "#2b6f6a",
  emissiveIntensity = 0.12,
}: EngravedPathProps) {
  const geometry = useMemo(() => {
    const jittered = applyEtchingJitter(points, jitter);
    const curve = curveFromPoints(jittered);
    return new TubeGeometry(curve, segments, radius, 12, false);
  }, [points, jitter, radius, segments]);

  const material = useMemo(
    () =>
      new MeshStandardMaterial({
        color,
        metalness,
        roughness,
        transparent: true,
        opacity,
        emissive,
        emissiveIntensity,
      }),
    [color, emissive, emissiveIntensity, metalness, roughness, opacity]
  );

  return <mesh geometry={geometry} material={material} />;
}
