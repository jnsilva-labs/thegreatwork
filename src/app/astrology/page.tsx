import type { Metadata } from "next";
import { AstroEntryButton } from "@/components/astro/AstroEntryButton";

export const metadata: Metadata = {
  title: "Astrology — Awareness Paradox",
  description:
    "Astrology carries a long lineage, from Mesopotamian sky omens to Greek and Renaissance cosmology."
};

export default function AstrologyPage() {
  return (
    <div className="min-h-screen px-6 py-24 sm:px-10 lg:px-20">
      <div className="mx-auto max-w-3xl space-y-10">
        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.4em] text-[color:var(--mist)]">
          <span className="h-px w-12 bg-[color:var(--copper)]" />
          The Cosmic Sympathy
        </div>

        <h1 className="font-ritual text-4xl leading-tight text-[color:var(--bone)] sm:text-5xl lg:text-6xl">
          As Above, So Below
        </h1>

        <p className="text-sm uppercase tracking-[0.2em] sm:tracking-[0.35em] text-[color:var(--gilt)]">
          That which is below is from that which is above
        </p>

        <div className="space-y-5">
          <p className="max-w-2xl text-base leading-relaxed text-[color:var(--mist)] sm:text-lg">
            Astrology began as careful sky watching in ancient Mesopotamia, where priests recorded eclipses,
            planetary motions, and unusual alignments as signs tied to seasons, kingship, and civic life.
            In Egypt, temple astronomer-priests refined calendar systems and star lore, then Greek thinkers
            gathered these traditions into a more systematic language of zodiac signs, aspects, and houses.
          </p>
          <p className="max-w-2xl text-base leading-relaxed text-[color:var(--mist)] sm:text-lg">
            By the Hellenistic era, astrology became part of natural philosophy, and Ptolemy treated it as the
            study of celestial influence within an ordered cosmos. Through Arabic scholarship and the Latin West,
            those methods were preserved, translated, and expanded across the medieval and Renaissance periods,
            shaping medicine, agriculture, court timing, and personal natal practice for centuries.
          </p>
        </div>

        <div className="rounded-2xl border border-[color:var(--copper)]/30 p-5 sm:p-8 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-[color:var(--gilt)]">Private Beta</p>
          <p className="mt-3 text-sm leading-relaxed text-[color:var(--mist)]">
            Natal oracle is live in limited preview.
          </p>
          <div className="mt-5 flex justify-center">
            <AstroEntryButton />
          </div>
        </div>

        <ZodiacWheel />
      </div>
    </div>
  );
}

function ZodiacWheel() {
  const signs = [
    "\u2648", "\u2649", "\u264A", "\u264B", "\u264C", "\u264D",
    "\u264E", "\u264F", "\u2650", "\u2651", "\u2652", "\u2653"
  ];

  return (
    <div className="flex justify-center py-8">
      <svg
        viewBox="0 0 200 200"
        className="h-48 w-48 text-[color:var(--copper)] opacity-40 sm:h-56 sm:w-56"
        aria-hidden="true"
      >
        <circle
          cx="100"
          cy="100"
          r="90"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
        />
        <circle
          cx="100"
          cy="100"
          r="70"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
        />
        {signs.map((sign, i) => {
          const angle = (i * 30 - 90) * (Math.PI / 180);
          const x = 100 + 80 * Math.cos(angle);
          const y = 100 + 80 * Math.sin(angle);
          return (
            <text
              key={i}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              fill="currentColor"
              fontSize="14"
            >
              {sign}
            </text>
          );
        })}
        {Array.from({ length: 12 }, (_, i) => {
          const angle = (i * 30 - 90) * (Math.PI / 180);
          const x1 = 100 + 70 * Math.cos(angle);
          const y1 = 100 + 70 * Math.sin(angle);
          const x2 = 100 + 90 * Math.cos(angle);
          const y2 = 100 + 90 * Math.sin(angle);
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="currentColor"
              strokeWidth="0.5"
            />
          );
        })}
      </svg>
    </div>
  );
}
