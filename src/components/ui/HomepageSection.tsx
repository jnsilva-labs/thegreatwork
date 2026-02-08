"use client";

import Link from "next/link";
import { useHermeticStore } from "@/lib/hermeticStore";
import type { HomepageSectionItem } from "@/data/homepage";

type HomepageSectionProps = {
  id: string;
  index: number;
  title: string;
  subtitle?: string;
  body: string[];
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
  cta,
  items,
  children,
}: HomepageSectionProps) {
  const progress = useHermeticStore(
    (state) => state.progressByChapter[index] ?? 0
  );
  const opacity = 0.35 + progress * 0.65;
  const translate = (1 - progress) * 20;

  return (
    <section id={id} className="px-6 py-20 sm:px-10 sm:py-28 lg:px-20">
      <div
        className="mx-auto max-w-3xl space-y-8 border-t border-[color:var(--copper)]/30 pt-10 transition"
        style={{ opacity, transform: `translateY(${translate}px)` }}
      >
        {/* Title */}
        <h2 className="font-ritual text-3xl leading-tight text-[color:var(--bone)] sm:text-4xl lg:text-5xl">
          {title}
        </h2>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-sm uppercase tracking-[0.2em] sm:tracking-[0.35em] text-[color:var(--gilt)]">
            {subtitle}
          </p>
        )}

        {/* Body paragraphs */}
        <div className="space-y-5">
          {body.map((paragraph, i) => (
            <p
              key={i}
              className="max-w-2xl text-base leading-relaxed text-[color:var(--mist)] sm:text-lg"
            >
              {paragraph}
            </p>
          ))}
        </div>

        {/* Items (alchemy stages, principles, etc.) */}
        {items && items.length > 0 && (
          <div className="space-y-4 pt-2">
            {items.map((item, i) => (
              <div
                key={i}
                className="border-l-2 border-[color:var(--copper)]/40 py-2 pl-4 sm:pl-5"
              >
                <h3 className="text-sm font-medium uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[color:var(--bone)]">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-[color:var(--mist)]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Children slot (e.g., SocialLinks) */}
        {children && <div className="pt-2">{children}</div>}

        {/* CTA button */}
        {cta && (
          <div className="pt-2">
            <Link
              href={cta.href}
              className="inline-flex min-h-[44px] items-center rounded-full border border-[color:var(--copper)] px-6 py-3 text-xs uppercase tracking-[0.35em] text-[color:var(--gilt)] transition hover:border-[color:var(--gilt)] hover:text-[color:var(--bone)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-[color:var(--gilt)]"
            >
              {cta.label}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
