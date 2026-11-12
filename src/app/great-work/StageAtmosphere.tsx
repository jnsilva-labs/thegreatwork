"use client";

import { useEffect, useState } from "react";

type StageAtmosphereProps = {
  stages: readonly { id: string; tone: string }[];
};

/**
 * The page's background follows the Work itself: as each stage section
 * crosses the viewport, a full-height wash crossfades toward that stage's
 * color — nigredo's char, albedo's bone, citrinitas's gold, rubedo's deep
 * red, with the peacock iridescence surfacing only at the final stage.
 * Scroll-position driven (IntersectionObserver), so it needs no animation
 * loop; reduced motion swaps the slow crossfade for an instant change.
 */
export function StageAtmosphere({ stages }: StageAtmosphereProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const sections = stages
      .map((stage) => document.getElementById(stage.id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          setActiveId(visible.target.id);
        }
      },
      { rootMargin: "-30% 0px -40% 0px", threshold: [0, 0.2, 0.5] }
    );

    sections.forEach((section) => observer.observe(section));
    const reset = () => {
      if (window.scrollY < (sections[0]?.offsetTop ?? 0) - window.innerHeight) {
        setActiveId(null);
      }
    };
    window.addEventListener("scroll", reset, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", reset);
    };
  }, [stages]);

  const active = stages.find((stage) => stage.id === activeId);
  const index = active ? stages.findIndex((stage) => stage.id === active.id) : -1;

  return (
    <div
      aria-hidden="true"
      className="stage-wash fixed inset-0 -z-10 pointer-events-none"
      data-stage={active?.id ?? "none"}
      style={
        active
          ? ({ "--stage-tone": active.tone, opacity: 1 } as React.CSSProperties)
          : { opacity: 0 }
      }
    >
      {index === stages.length - 1 && <div className="stage-wash-peacock absolute inset-0" />}
    </div>
  );
}
