import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Astrology — Awareness Paradox",
  description:
    "The Emerald Tablet declares: that which is below is like that which is above. Explore astrology as the ancients practiced it, through the bonds of cosmic sympathy.",
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
            The Emerald Tablet of Hermes opens with a declaration that has
            echoed through every century since: &quot;That which is below is
            like that which is above, and that which is above is like that
            which is below, to do the miracles of one only thing.&quot; The
            Arabic original says <em>from</em>, not <em>like</em>. You are
            not a reflection of the cosmos. You are from the same source.
          </p>
          <p className="max-w-2xl text-base leading-relaxed text-[color:var(--mist)] sm:text-lg">
            In Hermetic cosmology, the soul descends through seven planetary
            spheres to arrive on earth, gathering qualities at each stage.
            Your natal chart is a record of that passage. Ptolemy, writing in
            the second century, treated astrology as natural philosophy: the
            study of how celestial patterns correspond to earthly life through
            the bonds of <em>sympatheia</em>.
          </p>
        </div>

        <div className="rounded-2xl border border-[color:var(--copper)]/30 p-5 sm:p-8 text-center">
          <p className="text-sm uppercase tracking-[0.4em] text-[color:var(--gilt)]">
            Coming Soon
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[color:var(--mist)]">
            Natal chart readings, planetary transits, and zodiac profiles,
            drawn from the tradition of Hermetic correspondence.
          </p>
        </div>

        <ZodiacWheel />
      </div>
    </div>
  );
}

function ZodiacWheel() {
  const signs = [
    "\u2648", "\u2649", "\u264A", "\u264B", "\u264C", "\u264D",
    "\u264E", "\u264F", "\u2650", "\u2651", "\u2652", "\u2653",
  ];

  return (
    <div className="flex justify-center py-8">
      <svg
        viewBox="0 0 200 200"
        className="h-48 w-48 sm:h-56 sm:w-56 text-[color:var(--copper)] opacity-40"
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
