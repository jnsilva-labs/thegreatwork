import Link from "next/link";
import type { CSSProperties } from "react";
import { EmailCtaCard } from "@/components/marketing/EmailCtaCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { principles } from "@/data/principles";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildCollectionPageSchema } from "@/lib/seo/schema";

const PRINCIPLES_DESCRIPTION =
  "Study the seven Hermetic principles in canonical order, with axioms, full explanations, key ideas, and contemplative practices on one continuous page.";

const romanNumerals = ["I", "II", "III", "IV", "V", "VI", "VII"];
const principleAccents = [
  {
    accent: "rgba(43, 111, 106, 0.74)",
    wash: "rgba(43, 111, 106, 0.08)",
  },
  {
    accent: "rgba(184, 155, 94, 0.82)",
    wash: "rgba(184, 155, 94, 0.08)",
  },
  {
    accent: "rgba(118, 137, 167, 0.7)",
    wash: "rgba(118, 137, 167, 0.08)",
  },
  {
    accent: "rgba(214, 198, 165, 0.7)",
    wash: "rgba(214, 198, 165, 0.08)",
  },
  {
    accent: "rgba(126, 107, 160, 0.72)",
    wash: "rgba(126, 107, 160, 0.08)",
  },
  {
    accent: "rgba(173, 124, 92, 0.76)",
    wash: "rgba(173, 124, 92, 0.08)",
  },
  {
    accent: "rgba(110, 147, 132, 0.74)",
    wash: "rgba(110, 147, 132, 0.08)",
  },
] as const;

export const metadata = buildPageMetadata({
  title: "Hermetic Principles",
  path: "/principles",
  description: PRINCIPLES_DESCRIPTION,
  keywords: [
    "Hermetic principles",
    "Kybalion",
    "mentalism",
    "correspondence",
    "esoteric philosophy",
  ],
});

