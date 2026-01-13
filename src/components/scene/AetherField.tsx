"use client";

import { shaderMaterial } from "@react-three/drei";
import { extend, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { JSX } from "react";
import { Color } from "three";
import type { Points, ShaderMaterial } from "three";
import { useHermeticStore } from "@/lib/hermeticStore";

type AetherFieldProps = {
  reducedMotion: boolean;
};

const AetherMaterial = shaderMaterial(
  {
    uTime: 0,
    uPointer: [0, 0],
    uScroll: 0,
    uShift: 0,
    uClarity: 0.6,
    uIntensity: 0.6,
    uPrinciple: 1,
    uColorA: new Color("#2b6f6a"),
    uColorB: new Color("#b89b5e"),
  },
  /* glsl */ `
  attribute float aScale;
  attribute float aSeed;

  uniform float uTime;
  uniform vec2 uPointer;
  uniform float uScroll;
  uniform float uShift;
  uniform float uClarity;
  uniform float uIntensity;
  uniform float uPrinciple;

  varying float vAlpha;
  varying float vDepth;

  float hash(float n) {
    return fract(sin(n) * 43758.5453);
  }

  float noise(vec3 x) {
    vec3 p = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);

    float n = p.x + p.y * 57.0 + 113.0 * p.z;
    float res = mix(
      mix(mix(hash(n + 0.0), hash(n + 1.0), f.x),
          mix(hash(n + 57.0), hash(n + 58.0), f.x), f.y),
      mix(mix(hash(n + 113.0), hash(n + 114.0), f.x),
          mix(hash(n + 170.0), hash(n + 171.0), f.x), f.y), f.z);
    return res;
  }

  void main() {
    vec3 pos = position;

    float t = uTime * 0.12;
    float warp = noise(pos * 0.6 + vec3(t, t * 0.8, t * 0.6));
    float vibrate = sin(t + aSeed * 6.283) * 0.05;

    pos += normalize(pos) * (warp * 0.12 + vibrate * uIntensity);

    if (uPrinciple < 1.5) {
      float gather = smoothstep(0.0, 1.0, uShift);
      pos *= mix(1.1, 0.6, gather);
    }

    if (uPrinciple > 1.5 && uPrinciple < 2.5) {
      pos.y += sin((pos.x + t) * 1.4) * 0.08;
      pos.y *= mix(1.0, -1.0, uShift * 0.25);
    }

    vec2 pointer = uPointer * 2.0;
    vec2 dir = pos.xy - pointer;
    float dist = length(dir);
    float influence = exp(-dist * 1.4) * 0.4;
    vec2 swirl = vec2(-dir.y, dir.x) * influence * 0.4;
    vec2 repel = normalize(dir + 0.001) * influence * 0.35;
    pos.xy += swirl + repel;

    if (uPrinciple > 2.5 && uPrinciple < 3.5) {
      pos.xy += sin((pos.yx + t) * 2.6) * 0.04;
    }

    if (uPrinciple > 3.5 && uPrinciple < 4.5) {
      pos.xy *= mix(1.0, -1.0, uShift * 0.15);
    }

    if (uPrinciple > 4.5 && uPrinciple < 5.5) {
      pos.x += sin(t * 0.6 + pos.y * 1.2) * 0.08;
    }

    if (uPrinciple > 5.5 && uPrinciple < 6.5) {
      pos.xy += vec2(sin(aSeed * 6.283 + uScroll * 4.0), cos(aSeed * 6.283)) * 0.05;
    }

    if (uPrinciple > 6.5) {
      pos.xy += vec2(sin(pos.y * 1.6), cos(pos.x * 1.6)) * 0.05;
    }

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = aScale * (20.0 / -mvPosition.z) * mix(0.8, 1.2, uIntensity);
    vAlpha = mix(0.15, 0.65, aScale) * (1.0 - uClarity * 0.4);
    vDepth = -mvPosition.z;
    gl_Position = projectionMatrix * mvPosition;
  }
  `,
  /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uClarity;
  uniform float uIntensity;
  uniform float uShift;
  uniform float uPrinciple;

  varying float vAlpha;
  varying float vDepth;

  void main() {
    float d = distance(gl_PointCoord, vec2(0.5));
    float soft = smoothstep(0.5, 0.2, d);
    float depthFade = smoothstep(2.0, 10.0, vDepth);
    vec3 baseColor = mix(uColorA, uColorB, vAlpha * 0.6 + uIntensity * 0.2);
    vec3 altColor = mix(uColorB, uColorA, vAlpha * 0.6 + uIntensity * 0.2);
    float polarity = smoothstep(3.5, 4.5, uPrinciple);
    vec3 color = mix(baseColor, altColor, polarity * uShift);
    float alpha = soft * vAlpha * depthFade;
    alpha *= mix(0.65, 0.35, uClarity);
    gl_FragColor = vec4(color, alpha);
  }
  `
);

extend({ AetherMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    aetherMaterial: JSX.IntrinsicElements["shaderMaterial"];
  }
}

export function AetherField({ reducedMotion }: AetherFieldProps) {
  const pointsRef = useRef<Points | null>(null);
  const pointer = useHermeticStore((state) => state.pointer);
  const scroll = useHermeticStore((state) => state.scrollProgress);
  const shift = useHermeticStore((state) => state.shift);
  const clarity = useHermeticStore((state) => state.clarity);
  const intensity = useHermeticStore((state) => state.intensity);
  const principleId = useHermeticStore((state) => state.principleId);
  const quality = useHermeticStore((state) => state.qualityTier);

  const count = quality === "low" ? 45000 : quality === "medium" ? 90000 : 140000;

  const [positions, scales, seeds] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const seeds = new Float32Array(count);
    const golden = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < count; i += 1) {
      const y = 1 - (i / (count - 1)) * 2;
      const radius = Math.sqrt(1 - y * y);
      const theta = golden * i;
      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;
      const spread = 5.8 + (i % 7) * 0.05;

      positions.set([x * spread, y * spread, z * spread], i * 3);
      scales[i] = 0.4 + (i % 9) * 0.04;
      seeds[i] = (i % 1024) / 1024;
    }

    return [positions, scales, seeds];
  }, [count]);

  useFrame((state) => {
    const material = pointsRef.current?.material as ShaderMaterial | undefined;
    if (!material?.uniforms) return;

    material.uniforms.uTime.value = reducedMotion ? 0 : state.clock.elapsedTime;
    material.uniforms.uPointer.value = [pointer.x, pointer.y];
    material.uniforms.uScroll.value = scroll;
    material.uniforms.uShift.value = shift;
    material.uniforms.uClarity.value = clarity;
    material.uniforms.uIntensity.value = intensity;
    material.uniforms.uPrinciple.value = principleId;
  });

  return (
    <points ref={pointsRef} position={[0, 0, -0.2]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-aScale"
          args={[scales, 1]}
        />
        <bufferAttribute
          attach="attributes-aSeed"
          args={[seeds, 1]}
        />
      </bufferGeometry>
      <aetherMaterial transparent depthWrite={false} />
    </points>
  );
}
