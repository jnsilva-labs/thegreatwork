"use client";

import { useCallback, useState } from "react";
import type { MouseEvent } from "react";
import { ArchivalFigure } from "@/components/editorial";
import { EmailCtaCard } from "@/components/marketing/EmailCtaCard";
import { greatWork } from "@/data/greatWork";
import { AlchemyGlyph } from "@/components/AlchemyGlyph";
import { EtchHeading } from "@/components/motion/EtchHeading";
import { EtchRule } from "@/components/motion/EtchRule";
import { Reveal } from "@/components/motion/Reveal";
import { useFocusDialog } from "@/components/ui/useFocusDialog";

export default function GreatWorkPage() {
  const [activeGlyph, setActiveGlyph] = useState<string | null>(null);
  const closeGlyph = useCallback(() => setActiveGlyph(null), []);
  const { triggerRef, dialogRef, initialFocusRef } = useFocusDialog({
    open: activeGlyph !== null,
    onClose: closeGlyph,
  });
  const openGlyph = useCallback(
    (glyphId: string, event: MouseEvent<HTMLButtonElement>) => {
      triggerRef.current = event.currentTarget;
      setActiveGlyph(glyphId);
    },
    [triggerRef],
  );
  const glyph = greatWork.glyphs.find((item) => item.id === activeGlyph);

  return (
    <div className="min-h-screen px-6 py-18 text-[color:var(--bone)] sm:px-10 sm:py-22 lg:px-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-20">
        <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="space-y-5">
            <p className="text-xs uppercase tracking-[0.4em] text-[color:var(--mist)]">
              Hermetic Library
            </p>
            <h1 className="font-ritual text-5xl leading-tight sm:text-6xl">{greatWork.hero.title}</h1>
            <p className="text-sm uppercase tracking-[0.35em] text-[color:var(--gilt)]">
              {greatWork.hero.subtitle}
            </p>
            <div className="space-y-4 text-base leading-relaxed text-[color:var(--mist)]">
              {greatWork.definition.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
            <Reveal variant="drift">
              <p className="quote-measure border-l border-[color:var(--copper)]/28 pl-5 font-ritual text-2xl leading-tight text-[color:var(--bone)] sm:text-3xl">
                The work does not begin in brilliance. It begins where matter yields and the old form darkens.
              </p>
            </Reveal>
          </div>
          <ArchivalFigure
            figureId="the-alchemist"
            sizes="(max-width: 1023px) 100vw, 40vw"
            priority
            imageClassName="h-full w-full object-cover object-center grayscale-[0.28]"
          />
        </section>

        <section className="grid gap-8 lg:grid-cols-2">
          <article className="space-y-4 border-t border-[color:var(--copper)]/14 pt-5">
            <h2 className="text-xs uppercase tracking-[0.35em] text-[color:var(--gilt)]">Historical importance</h2>
            <div className="space-y-4 text-sm leading-relaxed text-[color:var(--mist)] sm:text-base">
              {greatWork.history.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </article>

          <article className="space-y-4 border-t border-[color:var(--copper)]/14 pt-5">
            <h2 className="text-xs uppercase tracking-[0.35em] text-[color:var(--gilt)]">Why it still matters</h2>
            <div className="space-y-4 text-sm leading-relaxed text-[color:var(--mist)] sm:text-base">
              {greatWork.whyItMatters.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </article>
        </section>

        <section className="max-w-3xl border-l border-[color:var(--copper)]/24 pl-5">
          <Reveal variant="drift">
            <p className="font-ritual text-2xl leading-tight text-[color:var(--bone)] sm:text-3xl">
              The Great Work survives because it names a sequence people still recognize: breakdown, purification,
              illumination, and integration.
            </p>
          </Reveal>
        </section>

        <section className="space-y-8">
          <h2 className="flex items-center gap-3 text-xs uppercase tracking-[0.4em] text-[color:var(--mist)]">
            <span className="h-px w-12 bg-[color:var(--copper)]" />
            The Work in Four Colors
          </h2>
          <ol aria-label="The work in four colors" className="relative border-l border-[color:var(--copper)]/26 pl-7 sm:pl-10">
            {greatWork.stages.map((stage, index) => (
              <li key={stage.id} id={stage.id} className="relative scroll-mt-24 py-8 first:pt-0">
                {index > 0 && <EtchRule className="mb-10" />}
                <article className="prose-measure space-y-4">
                  <div className="flex items-center gap-4">
                    <p className="font-ritual text-4xl text-[color:var(--gilt)]/86 sm:text-5xl">
                      {["I", "II", "III", "IV"][index]}
                    </p>
                    <span
                      className="block h-2 w-14 rounded-full"
                      style={{ backgroundColor: stage.tone }}
                      aria-hidden="true"
                    />
                  </div>
                  <p className="text-xs uppercase tracking-[0.28em] text-[color:var(--gilt)]">
                    {stage.keynotes.join(" · ")}
                  </p>
                  <EtchHeading as="h3" className="font-ritual text-3xl leading-tight sm:text-4xl">
                    {stage.title}
                  </EtchHeading>
                  <div className="space-y-3 text-sm leading-relaxed text-[color:var(--mist)] sm:text-base">
                    {stage.description.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                </article>
              </li>
            ))}
          </ol>
        </section>

        <section className="space-y-6">
          <h2 className="flex items-center gap-3 text-xs uppercase tracking-[0.4em] text-[color:var(--mist)]">
            <span className="h-px w-12 bg-[color:var(--copper)]" />
            Core Terms
          </h2>
          <div className="grid gap-5 md:grid-cols-2">
            {greatWork.glossary.map((item) => (
              <article key={item.term} className="border-t border-[color:var(--copper)]/14 pt-4">
                <h3 className="font-ritual text-xl">{item.term}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[color:var(--mist)]">{item.definition}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-8">
          <h2 className="flex items-center gap-3 text-xs uppercase tracking-[0.4em] text-[color:var(--mist)]">
            <span className="h-px w-12 bg-[color:var(--copper)]" />
            Visual Index
          </h2>
          <ul aria-label="Alchemical glyph index" className="grid border-y border-[color:var(--copper)]/22 sm:grid-cols-2 lg:grid-cols-4">
            {greatWork.glyphs.map((item) => (
              <li key={item.id} className="border-b border-r border-[color:var(--copper)]/16 last:border-r-0">
                <button
                  type="button"
                  aria-label={`Open ${item.title} glyph`}
                  onClick={(event) => openGlyph(item.id, event)}
                  className="group flex min-h-[112px] w-full items-center gap-4 px-4 py-5 text-left transition-colors hover:bg-[color:var(--char)]/14 focus-visible:outline focus-visible:outline-1 focus-visible:outline-[color:var(--gilt)]"
                >
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[color:var(--copper)]/28 text-[color:var(--gilt)] transition-colors group-hover:text-[color:var(--bone)]">
                    <AlchemyGlyph id={item.id} className="h-9 w-9" />
                  </span>
                  <span className="text-xs uppercase tracking-[0.25em] text-[color:var(--mist)]">{item.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="flex items-center gap-3 text-xs uppercase tracking-[0.4em] text-[color:var(--mist)]">
            <span className="h-px w-12 bg-[color:var(--copper)]" />
            Sources
          </h2>
          <ul aria-label="Sources" className="border-t border-[color:var(--copper)]/18 text-sm text-[color:var(--mist)]">
            {greatWork.sources.map((source) => (
              <li key={source.url} className="border-b border-[color:var(--copper)]/14">
                <a
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-[44px] items-center py-2 transition-colors hover:text-[color:var(--bone)]"
                >
                  {source.title}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <EmailCtaCard
          title="Build the Hermetic foundation first"
          body="If you are new to alchemy, start with the free Hermetic Principles Starter Guide, then return to the Great Work with a clearer symbolic framework."
          source="great-work-page"
          interests={["beginner-hermetic"]}
          variant="compact"
          secondaryHref="/guides/hermetic-principles-starter-guide"
          secondaryLabel="Get the Guide"
        />
      </div>

      {glyph && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-[color:var(--obsidian)]/80 px-6 py-10"
          onClick={(event) => {
            if (event.target === event.currentTarget) closeGlyph();
          }}
        >
          <section
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="great-work-glyph-title"
            tabIndex={-1}
            className="w-full max-w-md border border-[color:var(--copper)]/26 bg-[color:var(--char)]/92 p-5 sm:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[color:var(--copper)]/40 text-[color:var(--gilt)]">
                  <AlchemyGlyph id={glyph.id} className="h-7 w-7" />
                </div>
                <h3 id="great-work-glyph-title" className="font-ritual text-2xl">{glyph.title}</h3>
              </div>
              <button
                type="button"
                ref={initialFocusRef}
                onClick={closeGlyph}
                className="inline-flex min-h-[44px] items-center text-xs uppercase tracking-[0.35em] text-[color:var(--mist)] transition-colors hover:text-[color:var(--bone)]"
              >
                Close
              </button>
            </div>
            <p className="mt-4 text-sm text-[color:var(--mist)]">{glyph.description}</p>
          </section>
        </div>
      )}
    </div>
  );
}
