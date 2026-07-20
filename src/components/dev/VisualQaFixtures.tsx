import {
  ArchivalFigure,
  EditorialSpread,
  EtchedList,
  MarginalNote,
  OraclePanel,
  RitualLink,
  TrustNote,
} from "@/components/editorial";

const pathItems = [
  { id: "observe", title: "Observe", body: "Meet the symbol before assigning it a meaning." },
  { id: "record", title: "Record", body: "Write the first precise change in attention." },
  { id: "return", title: "Return", body: "Revisit the same form after the mind becomes quiet." },
];

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
    </div>
  );
}
