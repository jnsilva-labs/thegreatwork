"use client";

import { useCallback, useState } from "react";
import {
  ArchivalFigure,
  EditorialSpread,
  EtchedList,
  MarginalNote,
  OraclePanel,
  RitualLink,
  TrustNote,
} from "@/components/editorial";
import CardVisual from "@/features/tarot/components/CardVisual";
import { PhaseArc } from "@/features/tarot/components/PhaseArc";
import TarotShell from "@/features/tarot/components/TarotShell";
import { DEFAULT_DECK, SPREADS } from "@/features/tarot/constants";
import { CardDetailsDialog } from "@/features/tarot/pages/Reading";
import type { DrawnCard } from "@/features/tarot/types";
import { useFocusDialog } from "@/components/ui/useFocusDialog";
import { NatalReadingResult } from "@/components/astro/NatalChartWidget";
import type { AstroMonthAheadReadingResponse, AstroNatalResponse } from "@/lib/astro/types";

const pathItems = [
  { id: "observe", title: "Observe", body: "Meet the symbol before assigning it a meaning." },
  { id: "record", title: "Record", body: "Write the first precise change in attention." },
  { id: "return", title: "Return", body: "Revisit the same form after the mind becomes quiet." },
];

const chamberCards: DrawnCard[] = DEFAULT_DECK.cards.slice(0, 3).map((card, index) => ({
  ...card,
  isReversed: index === 2,
  positionId: index + 1,
}));

const natalResultFixture: AstroNatalResponse = {
  chart: {
    meta: { fixture: true, calculation: "deterministic visual QA" },
    points: { sun: 222.4, moon: 128.9, mercury: 238.2, venus: 197.6, mars: 84.1, jupiter: 301.7, saturn: 273.4, uranus: 276.9, neptune: 282.3, pluto: 226.8, node: 291.2, chiron: 111.6 },
    houses: null,
    aspects: [
      { a: "sun", b: "moon", type: "square", orb: 3.5 },
      { a: "venus", b: "saturn", type: "sextile", orb: 1.8 },
      { a: "mercury", b: "jupiter", type: "sextile", orb: 3.5 },
    ],
  },
  reading: {
    title: "The Keeper of the Unfinished Threshold",
    bigThree: {
      sun: "Your solar center works through Scorpio: patient with complexity, loyal to what is true, and unwilling to confuse a polished surface with an honest answer.",
      moon: "The Leo Moon asks the inner life to remain warm and expressive, even when your instinct is to protect what matters by keeping it private.",
      rising: null,
    },
    snapshot: "You are learning to let depth become visible without turning revelation into performance. The chart holds a long conversation between privacy and radiance, asking for forms of expression sturdy enough to carry what you actually know.",
    coreThemes: ["Depth that becomes useful", "Creative courage without spectacle", "Discernment at emotional thresholds"],
    strengths: ["Sustained attention", "Loyalty under pressure", "A precise instinct for hidden structure"],
    shadows: ["Withholding until certainty arrives", "Mistaking control for safety", "Carrying complexity alone"],
    relationships: "You meet others most honestly when trust grows through consistent action rather than accelerated disclosure. Intimacy becomes spacious when privacy is named instead of defended in silence.",
    careerCalling: "Work becomes meaningful when research, craft, and interpretation converge. You are less interested in occupying a role than in making a difficult field more intelligible.",
    growthKeys: [
      { label: "Make one thing visible", practice: "Choose a small finished form for an idea you have protected too long." },
      { label: "Name the boundary", practice: "State what you need before distance begins doing the speaking for you." },
      { label: "Let warmth count", practice: "Treat pleasure and play as sources of information, not rewards postponed until the work is complete." },
    ],
    paradox: { tension: "You want to be fully known while preserving the private chamber where meaning ripens.", gift: "You can reveal truth with timing, neither hiding it nor spending it before it has form." },
    mantra: "I let what is ready become visible.",
    disclaimer: "This symbolic reflection is for self-inquiry and does not replace medical, legal, financial, or mental-health guidance.",
  },
  meta: { timeUnknown: true, houseSystem: "wholeSign", zodiac: "tropical" },
};

