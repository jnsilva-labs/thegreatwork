'use client';

import { useLayoutEffect, type RefObject } from 'react';
import { gsap } from 'gsap';
import { REVEAL_OBSERVER } from './motionTokens';

// Builds a paused GSAP timeline scoped to `ref` and plays it once on first
// intersection. The builder runs inside gsap.context so ctx.revert() undoes
// every inline style on unmount. Initial hidden states are set inside the
// builder during useLayoutEffect (pre-paint), so markup stays visible for
// no-JS/SEO and never flashes.
export function useRevealTimeline(
  ref: RefObject<HTMLElement | null>,
  build: (root: HTMLElement) => gsap.core.Timeline | undefined,
  enabled: boolean,
) {
  useLayoutEffect(() => {
    if (!enabled) return;
    const root = ref.current;
    if (!root) return;

    let observer: IntersectionObserver | null = null;
    const ctx = gsap.context(() => {
      const timeline = build(root);
      if (!timeline) return;
      timeline.pause();

      observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          timeline.play();
          observer?.disconnect();
          observer = null;
        }
      }, REVEAL_OBSERVER);
      observer.observe(root);
    }, root);

    return () => {
      observer?.disconnect();
      ctx.revert();
    };
    // `build` is intentionally excluded: reveal timelines are one-shot and
    // rebuilding on every render of the parent would restart them.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ref]);
}
