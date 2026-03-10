import type { Metadata } from "next";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { EmailCtaCard } from "@/components/marketing/EmailCtaCard";
import { getSubstackUrl, isExternalHref } from "@/lib/substack";

export const metadata: Metadata = {
  title: "Start Here | Awareness Paradox",
  description:
    "A guided first path into Awareness Paradox: foundations, tarot, astrology, contemplative practice, and the next pages to study.",
};

const firstWeekSteps = [
  "Download the Starter Guide and read it once without trying to master everything.",
  "Choose one Hermetic principle and watch for it in daily life for the next 24 hours.",
  "Pull a tarot card and write down what it reveals about your present state.",
  "Read the astrology bridge page and learn the difference between your Sun, Moon, and Rising signs.",
  "Return to one practice or one essay that still feels alive after the first pass.",
];

const tracks = [
  {
    title: "Hermetic Foundations",
    subtitle: "Begin now",
    body: "Start with the core map first. Read the guide slowly, then move through one principle at a time with history, language, and practice in view.",
    href: "/principles",
    cta: "Start with the Principles",
  },
  {
    title: "Tarot for Self-Inquiry",
    subtitle: "Experience first",
    body: "Use the cards as mirrors for attention, shadow work, and practical reflection without fortune-telling claims.",
    href: "/tarot",
    cta: "Open Tarot",
  },
  {
    title: "Astrology for Self-Understanding",
    subtitle: "Bridge page",
    body: "Begin with the big three, natal symbolism, and a grounded explanation of what astrology means here.",
    href: "/astrology",
    cta: "Explore Astrology",
  },
  {
    title: "Meditation & Practice",
    subtitle: "Practice path",
    body: "Use the visual journey and reflective rhythm pages to turn symbolic ideas into direct experience.",
    href: "/journey",
    cta: "Open the Journey",
  },
];

const readingOrder = [
  { title: "The Seven Hermetic Principles", href: "/principles" },
  { title: "The Great Work", href: "/great-work" },
  { title: "Tarot Alchemy", href: "/tarot" },
  { title: "Astrology", href: "/astrology" },
  { title: "Sacred Geometry", href: "/gallery" },
];

