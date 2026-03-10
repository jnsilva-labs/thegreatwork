import { JsonLd } from "@/components/seo/JsonLd";
import { EmailCtaCard } from "@/components/marketing/EmailCtaCard";
import { NatalChartWidget } from "@/components/astro/NatalChartWidget";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildWebPageSchema } from "@/lib/seo/schema";

const ASTROLOGY_DESCRIPTION =
  "Reflective astrology at Awareness Paradox: a grounded introduction to natal symbolism, the big three, and a live natal oracle for self-inquiry.";

const bigThree = [
  {
    title: "Sun",
    body: "The organizing principle of selfhood, vitality, and what you are learning to embody in full daylight.",
  },
  {
    title: "Moon",
    body: "The inner climate: memory, instinct, emotional patterning, and the forms of safety your nervous system seeks.",
  },
  {
    title: "Rising",
    body: "The threshold where the inner life meets the visible world: tone, orientation, and how experience first enters your field.",
  },
];

const astrologyPromises = [
  "Grounded, symbolic self-observation rather than deterministic forecasting",
  "History, language, and practice held together in one place",
  "A bridge from beginner curiosity into deeper Hermetic and astrological study",
];

const astrologyBoundaries = [
  "Not a claim that the planets control your fate",
  "Not fear-based transit content or prediction theater",
  "Not a replacement for therapy, medical care, or practical decision-making",
];

export const metadata = buildPageMetadata({
  title: "Astrology",
  path: "/astrology",
  description: ASTROLOGY_DESCRIPTION,
  keywords: ["astrology", "natal chart", "big three astrology", "hellenistic astrology", "hermetic astrology"],
});

export default function AstrologyPage() {
  return (
    <div className="min-h-screen px-6 py-24 sm:px-10 lg:px-20">
      <div className="mx-auto max-w-5xl space-y-10">
        <JsonLd
          id="astrology-webpage-schema"
          data={buildWebPageSchema({
            name: "Astrology",
            path: "/astrology",
            description: ASTROLOGY_DESCRIPTION,
          })}
        />
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

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-5">
            <p className="max-w-2xl text-base leading-relaxed text-[color:var(--mist)] sm:text-lg">
              Astrology here is a language of correspondence. It is a way of studying patterns, timing,
              temperament, and symbolic atmosphere without collapsing into fatalism. The chart does not imprison
              the self. It gives the self a map.
            </p>
            <p className="max-w-2xl text-base leading-relaxed text-[color:var(--mist)] sm:text-lg">
              If you are new, begin with the big three and the idea that a natal chart is a symbolic record
              of your first moment in the world. If you already know the language, this section will grow toward
              source-aware interpretation, practical reflection, and a more serious Hermetic frame for chart work.
            </p>
          </div>
          <div className="rounded-2xl border border-[color:var(--copper)]/30 bg-[color:var(--char)]/40 p-6">
            <p className="text-xs uppercase tracking-[0.35em] text-[color:var(--gilt)]">What this section is for</p>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-[color:var(--mist)]">
              {astrologyPromises.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-2xl border border-[color:var(--copper)]/30 bg-[color:var(--char)]/40 p-6">
            <p className="text-xs uppercase tracking-[0.35em] text-[color:var(--gilt)]">Lineage</p>
            <div className="mt-4 space-y-5">
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
          </article>

          <article className="rounded-2xl border border-[color:var(--copper)]/30 bg-[color:var(--obsidian)]/55 p-6">
            <p className="text-xs uppercase tracking-[0.35em] text-[color:var(--gilt)]">What it is not</p>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-[color:var(--mist)]">
              {astrologyBoundaries.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </article>
        </div>

        <section className="space-y-4">
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.4em] text-[color:var(--mist)]">
            <span className="h-px w-12 bg-[color:var(--copper)]" />
            Start with the big three
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {bigThree.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-[color:var(--copper)]/30 bg-[color:var(--char)]/40 p-6"
              >
                <h2 className="font-ritual text-2xl text-[color:var(--bone)]">{item.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-[color:var(--mist)]">{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <div className="grid gap-6 pt-2 lg:grid-cols-[1fr_0.95fr]">
          <article className="rounded-2xl border border-[color:var(--copper)]/30 bg-[color:var(--char)]/45 p-6">
            <p className="text-xs uppercase tracking-[0.35em] text-[color:var(--gilt)]">Sample reading frame</p>
            <h2 className="mt-3 font-ritual text-2xl">What a reading should do</h2>
            <p className="mt-4 text-sm leading-relaxed text-[color:var(--mist)]">
              A useful reading should name tensions, capacities, and rhythms without pretending to close the
              future. It should help you ask better questions: what feels overactive, what feels starved,
              what pattern repeats, and what season of work you are entering now.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[color:var(--mist)]">
              The public natal oracle below is shaped around that standard: less prediction, more orientation;
              less spectacle, more symbolic accuracy.
            </p>
          </article>

          <article className="rounded-2xl border border-[color:var(--copper)]/30 bg-[color:var(--obsidian)]/55 p-5 sm:p-8">
            <p className="text-xs uppercase tracking-[0.4em] text-[color:var(--gilt)]">Public Reading Standard</p>
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-[color:var(--mist)]">
              <p>Birth data is geocoded and converted into time-aware chart data before interpretation begins.</p>
              <p>If your birth time is unknown, houses and rising-based claims are removed on purpose.</p>
              <p>The reading is written as symbolic guidance for reflection, not deterministic prediction.</p>
            </div>
          </article>
        </div>

        <NatalChartWidget />

        <EmailCtaCard
          eyebrow="Astrology Letters"
          title="Stay with the astrology path after the reading"
          body="Start with the free Hermetic guide now, then stay close for reflective astrology notes, chart lessons, and future monthly sky updates as this section grows."
          source="astrology-page"
          interests={["astrology-self-understanding", "beginner-hermetic"]}
          variant="compact"
          primaryLabel="Get the Guide and Astrology Letters"
          ctaNote="Subscribe on Substack for the guide now and future astrology notes as monthly readings and lessons expand."
          alreadySubscribedLabel="Already Subscribed? Open the Guide Link"
          secondaryHref="/start-here"
          secondaryLabel="Start Here"
          tertiaryHref="/study"
          tertiaryLabel="Explore The Path"
        />
      </div>
    </div>
  );
}