export default function PrinciplesIndexPage() {
  return (
    <div className="min-h-screen px-6 py-20 text-[color:var(--bone)] sm:px-10 lg:px-20">
      <div className="mx-auto max-w-6xl space-y-14">
        <JsonLd
          id="principles-collection-schema"
          data={buildCollectionPageSchema({
            name: "Hermetic Principles Index",
            path: "/principles",
            description: PRINCIPLES_DESCRIPTION,
            itemPaths: principles.map((principle) => `/principles/${principle.slug}`),
          })}
        />

        <header className="grid gap-10 border-b border-[color:var(--copper)]/18 pb-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.42em] text-[color:var(--mist)]">
              Hermetic Principles
            </p>
            <h1 className="font-ritual text-5xl sm:text-6xl">The Seven Principles</h1>
            <p className="max-w-3xl text-lg leading-relaxed text-[color:#D5D0C6] sm:text-xl">
              Read the whole doctrine in one field of attention. Each principle appears here in canonical order
              with its axiom, a fuller explanation, key ideas, and a simple contemplative practice.
            </p>
            <div className="max-w-3xl border-l border-[color:var(--copper)]/24 pl-5">
              <p className="text-sm uppercase tracking-[0.32em] text-[color:var(--gilt)]/92">Approach</p>
              <p className="mt-3 text-base leading-relaxed text-[color:var(--mist)] sm:text-lg">
                Study them as a sacred text with commentary. Move in order, let one principle stay with you,
                and return after you have seen it at work in ordinary life.
              </p>
            </div>
          </div>

          <div className="space-y-5 border-l border-[color:var(--copper)]/22 pl-6 lg:pl-8">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-[color:var(--gilt)]">Reading stance</p>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-[color:var(--mist)] sm:text-base">
                Do not try to master all seven at once. Read the sequence, then let one principle stay with you
                for a few days until it begins to describe what you are seeing in ordinary life.
              </p>
            </div>
            <div className="grid gap-2 text-sm leading-relaxed text-[color:var(--mist)] sm:grid-cols-2 sm:text-[15px]">
              <div>
                <p className="text-[11px] uppercase tracking-[0.32em] text-[color:var(--gilt)]">Doctrine</p>
                <p className="mt-2">Axiom and commentary show the principle as it was taught.</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.32em] text-[color:var(--gilt)]">Practice</p>
                <p className="mt-2">The closing prompts are there to make the law visible in daily life.</p>
              </div>
            </div>
          </div>
        </header>

        <section className="space-y-4 border-t border-[color:var(--copper)]/20 pt-8">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-[color:var(--gilt)]">Jump to a principle</p>
            </div>
            <p className="max-w-2xl text-sm leading-relaxed text-[color:var(--mist)] sm:text-base">
              Read the axiom first, then the commentary, then take one practice into the day.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-7">
            {principles.map((principle, index) => (
              <Link
                key={principle.slug}
                href={`#${principle.slug}`}
                className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[color:var(--copper)]/24 px-4 py-2 text-center text-[11px] uppercase tracking-[0.2em] text-[color:var(--mist)] transition hover:border-[color:var(--gilt)] hover:text-[color:var(--bone)]"
              >
                {romanNumerals[index]} · {principle.title}
              </Link>
            ))}
          </div>
        </section>

        <section className="space-y-14">
          {principles.map((principle, index) => {
            const accents = principleAccents[index];
            return (
              <article
                key={principle.slug}
                id={principle.slug}
                style={
                  {
                    "--principle-accent": accents.accent,
                    "--principle-wash": accents.wash,
                  } as CSSProperties
                }
                className="scroll-mt-28 border-t border-[color:var(--copper)]/18 pt-10"
              >
                <div className="space-y-7">
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-end gap-x-5 gap-y-2">
                      <p className="font-ritual text-4xl text-[color:var(--principle-accent)]/82 sm:text-5xl">
                        {romanNumerals[index]}
                      </p>
                      <p className="text-xs uppercase tracking-[0.35em] text-[color:var(--principle-accent)]">
                        {principle.title}
                      </p>
                    </div>
                    <h2 className="max-w-5xl font-ritual text-4xl leading-tight text-[color:var(--bone)] sm:text-5xl">
                      {principle.axiom}
                    </h2>
                    <p className="max-w-4xl font-ritual text-2xl leading-relaxed text-[color:var(--bone)]/84 sm:text-[2rem]">
                      {principle.short}
                    </p>
                  </div>

                  <div className="relative overflow-hidden border-l border-[color:var(--principle-accent)]/55 pl-6 sm:pl-8">
                    <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,var(--principle-wash),rgba(6,11,19,0)_62%)]" />
                    <div className="space-y-6">
                      <p className="text-[11px] uppercase tracking-[0.32em] text-[color:var(--principle-accent)]">
                        Commentary
                      </p>
                      <div className="max-w-5xl space-y-5 text-lg leading-[1.95] text-[color:#D5D0C6]">
                        <p>{principle.body}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                    <section className="px-1">
                      <p className="text-[11px] uppercase tracking-[0.32em] text-[color:var(--gilt)]">Keys to remember</p>
                      <ul className="mt-4 grid gap-3 text-sm leading-relaxed text-[color:var(--mist)] sm:text-base">
                        {principle.keys.map((key) => (
                          <li key={key} className="flex gap-3">
                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[color:var(--principle-accent)]/78" />
                            <span>{key}</span>
                          </li>
                        ))}
                      </ul>
                    </section>

                    <section className="border border-[color:var(--principle-accent)]/20 bg-[linear-gradient(135deg,var(--principle-wash),rgba(6,11,19,0.5))] px-5 py-5 sm:px-6">
                      <p className="text-[11px] uppercase tracking-[0.32em] text-[color:var(--principle-accent)]">
                        Practice
                      </p>
                      <ul className="mt-4 space-y-3 text-sm leading-relaxed text-[color:#D5D0C6] sm:text-base">
                        {principle.practice.map((prompt, practiceIndex) => (
                          <li key={prompt} className="flex gap-3">
                            <span className="font-ritual text-xl leading-none text-[color:var(--principle-accent)]">
                              {practiceIndex + 1}
                            </span>
                            <span>{prompt}</span>
                          </li>
                        ))}
                      </ul>
                    </section>
                  </div>

                  <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.24em]">
                    <Link
                      href={`/principles/${principle.slug}`}
                      className="inline-flex min-h-[40px] items-center rounded-full border border-[color:var(--copper)]/24 px-3 py-2 text-[color:var(--gilt)] transition hover:border-[color:var(--principle-accent)] hover:text-[color:var(--bone)]"
                    >
                      Standalone page
                    </Link>
                    <Link
                      href="/gallery"
                      className="inline-flex min-h-[40px] items-center rounded-full border border-[color:var(--copper)]/24 px-3 py-2 text-[color:var(--mist)] transition hover:border-[color:var(--principle-accent)] hover:text-[color:var(--bone)]"
                    >
                      Pair with geometry
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        <EmailCtaCard
          title="Get the beginner guide before you go deeper"
          body="Receive the free 7 Hermetic Principles Starter Guide with plain-language explanations, reflection prompts, and the weekly Awareness Paradox letters."
          source="principles-index"
          interests={["beginner-hermetic"]}
          secondaryHref="/guides/hermetic-principles-starter-guide"
          secondaryLabel="Free Starter Guide"
        />

        <footer className="border-t border-[color:var(--copper)]/24 pt-6 text-xs uppercase tracking-[0.35em] text-[color:var(--mist)]">
          Axioms and sequence follow The Kybalion (1908). Pair this page with the{" "}
          <Link href="/gallery" className="underline decoration-[color:var(--copper)]/50 underline-offset-4">
            Sacred Geometry Gallery
          </Link>{" "}
          or the{" "}
          <Link href="/journey" className="underline decoration-[color:var(--copper)]/50 underline-offset-4">
            interactive journey
          </Link>
          .
        </footer>
      </div>
    </div>
  );
}
