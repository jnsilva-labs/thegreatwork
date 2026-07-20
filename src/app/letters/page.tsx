import { TrackedLink } from "@/components/analytics/TrackedLink";
import { MarginalNote } from "@/components/editorial";
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
      <div className="mx-auto max-w-6xl space-y-16">
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

        <header className="grid gap-10 border-b border-[color:var(--copper)]/22 pb-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.4em] text-[color:var(--mist)]">
              Newsletter & Archive
            </p>
            <h1 className="font-ritual text-4xl sm:text-6xl">Weekly Letters</h1>
            <p className="max-w-3xl text-base leading-relaxed text-[color:var(--mist)] sm:text-lg">
              Weekly essays, practices, and guided pathways into Hermetic study and astrology for
              self-understanding. These letters are designed to deepen practice, not just deliver
              content.
            </p>
            <div className="flex flex-wrap gap-3">
              <TrackedLink
                href={SUBSTACK_URL}
                location="letters:header"
                label="Open Substack Archive"
                variant="archive"
                target="_blank"
                rel="noopener noreferrer"
                className="ritual-link inline-flex min-h-[44px] items-center border border-[color:var(--gilt)]/55 bg-[color:var(--gilt)]/10 px-5 py-2 text-xs uppercase tracking-[0.28em] text-[color:var(--bone)] transition-colors hover:border-[color:var(--gilt)]"
              >
                Open Substack Archive
              </TrackedLink>
            </div>
          </div>

          <MarginalNote heading="What they do" headingLevel="h2" glyph="✦">
            <p className="max-w-md">
              The letters are the slowest way through the site. Each one should return you to one practice,
              one page, or one question worth staying with.
            </p>
          </MarginalNote>
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

        <section className="grid gap-10 border-y border-[color:var(--copper)]/22 py-10 lg:grid-cols-[0.9fr_1.1fr]" data-editorial-index="letters">
          <div className="space-y-5">
            <h2 className="font-ritual text-2xl">What the letters cover</h2>
            <ul aria-label="What the letters cover" className="etched-list border-t border-[color:var(--copper)]/18 text-sm leading-relaxed text-[color:var(--mist)]">
              <li className="etched-list__item"><span aria-hidden="true" className="etched-list__marker">I</span><span>Hermetic principles in plain language and real-life application</span></li>
              <li className="etched-list__item"><span aria-hidden="true" className="etched-list__marker">II</span><span>Astrology as reflective self-study (not deterministic forecasting)</span></li>
              <li className="etched-list__item"><span aria-hidden="true" className="etched-list__marker">III</span><span>Meditation and contemplative practice prompts</span></li>
              <li className="etched-list__item"><span aria-hidden="true" className="etched-list__marker">IV</span><span>New site tools, essays, and guided pathways as the project grows</span></li>
            </ul>
            <div className="pt-2">
              <TrackedLink
                href={SUBSTACK_URL}
                location="letters:archive"
                label="Open Substack Archive"
                variant="archive"
                target="_blank"
                rel="noopener noreferrer"
                className="ritual-link inline-flex min-h-[44px] items-center border-t border-[color:var(--copper)]/55 px-1 py-2 text-xs uppercase tracking-[0.28em] text-[color:var(--mist)] transition-colors hover:border-[color:var(--gilt)] hover:text-[color:var(--bone)]"
              >
                Open Substack Archive
              </TrackedLink>
            </div>
          </div>

          <div className="space-y-4 lg:border-l lg:border-[color:var(--copper)]/20 lg:pl-10">
            <h2 className="font-ritual text-2xl">Coming letters</h2>
            <ol aria-label="Coming letters" className="border-t border-[color:var(--copper)]/18">
              {upcomingLetterThemes.map((item) => (
                <li
                  key={item.title}
                  className="grid gap-2 border-b border-[color:var(--copper)]/18 py-5 md:grid-cols-[0.68fr_1.32fr]"
                >
                  <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--gilt)]">
                    {item.format}
                  </p>
                  <div>
                    <h3 className="text-lg text-[color:var(--bone)]">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[color:var(--mist)]">{item.summary}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="border-y border-[color:var(--copper)]/25 py-7">
          <h2 className="font-ritual text-2xl">Where to begin</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <TrackedLink
              href="/start-here"
              location="letters:where-to-begin"
              label="Start Here"
              variant="secondary"
              className="ritual-link inline-flex min-h-[44px] items-center border border-[color:var(--copper)]/55 px-4 py-2 text-xs uppercase tracking-[0.25em] transition-colors hover:border-[color:var(--gilt)]"
            >
              Start Here
            </TrackedLink>
            <TrackedLink
              href="/principles"
              location="letters:where-to-begin"
              label="Hermetic Principles"
              variant="secondary"
              className="ritual-link inline-flex min-h-[44px] items-center border border-[color:var(--copper)]/55 px-4 py-2 text-xs uppercase tracking-[0.25em] transition-colors hover:border-[color:var(--gilt)]"
            >
              Hermetic Principles
            </TrackedLink>
            <TrackedLink
              href="/astrology"
              location="letters:where-to-begin"
              label="Astrology"
              variant="secondary"
              className="ritual-link inline-flex min-h-[44px] items-center border border-[color:var(--copper)]/55 px-4 py-2 text-xs uppercase tracking-[0.25em] transition-colors hover:border-[color:var(--gilt)]"
            >
              Astrology
            </TrackedLink>
          </div>
        </section>
      </div>
    </div>
  );
}
