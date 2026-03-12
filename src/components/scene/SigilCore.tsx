"use client";

import { useFrame } from "@react-three/fiber";
import { MathUtils } from "three";
import { useMemo, useRef } from "react";
import type { Group, Mesh } from "three";
import { useHermeticStore } from "@/lib/hermeticStore";
import { useThemeStore } from "@/lib/themeStore";

type SigilCoreProps = {
  reducedMotion: boolean;
  scrollProgress: number;
  heroProgress: number;
  activeAlchemyStage: number;
  hybrid: boolean;
};

export function SigilCore({
  reducedMotion,
  scrollProgress,
  heroProgress,
  activeAlchemyStage,
  hybrid,
}: SigilCoreProps) {
  const groupRef = useRef<Group | null>(null);
  const armillaryRef = useRef<Group | null>(null);
  const centralSeedRef = useRef<Mesh | null>(null);
  const glowShellRef = useRef<Mesh | null>(null);
  const ringRefs = useRef<Array<Mesh | null>>([]);
  const intensity = useHermeticStore((state) => state.intensity);
  const clarity = useHermeticStore((state) => state.clarity);
  const themeColors = useThemeStore((state) => state.colors);

  const stageScale = [0.92, 1, 1.07, 1.12][activeAlchemyStage] ?? 1;
  const settle = MathUtils.lerp(1, 0.18, scrollProgress);
  const emergence = MathUtils.lerp(0.82, 1.05, 1 - heroProgress * 0.35);
  const orbitOpacity = MathUtils.lerp(0.22, 0.42, 1 - scrollProgress * 0.45);
  const nodeOpacity = MathUtils.lerp(0.3, 0.7, 1 - heroProgress * 0.45);
  const shellOpacity = MathUtils.lerp(0.08, 0.2, clarity);

  const ringMaterial = useMemo(
    () => ({
      color: themeColors.line,
      emissive: themeColors.glow,
      emissiveIntensity: 0.08 + intensity * 0.12,
      metalness: 0.66,
      roughness: 0.34,
      transparent: true,
      opacity: orbitOpacity,
    }),
    [intensity, orbitOpacity, themeColors]
  );

  useFrame((state, delta) => {
    const root = groupRef.current;
    const armillary = armillaryRef.current;
    if (!root || !armillary) return;

    const breathe = reducedMotion ? 0 : Math.sin(state.clock.elapsedTime * 0.8) * 0.018;
    root.scale.setScalar(MathUtils.lerp(root.scale.x, stageScale * emergence + breathe, 0.08));

    if (reducedMotion) return;

    armillary.rotation.y += delta * 0.06 * settle;
    armillary.rotation.x += delta * 0.018 * settle;
    armillary.rotation.z += delta * 0.012 * settle;

    ringRefs.current.forEach((ring, index) => {
      if (!ring) return;
      const direction = index % 2 === 0 ? 1 : -1;
      ring.rotation.z += delta * (0.028 + index * 0.004) * settle * direction;
      ring.rotation.x += delta * (0.01 + index * 0.002) * settle;
    });

    if (centralSeedRef.current) {
      centralSeedRef.current.rotation.y += delta * 0.08 * settle;
      centralSeedRef.current.rotation.x += delta * 0.04 * settle;
    }
    if (glowShellRef.current) {
      glowShellRef.current.rotation.y -= delta * 0.03 * settle;
    }
  });

  if (!hybrid) {
    return (
      <mesh ref={centralSeedRef} position={[0, -0.2, 0]}>
        <torusKnotGeometry args={[1.1, 0.35, 220, 16]} />
        <meshStandardMaterial
          color={themeColors.line}
          metalness={Math.min(1, 0.5 + clarity * 0.4)}
          roughness={Math.max(0.18, 0.55 - clarity * 0.3)}
          emissive={themeColors.glow}
          emissiveIntensity={0.14 + intensity * 0.22}
          transparent
          opacity={0.8}
        />
      </mesh>
    );
  }

  return (
    <group ref={groupRef} position={[0.18, -0.05, 0]}>
      <group ref={armillaryRef}>
        <mesh
          ref={(node) => {
            ringRefs.current[0] = node;
          }}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <torusGeometry args={[1.7, 0.015, 20, 260]} />
          <meshStandardMaterial {...ringMaterial} />
        </mesh>
        <mesh
          ref={(node) => {
            ringRefs.current[1] = node;
          }}
          rotation={[Math.PI / 2.9, Math.PI / 7, Math.PI / 5]}
        >
          <torusGeometry args={[1.55, 0.012, 20, 260]} />
          <meshStandardMaterial {...ringMaterial} color={themeColors.accent2} opacity={orbitOpacity * 0.95} />
        </mesh>
        <mesh
          ref={(node) => {
            ringRefs.current[2] = node;
          }}
          rotation={[Math.PI / 3.6, -Math.PI / 6, Math.PI / 9]}
        >
          <torusGeometry args={[1.42, 0.011, 20, 260]} />
          <meshStandardMaterial {...ringMaterial} color={themeColors.glow} opacity={orbitOpacity * 0.82} />
        </mesh>
        <mesh
          ref={(node) => {
            ringRefs.current[3] = node;
          }}
          rotation={[Math.PI / 1.9, Math.PI / 8, -Math.PI / 7]}
          scale={[1, 0.82, 1]}
        >
          <torusGeometry args={[1.28, 0.01, 16, 220]} />
          <meshStandardMaterial {...ringMaterial} color={themeColors.line} opacity={orbitOpacity * 0.64} />
        </mesh>

        <group>
          {[
            [0, 1.7, 0],
            [1.55, 0.45, 0.42],
            [1.2, -1.02, -0.35],
            [-1.38, 0.92, -0.2],
            [-1.58, -0.64, 0.34],
          ].map((position, index) => (
            <mesh key={position.join("-")} position={position as [number, number, number]}>
              <sphereGeometry args={[index === 0 ? 0.078 : 0.06, 24, 24]} />
              <meshStandardMaterial
                color={themeColors.accent2}
                emissive={themeColors.glow}
                emissiveIntensity={0.16 + intensity * 0.14}
                transparent
                opacity={nodeOpacity}
              />
            </mesh>
          ))}
        </group>

        <mesh ref={centralSeedRef} position={[0, 0, 0]}>
          <sphereGeometry args={[0.28, 40, 40]} />
          <meshStandardMaterial
            color={themeColors.line}
            emissive={themeColors.glow}
            emissiveIntensity={0.28 + intensity * 0.18}
            metalness={0.15}
            roughness={0.18}
          />
        </mesh>
        <mesh ref={glowShellRef} position={[0, 0, 0]} rotation={[Math.PI / 5, Math.PI / 5, 0]}>
          <icosahedronGeometry args={[0.72, 0]} />
          <meshStandardMaterial
            color={themeColors.line}
            emissive={themeColors.glow}
            emissiveIntensity={0.08 + intensity * 0.05}
            transparent
            opacity={shellOpacity}
            wireframe
          />
        </mesh>
      </group>
    </group>
  );
}
