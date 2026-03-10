"use client";

import { useState } from "react";
import { EmailCtaCard } from "@/components/marketing/EmailCtaCard";
import { greatWork } from "@/data/greatWork";
import { Ouroboros } from "@/components/Ouroboros";
import { AlchemyGlyph } from "@/components/AlchemyGlyph";

export default function GreatWorkPage() {
  const [activeGlyph, setActiveGlyph] = useState<string | null>(null);
  const glyph = greatWork.glyphs.find((item) => item.id === activeGlyph);

  return (
    <div className="min-h-screen px-6 py-20 text-[color:var(--bone)] sm:px-10 lg:px-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-16">
        <section className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.4em] text-[color:var(--mist)]">
              Hermetic Library
            </p>
            <h1 className="font-ritual text-5xl sm:text-6xl">{greatWork.hero.title}</h1>
            <p className="text-sm uppercase tracking-[0.35em] text-[color:var(--gilt)]">
              {greatWork.hero.subtitle}
            </p>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-[color:var(--mist)]">
              {greatWork.definition.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
            <p className="max-w-2xl border-l border-[color:var(--copper)]/28 pl-5 font-ritual text-2xl leading-tight text-[color:var(--bone)] sm:text-3xl">
              The work does not begin in brilliance. It begins where matter yields and the old form darkens.
            </p>
          </div>
          <div className="relative flex items-center justify-center lg:pt-10">
            <div className="relative flex items-center justify-center rounded-full border border-[color:var(--copper)]/28 bg-[color:var(--char)]/28 p-10">
              <div className="violet-aura" aria-hidden="true" />
              <Ouroboros className="h-56 w-56 text-[color:var(--bone)] sm:h-64 sm:w-64" />
              <div className="pointer-events-none absolute inset-5 rounded-full border border-[color:var(--copper)]/15" />
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.4em] text-[color:var(--mist)]">
            <span className="h-px w-12 bg-[color:var(--copper)]" />
            The Work in Four Colors
          </div>
          <div className="space-y-6">
            {greatWork.stages.map((stage, index) => (
              <article
                key={stage.id}
                className="great-work-stage py-8"
              >
                <div className={`grid gap-6 lg:grid-cols-[0.18fr_0.82fr] ${index % 2 === 1 ? "lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1" : ""}`}>
                  <div className="space-y-4 lg:pt-1">
                    <p className="font-ritual text-5xl text-[color:var(--gilt)]/86">{["I", "II", "III", "IV"][index]}</p>
                    <span
                      className="block h-2.5 w-16 rounded-full"
                      style={{ backgroundColor: stage.tone }}
                      aria-hidden="true"
                    />
                  </div>
                  <div className="space-y-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--gilt)]">
                      {stage.keynotes.join(" · ")}
                    </p>
                    <h3 className="font-ritual text-3xl sm:text-4xl">{stage.title}</h3>
                    <div className="space-y-3 text-sm leading-relaxed text-[color:var(--mist)] sm:text-base">
                      {stage.description.map((line) => (
                        <p key={line}>{line}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.4em] text-[color:var(--mist)]">
            <span className="h-px w-12 bg-[color:var(--copper)]" />
            Core Terms
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {greatWork.glossary.map((item) => (
              <article
                key={item.term}
                className="rounded-2xl border border-[color:var(--copper)]/20 bg-[color:var(--char)]/18 p-5"
              >
                <h3 className="font-ritual text-xl">{item.term}</h3>
                <p className="mt-3 text-sm text-[color:var(--mist)]">{item.definition}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-8">
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.4em] text-[color:var(--mist)]">
            <span className="h-px w-12 bg-[color:var(--copper)]" />
            Visual Index
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {greatWork.glyphs.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveGlyph(item.id)}
                className="group flex flex-col items-center gap-4 rounded-2xl border border-[color:var(--copper)]/22 bg-[color:var(--char)]/18 p-5 text-left transition hover:border-[color:var(--gilt)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-[color:var(--gilt)]"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[color:var(--copper)]/40 text-[color:var(--gilt)] transition group-hover:text-[color:var(--bone)]">
                  <AlchemyGlyph id={item.id} className="h-10 w-10" />
                </div>
                <div className="text-center">
                  <p className="text-xs uppercase tracking-[0.35em] text-[color:var(--mist)]">
                    {item.title}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.4em] text-[color:var(--mist)]">
            <span className="h-px w-12 bg-[color:var(--copper)]" />
            Sources
          </div>
          <ul className="space-y-2 text-sm text-[color:var(--mist)]">
            {greatWork.sources.map((source) => (
              <li key={source.url}>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                  className="transition hover:text-[color:var(--bone)]"
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
          role="dialog"
          aria-modal="true"
          onClick={() => setActiveGlyph(null)}
        >
          <div
            className="w-full max-w-md rounded-[2rem] border border-[color:var(--copper)]/26 bg-[color:var(--char)]/92 p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[color:var(--copper)]/40 text-[color:var(--gilt)]">
                  <AlchemyGlyph id={glyph.id} className="h-7 w-7" />
                </div>
                <h3 className="font-ritual text-2xl">{glyph.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveGlyph(null)}
                className="text-xs uppercase tracking-[0.35em] text-[color:var(--mist)] transition hover:text-[color:var(--bone)]"
              >
                Close
              </button>
            </div>
            <p className="mt-4 text-sm text-[color:var(--mist)]">{glyph.description}</p>
          </div>
        </div>
      )}
    </div>
  );
}
