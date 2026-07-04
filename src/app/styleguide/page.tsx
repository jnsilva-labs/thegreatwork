"use client";

import { useState } from "react";
import { GlyphMark } from "@/components/ui/GlyphMark";
import { Dissolve } from "@/components/motion/Dissolve";
import { EtchHeading } from "@/components/motion/EtchHeading";
import { EtchRule } from "@/components/motion/EtchRule";
import { Reveal } from "@/components/motion/Reveal";

const colors = [
  { name: "obsidian", value: "#0b0c10" },
  { name: "bone", value: "#e8e3d8" },
  { name: "copper", value: "#2b6f6a" },
  { name: "gilt", value: "#b89b5e" },
  { name: "violet", value: "#252435" },
  { name: "mist", value: "#b9b2a5" },
];

const scale = [
  "text-xs",
  "text-sm",
  "text-base",
  "text-lg",
  "text-xl",
  "text-2xl",
  "text-3xl",
  "text-4xl",
];

export default function StyleguidePage() {
  return (
    <div className="min-h-screen px-8 py-16 text-[color:var(--bone)]">
      <div className="mx-auto max-w-5xl space-y-16">
        <header className="space-y-4">
          <p className="text-xs uppercase tracking-[0.4em] text-[color:var(--mist)]">
            Codex Styleguide
          </p>
          <h1 className="font-ritual text-5xl">Tokens & Sigils</h1>
        </header>

        <section className="space-y-6">
          <h2 className="text-sm uppercase tracking-[0.4em] text-[color:var(--mist)]">
            Palette
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {colors.map((color) => (
              <div
                key={color.name}
                className="rounded-xl border border-[color:var(--copper)]/40 bg-[color:var(--char)]/60 p-4"
              >
                <div className="h-16 rounded-lg" style={{ background: color.value }} />
                <div className="mt-3 text-xs uppercase tracking-[0.3em] text-[color:var(--mist)]">
                  {color.name}
                </div>
                <div className="text-sm text-[color:var(--bone)]">{color.value}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-sm uppercase tracking-[0.4em] text-[color:var(--mist)]">
            Type Scale
          </h2>
          <div className="space-y-2">
            {scale.map((className) => (
              <div key={className} className={`${className} font-ritual`}>
                {className} — Sacred Geometry Codex
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-sm uppercase tracking-[0.4em] text-[color:var(--mist)]">
            Sigils
          </h2>
          <div className="flex flex-wrap gap-6">
            {Array.from({ length: 7 }).map((_, index) => (
              <div
                key={`sigil-${index}`}
                className="flex flex-col items-center gap-2 rounded-xl border border-[color:var(--copper)]/40 bg-[color:var(--char)]/60 p-4"
              >
                <GlyphMark index={index} />
                <div className="text-xs uppercase tracking-[0.3em] text-[color:var(--mist)]">
                  {"I II III IV V VI VII".split(" ")[index]}
                </div>
              </div>
            ))}
          </div>
        </section>

        <MotionGallery />
      </div>
    </div>
  );
}

function MotionGallery() {
  const [dissolveShown, setDissolveShown] = useState(true);

  return (
    <section className="space-y-10">
      <h2 className="text-sm uppercase tracking-[0.4em] text-[color:var(--mist)]">
        Motion Vocabulary
      </h2>

      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--mist)]/70">Etch — headings</p>
        <EtchHeading as="h3" className="font-ritual text-4xl text-[color:var(--bone)]">
          The Art of Transmutation
        </EtchHeading>
      </div>

      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--mist)]/70">Etch — rule</p>
        <EtchRule className="max-w-xl" />
      </div>

      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--mist)]/70">Reveal — rise, staggered</p>
        <Reveal className="space-y-2">
          <p data-reveal className="text-[color:#D5D0C6]">The lips of wisdom are closed,</p>
          <p data-reveal className="text-[color:#D5D0C6]">except to the ears of understanding.</p>
          <p data-reveal className="text-xs uppercase tracking-[0.24em] text-[color:var(--gilt)]">— The Kybalion</p>
        </Reveal>
      </div>

      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--mist)]/70">Reveal — drift</p>
        <Reveal variant="drift">
          <blockquote className="editorial-quote font-ritual text-2xl italic text-[color:var(--bone)]">
            As above, so below; as within, so without.
          </blockquote>
        </Reveal>
      </div>

      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--mist)]/70">Dissolve — state change</p>
        <button
          onClick={() => setDissolveShown((shown) => !shown)}
          className="inline-flex min-h-[44px] items-center rounded-full border border-[color:var(--gilt)]/55 px-6 py-2 text-xs uppercase tracking-[0.24em] text-[color:var(--gilt)] transition hover:text-[color:var(--bone)]"
        >
          Toggle
        </button>
        <Dissolve show={dissolveShown}>
          <div className="max-w-md border border-[color:var(--copper)]/30 bg-[color:var(--char)]/60 p-6 font-ritual text-xl text-[color:var(--bone)]">
            What dissolves was never lost.
          </div>
        </Dissolve>
      </div>
    </section>
  );
}
