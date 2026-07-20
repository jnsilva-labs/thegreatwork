"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { gsap } from "gsap";
import {
  ArchivalFigure,
  EditorialSpread,
  EtchedList,
  MarginalNote,
  RitualLink,
  type EditorialSpreadVariant,
  type EtchedListItem,
} from "@/components/editorial";
import { DUR, EASE_CEREMONIAL, STAGGER } from "@/components/motion/motionTokens";
import { useMotionPreference } from "@/components/motion/useMotionPreference";
import { useHermeticStore } from "@/lib/hermeticStore";
import type { ArchivalFigureId } from "@/data/archivalFigures";
import type { HomepageLayout, HomepageSectionItem } from "@/data/homepage";

type HomepageSectionProps = {
  id: string;
  index: number;
  sectionType?: string;
  layout?: HomepageLayout;
  figureId?: ArchivalFigureId;
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
  layout = "essay",
  figureId,
  title,
  subtitle,
  body,
  quote,
  quoteSource,
  cta,
  items,
  children,
}: HomepageSectionProps) {
  const progress = useHermeticStore((state) => state.progressByChapter[index] ?? 0);
  const sectionRef = useRef<HTMLElement | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [revealed, setRevealed] = useState(false);
  const { motionOk } = useMotionPreference();
  const opacity = 0.5 + progress * 0.5;
  const atmosphereClass = sectionType
    ? `home-atmosphere--${sectionType}`
    : "home-atmosphere--paradox";
  const atmosphereOpacity = getAtmosphereOpacity(sectionType, progress);
  const listItems: EtchedListItem[] = (items ?? []).map((item) => ({
    id: `${id}-${item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    title: item.title,
    body: item.description,
  }));

  useEffect(() => {
    if (!motionOk) {
      const timeoutId = window.setTimeout(() => setRevealed(true), 0);
      return () => window.clearTimeout(timeoutId);
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
      { threshold: 0.2, rootMargin: "0px 0px -15% 0px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [motionOk]);

  useLayoutEffect(() => {
    if (!motionOk) return;
    const root = sectionRef.current;
    if (!root) return;

    const context = gsap.context(() => {
      const select = gsap.utils.selector(root);
      const divider = select(".home-divider");
      const label = select(".editorial-spread__eyebrow");
      const titleElement = select(".home-section-title");
      const copy = select(".home-section-copy");
      const secondary = select(".home-reveal-secondary");
      const closers = [...select(".home-cta"), ...select(".home-roman-corner")];

      gsap.set(divider, { scaleX: 0 });
      gsap.set(label, { y: 10, opacity: 0 });
      gsap.set(titleElement, { y: 14, opacity: 0 });
      gsap.set([...copy, ...secondary], { y: 22, opacity: 0 });
      gsap.set(closers, { opacity: 0 });

      const timeline = gsap.timeline({
        paused: true,
        defaults: { ease: EASE_CEREMONIAL },
      });
      timeline.to(divider, { scaleX: 1, duration: DUR.etch });
      if (label.length) {
        timeline.to(label, { y: 0, opacity: 1, duration: DUR.reveal }, "-=0.55");
      }
      timeline.to(titleElement, { y: 0, opacity: 1, duration: DUR.reveal }, "-=0.4");
      if (copy.length) {
        timeline.to(
          copy,
          { y: 0, opacity: 1, duration: DUR.reveal, stagger: STAGGER },
          "-=0.35",
        );
      }
      if (secondary.length) {
        timeline.to(
          secondary,
          { y: 0, opacity: 1, duration: DUR.reveal, stagger: STAGGER },
          "-=0.3",
        );
      }
      if (closers.length) {
        timeline.to(closers, { opacity: 1, duration: DUR.reveal }, "-=0.2");
      }

      timelineRef.current = timeline;
    }, root);

    return () => {
      timelineRef.current = null;
      context.revert();
    };
  }, [motionOk]);

  useEffect(() => {
    if (revealed) timelineRef.current?.play();
  }, [revealed]);

  const quoteContent = quote ? (
    <blockquote className="home-pull-quote home-reveal-secondary">
      <p>{quote}</p>
      {quoteSource ? <cite>{quoteSource}</cite> : null}
    </blockquote>
  ) : null;

  const figure = figureId ? (
    <ArchivalFigure
      figureId={figureId}
      className="home-archival-figure home-reveal-secondary"
      sizes="(max-width: 767px) 100vw, (max-width: 1279px) 48vw, 520px"
    />
  ) : null;

  const etchedList = listItems.length ? (
    <EtchedList
      items={listItems}
      ordered
      marker="numeral"
      headingLevel="h3"
      className="home-chapter-list home-reveal-secondary"
    />
  ) : null;

  const media = getMedia(layout, figure, quoteContent, etchedList);
  const marginalia =
    layout !== "quote" && quote ? (
      <MarginalNote
        heading={quoteSource ?? "From the archive"}
        headingLevel="h3"
        className="home-reveal-secondary"
      >
        <blockquote>{quote}</blockquote>
      </MarginalNote>
    ) : null;
  const spreadVariant = getSpreadVariant(layout, index);

  return (
    <section
      id={id}
      ref={sectionRef}
      data-gsap={motionOk ? "" : undefined}
      data-home-layout={layout}
      className={`home-stage home-stage--${layout} px-6 py-16 sm:px-10 sm:py-24 lg:px-20 ${
        revealed ? "is-revealed" : ""
      }`}
    >
      <div className="home-section mx-auto max-w-5xl" style={{ opacity }}>
        <div className="home-divider" aria-hidden="true" />
        <div
          className={`home-atmosphere ${atmosphereClass}`}
          aria-hidden="true"
          style={{ opacity: atmosphereOpacity }}
        />

        <EditorialSpread
          variant={spreadVariant}
          eyebrow={subtitle}
          title={<span className="home-section-title">{title}</span>}
          media={media}
          marginalia={marginalia}
          className="home-chapter-spread"
        >
          <div className="home-chapter-copy">
            {body.map((paragraph) => (
              <p key={paragraph} className="home-section-copy">
                {paragraph}
              </p>
            ))}
          </div>

          {layout !== "map" ? etchedList : null}
          {children ? <div className="home-section-copy home-chapter-extra">{children}</div> : null}
          {cta ? (
            <RitualLink
              href={cta.href}
              location={`homepage_section:${id}`}
              label={cta.label}
              className="home-cta"
            >
              {cta.label}
            </RitualLink>
          ) : null}
        </EditorialSpread>

        <div className="home-chapter-index" aria-hidden="true">
          <span>{toRoman(index + 1)}</span>
          <i
            className="home-glow-rail"
            style={{ "--rail-fill": progress.toString() } as CSSProperties}
          />
        </div>
        <span className="home-roman-corner" aria-hidden="true">
          {toRoman(index + 2)}
        </span>
      </div>
    </section>
  );
}

function getSpreadVariant(layout: HomepageLayout, index: number): EditorialSpreadVariant {
  if (layout === "quote" || layout === "map") return layout;
  return index % 2 === 0 ? "image-right" : "image-left";
}

function getMedia(
  layout: HomepageLayout,
  figure: React.ReactNode,
  quote: React.ReactNode,
  list: React.ReactNode,
) {
  switch (layout) {
    case "map":
      return list ?? figure;
    case "quote":
      return quote ?? figure;
    case "plate":
    case "essay":
    default:
      return figure;
  }
}

function toRoman(value: number) {
  const numerals = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"];
  return numerals[value - 1] ?? String(value);
}

function getAtmosphereOpacity(sectionType: string | undefined, progress: number) {
  switch (sectionType) {
    case "alchemy":
      return 0.32 + progress * 0.24;
    case "divination":
      return 0.3 + progress * 0.2;
    case "astrology":
      return 0.28 + progress * 0.24;
    case "geometry":
      return 0.3 + progress * 0.22;
    case "principles":
      return 0.26 + progress * 0.2;
    case "community":
      return 0.28 + progress * 0.18;
    case "paradox":
    default:
      return 0.3 + progress * 0.2;
  }
}
