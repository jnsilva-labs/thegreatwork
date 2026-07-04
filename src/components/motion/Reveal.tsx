'use client';

import { useRef, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { DUR, EASE_CEREMONIAL, STAGGER } from './motionTokens';
import { useMotionPreference } from './useMotionPreference';
import { useRevealTimeline } from './useRevealTimeline';

type RevealProps = {
  variant?: 'rise' | 'drift';
  stagger?: number;
  className?: string;
  children: ReactNode;
};

// Entrance reveal: children marked with [data-reveal] stagger in; without
// markers the wrapper itself animates. Renders children unmodified when
// motion is not allowed.
export function Reveal({ variant = 'rise', stagger, className, children }: RevealProps) {
  const { motionOk } = useMotionPreference();
  const ref = useRef<HTMLDivElement>(null);

  useRevealTimeline(
    ref,
    (root) => {
      const marked = root.querySelectorAll<HTMLElement>('[data-reveal]');
      const targets = marked.length > 0 ? Array.from(marked) : [root];
      const drift = variant === 'drift';

      gsap.set(targets, {
        opacity: 0,
        y: drift ? 24 : 16,
        scale: drift ? 0.985 : 1,
      });

      return gsap.timeline().to(targets, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: drift ? DUR.drift : DUR.reveal,
        ease: EASE_CEREMONIAL,
        stagger: stagger ?? STAGGER,
      });
    },
    motionOk,
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
