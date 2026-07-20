import { EtchedList, RitualLink, TrustNote } from "@/components/editorial";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Method",
  path: "/method",
  description: "How Awareness Paradox separates sources, computation, and AI-assisted interpretation.",
});

const methodSteps = [
  { id: "source", title: "Begin with the record", body: "Historical essays and image plates identify the texts, collections, and public-domain works that ground them." },
  { id: "compute", title: "Compute before interpreting", body: "Astrology uses calculated chart facts; tarot uses the cards and spread actually drawn. The interpretation is constrained by that supplied context." },
  { id: "reflect", title: "Return judgment to the reader", body: "AI-assisted language is framed as reflection. You decide what is accurate, useful, or better left aside." },
] as const;

export default function MethodPage() {
  return (
    <div className="min-h-screen px-6 py-16 text-[color:var(--bone)] sm:px-10 lg:px-20">
      <div className="mx-auto max-w-5xl space-y-12">
        <header className="max-w-3xl space-y-5">
          <p className="type-eyebrow text-[color:var(--gilt)]">Evidence · instrument · reflection</p>
          <h1 className="type-display font-ritual">Method</h1>
          <p className="type-body prose-measure text-[color:var(--mist)]">
            The site distinguishes source material, calculated or selected inputs, and the interpretive language built from them.
          </p>
        </header>

        <EtchedList items={methodSteps} ordered marker="numeral" headingLevel="h2" />

        <TrustNote heading="AI assistance is disclosed" eyebrow="Interpretation note" headingLevel="h2">
          Tarot and astrology readings use AI-assisted language. They are designed for reflective inquiry and do not establish facts about your future, health, finances, legal position, or identity.
        </TrustNote>

        <div className="flex flex-wrap gap-4">
          <RitualLink href="/sources" location="method" label="Review Sources">Review Sources</RitualLink>
          <RitualLink href="/privacy" location="method" label="Privacy" tone="quiet">Privacy</RitualLink>
        </div>
      </div>
    </div>
  );
}
