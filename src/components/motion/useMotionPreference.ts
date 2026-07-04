'use client';

import { useSyncExternalStore } from 'react';
import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion';
import { useUiStore } from '@/lib/uiStore';

// Pure predicate so the truth table is unit-testable without a DOM.
// Note: this deliberately does NOT read hermeticStore.qualityTier — that is
// a WebGL budget tier which RitualCanvas auto-sets to "low" for any mobile
// viewport, and mobile users should still get entrance choreography. Motion
// only shuts off for genuinely constrained devices.
export function isMotionOk(reducedMotion: boolean, stillness: boolean, lowPowerDevice: boolean): boolean {
  return !reducedMotion && !stillness && !lowPowerDevice;
}

// Same heuristic WebGLGuard uses: data-saver, very slow connection, or a
// very weak CPU. Computed once per page load; false during SSR.
let lowPowerCache: boolean | null = null;

function getLowPowerSnapshot(): boolean {
  if (lowPowerCache === null) {
    const connection = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;

    lowPowerCache =
      Boolean(connection?.saveData) ||
      Boolean(connection?.effectiveType && ['slow-2g', '2g'].includes(connection.effectiveType)) ||
      (typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency <= 2);
  }
  return lowPowerCache;
}

const subscribeNever = () => () => {};

function useLowPowerDevice() {
  return useSyncExternalStore(subscribeNever, getLowPowerSnapshot, () => false);
}

// One truth for "may we animate?". When false, motion primitives render
// their final state instantly and never create a timeline.
export function useMotionPreference() {
  const reducedMotion = usePrefersReducedMotion();
  const stillness = useUiStore((state) => state.stillness);
  const lowPowerDevice = useLowPowerDevice();

  return { motionOk: isMotionOk(reducedMotion, stillness, lowPowerDevice) };
}
