import { EtchedList, RitualLink, TrustNote } from "@/components/editorial";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Privacy",
  path: "/privacy",
  description: "A plain-language account of data used by Awareness Paradox reading tools.",
});

const dataFlows = [
  {
    id: "tarot",
    title: "Tarot readings",
    body: "Tarot questions, intentions, selected cards, and spread context are processed by the relevant interpretation service to generate a reading. Saved journal entries and tarot settings are stored in your browser unless you remove them.",
  },
  {
    id: "astrology",
    title: "Astrology readings",
    body: "Birth date, birth time when supplied, birthplace, and calculated chart data are processed by the relevant chart and interpretation services to generate natal or timing readings.",
  },
  {
    id: "choice",
    title: "Share the minimum",
    body: "Enter only the information needed for the reading you request. If an exact birth time is unknown, use the unknown-time option rather than guessing.",
  },
] as const;

export default function PrivacyPage() {
  return (
    <div className="min-h-screen px-6 py-16 text-[color:var(--bone)] sm:px-10 lg:px-20">
      <div className="mx-auto max-w-5xl space-y-12">
        <header className="max-w-3xl space-y-5">
          <p className="type-eyebrow text-[color:var(--gilt)]">Plain-language data note</p>
          <h1 className="type-display font-ritual">Privacy</h1>
          <p className="type-body prose-measure text-[color:var(--mist)]">
            This page describes the information the reading tools use. It does not make promises about service-provider retention that the application cannot verify.
          </p>
        </header>

        <EtchedList items={dataFlows} marker="glyph" headingLevel="h2" />

        <TrustNote heading="Reflective guidance, not professional advice" eyebrow="Scope" headingLevel="h2">
          Readings are AI-assisted reflective guidance. They are not medical, legal, financial, or other professional advice, and they should not replace qualified care or your own judgment.
        </TrustNote>

        <div className="flex flex-wrap gap-4">
          <RitualLink href="/method" location="privacy" label="Read the Method">Read the Method</RitualLink>
          <RitualLink href="/sources" location="privacy" label="Review Sources" tone="quiet">Review Sources</RitualLink>
        </div>
      </div>
    </div>
  );
}
