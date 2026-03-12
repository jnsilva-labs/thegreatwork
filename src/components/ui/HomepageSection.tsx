"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { MagneticLink } from "@/components/ui/MagneticLink";
import { useHermeticStore } from "@/lib/hermeticStore";
import type { HomepageSectionItem } from "@/data/homepage";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { useUiStore } from "@/lib/uiStore";

type HomepageSectionProps = {
  id: string;
  index: number;
  sectionType?: string;
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
  sectionType,
  title,
  subtitle,
  body,
  cta,
  items,
  children,
}: HomepageSectionProps) {
  const progress = useHermeticStore((state) => state.progressByChapter[index] ?? 0);
  const sectionRef = useRef<HTMLElement | null>(null);
  const [revealed, setRevealed] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const stillness = useUiStore((state) => state.stillness);
  const motionBlocked = reducedMotion || stillness;
  const opacity = 0.5 + progress * 0.5;
  const translate = motionBlocked ? 0 : (1 - progress) * 24;
  const atmosphereClass = sectionType ? `home-atmosphere--${sectionType}` : "home-atmosphere--paradox";
  const motion = getSectionMotion(sectionType, progress, translate);
  const paragraphBaseDelay = motionBlocked ? 0 : 140;
  const titleRevealStyle = motionBlocked
    ? undefined
    : ({
        "--reveal-delay": `${index * 40}ms`,
      } as CSSProperties);

  useEffect(() => {
    if (motionBlocked) {
      const id = window.setTimeout(() => setRevealed(true), 0);
      return () => window.clearTimeout(id);
    }

    const element = sectionRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -15% 0px",
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [motionBlocked]);

  return (
    <section id={id} ref={sectionRef} className={`home-stage px-6 py-20 sm:px-10 sm:py-28 lg:px-20 ${revealed ? "is-revealed" : ""}`}>
      <div
        className="home-section mx-auto max-w-5xl pt-10 transition"
        style={{ opacity, transform: motion.container }}
      >
        <div className="home-divider" aria-hidden="true" />
        <div
          className={`home-atmosphere ${atmosphereClass}`}
          aria-hidden="true"
          style={{ opacity: motion.atmosphereOpacity, transform: motion.atmosphereTransform }}
        />
        <div className="grid gap-8 lg:grid-cols-[0.92fr_0.08fr]">
          <div className="max-w-3xl space-y-8">
            {subtitle && (
              <p className="home-section-label text-sm uppercase tracking-[0.2em] sm:tracking-[0.35em] text-[color:var(--gilt)]">
                {subtitle}
              </p>
            )}
            <h2
              className="home-section-title font-ritual text-3xl leading-tight text-[color:var(--bone)] sm:text-4xl lg:text-5xl transition"
              style={titleRevealStyle}
            >
              {title}
            </h2>

            <div className="space-y-5">
              {body.map((paragraph, i) => (
                <p
                  key={i}
                  className="home-section-copy max-w-2xl text-base leading-relaxed text-[color:#D5D0C6] sm:text-lg"
                  style={
                    motionBlocked
                      ? undefined
                      : ({
                          transitionDelay: `${paragraphBaseDelay + i * 100}ms`,
                        } as CSSProperties)
                  }
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {items && items.length > 0 && (
              <div className="space-y-4 pt-2">
                {items.map((item, i) => (
                  <div
                    key={i}
                    className="home-principle-item border-l-2 border-[color:var(--copper)]/35 py-2 pl-4 transition hover:border-[color:var(--gilt)]/55 sm:pl-5"
                    style={
                      motionBlocked
                        ? undefined
                        : ({
                            transitionDelay: `${220 + i * 200}ms`,
                          } as CSSProperties)
                    }
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

            {children && <div className="pt-2">{children}</div>}

            {cta && (
              <div className="pt-2">
                <MagneticLink
                  href={cta.href}
                  location={`homepage_section:${id}`}
                  label={cta.label}
                  variant="section-cta"
                  className="home-cta inline-flex min-h-[48px] items-center rounded-full border px-6 py-3 text-xs uppercase tracking-[0.35em] text-[color:var(--gilt)] transition hover:border-[color:var(--gilt)] hover:text-[color:var(--bone)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-[color:var(--gilt)]"
                >
                  {cta.label}
                </MagneticLink>
              </div>
            )}
          </div>

          <div className="hidden lg:block">
            <div
              className="home-glow-rail sticky top-32 pt-8 text-right"
              style={
                {
                  transform: motion.rail,
                  ["--rail-fill"]: progress.toString(),
                } as CSSProperties
              }
            >
              <span className="font-ritual text-3xl text-[color:var(--gilt)]/72">
                {["I", "II", "III", "IV", "V", "VI", "VII"][index] ?? String(index + 1)}
              </span>
            </div>
          </div>
        </div>
        <span className="home-roman-corner" aria-hidden="true">
          {["I", "II", "III", "IV", "V", "VI", "VII", "VIII"][index + 1] ?? String(index + 2)}
        </span>
      </div>
    </section>
  );
}

function getSectionMotion(sectionType: string | undefined, progress: number, translate: number) {
  const baseScale = 0.985 + progress * 0.015;

  switch (sectionType) {
    case "alchemy":
      return {
        container: `translateY(${translate}px) scale(${baseScale}) rotate(${(1 - progress) * -0.45}deg)`,
        title: `translate3d(0, ${(1 - progress) * 20}px, 0)`,
        rail: `translateY(${(1 - progress) * 34}px) rotate(${(1 - progress) * 2}deg)`,
        atmosphereOpacity: 0.42 + progress * 0.42,
        atmosphereTransform: `scale(${0.96 + progress * 0.06})`
      };
    case "divination":
      return {
        container: `translate3d(${(1 - progress) * 8}px, ${translate}px, 0)`,
        title: `translate3d(${(1 - progress) * 14}px, ${(1 - progress) * 16}px, 0)`,
        rail: `translateY(${(1 - progress) * 30}px)`,
        atmosphereOpacity: 0.38 + progress * 0.38,
        atmosphereTransform: `translateX(${(1 - progress) * 16}px) scale(${0.98 + progress * 0.04})`
      };
    case "astrology":
      return {
        container: `translate3d(${(1 - progress) * -8}px, ${translate}px, 0) scale(${baseScale})`,
        title: `translate3d(${(1 - progress) * -10}px, ${(1 - progress) * 14}px, 0)`,
        rail: `translateY(${(1 - progress) * 28}px)`,
        atmosphereOpacity: 0.34 + progress * 0.46,
        atmosphereTransform: `translateY(${(1 - progress) * -12}px) scale(${0.97 + progress * 0.05})`
      };
    case "geometry":
      return {
        container: `translateY(${translate}px) scale(${0.97 + progress * 0.03})`,
        title: `translateY(${(1 - progress) * 16}px) scale(${0.985 + progress * 0.015})`,
        rail: `translateY(${(1 - progress) * 36}px)`,
        atmosphereOpacity: 0.4 + progress * 0.42,
        atmosphereTransform: `scale(${0.92 + progress * 0.08}) rotate(${(1 - progress) * 2.2}deg)`
      };
    case "principles":
      return {
        container: `translateY(${translate}px)`,
        title: `translateY(${(1 - progress) * 18}px)`,
        rail: `translateY(${(1 - progress) * 32}px)`,
        atmosphereOpacity: 0.3 + progress * 0.4,
        atmosphereTransform: `translateY(${(1 - progress) * 10}px)`
      };
    case "community":
      return {
        container: `translateY(${translate}px) scale(${0.99 + progress * 0.01})`,
        title: `translateY(${(1 - progress) * 14}px)`,
        rail: `translateY(${(1 - progress) * 24}px)`,
        atmosphereOpacity: 0.34 + progress * 0.34,
        atmosphereTransform: `scale(${0.99 + progress * 0.03})`
      };
    case "paradox":
    default:
      return {
        container: `translateY(${translate}px) scale(${baseScale})`,
        title: `translate3d(0, ${(1 - progress) * 18}px, 0)`,
        rail: `translateY(${(1 - progress) * 36}px)`,
        atmosphereOpacity: 0.36 + progress * 0.4,
        atmosphereTransform: `scale(${0.98 + progress * 0.04})`
      };
  }
}
