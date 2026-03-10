"use client";

import { TrackedLink } from "@/components/analytics/TrackedLink";
import { useHermeticStore } from "@/lib/hermeticStore";
import type { HomepageSectionItem } from "@/data/homepage";

type HomepageSectionProps = {
  id: string;
  index: number;
  title: string;
  subtitle?: string;
  body: string[];
  quote?: string;
  quoteSource?: string;
  cta?: { label: string; href: string };
  items?: HomepageSectionItem[];
  children?: React.ReactNode;
};

export function HomepageSection({
  id,
  index,
  title,
  subtitle,
  body,
  quote,
  quoteSource,
  cta,
  items,
  children,
}: HomepageSectionProps) {
  const progress = useHermeticStore(
    (state) => state.progressByChapter[index] ?? 0
  );
  const opacity = 0.35 + progress * 0.65;
  const translate = (1 - progress) * 20;
  const sectionNumeral = ["I", "II", "III", "IV", "V", "VI", "VII"][index] ?? String(index + 1);
  const railFirst = index % 2 === 0;

  return (
    <section id={id} className="px-6 py-20 sm:px-10 sm:py-28 lg:px-20">
      <div
        className="mx-auto max-w-6xl border-t border-[color:var(--copper)]/30 pt-10 transition"
        style={{ opacity, transform: `translateY(${translate}px)` }}
      >
        <div className="grid gap-10 lg:grid-cols-[0.34fr_0.66fr] lg:gap-16">
          <aside className={`${railFirst ? "lg:order-1" : "lg:order-2"} space-y-5`}>
            <div className="editorial-panel rounded-[2rem] p-6">
              <div className="flex items-center gap-4">
                <span className="font-ritual text-3xl text-[color:var(--gilt)]">{sectionNumeral}</span>
                <div className="h-px flex-1 bg-[color:var(--copper)]/25" />
              </div>
              {subtitle ? (
                <p className="mt-6 text-xs uppercase tracking-[0.34em] text-[color:var(--gilt)]">
                  {subtitle}
                </p>
              ) : null}
              {quote ? (
                <blockquote className="mt-5 space-y-3">
                  <p className="editorial-quote text-[color:var(--bone)]">{quote}</p>
                  {quoteSource ? (
                    <footer className="text-xs uppercase tracking-[0.28em] text-[color:var(--mist)]">
                      {quoteSource}
                    </footer>
                  ) : null}
                </blockquote>
              ) : null}
            </div>
          </aside>

          <div className={`${railFirst ? "lg:order-2" : "lg:order-1"} space-y-8`}>
            <div className="space-y-4">
              <h2 className="font-ritual text-3xl leading-tight text-[color:var(--bone)] sm:text-4xl lg:text-5xl">
                {title}
              </h2>
            </div>

            <div className="space-y-5">
              {body.map((paragraph, i) => (
                <p
                  key={i}
                  className="max-w-3xl text-base leading-relaxed text-[color:var(--mist)] sm:text-lg"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {items && items.length > 0 && (
              <div className="grid gap-4 pt-2 sm:grid-cols-2">
                {items.map((item, i) => (
                  <div
                    key={i}
                    className="editorial-panel rounded-[1.6rem] p-5"
                  >
                    <h3 className="text-sm font-medium uppercase tracking-[0.24em] sm:tracking-[0.3em] text-[color:var(--bone)]">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-[color:var(--mist)]">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {children ? <div className="pt-2">{children}</div> : null}

            {cta ? (
              <div className="pt-3">
                <TrackedLink
                  href={cta.href}
                  location={`homepage_section:${id}`}
                  label={cta.label}
                  variant="section-cta"
                  className="inline-flex min-h-[44px] items-center rounded-full border border-[color:var(--copper)] px-6 py-3 text-xs uppercase tracking-[0.35em] text-[color:var(--gilt)] transition hover:border-[color:var(--gilt)] hover:text-[color:var(--bone)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-[color:var(--gilt)]"
                >
                  {cta.label}
                </TrackedLink>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
