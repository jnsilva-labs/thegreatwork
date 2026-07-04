'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { DUR, EASE_CEREMONIAL } from './motionTokens';
import { useMotionPreference } from './useMotionPreference';
import { useRevealTimeline } from './useRevealTimeline';

type EtchRuleProps = {
  className?: string;
};

// Engraved divider: a hairline rule with a center diamond that draws
// outward from the middle on first view. Static after draw-in. Purely
// decorative: aria-hidden, pointer-events-none.
export function EtchRule({ className }: EtchRuleProps) {
  const { motionOk } = useMotionPreference();
  const ref = useRef<HTMLDivElement>(null);

  useRevealTimeline(
    ref,
    (root) => {
      const lines = root.querySelectorAll<SVGLineElement>('line');
      const diamond = root.querySelector<SVGRectElement>('rect');

      gsap.set(lines, { strokeDasharray: 1, strokeDashoffset: 1 });
      if (diamond) gsap.set(diamond, { opacity: 0, scale: 0.4, transformOrigin: 'center center' });

      const tl = gsap.timeline();
      if (diamond) {
        tl.to(diamond, { opacity: 1, scale: 1, duration: DUR.etch * 0.4, ease: EASE_CEREMONIAL });
      }
      tl.to(
        lines,
        { strokeDashoffset: 0, duration: DUR.etch, ease: EASE_CEREMONIAL },
        diamond ? '-=0.2' : 0,
      );
      return tl;
    },
    motionOk,
  );

  return (
    <div ref={ref} className={`pointer-events-none ${className ?? ''}`} aria-hidden="true">
      <svg
        viewBox="0 0 400 12"
        preserveAspectRatio="none"
        className="h-3 w-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line x1="196" y1="6" x2="8" y2="6" pathLength="1" stroke="var(--gilt, #b89b5e)" strokeOpacity="0.35" strokeWidth="1" />
        <line x1="204" y1="6" x2="392" y2="6" pathLength="1" stroke="var(--gilt, #b89b5e)" strokeOpacity="0.35" strokeWidth="1" />
        <rect x="197" y="3" width="6" height="6" transform="rotate(45 200 6)" fill="var(--gilt, #b89b5e)" fillOpacity="0.55" />
      </svg>
    </div>
  );
}
