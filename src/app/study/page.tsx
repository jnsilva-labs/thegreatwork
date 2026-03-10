import type { Metadata } from "next";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { EmailCtaCard } from "@/components/marketing/EmailCtaCard";
import { buildPageMetadata } from "@/lib/seo/metadata";

const STUDY_DESCRIPTION =
  "The path through Awareness Paradox: a clear study map for seekers, students, and practitioners moving through tarot, astrology, alchemy, sacred geometry, and the Hermetic principles.";

const audiencePaths = [
  {
    title: "Seeker",
    subtitle: "For the spiritually curious",
    body: "Begin with simple contact. Read slowly, pull one card, learn the big three, and let one living idea stay with you long enough to soften the noise around it.",
    rhythm: "Best rhythm: one page, one practice, one reflection each week.",
    href: "/start-here",
    cta: "Begin with Start Here",
  },
  {
    title: "Student",
    subtitle: "For structured self-study",
    body: "Move from inspiration into sequence. Study the principles, return to the journey as practice, and use tarot and astrology as instruments of attention rather than entertainment.",
    rhythm: "Best rhythm: one doctrine page, one direct practice, one journal entry.",
    href: "/principles",
    cta: "Study the Principles",
  },
  {
    title: "Practitioner",
    subtitle: "For deeper symbolic work",
    body: "Follow the correspondences across disciplines. Compare systems, stay close to the source texts, and let the work become contemplative discipline rather than passing fascination.",
    rhythm: "Best rhythm: one source-grounded essay, one practice cycle, one integration note.",
    href: "/great-work",
    cta: "Enter the Great Work",
  },
];

const disciplines = [
  {
    title: "Hermetic Principles",
    body: "The governing frame. These principles give language to patterns that return across mind, matter, symbol, and relationship.",
    begin: "Begin with the starter guide and one principle at a time.",
    deepen: "Deepen through comparative reading, daily observation, and journaling.",
    href: "/principles",
    cta: "Open Principles",
  },
  {
    title: "Tarot",
    body: "The quickest mirror. Tarot works best here as reflective practice: a way to surface pattern, tension, and possibility without collapsing into prediction.",
    begin: "Begin with a single-card draw and a short journal note.",
    deepen: "Deepen through repeated spreads, symbolism, and alchemical correspondences.",
    href: "/tarot",
    cta: "Open Tarot",
  },
  {
    title: "Astrology",
    body: "The celestial map. Astrology gives language to temperament, timing, and the way inner life reflects larger cycles.",
    begin: "Begin with the Sun, Moon, and Rising as your first frame.",
    deepen: "Deepen through houses, aspects, planetary dignities, and chart reflection.",
    href: "/astrology",
    cta: "Explore Astrology",
  },
  {
    title: "Alchemy",
    body: "The process of transformation. Alchemy names the phases of breakdown, purification, illumination, and integration that any real inner work eventually passes through.",
    begin: "Begin with the Great Work and the broad arc of the opus.",
    deepen: "Deepen through stage study, symbolic texts, and personal observation.",
    href: "/great-work",
    cta: "Study the Great Work",
  },
  {
    title: "Sacred Geometry",
    body: "The contemplative architecture of pattern. Geometry steadies attention and offers a visual grammar for proportion, recurrence, and harmony.",
    begin: "Begin with visual exploration and the journey practice.",
    deepen: "Deepen through patient looking, symbolic comparison, and embodied stillness.",
    href: "/journey",
    cta: "Open the Journey",
  },
];

const pathSequence = [
  {
    title: "Orient",
    body: "Use Start Here to get your footing and choose the first live door into the work.",
    href: "/start-here",
  },
  {
    title: "Practice",
    body: "Open the journey and let the ideas slow down into breath, attention, and reflection.",
    href: "/journey",
  },
  {
    title: "Understand",
    body: "Study the Hermetic principles and notice how the language begins to organize experience.",
    href: "/principles",
  },
  {
    title: "Apply",
    body: "Use tarot and astrology as active mirrors for what is unfolding in your life now.",
    href: "/tarot",
  },
  {
    title: "Integrate",
    body: "Return to alchemy and sacred geometry when you want the work to widen into a larger pattern.",
    href: "/great-work",
  },
];

export const metadata: Metadata = buildPageMetadata({
  title: "The Path",
  path: "/study",
  description: STUDY_DESCRIPTION,
  keywords: [
    "study map",
    "hermetic study path",
    "alchemy study",
    "tarot practice",
    "astrology study",
    "sacred geometry meditation",
  ],
});

