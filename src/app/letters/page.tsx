import { TrackedLink } from "@/components/analytics/TrackedLink";
import { EmailCtaCard } from "@/components/marketing/EmailCtaCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildCollectionPageSchema, buildWebPageSchema } from "@/lib/seo/schema";
import { getSubstackUrl } from "@/lib/substack";

const LETTERS_DESCRIPTION =
  "Weekly letters from Awareness Paradox: Hermetic principles, astrology for self-understanding, spiritual practice prompts, and guided next steps.";

const SUBSTACK_URL = getSubstackUrl();

const upcomingLetterThemes = [
  {
    title: "Mentalism and the discipline of attention",
    format: "Hermetic principle essay",
    summary:
      "A beginner-friendly explanation of Mentalism as a practice of attention, not just a metaphysical claim.",
  },
  {
    title: "As above, so below in practical self-observation",
    format: "Hermetic + astrology bridge",
    summary:
      "Using correspondence as a lens for pattern recognition without collapsing into fatalism.",
  },
  {
    title: "Saturn as structure, not punishment",
    format: "Astrology self-understanding",
    summary:
      "Reframing Saturn in beginner-safe language tied to responsibility, timing, and boundaries.",
  },
];

export const metadata = buildPageMetadata({
  title: "Weekly Letters",
  path: "/letters",
  description: LETTERS_DESCRIPTION,
  keywords: ["Hermetic newsletter", "astrology newsletter", "Awareness Paradox letters", "spiritual practice newsletter"],
});

export default function LettersPage() {
  return (
    <div className="min-h-screen px-6 py-20 text-[color:var(--bone)] sm:px-10 lg:px-20">
      <div className="mx-auto max-w-5xl space-y-12">
        <JsonLd
          id="letters-webpage-schema"
          data={buildWebPageSchema({
            name: "Weekly Letters",
            path: "/letters",
            description: LETTERS_DESCRIPTION,
          })}
        />
        <JsonLd
          id="letters-collection-schema"
          data={buildCollectionPageSchema({
            name: "Awareness Paradox Weekly Letters",
            path: "/letters",
            description: LETTERS_DESCRIPTION,
            itemPaths: ["/start-here", "/guides/hermetic-principles-starter-guide", "/principles"],
          })}
        />

        <header className="space-y-4">
          <p className="text-xs uppercase tracking-[0.4em] text-[color:var(--mist)]">
            Newsletter & Archive
          </p>
          <h1 className="font-ritual text-4xl sm:text-6xl">Weekly Letters</h1>
          <p className="max-w-3xl text-base leading-relaxed text-[color:var(--mist)] sm:text-lg">
            Weekly essays, practices, and guided pathways into Hermetic study and astrology for
            self-understanding. These letters are designed to deepen practice, not just deliver
            content.
          </p>
        </header>

        <EmailCtaCard
          title="Join the Weekly Letters"
          body="Subscribe for new essays, reflection prompts, and practical next steps. Start with the free 7 Hermetic Principles Starter Guide."
          source="letters-page"
          interests={["beginner-hermetic"]}
          variant="compact"
          secondaryHref="/guides/hermetic-principles-starter-guide"
          secondaryLabel="Free Starter Guide"
          tertiaryHref=""
          tertiaryLabel=""
        />

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4 rounded-2xl border border-[color:var(--copper)]/30 bg-[color:var(--char)]/45 p-6">
            <h2 className="font-ritual text-2xl">What the letters cover</h2>
            <ul className="space-y-3 text-sm leading-relaxed text-[color:var(--mist)]">
              <li>— Hermetic principles in plain language and real-life application</li>
              <li>— Astrology as reflective self-study (not deterministic forecasting)</li>
              <li>— Meditation and contemplative practice prompts</li>
              <li>— New site tools, essays, and guided pathways as the project grows</li>
            </ul>
            <div className="pt-2">
              <TrackedLink
                href={SUBSTACK_URL}
                location="letters:archive"
                label="Open Substack Archive"
                variant="archive"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center rounded-full border border-[color:var(--copper)]/55 px-5 py-2 text-xs uppercase tracking-[0.28em] text-[color:var(--mist)] transition hover:border-[color:var(--gilt)] hover:text-[color:var(--bone)]"
              >
                Open Substack Archive
              </TrackedLink>
            </div>
          </div>

          <div className="space-y-4 rounded-2xl border border-[color:var(--copper)]/30 bg-[color:var(--obsidian)]/50 p-6">
            <h2 className="font-ritual text-2xl">Coming letters</h2>
            <div className="space-y-4">
              {upcomingLetterThemes.map((item) => (
                <article
                  key={item.title}
                  className="rounded-xl border border-[color:var(--copper)]/20 bg-[color:var(--char)]/35 p-4"
                >
                  <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--gilt)]">
                    {item.format}
                  </p>
                  <h3 className="mt-2 text-lg text-[color:var(--bone)]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[color:var(--mist)]">
                    {item.summary}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-[color:var(--copper)]/25 bg-[color:var(--char)]/35 p-6">
          <h2 className="font-ritual text-2xl">Where to begin</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <TrackedLink
              href="/start-here"
              location="letters:where-to-begin"
              label="Start Here"
              variant="secondary"
              className="inline-flex min-h-[44px] items-center rounded-full border border-[color:var(--copper)]/55 px-4 py-2 text-xs uppercase tracking-[0.25em] transition hover:border-[color:var(--gilt)]"
            >
              Start Here
            </TrackedLink>
            <TrackedLink
              href="/principles"
              location="letters:where-to-begin"
              label="Hermetic Principles"
              variant="secondary"
              className="inline-flex min-h-[44px] items-center rounded-full border border-[color:var(--copper)]/55 px-4 py-2 text-xs uppercase tracking-[0.25em] transition hover:border-[color:var(--gilt)]"
            >
              Hermetic Principles
            </TrackedLink>
            <TrackedLink
              href="/astrology"
              location="letters:where-to-begin"
              label="Astrology"
              variant="secondary"
              className="inline-flex min-h-[44px] items-center rounded-full border border-[color:var(--copper)]/55 px-4 py-2 text-xs uppercase tracking-[0.25em] transition hover:border-[color:var(--gilt)]"
            >
              Astrology
            </TrackedLink>
          </div>
        </section>
      </div>
    </div>
  );
}
