"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { gsap } from "gsap";
import { MagneticLink } from "@/components/ui/MagneticLink";
import { DUR, EASE_CEREMONIAL, STAGGER } from "@/components/motion/motionTokens";
import { useMotionPreference } from "@/components/motion/useMotionPreference";
import { useHermeticStore } from "@/lib/hermeticStore";
import type { HomepageSectionItem } from "@/data/homepage";

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
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [revealed, setRevealed] = useState(false);
  const { motionOk } = useMotionPreference();
  const motionBlocked = !motionOk;
  const opacity = 0.5 + progress * 0.5;
  const atmosphereClass = sectionType ? `home-atmosphere--${sectionType}` : "home-atmosphere--paradox";
  const atmosphereOpacity = getAtmosphereOpacity(sectionType, progress);
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

  // Authored entrance choreography: rule draws -> label -> title rises ->
  // copy staggers -> principle items -> CTA and corner fade. Built paused,
  // played when the existing observer reveals the section. CSS transitions
  // are disabled under [data-gsap] so the two systems never fight.
  useLayoutEffect(() => {
    if (!motionOk) return;
    const root = sectionRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);
      const divider = q(".home-divider");
      const label = q(".home-section-label");
      const title = q(".home-section-title");
      const copy = q(".home-section-copy");
      const principleItems = q(".home-principle-item");
      const closers = [...q(".home-cta"), ...q(".home-roman-corner")];

      gsap.set(divider, { scaleX: 0 });
      gsap.set(label, { y: 10, opacity: 0 });
      gsap.set(title, { y: 14, opacity: 0 });
      gsap.set([...copy, ...principleItems], { y: 24, opacity: 0 });
      gsap.set(closers, { opacity: 0 });

      const tl = gsap.timeline({ paused: true, defaults: { ease: EASE_CEREMONIAL } });
      tl.to(divider, { scaleX: 1, duration: DUR.etch });
      if (label.length) tl.to(label, { y: 0, opacity: 1, duration: DUR.reveal }, "-=0.55");
      tl.to(title, { y: 0, opacity: 1, duration: DUR.reveal }, "-=0.4");
      if (copy.length) tl.to(copy, { y: 0, opacity: 1, duration: DUR.reveal, stagger: STAGGER }, "-=0.35");
      if (principleItems.length) {
        tl.to(principleItems, { y: 0, opacity: 1, duration: DUR.reveal, stagger: STAGGER }, "-=0.3");
      }
      if (closers.length) tl.to(closers, { opacity: 1, duration: DUR.reveal }, "-=0.2");

      timelineRef.current = tl;
    }, root);

    return () => {
      timelineRef.current = null;
      ctx.revert();
    };
  }, [motionOk]);

  useEffect(() => {
    if (revealed) {
      timelineRef.current?.play();
    }
  }, [revealed]);

  return (
    <section
      id={id}
      ref={sectionRef}
      data-gsap={motionOk ? "" : undefined}
      className={`home-stage px-6 py-20 sm:px-10 sm:py-28 lg:px-20 ${revealed ? "is-revealed" : ""}`}
    >
      <div
        className="home-section mx-auto max-w-5xl pt-10 transition"
        style={{ opacity }}
      >
        <div className="home-divider" aria-hidden="true" />
        <div
          className={`home-atmosphere ${atmosphereClass}`}
          aria-hidden="true"
          style={{ opacity: atmosphereOpacity }}
        />
        <div className="grid gap-8 lg:grid-cols-[0.92fr_0.08fr]">
          <div className="max-w-3xl space-y-8">
            {subtitle && (
              <p className="home-section-label text-sm uppercase tracking-[0.2em] sm:tracking-[0.35em] text-[color:var(--gilt)]">
                {subtitle}
              </p>
            )}
            <h2
              className="home-section-title type-title font-ritual text-[color:var(--bone)] transition"
              style={titleRevealStyle}
            >
              {title}
            </h2>

            <div className="space-y-5">
              {body.map((paragraph, i) => (
                <p
                  key={i}
                  className="home-section-copy prose-measure text-base leading-relaxed text-[color:#D5D0C6] sm:text-lg"
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

function getAtmosphereOpacity(sectionType: string | undefined, progress: number) {
  switch (sectionType) {
    case "alchemy":
      return 0.42 + progress * 0.42;
    case "divination":
      return 0.38 + progress * 0.38;
    case "astrology":
      return 0.34 + progress * 0.46;
    case "geometry":
      return 0.4 + progress * 0.42;
    case "principles":
      return 0.3 + progress * 0.4;
    case "community":
      return 0.34 + progress * 0.34;
    case "paradox":
    default:
      return 0.36 + progress * 0.4;
  }
}
