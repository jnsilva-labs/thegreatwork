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
    <div className="min-h-screen px-6 py-18 sm:px-10 sm:py-22 lg:px-20">
      <div className="mx-auto max-w-5xl space-y-14">
        <JsonLd
          id="astrology-webpage-schema"
          data={buildWebPageSchema({
            name: "Astrology",
            path: "/astrology",
            description: ASTROLOGY_DESCRIPTION,
          })}
        />
        <div className="space-y-5">
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.4em] text-[color:var(--mist)]">
            <span className="h-px w-12 bg-[color:var(--copper)]" />
            The Cosmic Sympathy
          </div>

          <h1 className="max-w-4xl font-ritual text-4xl leading-tight text-[color:var(--bone)] sm:text-5xl lg:text-6xl">
            As Above, So Below
          </h1>

          <p className="text-sm uppercase tracking-[0.2em] text-[color:var(--gilt)] sm:tracking-[0.35em]">
            That which is below is from that which is above
          </p>
        </div>

        <section className="space-y-8">
          <div className="grid gap-8 lg:grid-cols-[1.16fr_0.84fr] lg:items-start">
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

            <div className="space-y-4 border-t border-[color:var(--copper)]/18 pt-4 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
              <p className="text-xs uppercase tracking-[0.35em] text-[color:var(--gilt)]">Orientation</p>
              <div className="space-y-4 text-sm leading-relaxed text-[color:var(--mist)]">
                <p>
                  Grounded, symbolic self-observation rather than deterministic forecasting. History,
                  language, and practice held together in one place.
                </p>
                <p>
                  Not fear-based transit content, prediction theater, or a replacement for therapy,
                  medical care, or practical decision-making.
                </p>
              </div>
            </div>
          </div>

          <p className="max-w-3xl border-l border-[color:var(--copper)]/24 pl-5 font-ritual text-2xl leading-tight text-[color:var(--bone)] sm:text-3xl">
            A chart is not a cage. It is a sky-written way of noticing how you enter time.
          </p>

          <div className="grid gap-6 text-sm leading-relaxed text-[color:var(--mist)] md:grid-cols-2">
            <div className="space-y-3 border-t border-[color:var(--copper)]/14 pt-4">
              <p className="text-xs uppercase tracking-[0.35em] text-[color:var(--gilt)]">What this section is for</p>
              <ul className="space-y-2">
                {astrologyPromises.map((item) => (
                  <li key={item}>- {item}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-3 border-t border-[color:var(--copper)]/14 pt-4">
              <p className="text-xs uppercase tracking-[0.35em] text-[color:var(--gilt)]">What it is not</p>
              <ul className="space-y-2">
                {astrologyBoundaries.map((item) => (
                  <li key={item}>- {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.4em] text-[color:var(--mist)]">
            <span className="h-px w-12 bg-[color:var(--copper)]" />
            The big three
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {bigThree.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-[color:var(--copper)]/18 bg-[color:var(--char)]/16 p-5"
              >
                <h2 className="font-ritual text-2xl text-[color:var(--bone)]">{item.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-[color:var(--mist)]">{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
          <article className="space-y-4 border-t border-[color:var(--copper)]/16 pt-5">
            <p className="text-xs uppercase tracking-[0.35em] text-[color:var(--gilt)]">Lineage</p>
            <div className="space-y-4 text-sm leading-relaxed text-[color:var(--mist)] sm:text-base">
              <p>
                Astrology began as careful sky watching in ancient Mesopotamia, where priests recorded eclipses,
                planetary motions, and unusual alignments as signs tied to seasons, kingship, and civic life.
                In Egypt, temple astronomer-priests refined calendar systems and star lore, then Greek thinkers
                gathered these traditions into a more systematic language of zodiac signs, aspects, and houses.
              </p>
              <p>
                By the Hellenistic era, astrology became part of natural philosophy, and Ptolemy treated it as the
                study of celestial influence within an ordered cosmos. Through Arabic scholarship and the Latin West,
                those methods were preserved, translated, and expanded across the medieval and Renaissance periods,
                shaping medicine, agriculture, court timing, and personal natal practice for centuries.
              </p>
            </div>
          </article>

          <article className="space-y-4 border-t border-[color:var(--copper)]/16 pt-5">
            <p className="text-xs uppercase tracking-[0.35em] text-[color:var(--gilt)]">Reading standard</p>
            <div className="space-y-4 text-sm leading-relaxed text-[color:var(--mist)]">
              <p>
                A useful reading should name tensions, capacities, and rhythms without pretending to close the
                future. It should help you ask better questions about pattern, pressure, and timing.
              </p>
              <p>
                Birth data is geocoded and converted into time-aware chart data before interpretation begins.
                If your birth time is unknown, houses and rising-based claims are removed on purpose.
              </p>
              <p>
                The public natal oracle below is shaped around that standard: less prediction, more orientation;
                less spectacle, more symbolic accuracy.
              </p>
            </div>
          </article>
        </section>
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
