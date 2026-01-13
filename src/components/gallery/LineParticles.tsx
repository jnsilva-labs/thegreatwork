"use client";

import { useMemo, useRef } from "react";
import type { JSX } from "react";
import { shaderMaterial } from "@react-three/drei";
import { extend, useFrame } from "@react-three/fiber";
import { Color, Vector3 } from "three";
import type { Points, ShaderMaterial } from "three";
import type { LineSet } from "@/lib/geometry";

const LineParticleMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new Color("#b89b5e"),
    uClarity: 0.5,
    uSize: 16,
    uAlpha: 0.8,
    uFlow: 0.6,
  },
  /* glsl */ `
  attribute vec3 aTangent;
  attribute float aPhase;

  uniform float uTime;
  uniform float uClarity;
  uniform float uSize;
  uniform float uAlpha;
  uniform float uFlow;

  varying float vAlpha;

  vec2 curl(vec2 p) {
    float n1 = sin(p.y * 1.7 + uTime * 0.2);
    float n2 = cos(p.x * 1.3 - uTime * 0.25);
    return vec2(n1, -n2);
  }

  void main() {
    vec3 base = position;
    vec3 pos = base;
    float drift = sin(uTime * 0.4 + aPhase) * 0.08;
    pos += aTangent * drift;
    vec2 flow = curl(pos.xy * 1.2) * uFlow * 0.08;
    pos.xy += flow;
    pos = mix(pos, base, uClarity * 0.6);

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = uSize / -mvPosition.z;
    vAlpha = uAlpha * (0.6 + (1.0 - uClarity) * 0.4);
    gl_Position = projectionMatrix * mvPosition;
  }
  `,
  /* glsl */ `
  uniform vec3 uColor;
  uniform float uAlpha;
  varying float vAlpha;

  void main() {
    float d = distance(gl_PointCoord, vec2(0.5));
    float soft = smoothstep(0.5, 0.2, d);
    gl_FragColor = vec4(uColor, soft * vAlpha * uAlpha);
  }
  `
);

extend({ LineParticleMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    lineParticleMaterial: JSX.IntrinsicElements["shaderMaterial"];
  }
}

type LineParticlesProps = {
  lines: LineSet;
  clarity: number;
  size: number;
  alpha: number;
  density: number;
  flow: number;
  renderOrder?: number;
};

export function LineParticles({
  lines,
  clarity,
  size,
  alpha,
  density,
  flow,
  renderOrder = 1,
}: LineParticlesProps) {
  const pointsRef = useRef<Points | null>(null);

  const { positions, tangents, phases } = useMemo(() => {
    const positions: number[] = [];
    const tangents: number[] = [];
    const phases: number[] = [];

    const baseStep = Math.max(1, Math.round(4 / Math.max(0.3, density)));
    const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches;
    const maxPoints = isMobile ? 3500 : 9000;

    lines.forEach((line) => {
      for (let i = 0; i < line.length; i += baseStep) {
        const point = line[i];
        const next = line[Math.min(i + 1, line.length - 1)];
        const tangent = new Vector3().subVectors(next, point).normalize();

        positions.push(point.x, point.y, point.z);
        tangents.push(tangent.x, tangent.y, tangent.z);
        phases.push((i / line.length) * Math.PI * 2);
      }
    });

    if (positions.length / 3 > maxPoints) {
      const stride = Math.ceil((positions.length / 3) / maxPoints);
      const filteredPositions: number[] = [];
      const filteredTangents: number[] = [];
      const filteredPhases: number[] = [];
      for (let i = 0; i < positions.length / 3; i += stride) {
        filteredPositions.push(
          positions[i * 3],
          positions[i * 3 + 1],
          positions[i * 3 + 2]
        );
        filteredTangents.push(
          tangents[i * 3],
          tangents[i * 3 + 1],
          tangents[i * 3 + 2]
        );
        filteredPhases.push(phases[i]);
      }
      return {
        positions: new Float32Array(filteredPositions),
        tangents: new Float32Array(filteredTangents),
        phases: new Float32Array(filteredPhases),
      };
    }

    return {
      positions: new Float32Array(positions),
      tangents: new Float32Array(tangents),
      phases: new Float32Array(phases),
    };
  }, [density, lines]);

  useFrame((state) => {
    const material = pointsRef.current?.material as ShaderMaterial | undefined;
    if (!material?.uniforms) return;
    material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.uClarity.value = clarity;
    material.uniforms.uSize.value = size;
    material.uniforms.uAlpha.value = alpha;
    material.uniforms.uFlow.value = flow;
  });

  return (
    <points ref={pointsRef} renderOrder={renderOrder}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aTangent" args={[tangents, 3]} />
        <bufferAttribute attach="attributes-aPhase" args={[phases, 1]} />
      </bufferGeometry>
      <lineParticleMaterial transparent depthWrite={false} depthTest={false} />
    </points>
  );
}
