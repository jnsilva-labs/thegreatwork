"use client";

import { useHermeticStore } from "@/lib/hermeticStore";
import { GlyphMark } from "@/components/ui/GlyphMark";

type ChapterSectionProps = {
  id: string;
  index: number;
  title: string;
  axiom: string;
  short: string;
  visual: string;
};

export function ChapterSection({
  id,
  index,
  title,
  axiom,
  short,
  visual,
}: ChapterSectionProps) {
  const progress = useHermeticStore((state) => state.progressByChapter[index] ?? 0);
  const opacity = 0.35 + progress * 0.65;
  const translate = (1 - progress) * 20;
  const roman = ["I", "II", "III", "IV", "V", "VI", "VII"][index] ?? "I";

  return (
    <section id={id} className="px-6 py-24 sm:px-10 lg:px-20">
      <div
        className="mx-auto grid max-w-5xl gap-6 border-t border-[color:var(--copper)]/40 pt-10 transition"
        style={{ opacity, transform: `translateY(${translate}px)` }}
      >
        <div className="flex items-start gap-4 text-xs uppercase tracking-[0.4em] text-[color:var(--mist)]">
          <GlyphMark index={index} />
          <div>
            <div>Chapter {roman}</div>
            <div className="mt-4 text-[0.55rem] tracking-[0.5em] text-[color:var(--mist)]">
              Visual theorem
            </div>
            <div className="mt-2 text-[0.65rem] tracking-[0.5em] text-[color:var(--gilt)]">
              {visual}
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="font-ritual text-3xl text-[color:var(--bone)] sm:text-4xl">
            {title}
          </h2>
          <p className="max-w-xl text-sm uppercase tracking-[0.3em] text-[color:var(--mist)]">
            {axiom}
          </p>
          <p className="max-w-xl text-base text-[color:var(--mist)] sm:text-lg">
            {short}
          </p>
        </div>
      </div>
    </section>
  );
}
