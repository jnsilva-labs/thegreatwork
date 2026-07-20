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
import { DEFAULT_DECK } from "@/features/tarot/constants";
import type { DrawnCard } from "@/features/tarot/types";

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

export function VisualQaFixtures() {
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
    </div>
  );
}
