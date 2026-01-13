"use client";

import { shaderMaterial } from "@react-three/drei";
import { extend, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { JSX } from "react";
import { Color, DoubleSide } from "three";
import type { Mesh, ShaderMaterial } from "three";
import { fractalVeilFragment, fractalVeilVertex } from "@/shaders/FractalVeil";
import { useHermeticStore } from "@/lib/hermeticStore";

const FractalVeilMaterial = shaderMaterial(
  {
    uTime: 0,
    uShift: 0,
    uPointer: [0, 0],
    uScroll: 0,
    uResolution: [1, 1],
    uClarity: 0.5,
    uGrain: 0.1,
    uPrinciple: 1,
    uVeilIntensity: 1,
    uTintA: new Color("#0b0c10"),
  },
  fractalVeilVertex,
  fractalVeilFragment
);

extend({ FractalVeilMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    fractalVeilMaterial: JSX.IntrinsicElements["shaderMaterial"];
  }
}

export function FractalVeil() {
  const meshRef = useRef<Mesh | null>(null);
  const { size } = useThree();
  const shift = useHermeticStore((state) => state.shift);
  const pointer = useHermeticStore((state) => state.pointer);
  const scroll = useHermeticStore((state) => state.scrollProgress);
  const clarity = useHermeticStore((state) => state.clarity);
  const principleId = useHermeticStore((state) => state.principleId);
  const stillnessMode = useHermeticStore((state) => state.stillnessMode);
  const veilIntensity = useHermeticStore((state) => state.veilIntensity);

  useFrame((state) => {
    const material = meshRef.current?.material as ShaderMaterial | undefined;
    if (!material?.uniforms) return;

    material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.uShift.value = shift;
    material.uniforms.uPointer.value = [pointer.x, pointer.y];
    material.uniforms.uScroll.value = scroll;
    material.uniforms.uResolution.value = [size.width, size.height];
    material.uniforms.uClarity.value = clarity;
    material.uniforms.uGrain.value = stillnessMode ? 0.04 : 0.1;
    material.uniforms.uPrinciple.value = principleId;
    material.uniforms.uVeilIntensity.value = veilIntensity;
  });

  const scale = useMemo(() => [18, 18, 1] as const, []);

  return (
    <mesh ref={meshRef} position={[0, 0, -5.6]} scale={scale}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <fractalVeilMaterial transparent side={DoubleSide} />
    </mesh>
  );
}
