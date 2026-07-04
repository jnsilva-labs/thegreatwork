'use client';

import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion';
import { useHermeticStore } from '@/lib/hermeticStore';
import { useUiStore } from '@/lib/uiStore';

// Pure predicate so the truth table is unit-testable without a DOM.
export function isMotionOk(reducedMotion: boolean, stillness: boolean, qualityTier: string): boolean {
  return !reducedMotion && !stillness && qualityTier !== 'low';
}

// One truth for "may we animate?". When false, motion primitives render
// their final state instantly and never create a timeline.
export function useMotionPreference() {
  const reducedMotion = usePrefersReducedMotion();
  const stillness = useUiStore((state) => state.stillness);
  const qualityTier = useHermeticStore((state) => state.qualityTier);

  return { motionOk: isMotionOk(reducedMotion, stillness, qualityTier) };
}