const monthAheadFixture: AstroMonthAheadReadingResponse = {
  meta: { startDateUtc: "2030-01-01T00:00:00.000Z", endDateUtc: "2030-01-31T00:00:00.000Z", durationDays: 30, generatedAt: "2030-01-01T00:00:00.000Z", sampleHours: 6, zodiac: "tropical" },
  lunarStages: [
    { kind: "lunarStage", phase: "newMoon", timestampUtc: "2030-01-04T12:00:00.000Z", orb: 0.1, priority: 1 },
    { kind: "lunarStage", phase: "firstQuarter", timestampUtc: "2030-01-11T12:00:00.000Z", orb: 0.2, priority: 2 },
    { kind: "lunarStage", phase: "fullMoon", timestampUtc: "2030-01-18T12:00:00.000Z", orb: 0.1, priority: 1 },
    { kind: "lunarStage", phase: "lastQuarter", timestampUtc: "2030-01-26T12:00:00.000Z", orb: 0.3, priority: 2 },
  ],
  skyShifts: [{ kind: "skyShift", eventType: "ingress", planet: "venus", timestampUtc: "2030-01-09T18:00:00.000Z", longitude: 300, speed: 1.1, priority: 2, fromSign: "Capricorn", toSign: "Aquarius" }],
  transitContacts: [{ kind: "transitContact", transitPlanet: "saturn", natalPoint: "sun", aspect: "trine", timestampUtc: "2030-01-21T09:00:00.000Z", orb: 0.4, transitLongitude: 342.4, natalLongitude: 222.4, priority: 1 }],
  highlights: [{ kind: "lunarStage", phase: "fullMoon", timestampUtc: "2030-01-18T12:00:00.000Z", orb: 0.1, priority: 1 }],
  reading: {
    title: "A month for giving the hidden work a vessel",
    timeframe: "January 1–31, 2030",
    overview: "The month favors deliberate visibility. Build the container before increasing the signal, and let each public gesture remain proportionate to the work it carries.",
    majorThemes: ["Measured visibility", "Durable agreements", "Rest before revision"],
    transitHighlights: [
      { title: "Venus changes the social temperature", window: "January 8–11", guidance: "Notice which collaborations allow difference without demanding distance." },
      { title: "The full Moon reveals the cost of silence", window: "January 17–19", guidance: "Name one need plainly, without supplying an argument for why it deserves to exist." },
      { title: "Saturn steadies the central work", window: "January 20–23", guidance: "Choose the repeatable practice over the dramatic correction." },
    ],
    lunarStages: [
      { phase: "newMoon", window: "January 4", cue: "Set one private intention that can be tested through action." },
      { phase: "firstQuarter", window: "January 11", cue: "Make a small commitment visible to another person." },
      { phase: "fullMoon", window: "January 18", cue: "Observe where attention is nourishing the work and where it is replacing it." },
      { phase: "lastQuarter", window: "January 26", cue: "Remove one obligation that no longer belongs to the experiment." },
    ],
    practiceSuggestions: ["Finish a single page before widening the project.", "Schedule one conversation you have been rehearsing alone.", "Keep one evening free of optimization."],
    cautions: ["Do not mistake urgency for clarity.", "Avoid offering more access than the relationship can hold."],
    closingLine: "Give the hidden work a vessel, then let the vessel speak quietly.",
    disclaimer: "Month-ahead symbolism is reflective, not predictive, and should not replace practical judgment.",
  },
};

