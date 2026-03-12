import { JsonLd } from "@/components/seo/JsonLd";
import { EmailCtaCard } from "@/components/marketing/EmailCtaCard";
import { RitualCanvas } from "@/components/scene/RitualCanvas";
import { ScrollOrchestrator } from "@/components/ui/ScrollOrchestrator";
import { HomepageSection } from "@/components/ui/HomepageSection";
import { AnnotationBar } from "@/components/ui/AnnotationBar";
import { WebGLGuard } from "@/components/ui/WebGLGuard";
import { FallbackEngraving } from "@/components/ui/FallbackEngraving";
import { AudioLayer } from "@/components/ui/AudioLayer";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { HomepageHero } from "@/components/ui/HomepageHero";
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
    symbol: "◇",
    accent: "teal",
  },
  {
    title: "I Want a Reading",
    body: "Enter through direct experience with tarot or astrology and let the symbolic language meet you through a live reading.",
    href: "/astrology",
    label: "Get a Reading",
    symbol: "◎",
    accent: "gold",
  },
  {
    title: "I Want Serious Study",
    body: "Follow a clearer map through the principles, alchemy, tarot, astrology, and source-grounded study without losing the thread.",
    href: "/study",
    label: "Walk The Path",
    symbol: "⟐",
    accent: "bone",
  },
] as const;

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
        <HomepageHero
          title={hero.title}
          subtitle={hero.subtitle ?? ""}
          body={hero.body[0] ?? ""}
          pathDoors={[...pathDoors]}
        />

        {/* Tracked sections: paradox → alchemy → divination → astrology → geometry → principles → community */}
        {trackedSections.map((section, index) => (
          <HomepageSection
            key={section.id}
            id={section.id}
            index={index}
            sectionType={section.sectionType}
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
