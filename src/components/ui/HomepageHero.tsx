"use client";

import { useEffect, useMemo, useState } from "react";
import { HeroSigil } from "@/components/ui/HeroSigil";
import { MagneticLink } from "@/components/ui/MagneticLink";
import { useHermeticStore } from "@/lib/hermeticStore";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { useUiStore } from "@/lib/uiStore";

type PathDoor = {
  title: string;
  body: string;
  actions: readonly {
    href: string;
    label: string;
  }[];
  symbol: string;
  accent: "teal" | "gold" | "bone";
};

type HomepageHeroProps = {
  title: string;
  subtitle: string;
  body: string;
  pathDoors: readonly PathDoor[];
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
  const motionBlocked = reducedMotion || stillness;

  useEffect(() => {
    if (motionBlocked) {
      const id = window.setTimeout(() => setEntered(true), 0);
      return () => window.clearTimeout(id);
    }

    const id = window.setTimeout(() => setEntered(true), 50);
    return () => window.clearTimeout(id);
  }, [motionBlocked]);

  const titleTransform = useMemo(() => {
    if (motionBlocked) return undefined;
    return {
      transform: `translate3d(0, ${heroProgress * 48}px, 0)`,
    };
  }, [heroProgress, motionBlocked]);

  const copyTransform = useMemo(() => {
    if (motionBlocked) return undefined;
    return {
      transform: `translate3d(0, ${heroProgress * 78}px, 0)`,
    };
  }, [heroProgress, motionBlocked]);

  const cardTransform = useMemo(() => {
    if (motionBlocked) return undefined;
    return {
      transform: `translate3d(0, ${heroProgress * 104}px, 0)`,
    };
  }, [heroProgress, motionBlocked]);

  const lines = title.split(" ");
  const titleRows = [lines.slice(0, 1).join(" "), lines.slice(1).join(" ")];

  return (
    <section
      id="hero"
      className={`homepage-hero relative min-h-[100svh] overflow-hidden px-6 pt-20 pb-12 sm:min-h-screen sm:px-10 sm:py-24 lg:px-20 ${
        entered ? "is-entered" : ""
      }`}
    >
      <div className="hero-vignette fixed inset-0 -z-[5]" aria-hidden="true" />
      <div className="hero-sigil-wrap absolute inset-x-0 top-20 z-0 flex justify-center lg:inset-y-0 lg:right-[-10%] lg:left-auto lg:items-center lg:justify-end">
        <HeroSigil />
      </div>

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col justify-center gap-5 sm:min-h-[72vh] sm:gap-8">
        <div className="hero-intro-row flex items-center gap-3 text-xs uppercase tracking-[0.34em] text-[color:var(--mist)] sm:tracking-[0.4em]">
          <span className="hero-label-line h-px w-12 bg-[color:var(--copper)]" />
          <span className="hero-label-copy">A Digital Temple</span>
        </div>

        <div className="hero-title-shell" style={titleTransform}>
          <h1 className="font-ritual text-[3.6rem] leading-[0.94] text-[color:var(--bone)] sm:text-[5rem] lg:text-[5.8rem]">
            {titleRows.map((row) => (
              <span key={row} className="hero-title-line hero-title-line-wrap block overflow-hidden">
                <span className="hero-title-line-text block">{row}</span>
              </span>
            ))}
          </h1>
        </div>

        <div className="hero-copy-stack space-y-4 sm:space-y-7" style={copyTransform}>
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

        <div
          className="hero-card-grid grid max-w-4xl gap-3 md:grid-cols-3 lg:gap-4"
          style={cardTransform}
          aria-label="Choose a path"
        >
          {pathDoors.map((door) => {
            return (
              <article
                key={door.title}
                className={`home-door home-door--${door.accent}`}
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
                <div className="mt-4 flex flex-wrap gap-3">
                  {door.actions.map((action) => (
                    <MagneticLink
                      key={action.href}
                      href={action.href}
                      location="home:hero-door"
                      label={action.label}
                      variant={door.title}
                      className="home-cta inline-flex min-h-[48px] items-center rounded-full border px-5 py-3 text-[0.65rem] uppercase tracking-[0.26em] transition focus-visible:outline focus-visible:outline-1 focus-visible:outline-[color:var(--gilt)]"
                    >
                      {action.label}
                    </MagneticLink>
                  ))}
                </div>
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

        <div className="hero-scroll-cue mt-3 text-center text-xs uppercase tracking-[0.3em] text-[color:var(--mist)] sm:mt-8 sm:tracking-[0.5em]">
          Continue into the archive
        </div>
      </div>
    </section>
  );
}