export function VisualQaFixtures() {
  const [selectedFixtureCardIndex, setSelectedFixtureCardIndex] = useState<number | null>(null);
  const closeFixtureDialog = useCallback(() => setSelectedFixtureCardIndex(null), []);
  const {
    triggerRef: fixtureDialogTriggerRef,
    dialogRef: fixtureDialogRef,
    initialFocusRef: fixtureDialogInitialFocusRef,
  } = useFocusDialog({
    open: selectedFixtureCardIndex !== null,
    onClose: closeFixtureDialog,
  });
  const selectedFixtureCard = selectedFixtureCardIndex === null ? null : chamberCards[selectedFixtureCardIndex];

  return (
    <div className="space-y-24" data-visual-qa-fixtures="editorial-primitives">
      <section data-qa-section="editorial-spread" aria-label="Editorial spread fixture">
        <div className="space-y-16">
          <EditorialSpread
            variant="image-left"
            eyebrow="Plate I · Orientation"
            title="The archive is an instrument of attention"
            media={<ArchivalFigure figureId="the-alchemist" sizes="(max-width: 767px) 100vw, 42vw" />}
            marginalia={<MarginalNote heading="Margin 01">Begin with what is visible.</MarginalNote>}
          >
            <p>
              Text, image, and annotation share one field without collapsing into a stack of interchangeable cards.
            </p>
          </EditorialSpread>

          <EditorialSpread
            variant="image-right"
            eyebrow="Plate II · Reversal"
            title="The image answers from the opposite margin"
            media={<ArchivalFigure figureId="splendor-solis-sun" sizes="(max-width: 767px) 100vw, 42vw" />}
          >
            <p>The reversed composition keeps reading order stable while shifting the visual center of gravity.</p>
          </EditorialSpread>

          <EditorialSpread
            variant="quote"
            eyebrow="Fragment III · Witness"
            title="Attention is the first form of interpretation"
            media={
              <blockquote className="quote-measure border-l border-[color:var(--gilt)]/50 pl-5 text-[color:var(--mist)]">
                A quotation remains subordinate to its source, even when it anchors the spread.
              </blockquote>
            }
          >
            <p>The quote layout gives a short statement ceremonial scale without disguising its context.</p>
          </EditorialSpread>

          <EditorialSpread
            variant="map"
            eyebrow="Field IV · Relation"
            title="A map makes distance legible"
            media={
              <div
                aria-label="Constellation map fixture"
                className="grid min-h-64 place-items-center border border-[color:var(--copper)]/35 bg-[color:var(--char)]/20 text-[color:var(--gilt)]"
              >
                <span className="font-ritual text-5xl" aria-hidden="true">
                  ◇ · ✦ · ◇
                </span>
              </div>
            }
          >
            <p>The map variant holds diagrammatic media beside a concise orientation to the field.</p>
          </EditorialSpread>
        </div>
      </section>

      <section data-qa-section="archival-figure" aria-label="Archival figure fixture" className="max-w-2xl">
        <ArchivalFigure figureId="splendor-solis-sun" sizes="(max-width: 767px) 100vw, 42rem" />
      </section>

      <section data-qa-section="marginal-note" aria-label="Marginal note fixture" className="max-w-xl">
        <MarginalNote heading="Reading posture" headingLevel="h4">
          Look slowly enough for proportion to become legible.
        </MarginalNote>
      </section>

      <section data-qa-section="etched-list" aria-label="Etched list fixture">
        <EtchedList items={pathItems} ordered marker="numeral" headingLevel="h4" />
      </section>

      <section data-qa-section="ritual-link" aria-label="Ritual link fixture">
        <RitualLink href="/method" location="dev:visual-qa" label="Read the method">
          Read the method
        </RitualLink>
      </section>

      <section data-qa-section="oracle-panel" aria-label="Oracle panel fixture">
        <OraclePanel heading="Celestial inquiry" eyebrow="Interactive instrument" headingLevel="h3">
          <form className="grid gap-5" action="#">
            <label className="grid gap-2 text-sm" htmlFor="qa-oracle-question">
              Question
              <input
                id="qa-oracle-question"
                className="min-h-[44px] border-b border-[color:var(--copper)]/50 bg-transparent px-1 text-[color:var(--bone)]"
                defaultValue="What pattern is asking to be seen?"
              />
            </label>
            <button className="ritual-link min-h-[44px] justify-center" type="button">
              Hold the question
            </button>
          </form>
        </OraclePanel>
      </section>

      <section data-qa-section="trust-note" aria-label="Trust note fixture" className="max-w-2xl">
        <TrustNote
          heading="How this instrument is made"
          headingLevel="h4"
          link={{ href: "/method", label: "Read the method" }}
        >
          This deterministic fixture demonstrates presentation only. It sends no request and produces no interpretation.
        </TrustNote>
      </section>

      <section data-qa-tarot-fixture="tarot-entry" aria-label="Tarot entry fixture" className="overflow-hidden border border-[color:var(--copper)]/30">
        <TarotShell>
          <div className="mx-auto max-w-3xl space-y-8 px-5 py-14 sm:px-10">
            <header className="space-y-2 text-center">
              <p className="text-xs uppercase tracking-[0.14em] text-[color:var(--gilt)]">Deterministic fixture</p>
              <h2 className="font-ritual text-4xl text-[color:var(--bone)]">Tarot entry fixture</h2>
            </header>
            <div className="space-y-6 border-y border-[color:var(--copper)]/28 bg-[color:var(--panel)]/55 p-5 sm:p-8">
              <label className="grid gap-2 text-xs uppercase tracking-[0.14em] text-[color:var(--gilt)]" htmlFor="qa-tarot-question">
                The question
                <textarea
                  id="qa-tarot-question"
                  className="min-h-[96px] resize-none border border-[color:var(--gilt)]/45 bg-[color:var(--bone)] p-4 font-ritual text-xl normal-case tracking-normal text-[color:var(--bg)]"
                  defaultValue="What pattern is asking to be seen?"
                  readOnly
                />
              </label>
              <p className="text-xs uppercase tracking-[0.12em] text-[color:var(--mist)]">Intention · General</p>
              <div className="grid border-y border-[color:var(--copper)]/25 sm:grid-cols-3">
                {[
                  ["Focus", "Single insight"],
                  ["Trinity", "Context · center · outcome"],
                  ["Celtic", "A complete field"],
                ].map(([name, description]) => (
                  <div key={name} className="min-h-[72px] border-b border-[color:var(--copper)]/20 p-4 last:border-b-0 sm:border-b-0 sm:border-l sm:first:border-l-0">
                    <p className="font-ritual text-2xl text-[color:var(--bone)]">{name}</p>
                    <p className="text-xs uppercase tracking-[0.1em] text-[color:var(--mist)]">{description}</p>
                  </div>
                ))}
              </div>
              <button type="button" className="min-h-[52px] w-full border border-[color:var(--gilt)]/70 bg-[color:var(--gilt)]/16 text-sm uppercase tracking-[0.16em] text-[color:var(--bone)]">
                Reveal the cards
              </button>
            </div>
          </div>
        </TarotShell>
      </section>

      <section data-qa-tarot-fixture="tarot-reading" aria-label="Reading chamber fixture" className="overflow-hidden border border-[color:var(--copper)]/30">
        <TarotShell depth="reading">
          <div className="mx-auto max-w-5xl space-y-10 px-5 py-14 sm:px-10">
            <header className="space-y-3 border-b border-[color:var(--copper)]/24 pb-7 text-center">
              <p className="text-xs uppercase tracking-[0.14em] text-[color:var(--gilt)]">Local Rider-Waite cards · no request</p>
              <h2 className="font-ritual text-4xl text-[color:var(--bone)]">Reading chamber fixture</h2>
              <p className="font-ritual text-2xl text-[color:var(--mist)]">What pattern is asking to be seen?</p>
            </header>
            <div className="grid grid-cols-3 items-start gap-3 sm:gap-8">
              {chamberCards.map((card, index) => (
                <div key={card.id} className="flex min-w-0 flex-col items-center gap-3">
                  <p className="text-xs uppercase tracking-[0.08em] text-[color:var(--mist)]">{["Context", "Focus", "Outcome"][index]}</p>
                  <CardVisual card={card} isFaceUp={false} className="w-full max-w-48" />
                </div>
              ))}
            </div>
            <div className="border-y border-[color:var(--copper)]/24 py-8">
              <PhaseArc phase="albedo" reason="The fixture keeps the full reading chamber visible without invoking interpretation." />
            </div>
          </div>
        </TarotShell>
      </section>

      <section data-qa-tarot-fixture="tarot-one-card-revealed" aria-label="One-card revealed fixture" className="overflow-hidden border border-[color:var(--copper)]/30">
        <TarotShell depth="reading">
          <div className="mx-auto max-w-3xl space-y-8 px-5 py-14 text-center sm:px-10">
            <header className="space-y-3 border-b border-[color:var(--copper)]/24 pb-7">
              <p className="text-xs uppercase tracking-[0.14em] text-[color:var(--gilt)]">Local one-card state · no request</p>
              <h2 className="font-ritual text-4xl text-[color:var(--bone)]">One-card revealed fixture</h2>
            </header>
            <div className="mx-auto flex max-w-sm flex-col items-center gap-5">
              <CardVisual card={chamberCards[0]} isFaceUp className="w-48 sm:w-56" />
              <p className="font-ritual text-2xl text-[color:var(--gilt)]">{chamberCards[0].name}</p>
              <p className="text-xs uppercase tracking-[0.12em] text-[color:var(--mist)]">{chamberCards[0].keywords.join(" · ")}</p>
            </div>
          </div>
        </TarotShell>
      </section>

      <section data-qa-tarot-fixture="tarot-three-card-dialog" aria-label="Three-card dialog fixture" className="overflow-hidden border border-[color:var(--copper)]/30">
        <TarotShell depth="reading">
          <div className="mx-auto max-w-5xl space-y-9 px-5 py-14 text-center sm:px-10">
            <header className="space-y-3 border-b border-[color:var(--copper)]/24 pb-7">
              <p className="text-xs uppercase tracking-[0.14em] text-[color:var(--gilt)]">Local three-card state · no request</p>
              <h2 className="font-ritual text-4xl text-[color:var(--bone)]">Three-card dialog fixture</h2>
            </header>
            <div className="grid grid-cols-3 items-start gap-3 sm:gap-8">
              {chamberCards.map((card, index) => (
                <div key={card.id} className="flex min-w-0 flex-col items-center gap-3">
                  <p className="text-xs uppercase tracking-[0.08em] text-[color:var(--mist)]">{["Context", "Focus", "Outcome"][index]}</p>
                  <CardVisual card={card} isFaceUp className="w-full max-w-48" />
                </div>
              ))}
            </div>
            <button
              ref={fixtureDialogTriggerRef}
              type="button"
              onClick={() => setSelectedFixtureCardIndex(0)}
              className="inline-flex min-h-[44px] items-center justify-center border border-[color:var(--gilt)]/60 px-6 py-3 text-xs uppercase tracking-[0.14em] text-[color:var(--bone)] transition-[background-color,border-color] hover:border-[color:var(--gilt)] hover:bg-[color:var(--gilt)]/12"
            >
              Open three-card dialog fixture
            </button>
          </div>
        </TarotShell>
      </section>

      <section data-qa-astro-fixture="natal-result" aria-label="Complete unknown-time natal result fixture" className="border border-[color:var(--copper)]/30 px-5 py-12 sm:px-10">
        <header className="mb-10 space-y-2">
          <p className="text-xs uppercase tracking-[0.12em] text-[color:var(--gilt)]">Deterministic fixture · no network requests</p>
          <h2 className="font-ritual text-4xl text-[color:var(--bone)]">Complete natal result fixture</h2>
        </header>
        <NatalReadingResult
          result={natalResultFixture}
          monthAheadResult={monthAheadFixture}
          defaultOpenAdvanced
          sharePreviewEnabled={false}
        />
      </section>

      {selectedFixtureCard && selectedFixtureCardIndex !== null && (
        <CardDetailsDialog
          card={selectedFixtureCard}
          position={SPREADS["three-card"].positions[selectedFixtureCardIndex]}
          currentIndex={selectedFixtureCardIndex}
          cardCount={chamberCards.length}
          onClose={closeFixtureDialog}
          onPrevious={() => setSelectedFixtureCardIndex((index) => Math.max(0, (index ?? 0) - 1))}
          onNext={() => setSelectedFixtureCardIndex((index) => Math.min(chamberCards.length - 1, (index ?? 0) + 1))}
          dialogRef={fixtureDialogRef}
          initialFocusRef={fixtureDialogInitialFocusRef}
        />
      )}
    </div>
  );
}
