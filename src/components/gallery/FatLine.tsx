"use client";

import { useEffect, useMemo } from "react";
import { Line2, LineGeometry, LineMaterial } from "three-stdlib";
import { useThree, useFrame } from "@react-three/fiber";
import { Color, NormalBlending, Vector3 } from "three";
import type { LineSet, Polyline } from "@/lib/geometry";

type FatLineProps = {
  lines: LineSet;
  color?: string;
  opacity?: number;
  linewidth?: number;
  renderOrder?: number;
};

export function FatLine({
  lines,
  color = "#b89b5e",
  opacity = 0.85,
  linewidth = 0.003,
  renderOrder = 2,
}: FatLineProps) {
  const { size } = useThree();

  return (
    <group>
      {lines.map((points, index) => (
        <FatLineSegment
          key={`line-${index}`}
          points={points}
          color={color}
          opacity={opacity}
          linewidth={linewidth}
          resolution={[size.width, size.height]}
          renderOrder={renderOrder}
        />
      ))}
    </group>
  );
}

type FatLineSegmentProps = {
  points: Polyline;
  color: string;
  opacity: number;
  linewidth: number;
  resolution: [number, number];
  renderOrder: number;
};

function FatLineSegment({
  points,
  color,
  opacity,
  linewidth,
  resolution,
  renderOrder,
}: FatLineSegmentProps) {
  const line = useMemo(
    () => createLine(points, color, opacity, linewidth, renderOrder),
    [points, color, opacity, linewidth, renderOrder]
  );

  useEffect(() => {
    return () => {
      line.geometry.dispose();
      (line.material as LineMaterial).dispose();
    };
  }, [line]);

  useFrame(() => {
    const material = line.material as LineMaterial;
    material.resolution.set(resolution[0], resolution[1]);
  });

  return <primitive object={line} />;
}

function createLine(
  points: Vector3[],
  color: string,
  opacity: number,
  linewidth: number,
  renderOrder: number
) {
  const geometry = new LineGeometry();
  const positions = points.flatMap((point) => [point.x, point.y, point.z]);
  geometry.setPositions(positions);

  const material = new LineMaterial({
    color: new Color(color).getHex(),
    linewidth,
    transparent: true,
    opacity,
    depthWrite: false,
    depthTest: false,
    blending: NormalBlending,
  });

  const line = new Line2(geometry, material);
  line.renderOrder = renderOrder;
  line.computeLineDistances();
  return line;
}
