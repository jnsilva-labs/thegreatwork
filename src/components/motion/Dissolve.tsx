'use client';

import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { DUR, EASE_CEREMONIAL } from './motionTokens';
import { useMotionPreference } from './useMotionPreference';

type DissolveProps = {
  show: boolean;
  className?: string;
  children: ReactNode;
};

// Cross-fade + slight blur for state changes (card reveals, result states).
// Toggles visibility synchronously when motion is not allowed.
export function Dissolve({ show, className, children }: DissolveProps) {
  const { motionOk } = useMotionPreference();
  const ref = useRef<HTMLDivElement>(null);
  const [rendered, setRendered] = useState(show);

  // Render-phase adjustments (React's sanctioned derived-state pattern):
  // mount immediately when shown; hide instantly when motion is off.
  if (show && !rendered) {
    setRendered(true);
  }
  if (!show && rendered && !motionOk) {
    setRendered(false);
  }

  // Animated exit — the only async path.
  useLayoutEffect(() => {
    if (!motionOk || show) return;
    const el = ref.current;
    if (!el) return;

    const tween = gsap.to(el, {
      opacity: 0,
      filter: 'blur(4px)',
      duration: DUR.dissolve,
      ease: EASE_CEREMONIAL,
      onComplete: () => setRendered(false),
    });
    return () => {
      tween.kill();
    };
  }, [show, motionOk]);

  useLayoutEffect(() => {
    if (!motionOk || !show || !rendered) return;
    const el = ref.current;
    if (!el) return;

    const tween = gsap.fromTo(
      el,
      { opacity: 0, filter: 'blur(4px)' },
      { opacity: 1, filter: 'blur(0px)', duration: DUR.dissolve, ease: EASE_CEREMONIAL },
    );
    return () => {
      tween.kill();
    };
  }, [show, rendered, motionOk]);

  if (!rendered) return null;

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
