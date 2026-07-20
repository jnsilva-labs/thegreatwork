import { EditorialSpread, MarginalNote, RitualLink, TrustNote } from "@/components/editorial";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "About",
  path: "/about",
  description: "The purpose and editorial posture of Awareness Paradox.",
});

export default function AboutPage() {
  return (
    <div className="min-h-screen px-6 py-16 text-[color:var(--bone)] sm:px-10 lg:px-20">
      <div className="mx-auto max-w-6xl">
        <header className="max-w-3xl space-y-5 pb-12">
          <p className="type-eyebrow text-[color:var(--gilt)]">The archive</p>
          <h1 className="type-display font-ritual">About</h1>
          <p className="type-body prose-measure text-[color:var(--mist)]">
            Awareness Paradox is a living study space for people who want symbolic traditions presented with beauty, context, and room for independent judgment.
          </p>
        </header>

        <EditorialSpread
          variant="quote"
          eyebrow="Editorial posture"
          title="Wonder and discernment belong in the same room."
          marginalia={<MarginalNote heading="Orientation">Read slowly. Check sources. Keep what proves useful.</MarginalNote>}
        >
          <p>
            The archive brings Hermetic texts, alchemical images, tarot, astrology, and sacred geometry into conversation. Historical claims are separated from modern reflection, and source notes remain visible wherever possible.
          </p>
        </EditorialSpread>

        <TrustNote heading="How to read this work" link={{ href: "/method", label: "Read the Method" }}>
          Interpretive tools are invitations to reflect, not declarations of fate or substitutes for professional care.
        </TrustNote>

        <div className="mt-10 flex flex-wrap gap-4">
          <RitualLink href="/method" location="about" label="Method">Method</RitualLink>
          <RitualLink href="/sources" location="about" label="Sources" tone="quiet">Sources</RitualLink>
        </div>
      </div>
    </div>
  );
}
