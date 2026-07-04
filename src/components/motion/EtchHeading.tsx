'use client';

import { createElement, useRef, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { DUR, EASE_CEREMONIAL } from './motionTokens';
import { useMotionPreference } from './useMotionPreference';
import { useRevealTimeline } from './useRevealTimeline';

type EtchHeadingProps = {
  as?: 'h1' | 'h2' | 'h3' | 'h4';
  underline?: boolean;
  className?: string;
  children: ReactNode;
};

// Heading etch-in: the text is unmasked left-to-right via clip-path while a
// hairline gilt underline draws in beneath it. No per-character splitting.
export function EtchHeading({ as = 'h2', underline = true, className, children }: EtchHeadingProps) {
  const { motionOk } = useMotionPreference();
  const ref = useRef<HTMLDivElement>(null);

  useRevealTimeline(
    ref,
    (root) => {
      const text = root.querySelector<HTMLElement>('[data-etch-text]');
      const rule = root.querySelector<HTMLElement>('[data-etch-rule]');
      if (!text) return undefined;

      gsap.set(text, { clipPath: 'inset(-5% 100% -5% 0)' });
      if (rule) gsap.set(rule, { scaleX: 0, transformOrigin: 'left center' });

      const tl = gsap.timeline();
      tl.to(text, { clipPath: 'inset(-5% 0% -5% 0)', duration: DUR.etch, ease: EASE_CEREMONIAL });
      if (rule) {
        tl.to(rule, { scaleX: 1, duration: DUR.etch * 0.8, ease: EASE_CEREMONIAL }, '-=0.55');
      }
      return tl;
    },
    motionOk,
  );

  return (
    <div ref={ref}>
      {createElement(as, { className, 'data-etch-text': '' }, children)}
      {underline && (
        <div
          data-etch-rule=""
          aria-hidden="true"
          className="pointer-events-none mt-3 h-px w-16 bg-gradient-to-r from-[color:var(--gilt)]/70 to-transparent"
        />
      )}
    </div>
  );
}
