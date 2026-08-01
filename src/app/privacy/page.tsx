import { EtchedList, RitualLink, TrustNote } from "@/components/editorial";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Privacy",
  path: "/privacy",
  description: "A plain-language account of data used by Awareness Paradox reading tools.",
});

const dataFlows = [
  {
    id: "browser-storage",
    title: "Browser storage",
    body: "Tarot journal entries, Tarot settings, and custom decks are stored in browser localStorage. Settings can include an optional personal Gemini key, stored as plain text JSON rather than encrypted by this application. To remove it, clear the key field and press Save. You can delete journal entries in the app or clear this site's browser storage.",
  },
  {
    id: "tarot-providers",
    title: "Tarot interpretation providers",
    body: "Tarot questions, intentions, selected cards, and spread context are processed by the interpretation service. Shared readings use Vercel AI Gateway with Google Gemini as the primary model and Anthropic Claude as a fallback. If you use a personal Gemini key, your browser sends the key and reading prompt directly to Google Gemini.",
  },
  {
    id: "astrology-providers",
    title: "Astrology calculation and interpretation",
    body: "Birth details and chart data are processed by several services. A birthplace search goes to OpenCage or OpenStreetMap Nominatim; converted time and coordinates go to the configured astrology calculation service; the resulting chart data and optional name go to OpenAI for interpretive text.",
  },
  {
    id: "cookies-verification",
    title: "Usage cookies and verification",
    body: "A signed daily-usage cookie stores a random visitor ID, UTC day, and Tarot and natal usage counts. When astrology verification is required, Cloudflare Turnstile receives a verification token and may receive an IP address and user-agent; a successful check creates a short-lived astrology session cookie containing a signed expiry time.",
  },
  {
    id: "analytics",
    title: "Site analytics",
    body: "Vercel Analytics is loaded to measure site use. When configured, PostHog records page views and explicit site actions and uses its default browser persistence in localStorage and cookies; PostHog autocapture and session recording are disabled in the application configuration.",
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
