import { TrackedLink } from "@/components/analytics/TrackedLink";
import { JsonLd } from "@/components/seo/JsonLd";
import { EmailCtaCard } from "@/components/marketing/EmailCtaCard";
import { RitualCanvas } from "@/components/scene/RitualCanvas";
import { ScrollOrchestrator } from "@/components/ui/ScrollOrchestrator";
import { HomepageSection } from "@/components/ui/HomepageSection";
import { AnnotationBar } from "@/components/ui/AnnotationBar";
import { SigilLoader } from "@/components/ui/SigilLoader";
import { WebGLGuard } from "@/components/ui/WebGLGuard";
import { FallbackEngraving } from "@/components/ui/FallbackEngraving";
import { AudioLayer } from "@/components/ui/AudioLayer";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { homepageSections, homepageSlugs, trackedSections } from "@/data/homepage";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildWebPageSchema } from "@/lib/seo/schema";

const HOME_DESCRIPTION =
  "A living archive of alchemy, tarot, astrology, sacred geometry, and Hermetic principles for reflective self-study and practical inner work.";

const pathDoors = [
  {
    title: "I'm New Here",
    body: "Start with a clear orientation, the Hermetic starter path, and the first practices that make the library usable.",
    href: "/start-here",
    label: "Begin Your Initiation",
  },
  {
    title: "I Want a Reading",
    body: "Enter through direct experience with tarot now, and astrology as it opens to the public.",
    href: "/tarot",
    label: "Get a Reading",
  },
  {
    title: "I Want Serious Study",
    body: "Follow a clearer map through the principles, alchemy, tarot, astrology, and source-grounded study without losing the thread.",
    href: "/study",
    label: "Walk The Path",
  },
];

export const metadata = buildPageMetadata({
  path: "/",
  description: HOME_DESCRIPTION,
  keywords: [
    "hermetic principles",
    "alchemy",
    "tarot",
    "astrology",
    "sacred geometry",
    "esoteric studies",
  ],
});

