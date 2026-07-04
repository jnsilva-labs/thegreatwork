// Signature motion vocabulary for the Editorial Ritual direction.
// All entrance choreography draws from these values so the site moves
// with one voice. Scroll position/progress stays owned by Lenis +
// hermeticStore (ScrollOrchestrator); GSAP is used only for entrance
// timelines fired by intersection, never for per-frame scroll effects.

// GSAP's expo.out closely matches the site's de-facto CSS ease
// cubic-bezier(0.16, 1, 0.3, 1).
export const EASE_CEREMONIAL = 'expo.out';

export const DUR = {
  drift: 1.1,
  reveal: 0.7,
  etch: 0.9,
  dissolve: 0.6,
} as const;

export const STAGGER = 0.09;

// Reuse the intersection tuning already proven in HomepageSection.
export const REVEAL_OBSERVER: IntersectionObserverInit = {
  threshold: 0.2,
  rootMargin: '0px 0px -15% 0px',
};
