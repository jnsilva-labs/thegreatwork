"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import type { Group } from "three";
import { useMotionPreference } from "@/components/motion/useMotionPreference";

type DriftingStarsProps = {
  motionOk: boolean;
};

function DriftingStars({ motionOk }: DriftingStarsProps) {
  const groupRef = useRef<Group | null>(null);

  useFrame((_, delta) => {
    if (!motionOk || !groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.004;
    groupRef.current.rotation.x += delta * 0.0012;
  });

  return (
    <group ref={groupRef} rotation={[0.4, 0, 0.1]}>
      <Stars radius={34} depth={48} count={1100} factor={5} saturation={0} fade speed={motionOk ? 0.5 : 0} />
    </group>
  );
}

/**
 * The quiet cousin of the homepage's RitualCanvas: a slow starfield behind
 * content pages, so the temple's night sky never ends at the front door.
 * No post-processing, low DPR, pauses when hidden, stops when motion is off.
 */
export function AmbientVeil() {
  const { motionOk } = useMotionPreference();
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const update = () => setPaused(document.hidden);
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  return (
    <Canvas
      dpr={[1, 1.25]}
      frameloop={paused ? "never" : motionOk ? "always" : "demand"}
      camera={{ position: [0, 0, 1], fov: 55, near: 0.1, far: 120 }}
      gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
    >
      <Suspense fallback={null}>
        <DriftingStars motionOk={motionOk} />
      </Suspense>
    </Canvas>
  );
}

export default AmbientVeil;