export default function StartHerePage() {
  const substackUrl = getSubstackUrl();
  const isExternal = isExternalHref(substackUrl);

  return (
    <div className="min-h-screen px-6 py-20 text-[color:var(--bone)] sm:px-10 lg:px-20">
      <div className="mx-auto max-w-5xl space-y-10">
        <header className="space-y-5">
          <p className="text-xs uppercase tracking-[0.4em] text-[color:var(--mist)]">Orientation</p>
          <h1 className="font-ritual text-4xl sm:text-6xl">Start Here</h1>
          <p className="max-w-3xl text-base leading-relaxed text-[color:var(--mist)] sm:text-lg">
            Welcome to Awareness Paradox. This page is the clearest first path through the library:
            foundations, direct experience, symbolic study, and the pages most worth your attention first.
          </p>
          <TrackedLink
            href="/study"
            location="start-here:header"
            label="See The Full Path"
            variant="primary"
            className="inline-flex min-h-[44px] items-center rounded-full border border-[color:var(--copper)]/55 px-4 py-2 text-xs uppercase tracking-[0.24em] transition hover:border-[color:var(--gilt)]"
          >
            See The Full Path
          </TrackedLink>
        </header>

        <section className="rounded-2xl border border-[color:var(--copper)]/35 bg-[color:var(--char)]/50 p-6 sm:p-8">
          <h2 className="font-ritual text-2xl">Your first week</h2>
          <ol className="mt-4 space-y-3 text-sm leading-relaxed text-[color:var(--mist)] sm:text-base">
            {firstWeekSteps.map((step, index) => (
              <li key={step}>
                {index + 1}. {step}
              </li>
            ))}
          </ol>
        </section>

        <section className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[color:var(--gilt)]">Choose your first door</p>
            <h2 className="mt-2 font-ritual text-3xl">Four ways into the work</h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
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
                  <TrackedLink
                    href={track.href}
                    location="start-here:track"
                    label={track.cta}
                    variant={track.title}
                    className="inline-flex min-h-[44px] items-center rounded-full border border-[color:var(--copper)]/55 px-4 py-2 text-xs uppercase tracking-[0.25em] transition hover:border-[color:var(--gilt)]"
                  >
                    {track.cta}
                  </TrackedLink>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
          <article className="rounded-2xl border border-[color:var(--copper)]/35 bg-[color:var(--char)]/45 p-6">
            <p className="text-xs uppercase tracking-[0.35em] text-[color:var(--gilt)]">Reading order</p>
            <h2 className="mt-3 font-ritual text-2xl">If you want the clearest path</h2>
            <ol className="mt-4 space-y-3 text-sm leading-relaxed text-[color:var(--mist)]">
              {readingOrder.map((entry, index) => (
                <li key={entry.href} className="flex items-start justify-between gap-4 border-b border-[color:var(--copper)]/15 pb-3 last:border-b-0 last:pb-0">
                  <span>
                    {index + 1}. {entry.title}
                  </span>
                  <TrackedLink
                    href={entry.href}
                    location="start-here:reading-order"
                    label={`Open ${entry.title}`}
                    variant="open"
                    className="text-xs uppercase tracking-[0.24em] text-[color:var(--gilt)] transition hover:text-[color:var(--bone)]"
                  >
                    Open
                  </TrackedLink>
                </li>
              ))}
            </ol>
          </article>

          <article className="rounded-2xl border border-[color:var(--copper)]/25 bg-[color:var(--obsidian)]/50 p-6">
            <p className="text-xs uppercase tracking-[0.35em] text-[color:var(--gilt)]">Simple rhythm</p>
            <h2 className="mt-3 font-ritual text-2xl">A weekly way to use the site</h2>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-[color:var(--mist)]">
              <li>Read one principle or essay slowly.</li>
              <li>Pull one tarot card and journal what it mirrors back.</li>
              <li>Study one astrological symbol or placement.</li>
              <li>Return to the journey or geometry pages for contemplative focus.</li>
              <li>Stay with one insight long enough for it to become practice.</li>
            </ul>
          </article>
        </section>

        <EmailCtaCard
          eyebrow="Weekly Guidance"
          title="Receive the starter guide and the next path"
          body="Subscribe for the guide, the weekly letters, and a clearer sequence into tarot, astrology, and the deeper study pages."
          variant="compact"
          primaryLabel="Subscribe on Substack"
          ctaNote="Email is the simplest way to stay close while the library grows. The starter guide arrives first, and the weekly letters carry the next steps."
          secondaryHref="/letters"
          secondaryLabel="Read the Letters"
          tertiaryHref="/guides/hermetic-principles-starter-guide"
          tertiaryLabel="Preview the Guide"
        />

        <section className="rounded-2xl border border-[color:var(--copper)]/25 bg-[color:var(--obsidian)]/50 p-6">
          <h2 className="font-ritual text-2xl">Keep Going</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <TrackedLink
              href="/great-work"
              location="start-here:keep-going"
              label="Enter The Great Work"
              variant="keep-going"
              className="inline-flex min-h-[44px] items-center rounded-full border border-[color:var(--copper)]/55 px-4 py-2 text-xs uppercase tracking-[0.25em] transition hover:border-[color:var(--gilt)]"
            >
              Enter The Great Work
            </TrackedLink>
            <TrackedLink
              href="/journey"
              location="start-here:keep-going"
              label="Practice Journey"
              variant="keep-going"
              className="inline-flex min-h-[44px] items-center rounded-full border border-[color:var(--copper)]/55 px-4 py-2 text-xs uppercase tracking-[0.25em] transition hover:border-[color:var(--gilt)]"
            >
              Practice Journey
            </TrackedLink>
            <TrackedLink
              href="/study"
              location="start-here:keep-going"
              label="Explore The Path"
              variant="keep-going"
              className="inline-flex min-h-[44px] items-center rounded-full border border-[color:var(--copper)]/55 px-4 py-2 text-xs uppercase tracking-[0.25em] transition hover:border-[color:var(--gilt)]"
            >
              Explore The Path
            </TrackedLink>
            <TrackedLink
              href={substackUrl}
              location="start-here:keep-going"
              label="Subscribe on Substack"
              variant="keep-going-primary"
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer" : undefined}
              className="inline-flex min-h-[44px] items-center rounded-full border border-[color:var(--gilt)]/60 bg-[color:var(--gilt)]/15 px-4 py-2 text-xs uppercase tracking-[0.25em] text-[color:var(--bone)] transition hover:border-[color:var(--gilt)]"
            >
              Subscribe on Substack
            </TrackedLink>
          </div>
        </section>
      </div>
    </div>
  );
}
