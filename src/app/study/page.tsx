import type { Metadata } from "next";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { EditorialSpread, MarginalNote } from "@/components/editorial";
import { EmailCtaCard } from "@/components/marketing/EmailCtaCard";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getSubstackUrl, isExternalHref } from "@/lib/substack";

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
  const substackUrl = getSubstackUrl();
  const isExternal = isExternalHref(substackUrl);

  return (
    <div className="min-h-screen px-6 py-20 text-[color:var(--bone)] sm:px-10 lg:px-20">
      <div className="mx-auto max-w-6xl space-y-16">
        <header className="grid gap-10 border-b border-[color:var(--copper)]/22 pb-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
          <div className="space-y-5">
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
                className="ritual-link inline-flex min-h-[44px] items-center border border-[color:var(--gilt)]/60 bg-[color:var(--gilt)]/10 px-4 py-2 text-xs uppercase tracking-[0.25em] text-[color:var(--bone)] transition-colors hover:border-[color:var(--gilt)]"
              >
                Start Here
              </TrackedLink>
              <TrackedLink
                href="/journey"
                location="study:header"
                label="Open the Journey"
                variant="secondary"
                className="ritual-link inline-flex min-h-[44px] items-center border border-[color:var(--copper)]/55 px-4 py-2 text-xs uppercase tracking-[0.25em] transition-colors hover:border-[color:var(--gilt)]"
              >
                Open the Journey
              </TrackedLink>
              <TrackedLink
                href={substackUrl}
                location="study:header"
                label="Subscribe on Substack"
                variant="secondary"
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className="ritual-link inline-flex min-h-[44px] items-center border border-[color:var(--copper)]/55 px-4 py-2 text-xs uppercase tracking-[0.25em] transition-colors hover:border-[color:var(--gilt)]"
              >
                Subscribe on Substack
              </TrackedLink>
            </div>
          </div>

          <MarginalNote heading="Reading stance" headingLevel="h2" glyph="◇">
            <p className="mt-3 max-w-md text-sm leading-relaxed text-[color:var(--mist)] sm:text-base">
              Use this map to move more slowly, not faster. The point is not to consume every path, but to find the
              one that is asking for your attention now.
            </p>
          </MarginalNote>
        </header>

        <section className="space-y-8" data-editorial-index="audiences">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[color:var(--gilt)]">Three entry modes</p>
            <h2 className="mt-2 font-ritual text-3xl">One library, three ways to walk it</h2>
          </div>
          <ul aria-label="Three ways to walk the library" className="grid border-y border-[color:var(--copper)]/22 lg:grid-cols-3">
            {audiencePaths.map((path) => (
              <li
                key={path.title}
                className="border-b border-[color:var(--copper)]/18 py-7 last:border-b-0 lg:border-b-0 lg:border-r lg:px-7 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0"
              >
                <p className="text-xs uppercase tracking-[0.35em] text-[color:var(--gilt)]">{path.subtitle}</p>
                <h3 className="mt-4 font-ritual text-3xl">{path.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[color:var(--mist)]">{path.body}</p>
                <p className="mt-4 text-xs uppercase tracking-[0.24em] text-[color:var(--mist)]">
                  {path.rhythm}
                </p>
                <TrackedLink
                  href={path.href}
                  location="study:audience-path"
                  label={path.cta}
                  variant={path.title}
                  className="ritual-link mt-5 inline-flex min-h-[44px] items-center border-t border-[color:var(--copper)]/55 px-1 py-2 text-xs uppercase tracking-[0.24em] transition-colors hover:border-[color:var(--gilt)]"
                >
                  {path.cta}
                </TrackedLink>
              </li>
            ))}
          </ul>
        </section>

        <EditorialSpread
          variant="map"
          eyebrow="Disciplines"
          title="How the traditions fit together"
          marginalia={
            <p>The governing ideas, reflective instruments, and contemplative forms belong to one field of study.</p>
          }
        >
          <ul aria-label="Discipline correspondence map" className="border-t border-[color:var(--copper)]/22">
            {disciplines.map((discipline) => (
              <li
                key={discipline.title}
                className="grid gap-4 border-b border-[color:var(--copper)]/18 py-6 md:grid-cols-[0.72fr_1.28fr]"
              >
                <div>
                  <h3 className="font-ritual text-2xl">{discipline.title}</h3>
                  <TrackedLink
                    href={discipline.href}
                    location="study:discipline"
                    label={discipline.cta}
                    variant={discipline.title}
                    className="ritual-link mt-4 inline-flex min-h-[44px] items-center border-t border-[color:var(--copper)]/55 px-1 py-2 text-xs uppercase tracking-[0.24em] transition-colors hover:border-[color:var(--gilt)]"
                  >
                    {discipline.cta}
                  </TrackedLink>
                </div>
                <div className="space-y-3 text-sm leading-relaxed text-[color:var(--mist)]">
                  <p>{discipline.body}</p>
                  <p>
                    <span className="text-[color:var(--bone)]">Begin:</span> {discipline.begin}
                  </p>
                  <p>
                    <span className="text-[color:var(--bone)]">Deepen:</span> {discipline.deepen}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </EditorialSpread>

        <section className="grid gap-12 border-t border-[color:var(--copper)]/22 pt-10 lg:grid-cols-[1.1fr_0.9fr]">
          <article>
            <p className="text-xs uppercase tracking-[0.35em] text-[color:var(--gilt)]">Suggested sequence</p>
            <h2 className="mt-3 font-ritual text-2xl">If you want the clearest progression</h2>
            <ol aria-label="Suggested study sequence" className="relative mt-6 border-l border-[color:var(--copper)]/28 text-sm leading-relaxed text-[color:var(--mist)]">
              {pathSequence.map((step, index) => (
                <li
                  key={step.title}
                  className="relative border-b border-[color:var(--copper)]/15 py-6 pl-8 first:pt-2 last:border-b-0"
                >
                  <div>
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
                      className="ritual-link mt-4 inline-flex min-h-[44px] items-center border-t border-[color:var(--copper)]/28 px-1 py-2 text-xs uppercase tracking-[0.24em] text-[color:var(--gilt)] transition-colors hover:border-[color:var(--gilt)] hover:text-[color:var(--bone)]"
                    >
                      Open
                    </TrackedLink>
                  </div>
                </li>
              ))}
            </ol>
          </article>

          <article className="border-t border-[color:var(--copper)]/22 pt-6">
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