export default function StudyPage() {
  return (
    <div className="min-h-screen px-6 py-20 text-[color:var(--bone)] sm:px-10 lg:px-20">
      <div className="mx-auto max-w-6xl space-y-10">
        <header className="space-y-5">
          <p className="text-xs uppercase tracking-[0.4em] text-[color:var(--mist)]">Study Map</p>
          <h1 className="font-ritual text-4xl sm:text-6xl">The Path</h1>
          <p className="max-w-3xl text-base leading-relaxed text-[color:var(--mist)] sm:text-lg">
            Every tradition on this site points back to the same work: learning how to see more clearly,
            live more honestly, and stay with transformation long enough for it to become wisdom. This
            page is the clearest map through that terrain.
          </p>
          <div className="flex flex-wrap gap-3">
            <TrackedLink
              href="/start-here"
              location="study:header"
              label="Start Here"
              variant="primary"
              className="inline-flex min-h-[44px] items-center rounded-full border border-[color:var(--gilt)]/60 bg-[color:var(--gilt)]/10 px-4 py-2 text-xs uppercase tracking-[0.25em] text-[color:var(--bone)] transition hover:border-[color:var(--gilt)]"
            >
              Start Here
            </TrackedLink>
            <TrackedLink
              href="/journey"
              location="study:header"
              label="Open the Journey"
              variant="secondary"
              className="inline-flex min-h-[44px] items-center rounded-full border border-[color:var(--copper)]/55 px-4 py-2 text-xs uppercase tracking-[0.25em] transition hover:border-[color:var(--gilt)]"
            >
              Open the Journey
            </TrackedLink>
            <TrackedLink
              href="/letters"
              location="study:header"
              label="Read the Letters"
              variant="secondary"
              className="inline-flex min-h-[44px] items-center rounded-full border border-[color:var(--copper)]/55 px-4 py-2 text-xs uppercase tracking-[0.25em] transition hover:border-[color:var(--gilt)]"
            >
              Read the Letters
            </TrackedLink>
          </div>
        </header>

        <section className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[color:var(--gilt)]">Three entry modes</p>
            <h2 className="mt-2 font-ritual text-3xl">One library, three ways to walk it</h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {audiencePaths.map((path) => (
              <article
                key={path.title}
                className="rounded-2xl border border-[color:var(--copper)]/35 bg-[color:var(--char)]/45 p-6"
              >
                <p className="text-xs uppercase tracking-[0.35em] text-[color:var(--gilt)]">{path.subtitle}</p>
                <h2 className="mt-4 font-ritual text-2xl">{path.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-[color:var(--mist)]">{path.body}</p>
                <p className="mt-4 text-xs uppercase tracking-[0.24em] text-[color:var(--mist)]">
                  {path.rhythm}
                </p>
                <TrackedLink
                  href={path.href}
                  location="study:audience-path"
                  label={path.cta}
                  variant={path.title}
                  className="mt-5 inline-flex min-h-[44px] items-center rounded-full border border-[color:var(--copper)]/55 px-4 py-2 text-xs uppercase tracking-[0.24em] transition hover:border-[color:var(--gilt)]"
                >
                  {path.cta}
                </TrackedLink>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[color:var(--gilt)]">Disciplines</p>
            <h2 className="mt-2 font-ritual text-3xl">How the traditions fit together</h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            {disciplines.map((discipline) => (
              <article
                key={discipline.title}
                className="rounded-2xl border border-[color:var(--copper)]/30 bg-[color:var(--obsidian)]/55 p-6"
              >
                <h2 className="font-ritual text-2xl">{discipline.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-[color:var(--mist)]">{discipline.body}</p>
                <div className="mt-5 space-y-3 text-sm leading-relaxed text-[color:var(--mist)]">
                  <p>
                    <span className="text-[color:var(--bone)]">Begin:</span> {discipline.begin}
                  </p>
                  <p>
                    <span className="text-[color:var(--bone)]">Deepen:</span> {discipline.deepen}
                  </p>
                </div>
                <TrackedLink
                  href={discipline.href}
                  location="study:discipline"
                  label={discipline.cta}
                  variant={discipline.title}
                  className="mt-5 inline-flex min-h-[44px] items-center rounded-full border border-[color:var(--copper)]/55 px-4 py-2 text-xs uppercase tracking-[0.24em] transition hover:border-[color:var(--gilt)]"
                >
                  {discipline.cta}
                </TrackedLink>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-2xl border border-[color:var(--copper)]/35 bg-[color:var(--char)]/45 p-6">
            <p className="text-xs uppercase tracking-[0.35em] text-[color:var(--gilt)]">Suggested sequence</p>
            <h2 className="mt-3 font-ritual text-2xl">If you want the clearest progression</h2>
            <ol className="mt-4 space-y-4 text-sm leading-relaxed text-[color:var(--mist)]">
              {pathSequence.map((step, index) => (
                <li
                  key={step.title}
                  className="border-b border-[color:var(--copper)]/15 pb-4 last:border-b-0 last:pb-0"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--gilt)]">
                        Step {index + 1}
                      </p>
                      <h3 className="mt-2 font-ritual text-xl text-[color:var(--bone)]">{step.title}</h3>
                      <p className="mt-2">{step.body}</p>
                    </div>
                    <TrackedLink
                      href={step.href}
                      location="study:sequence"
                      label={`Open ${step.title}`}
                      variant="open"
                      className="shrink-0 text-xs uppercase tracking-[0.24em] text-[color:var(--gilt)] transition hover:text-[color:var(--bone)]"
                    >
                      Open
                    </TrackedLink>
                  </div>
                </li>
              ))}
            </ol>
          </article>

          <article className="rounded-2xl border border-[color:var(--copper)]/25 bg-[color:var(--obsidian)]/50 p-6">
            <p className="text-xs uppercase tracking-[0.35em] text-[color:var(--gilt)]">Use it well</p>
            <h2 className="mt-3 font-ritual text-2xl">A calmer way to move through the site</h2>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-[color:var(--mist)]">
              <li>Read less than you want to, but stay with it longer than is comfortable.</li>
              <li>Let one symbol follow you through the week instead of collecting ten at once.</li>
              <li>Use the journey when the mind is crowded and study when it grows quiet again.</li>
              <li>Keep a simple notebook. The path clarifies when patterns are written down.</li>
              <li>Return often. The work changes because you do.</li>
            </ul>
          </article>
        </section>

        <EmailCtaCard
          eyebrow="Stay Close"
          title="Let the path keep unfolding in your inbox"
          body="Subscribe for the starter guide, weekly letters, and a slower sequence through the disciplines as the library deepens."
          variant="compact"
          primaryLabel="Subscribe on Substack"
          secondaryHref="/start-here"
          secondaryLabel="Return to Start Here"
          tertiaryHref="/journey"
          tertiaryLabel="Open the Journey"
        />
      </div>
    </div>
  );
}
