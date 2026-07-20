import { CelestialOrientation } from "@/components/astro/CelestialOrientation";
import { NatalChartWidget } from "@/components/astro/NatalChartWidget";
import { EmailCtaCard } from "@/components/marketing/EmailCtaCard";
import { EtchedList, MarginalNote, RitualLink } from "@/components/editorial";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildWebPageSchema } from "@/lib/seo/schema";

const ASTROLOGY_DESCRIPTION =
  "Reflective astrology at Awareness Paradox: a grounded introduction to natal symbolism, the big three, and a live natal oracle for self-inquiry.";

const bigThree = [
  {
    id: "sun",
    title: "Sun",
    glyph: "☉",
    body: "The organizing principle of selfhood, vitality, and what you are learning to embody in full daylight.",
  },
  {
    id: "moon",
    title: "Moon",
    glyph: "☽",
    body: "The inner climate: memory, instinct, emotional patterning, and the forms of safety your nervous system seeks.",
  },
  {
    id: "rising",
    title: "Rising",
    glyph: "Asc",
    body: "The threshold where the inner life meets the visible world: tone, orientation, and how experience first enters your field.",
  },
];

const astrologyPromises = [
  { id: "symbol", title: "Symbol before prediction", body: "Grounded self-observation rather than deterministic forecasting." },
  { id: "lineage", title: "Lineage with context", body: "History, language, and practice held together in one place." },
  { id: "practice", title: "Practice after insight", body: "A bridge from beginner curiosity into deeper Hermetic and astrological study." },
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
      <div className="mx-auto max-w-6xl space-y-20">
        <JsonLd
          id="astrology-webpage-schema"
          data={buildWebPageSchema({ name: "Astrology", path: "/astrology", description: ASTROLOGY_DESCRIPTION })}
        />

        <header className="grid gap-8 border-b border-[color:var(--copper)]/28 pb-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(15rem,0.75fr)] lg:items-end">
          <div className="space-y-5">
            <p className="type-eyebrow text-[color:var(--mist)]">The Cosmic Sympathy</p>
            <h1 className="max-w-4xl font-ritual text-5xl leading-[0.96] text-[color:var(--bone)] sm:text-6xl lg:text-7xl">
              As Above,<br />So Below
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-[color:var(--mist)]">
              Astrology is a language of correspondence: a way of noticing temperament, timing, and symbolic atmosphere without surrendering choice.
            </p>
          </div>
          <div className="space-y-5 border-t border-[color:var(--copper)]/28 pt-5 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
            <p className="font-ritual text-2xl leading-tight text-[color:var(--bone)]">
              A chart is not a cage. It is a sky-written way of noticing how you enter time.
            </p>
            <RitualLink href="#natal-widget" location="astrology:intro" label="Create your natal chart">
              Create your natal chart
            </RitualLink>
          </div>
        </header>

        <CelestialOrientation />

        <section aria-labelledby="big-three-title" className="space-y-7">
          <div className="max-w-2xl space-y-3">
            <p className="type-eyebrow text-[color:var(--gilt)]">First coordinates</p>
            <h2 id="big-three-title" className="font-ritual text-4xl text-[color:var(--bone)] sm:text-5xl">The big three</h2>
            <p className="text-base leading-relaxed text-[color:var(--mist)]">
              Begin with three lights: the center you grow toward, the climate you carry, and the threshold through which the world first meets you.
            </p>
          </div>
          <div className="grid border-y border-[color:var(--copper)]/32 md:grid-cols-3">
            {bigThree.map((item, index) => (
              <article key={item.id} className="relative border-b border-[color:var(--copper)]/24 py-7 md:border-b-0 md:border-l md:px-7 md:first:border-l-0">
                <span className="font-ritual text-3xl text-[color:var(--gilt)]" aria-hidden="true">{item.glyph}</span>
                <p className="mt-8 text-xs uppercase tracking-[0.12em] text-[color:var(--mist)]">Coordinate {String(index + 1).padStart(2, "0")}</p>
                <h3 className="mt-2 font-ritual text-3xl text-[color:var(--bone)]">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[color:var(--mist)]">{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(15rem,0.44fr)]">
          <div className="space-y-5 border-t border-[color:var(--copper)]/28 pt-6">
            <p className="type-eyebrow text-[color:var(--gilt)]">A measured lineage</p>
            <h2 className="font-ritual text-3xl text-[color:var(--bone)] sm:text-4xl">From careful sky watching to a reflective practice</h2>
            <div className="max-w-3xl columns-1 gap-8 space-y-4 text-base leading-relaxed text-[color:var(--mist)] md:columns-2">
              <p>Astrology began as careful sky watching in ancient Mesopotamia. Egyptian, Greek, Arabic, and later European scholars refined its calendars, geometry, signs, aspects, and houses.</p>
              <p>Here that lineage is treated as symbolic craft, not proof that planets command the future. A useful reading names tensions, capacities, and rhythms while leaving the life in your hands.</p>
            </div>
          </div>
          <div className="space-y-7">
            <EtchedList items={astrologyPromises} marker="numeral" headingLevel="h3" />
            <MarginalNote heading="Reading boundary" headingLevel="h3">
              This is not fear-based transit theater or a replacement for therapy, medical care, or practical judgment.
            </MarginalNote>
          </div>
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
