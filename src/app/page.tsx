import Link from "next/link";
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

      <main className="relative z-10">
        {/* Hero — not scroll-tracked */}
        <section className="min-h-screen px-6 py-24 sm:px-10 lg:px-20">
          <div className="mx-auto flex min-h-[70vh] max-w-5xl flex-col justify-center gap-10">
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.4em] text-[color:var(--mist)]">
              <span className="h-px w-12 bg-[color:var(--copper)]" />
              A Digital Temple
            </div>
            <h1 className="font-ritual text-4xl leading-tight text-[color:var(--bone)] sm:text-6xl lg:text-7xl">
              {hero.title}
            </h1>
            <p className="max-w-2xl text-sm uppercase tracking-[0.2em] sm:tracking-[0.35em] text-[color:var(--gilt)]">
              {hero.subtitle}
            </p>
            <p className="max-w-2xl text-base leading-relaxed text-[color:var(--mist)] sm:text-lg">
              {hero.body[0]}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/great-work"
                className="inline-flex min-h-[44px] items-center rounded-full border border-[color:var(--copper)] px-5 py-3 text-xs uppercase tracking-[0.35em] text-[color:var(--gilt)] transition hover:border-[color:var(--gilt)] hover:text-[color:var(--bone)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-[color:var(--gilt)]"
              >
                Begin the Journey
              </Link>
              <Link
                href="/principles"
                className="inline-flex min-h-[44px] items-center rounded-full border border-[color:var(--copper)] px-5 py-3 text-xs uppercase tracking-[0.35em] text-[color:var(--gilt)] transition hover:border-[color:var(--gilt)] hover:text-[color:var(--bone)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-[color:var(--gilt)]"
              >
                Seven Principles
              </Link>
            </div>
            {/* Scroll indicator */}
            <div className="mt-8 animate-pulse-slow text-center text-xs uppercase tracking-[0.3em] sm:tracking-[0.5em] text-[color:var(--mist)]">
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

        <div className="h-[50vh] sm:h-[70vh]" aria-hidden="true" />
      </main>
    </div>
  );
}
