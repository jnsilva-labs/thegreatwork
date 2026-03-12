"use client";

import { useHermeticStore } from "@/lib/hermeticStore";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { useUiStore } from "@/lib/uiStore";

const HOMEPAGE_HYBRID_SIGIL = true;

export function HeroSigil() {
  const heroProgress = useHermeticStore((state) => state.heroProgress);
  const reducedMotion = usePrefersReducedMotion();
  const stillness = useUiStore((state) => state.stillness);
  const motionBlocked = reducedMotion || stillness;

  return (
    <div
      className={`hero-sigil-shell ${HOMEPAGE_HYBRID_SIGIL ? "hero-sigil-shell--hybrid" : ""}`}
      aria-hidden="true"
      style={
        motionBlocked
          ? undefined
          : {
              transform: `translate3d(${heroProgress * 24}px, ${heroProgress * 16}px, 0) scale(${1 - heroProgress * 0.06})`,
            }
      }
    >
      <div className="hero-sigil-glow" />
      <svg className="hero-sigil" viewBox="0 0 560 560" fill="none">
        <defs>
          <radialGradient id="hero-node-fill" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(232, 227, 216, 0.95)" />
            <stop offset="100%" stopColor="rgba(184, 155, 94, 0.55)" />
          </radialGradient>
        </defs>
        <g className="hero-sigil__drift">
          <circle className="hero-sigil__halo" cx="280" cy="280" r="210" />
          <circle className="hero-sigil__halo hero-sigil__halo--inner" cx="280" cy="280" r="164" />
          <circle className="hero-sigil__halo hero-sigil__halo--trace" cx="280" cy="280" r="118" />
          <g className="hero-sigil__flower">
            <circle className="hero-sigil__ring" cx="280" cy="280" r="74" />
            <circle className="hero-sigil__ring" cx="280" cy="206" r="74" />
            <circle className="hero-sigil__ring" cx="344" cy="243" r="74" />
            <circle className="hero-sigil__ring" cx="344" cy="317" r="74" />
            <circle className="hero-sigil__ring" cx="280" cy="354" r="74" />
            <circle className="hero-sigil__ring" cx="216" cy="317" r="74" />
            <circle className="hero-sigil__ring" cx="216" cy="243" r="74" />
          </g>
          {HOMEPAGE_HYBRID_SIGIL ? (
            <>
              <g className="hero-sigil__etch">
                <circle className="hero-sigil__etch-ring" cx="280" cy="280" r="238" />
                <circle className="hero-sigil__etch-ring" cx="280" cy="280" r="96" />
                <path className="hero-sigil__etch-arc" d="M102 280C126 195 197 126 280 102C363 126 434 195 458 280" />
                <path className="hero-sigil__etch-arc" d="M458 280C434 365 363 434 280 458C197 434 126 365 102 280" />
              </g>
              <g className="hero-sigil__orbit hero-sigil__orbit--outer">
                <circle className="hero-sigil__node" cx="280" cy="42" r="7" />
                <circle className="hero-sigil__node" cx="446" cy="112" r="6" />
                <circle className="hero-sigil__node" cx="518" cy="280" r="6" />
                <circle className="hero-sigil__node" cx="448" cy="446" r="6" />
                <circle className="hero-sigil__node" cx="280" cy="518" r="7" />
                <circle className="hero-sigil__node" cx="114" cy="448" r="6" />
                <circle className="hero-sigil__node" cx="42" cy="280" r="6" />
                <circle className="hero-sigil__node" cx="112" cy="112" r="6" />
              </g>
            </>
          ) : null}
          <g className="hero-sigil__orbit">
            <circle className="hero-sigil__node" cx="280" cy="96" r="6" />
            <circle className="hero-sigil__node" cx="427" cy="170" r="6" />
            <circle className="hero-sigil__node" cx="464" cy="318" r="6" />
            <circle className="hero-sigil__node" cx="391" cy="464" r="6" />
            <circle className="hero-sigil__node" cx="243" cy="501" r="6" />
            <circle className="hero-sigil__node" cx="96" cy="428" r="6" />
            <circle className="hero-sigil__node" cx="59" cy="280" r="6" />
            <circle className="hero-sigil__node" cx="132" cy="133" r="6" />
          </g>
        </g>
      </svg>
    </div>
  );
}
