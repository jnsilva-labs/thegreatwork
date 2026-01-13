"use client";

import { shaderMaterial } from "@react-three/drei";
import { extend, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { JSX } from "react";
import { Color, DoubleSide } from "three";
import type { Mesh, ShaderMaterial } from "three";

const VellumMaterial = shaderMaterial(
  {
    uTime: 0,
    uColorA: new Color("#1b1611"),
    uColorB: new Color("#0b0a09"),
  },
  /* glsl */
  `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  `,
  /* glsl */
  `
  uniform float uTime;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  void main() {
    vec2 uv = vUv * 1.6;
    float n = noise(uv * 4.0 + uTime * 0.02);
    float vignette = smoothstep(0.9, 0.3, distance(vUv, vec2(0.5)));
    vec3 color = mix(uColorA, uColorB, vUv.y + n * 0.08);
    color = mix(color, color * 0.6, 1.0 - vignette);
    gl_FragColor = vec4(color, 0.9);
  }
  `
);

extend({ VellumMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    vellumMaterial: JSX.IntrinsicElements["shaderMaterial"];
  }
}

export function VellumPlane() {
  const meshRef = useRef<Mesh | null>(null);
  const scale = useMemo(() => [18, 18, 1] as const, []);

  useFrame((state) => {
    const material = meshRef.current?.material as ShaderMaterial | undefined;
    if (material?.uniforms?.uTime) {
      material.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -6]} scale={scale}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <vellumMaterial side={DoubleSide} transparent />
    </mesh>
  );
}
