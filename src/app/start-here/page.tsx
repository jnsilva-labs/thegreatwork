import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Start Here | Awareness Paradox",
  description:
    "A short orientation guide for new readers: begin with Hermetic principles, then move into astrology and contemplative practice.",
};

const tracks = [
  {
    title: "Hermetic Foundations",
    subtitle: "Begin now",
    body: "Start with the core map first. Read the guide slowly, then move through one principle at a time.",
    href: "/principles",
    cta: "Start with the Principles",
    comingSoon: false,
  },
  {
    title: "Astrology for Self-Understanding",
    subtitle: "Coming soon",
    body: "A grounded path for symbolic self-observation, timing, and pattern recognition.",
    comingSoon: true,
  },
  {
    title: "Meditation & Practice",
    subtitle: "Coming soon",
    body: "Simple rhythms for turning ideas into direct experience through stillness and reflection.",
    comingSoon: true,
  },
];

export default function StartHerePage() {
  const envSubstackUrl = process.env.NEXT_PUBLIC_SUBSTACK_URL?.trim();
  const substackUrl =
    envSubstackUrl && envSubstackUrl.length > 0
      ? envSubstackUrl
      : "https://substack.com/@awarenessparadox";
  const isExternal = substackUrl.startsWith("https://") || substackUrl.startsWith("http://");

  return (
    <div className="min-h-screen px-6 py-20 text-[color:var(--bone)] sm:px-10 lg:px-20">
      <div className="mx-auto max-w-5xl space-y-10">
        <header className="space-y-5">
          <p className="text-xs uppercase tracking-[0.4em] text-[color:var(--mist)]">Orientation</p>
          <h1 className="font-ritual text-4xl sm:text-6xl">Start Here</h1>
          <p className="max-w-3xl text-base leading-relaxed text-[color:var(--mist)] sm:text-lg">
            Welcome to Awareness Paradox. Use this page as your first map after downloading the guide.
            One path, one week, one principle at a time.
          </p>
        </header>

        <section className="rounded-2xl border border-[color:var(--copper)]/35 bg-[color:var(--char)]/50 p-6 sm:p-8">
          <h2 className="font-ritual text-2xl">Your first week</h2>
          <ol className="mt-4 space-y-3 text-sm leading-relaxed text-[color:var(--mist)] sm:text-base">
            <li>1. Download and read the Starter Guide.</li>
            <li>2. Choose one Hermetic principle and reflect on it for 24 hours.</li>
            <li>3. Continue through one principle per day, then return for the next track.</li>
          </ol>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          {tracks.map((track) => (
            <article
              key={track.title}
              className="rounded-2xl border border-[color:var(--copper)]/35 bg-[color:var(--char)]/45 p-6"
            >
              <p className="text-xs uppercase tracking-[0.35em] text-[color:var(--gilt)]">
                {track.subtitle}
              </p>
              <h2 className="mt-4 font-ritual text-2xl">{track.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-[color:var(--mist)]">
                {track.body}
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                {track.comingSoon ? (
                  <>
                    <span
                      aria-disabled="true"
                      className="inline-flex min-h-[44px] items-center rounded-full border border-[color:var(--copper)]/35 px-4 py-2 text-xs uppercase tracking-[0.25em] text-[color:var(--mist)]/80"
                    >
                      Coming Soon
                    </span>
                    <a
                      href={substackUrl}
                      target={isExternal ? "_blank" : undefined}
                      rel={isExternal ? "noopener noreferrer" : undefined}
                      className="inline-flex min-h-[44px] items-center rounded-full border border-[color:var(--copper)]/55 px-4 py-2 text-xs uppercase tracking-[0.25em] text-[color:var(--mist)] transition hover:border-[color:var(--gilt)] hover:text-[color:var(--bone)]"
                    >
                      Join Waitlist
                    </a>
                  </>
                ) : (
                  <Link
                    href={track.href ?? "/principles"}
                    className="inline-flex min-h-[44px] items-center rounded-full border border-[color:var(--copper)]/55 px-4 py-2 text-xs uppercase tracking-[0.25em] transition hover:border-[color:var(--gilt)]"
                  >
                    {track.cta}
                  </Link>
                )}
              </div>
            </article>
          ))}
        </section>

        <section className="rounded-2xl border border-[color:var(--copper)]/25 bg-[color:var(--obsidian)]/50 p-6">
          <h2 className="font-ritual text-2xl">Keep Going</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/principles"
              className="inline-flex min-h-[44px] items-center rounded-full border border-[color:var(--copper)]/55 px-4 py-2 text-xs uppercase tracking-[0.25em] transition hover:border-[color:var(--gilt)]"
            >
              Read the Principles
            </Link>
            <Link
              href="/journey"
              className="inline-flex min-h-[44px] items-center rounded-full border border-[color:var(--copper)]/55 px-4 py-2 text-xs uppercase tracking-[0.25em] transition hover:border-[color:var(--gilt)]"
            >
              Practice Journey
            </Link>
            <a
              href={substackUrl}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer" : undefined}
              className="inline-flex min-h-[44px] items-center rounded-full border border-[color:var(--gilt)]/60 bg-[color:var(--gilt)]/15 px-4 py-2 text-xs uppercase tracking-[0.25em] text-[color:var(--bone)] transition hover:border-[color:var(--gilt)]"
            >
              Subscribe on Substack
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
