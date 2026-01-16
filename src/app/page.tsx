import Link from "next/link";
import { RitualCanvas } from "@/components/scene/RitualCanvas";
import { ScrollOrchestrator } from "@/components/ui/ScrollOrchestrator";
import { ChapterSection } from "@/components/ui/ChapterSection";
import { AnnotationBar } from "@/components/ui/AnnotationBar";
import { SigilLoader } from "@/components/ui/SigilLoader";
import { WebGLGuard } from "@/components/ui/WebGLGuard";
import { FallbackEngraving } from "@/components/ui/FallbackEngraving";
import { AudioLayer } from "@/components/ui/AudioLayer";
import { principles } from "@/data/principles";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden text-[color:var(--bone)]">
      <WebGLGuard fallback={<FallbackEngraving />}>
        <RitualCanvas />
      </WebGLGuard>
      <div className="grain-overlay fixed inset-0 z-0 opacity-40" />
      <div className="vellum-overlay fixed inset-0 z-0" />
      <div className="scrim fixed inset-0 z-0" />
      <ScrollOrchestrator />
      <AnnotationBar />
      <SigilLoader />
      <AudioLayer />

      <main className="relative z-10">
        <section className="min-h-screen px-6 py-24 sm:px-10 lg:px-20">
          <div className="mx-auto flex min-h-[70vh] max-w-5xl flex-col justify-center gap-10">
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.4em] text-[color:var(--mist)]">
              <span className="h-px w-12 bg-[color:var(--copper)]" />
              Ritual Interface
            </div>
            <h1 className="font-ritual text-4xl leading-tight text-[color:var(--bone)] sm:text-6xl lg:text-7xl">
              Awareness Paradox
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-[color:var(--mist)] sm:text-lg">
              A digital grimoire of Hermetic law, etched in golden ratios and
              fractal fields. Scroll to reveal the geometry that binds mind to
              cosmos.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.35em] text-[color:var(--gilt)]">
              <Link
                href="/principles"
                className="rounded-full border border-[color:var(--copper)] px-5 py-3 text-xs uppercase tracking-[0.35em] text-[color:var(--gilt)] transition hover:border-[color:var(--gilt)] hover:text-[color:var(--bone)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-[color:var(--gilt)]"
              >
                Seven Principles
              </Link>
              <Link
                href="/ripley-scroll"
                className="rounded-full border border-[color:var(--copper)] px-5 py-3 text-xs uppercase tracking-[0.35em] text-[color:var(--gilt)] transition hover:border-[color:var(--gilt)] hover:text-[color:var(--bone)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-[color:var(--gilt)]"
              >
                Principles in Motion
              </Link>
            </div>
          </div>
        </section>

        {principles.map((chapter, index) => (
          <ChapterSection
            key={chapter.title}
            id={chapter.slug}
            index={index}
            title={chapter.title}
            axiom={chapter.axiom}
            short={chapter.short}
            visual={chapter.visual}
          />
        ))}
        <div className="h-[50vh] sm:h-[70vh]" aria-hidden="true" />
      </main>
    </div>
  );
}