export default function Home() {
  const hero = homepageSections[0];

  return (
    <div className="relative min-h-screen overflow-hidden text-[color:var(--bone)]">
      <WebGLGuard fallback={<FallbackEngraving />}>
        <RitualCanvas />
      </WebGLGuard>
      <div className="grain-overlay fixed inset-0 z-0 opacity-40" />
      <div className="vellum-overlay fixed inset-0 z-0" />
      <div className="scrim fixed inset-0 z-0" />
      <ScrollOrchestrator slugs={homepageSlugs} />
      <AnnotationBar />
      <SigilLoader />
      <AudioLayer />
      <JsonLd
        id="home-webpage-schema"
        data={buildWebPageSchema({
          name: "Awareness Paradox",
          path: "/",
          description: HOME_DESCRIPTION,
        })}
      />

      <main className="relative z-10">
        {/* Hero — not scroll-tracked */}
        <section className="min-h-screen px-6 py-24 sm:px-10 lg:px-20">
          <div className="mx-auto flex min-h-[78vh] max-w-6xl flex-col justify-center gap-12">
            <div className="grid gap-10 lg:grid-cols-[1.12fr_0.88fr] lg:items-start">
              <div className="space-y-7">
                <div className="flex items-center gap-3 text-xs uppercase tracking-[0.4em] text-[color:var(--mist)]">
                  <span className="h-px w-12 bg-[color:var(--copper)]" />
                  A Digital Temple
                </div>
                <h1 className="font-ritual text-5xl leading-[0.94] text-[color:var(--bone)] sm:text-6xl lg:text-8xl">
                  {hero.title}
                </h1>
                <p className="max-w-2xl text-sm uppercase tracking-[0.24em] sm:tracking-[0.35em] text-[color:var(--gilt)]">
                  {hero.subtitle}
                </p>
                <p className="max-w-2xl text-base leading-relaxed text-[color:var(--mist)] sm:text-lg">
                  {hero.body[0]}
                </p>
                <div className="editorial-panel max-w-3xl rounded-[2rem] p-6 sm:p-7">
                  <p className="editorial-quote max-w-2xl text-[color:var(--bone)]">
                    You are already made of what you seek.
                  </p>
                  <p className="mt-5 max-w-2xl text-sm uppercase tracking-[0.22em] text-[color:var(--mist)] sm:tracking-[0.3em]">
                    For the spiritually curious, the disciplined seeker, and the serious student of the esoteric arts.
                  </p>
                </div>
              </div>

              <div className="space-y-5 lg:pt-10">
                <div className="editorial-panel rounded-[2rem] p-6">
                  <p className="text-xs uppercase tracking-[0.35em] text-[color:var(--gilt)]">Opening invocation</p>
                  <p className="mt-4 text-sm leading-relaxed text-[color:var(--mist)] sm:text-base">
                    Enter as you would enter a quiet library, a workshop, and a mirror at once. The archive opens by practice, not by ornament.
                  </p>
                </div>
                <div className="grid gap-4">
                  {pathDoors.map((door) => (
                    <article
                      key={door.title}
                      className="editorial-panel rounded-[1.8rem] p-5 backdrop-blur-sm"
                    >
                      <h2 className="font-ritual text-2xl text-[color:var(--bone)]">
                        {door.title}
                      </h2>
                      <p className="mt-3 text-sm leading-relaxed text-[color:var(--mist)]">
                        {door.body}
                      </p>
                      <TrackedLink
                        href={door.href}
                        location="home:hero-door"
                        label={door.label}
                        variant={door.title}
                        className="mt-5 inline-flex min-h-[44px] items-center rounded-full border border-[color:var(--copper)] px-5 py-3 text-xs uppercase tracking-[0.3em] text-[color:var(--gilt)] transition hover:border-[color:var(--gilt)] hover:text-[color:var(--bone)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-[color:var(--gilt)]"
                      >
                        {door.label}
                      </TrackedLink>
                    </article>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <TrackedLink
                href="/study"
                location="home:hero-secondary"
                label="Explore The Path"
                variant="secondary"
                className="inline-flex min-h-[44px] items-center rounded-full border border-[color:var(--gilt)]/60 bg-[color:var(--gilt)]/10 px-4 py-2 text-xs uppercase tracking-[0.26em] text-[color:var(--bone)] transition hover:border-[color:var(--gilt)]"
              >
                Explore The Path
              </TrackedLink>
              <TrackedLink
                href="/letters"
                location="home:hero-secondary"
                label="Read the Letters"
                variant="secondary"
                className="inline-flex min-h-[44px] items-center rounded-full border border-[color:var(--copper)]/55 px-4 py-2 text-xs uppercase tracking-[0.26em] transition hover:border-[color:var(--gilt)]"
              >
                Read the Letters
              </TrackedLink>
              <p className="ml-auto hidden text-xs uppercase tracking-[0.34em] text-[color:var(--mist)] lg:block">
                Scroll to explore
              </p>
            </div>

            <div className="animate-pulse-slow text-center text-xs uppercase tracking-[0.3em] sm:tracking-[0.5em] text-[color:var(--mist)] lg:hidden">
              Scroll to explore
            </div>
          </div>
        </section>

        {/* Tracked sections: paradox → alchemy → divination → astrology → geometry → principles → community */}
        {trackedSections.map((section, index) => (
          <HomepageSection
            key={section.id}
            id={section.id}
            index={index}
            title={section.title}
            subtitle={section.subtitle}
            body={section.body}
            cta={section.cta}
            items={section.items}
          >
            {section.sectionType === "community" && (
              <SocialLinks variant="prominent" />
            )}
          </HomepageSection>
        ))}

        <section className="px-6 py-12 sm:px-10 lg:px-20">
          <div className="mx-auto max-w-5xl">
            <EmailCtaCard
              eyebrow="Seeker Path"
              title="Begin with the 7 Hermetic Principles Starter Guide"
              body="A beginner-friendly entry into Hermetic study, practical reflection prompts, and a guided next step into tarot, astrology, and the wider Awareness Paradox library."
              source="homepage"
              interests={["beginner-hermetic"]}
              primaryLabel="Get the Starter Guide"
              ctaNote="Subscribe on Substack and the guide link arrives through the welcome sequence with your next steps."
              alreadySubscribedLabel="Already Subscribed? Open the Guide Link"
              secondaryHref="/start-here"
              secondaryLabel="Start Here"
              tertiaryHref="/study"
              tertiaryLabel="Explore The Path"
            />
          </div>
        </section>

        <div className="h-[50vh] sm:h-[70vh]" aria-hidden="true" />
      </main>
    </div>
  );
}
