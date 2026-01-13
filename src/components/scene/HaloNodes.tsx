"use client";

import { useEffect, useMemo, useRef } from "react";
import type { InstancedMesh } from "three";
import { Color, Matrix4, Vector3 } from "three";

type HaloNodesProps = {
  nodes: Vector3[];
  opacity: number;
  color?: string;
  size?: number;
};

export function HaloNodes({ nodes, opacity, color = "#e8e3d8", size = 0.035 }: HaloNodesProps) {
  const meshRef = useRef<InstancedMesh | null>(null);
  const matrix = useMemo(() => new Matrix4(), []);
  const tint = useMemo(() => new Color(color), [color]);

  useEffect(() => {
    if (!meshRef.current) return;
    nodes.forEach((node, index) => {
      matrix.makeTranslation(node.x, node.y, node.z);
      meshRef.current?.setMatrixAt(index, matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [matrix, nodes]);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, nodes.length]}>
      <sphereGeometry args={[size, 12, 12]} />
      <meshStandardMaterial
        color={tint}
        emissive={tint}
        emissiveIntensity={0.3}
        transparent
        opacity={opacity}
        metalness={0.2}
        roughness={0.3}
      />
    </instancedMesh>
  );
}
