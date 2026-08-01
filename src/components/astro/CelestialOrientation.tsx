"use client";

import { useId } from "react";
import { useMotionPreference } from "@/components/motion/useMotionPreference";

const zodiac = [
  { abbreviation: "Ar", name: "Aries" },
  { abbreviation: "Ta", name: "Taurus" },
  { abbreviation: "Ge", name: "Gemini" },
  { abbreviation: "Ca", name: "Cancer" },
  { abbreviation: "Le", name: "Leo" },
  { abbreviation: "Vi", name: "Virgo" },
  { abbreviation: "Li", name: "Libra" },
  { abbreviation: "Sc", name: "Scorpio" },
  { abbreviation: "Sg", name: "Sagittarius" },
  { abbreviation: "Cp", name: "Capricorn" },
  { abbreviation: "Aq", name: "Aquarius" },
  { abbreviation: "Pi", name: "Pisces" },
] as const;

const pointOnCircle = (index: number, radius: number) => {
  const angle = (index / zodiac.length) * Math.PI * 2 - Math.PI / 2;
  const stabilize = (value: number) => Number(value.toFixed(6));
  return {
    x: stabilize(50 + Math.cos(angle) * radius),
    y: stabilize(50 + Math.sin(angle) * radius),
  };
};

export function CelestialOrientation() {
  const { motionOk } = useMotionPreference();
  const gradientId = useId().replace(/:/g, "");

  return (
    <section
      aria-labelledby="celestial-orientation-title"
      className="grid gap-8 border-y border-[color:var(--copper)]/28 py-9 lg:grid-cols-[minmax(0,0.82fr)_minmax(18rem,1.18fr)] lg:items-center lg:py-12"
    >
      <div className="space-y-5">
        <p className="type-eyebrow text-[color:var(--gilt)]">Celestial orientation · tropical zodiac</p>
        <h2 id="celestial-orientation-title" className="font-ritual text-3xl leading-tight text-[color:var(--bone)] sm:text-4xl">
          The chart begins with a moment, a place, and a turning sky.
        </h2>
        <p className="max-w-xl text-base leading-relaxed text-[color:var(--mist)]">
          A natal chart fixes the planets against the zodiac at your first moment in the world. The wheel is not a verdict. It is a field of relationships to read with care.
        </p>
        <a
          href="#natal-widget"
          className="ritual-link min-h-[44px] w-fit"
        >
          Set the celestial instrument
        </a>
      </div>

      <figure className="relative mx-auto grid w-full max-w-[34rem] gap-3" aria-labelledby="celestial-wheel-caption">
        <div className="relative aspect-square">
          <div className="pointer-events-none absolute inset-[8%] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--gilt)_14%,transparent),transparent_68%)]" />
          <svg
          viewBox="0 0 100 100"
          role="img"
          aria-labelledby="celestial-wheel-title celestial-wheel-desc"
          className="relative h-full w-full overflow-visible text-[color:var(--gilt)]"
        >
          <title id="celestial-wheel-title">A twelve-sign celestial orientation wheel</title>
          <desc id="celestial-wheel-desc">Twelve zodiac stations surround intersecting celestial axes and three quiet planetary points.</desc>
          <defs>
            <radialGradient id={gradientId}>
              <stop offset="0" stopColor="var(--gilt)" stopOpacity="0.22" />
              <stop offset="1" stopColor="var(--gilt)" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeOpacity="0.35" strokeWidth="0.3" />
          <circle cx="50" cy="50" r="35" fill={`url(#${gradientId})`} stroke="currentColor" strokeOpacity="0.5" strokeWidth="0.4" />
          <circle cx="50" cy="50" r="23" fill="none" stroke="currentColor" strokeOpacity="0.25" strokeDasharray="0.8 1.8" strokeWidth="0.35" />
          <g className={motionOk ? "origin-center animate-spin-[48s_linear_infinite]" : undefined}>
            {zodiac.map((sign, index) => {
              const outer = pointOnCircle(index, 46);
              const inner = pointOnCircle(index, 35);
              const label = pointOnCircle(index, 40.5);
              return (
                <g key={sign.name}>
                  <line x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y} stroke="currentColor" strokeOpacity="0.32" strokeWidth="0.3" />
                  <text x={label.x} y={label.y} dy="0.9" textAnchor="middle" fontSize="2.8" fill="currentColor" opacity="0.8">
                    {sign.abbreviation}
                  </text>
                </g>
              );
            })}
          </g>
          <line x1="8" y1="50" x2="92" y2="50" stroke="currentColor" strokeOpacity="0.28" strokeWidth="0.3" />
          <line x1="50" y1="8" x2="50" y2="92" stroke="currentColor" strokeOpacity="0.18" strokeWidth="0.3" />
          <path d="M18 67 Q50 16 82 67" fill="none" stroke="currentColor" strokeOpacity="0.5" strokeWidth="0.55" />
          <circle cx="36" cy="36" r="1.6" fill="var(--bone)" />
          <circle cx="57" cy="25" r="1.25" fill="var(--gilt)" />
          <circle cx="74" cy="49" r="1.4" fill="var(--copper)" />
          <circle cx="50" cy="50" r="2.2" fill="var(--bg)" stroke="currentColor" strokeWidth="0.5" />
          </svg>
          <figcaption id="celestial-wheel-caption" className="absolute inset-x-0 bottom-2 text-center text-xs uppercase tracking-[0.12em] text-[color:var(--mist)]">
            Twelve signs · four angles · one field of relation
          </figcaption>
        </div>
        <ul aria-label="Zodiac stations" className="grid grid-cols-4 border-y border-[color:var(--copper)]/24 py-2 sm:grid-cols-6">
          {zodiac.map((sign) => (
            <li key={sign.name} className="text-xs leading-6 text-[color:var(--mist)]">
              <span className="mr-1 font-ritual text-base text-[color:var(--gilt)]" aria-hidden="true">{sign.abbreviation}</span>
              {sign.name}
            </li>
          ))}
        </ul>
      </figure>
    </section>
  );
}
