"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { HeroSigil } from "@/components/ui/HeroSigil";
import { MagneticLink } from "@/components/ui/MagneticLink";
import { useHermeticStore } from "@/lib/hermeticStore";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { useUiStore } from "@/lib/uiStore";

type PathDoor = {
  title: string;
  body: string;
  href: string;
  label: string;
  symbol: string;
  accent: "teal" | "gold" | "bone";
};

type HomepageHeroProps = {
  title: string;
  subtitle: string;
  body: string;
  pathDoors: PathDoor[];
};

export function HomepageHero({
  title,
  subtitle,
  body,
  pathDoors,
}: HomepageHeroProps) {
  const heroProgress = useHermeticStore((state) => state.heroProgress);
  const reducedMotion = usePrefersReducedMotion();
  const stillness = useUiStore((state) => state.stillness);
  const [entered, setEntered] = useState(false);
  const [cardPointer, setCardPointer] = useState<Record<string, { x: number; y: number }>>({});

  useEffect(() => {
    if (reducedMotion || stillness) {
      const id = window.setTimeout(() => setEntered(true), 0);
      return () => window.clearTimeout(id);
    }

    const id = window.setTimeout(() => setEntered(true), 50);
    return () => window.clearTimeout(id);
  }, [reducedMotion, stillness]);

  const titleTransform = useMemo(() => {
    if (reducedMotion) return undefined;
    return {
      transform: `translate3d(0, ${heroProgress * 48}px, 0)`,
    };
  }, [heroProgress, reducedMotion]);

  const copyTransform = useMemo(() => {
    if (reducedMotion) return undefined;
    return {
      transform: `translate3d(0, ${heroProgress * 78}px, 0)`,
    };
  }, [heroProgress, reducedMotion]);

  const cardTransform = useMemo(() => {
    if (reducedMotion) return undefined;
    return {
      transform: `translate3d(0, ${heroProgress * 104}px, 0)`,
    };
  }, [heroProgress, reducedMotion]);

  const lines = title.split(" ");
  const titleRows = [lines.slice(0, 1).join(" "), lines.slice(1).join(" ")];

  return (
    <section
      id="hero"
      className={`homepage-hero relative min-h-screen overflow-hidden px-6 py-24 sm:px-10 lg:px-20 ${
        entered ? "is-entered" : ""
      }`}
    >
      <div className="hero-vignette fixed inset-0 -z-[5]" aria-hidden="true" />
      <div className="hero-sigil-wrap absolute inset-x-0 top-20 z-0 flex justify-center lg:inset-y-0 lg:right-[-10%] lg:left-auto lg:items-center lg:justify-end">
        <HeroSigil />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[72vh] max-w-5xl flex-col justify-center gap-7 sm:gap-8">
        <div className="hero-intro-row flex items-center gap-3 text-xs uppercase tracking-[0.34em] text-[color:var(--mist)] sm:tracking-[0.4em]">
          <span className="hero-label-line h-px w-12 bg-[color:var(--copper)]" />
          <span className="hero-label-copy">A Digital Temple</span>
        </div>

        <div className="hero-title-shell space-y-1" style={titleTransform}>
          {titleRows.map((row) => (
            <div key={row} className="hero-title-line-wrap overflow-hidden">
              <h1 className="hero-title-line font-ritual text-[3.6rem] leading-[0.94] text-[color:var(--bone)] sm:text-[5rem] lg:text-[5.8rem]">
                {row}
              </h1>
            </div>
          ))}
        </div>

        <div className="hero-copy-stack space-y-7" style={copyTransform}>
          <p className="hero-subtitle max-w-2xl text-xs uppercase tracking-[0.24em] text-[color:var(--gilt)] sm:text-sm sm:tracking-[0.35em]">
            {subtitle}
          </p>
          <p className="hero-body max-w-2xl text-base leading-relaxed text-[color:var(--mist)] sm:text-[1.05rem]">
            {body}
          </p>
          <p className="hero-audience max-w-3xl text-xs uppercase tracking-[0.24em] text-[color:var(--mist)] sm:text-sm sm:tracking-[0.28em]">
            For the spiritually curious, the disciplined seeker, and the serious student of the esoteric arts.
          </p>
        </div>

        <div className="hero-card-grid grid max-w-4xl gap-3 md:grid-cols-3 lg:gap-4" style={cardTransform}>
          {pathDoors.map((door, index) => {
            const pointer = cardPointer[door.title] ?? { x: 50, y: 50 };
            const hoverStyle =
              reducedMotion || stillness
                ? undefined
                : ({
                    "--door-x": `${pointer.x}%`,
                    "--door-y": `${pointer.y}%`,
                  } as CSSProperties);

            return (
              <article
                key={door.title}
                className={`home-door home-door--${door.accent}`}
                style={{
                  animationDelay: `${1600 + index * 150}ms`,
                  ...hoverStyle,
                }}
                onMouseMove={(event) => {
                  if (reducedMotion || stillness) return;
                  const rect = event.currentTarget.getBoundingClientRect();
                  const x = ((event.clientX - rect.left) / rect.width) * 100;
                  const y = ((event.clientY - rect.top) / rect.height) * 100;
                  setCardPointer((state) => ({
                    ...state,
                    [door.title]: { x, y },
                  }));
                }}
                onMouseLeave={() => {
                  setCardPointer((state) => ({
                    ...state,
                    [door.title]: { x: 50, y: 50 },
                  }));
                }}
              >
                <span className="home-door__symbol" aria-hidden="true">
                  {door.symbol}
                </span>
                <h2 className="font-ritual text-[2rem] leading-none text-[color:var(--bone)] sm:text-[2.1rem]">
                  {door.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-[color:var(--mist)]">
                  {door.body}
                </p>
                <MagneticLink
                  href={door.href}
                  location="home:hero-door"
                  label={door.label}
                  variant={door.title}
                  className="home-cta mt-4 inline-flex min-h-[48px] items-center rounded-full border px-5 py-3 text-[0.65rem] uppercase tracking-[0.26em] transition focus-visible:outline focus-visible:outline-1 focus-visible:outline-[color:var(--gilt)]"
                >
                  {door.label}
                </MagneticLink>
              </article>
            );
          })}
        </div>

        <div className="hero-secondary-ctas flex flex-wrap gap-3" style={cardTransform}>
          <MagneticLink
            href="/study"
            location="home:hero-secondary"
            label="Explore The Path"
            variant="secondary"
            className="home-cta inline-flex min-h-[48px] items-center rounded-full border px-5 py-3 text-xs uppercase tracking-[0.26em] text-[color:var(--bone)] transition"
          >
            Explore The Path
          </MagneticLink>
          <MagneticLink
            href="/letters"
            location="home:hero-secondary"
            label="Read the Letters"
            variant="secondary"
            className="home-cta inline-flex min-h-[48px] items-center rounded-full border px-5 py-3 text-xs uppercase tracking-[0.26em] transition"
          >
            Read the Letters
          </MagneticLink>
        </div>

        <div className="hero-scroll-cue mt-8 text-center text-xs uppercase tracking-[0.3em] text-[color:var(--mist)] sm:tracking-[0.5em]">
          Scroll to explore
        </div>
      </div>
    </section>
  );
}
