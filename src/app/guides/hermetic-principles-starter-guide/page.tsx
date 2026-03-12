import Link from "next/link";
import { EmailCtaCard } from "@/components/marketing/EmailCtaCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildWebPageSchema } from "@/lib/seo/schema";

const GUIDE_DESCRIPTION =
  "Download the free 7 Hermetic Principles Starter Guide: plain-language explanations, practical prompts, and a beginner path into Awareness Paradox.";

export const metadata = buildPageMetadata({
  title: "Free Guide: 7 Hermetic Principles Starter Guide",
  path: "/guides/hermetic-principles-starter-guide",
  description: GUIDE_DESCRIPTION,
  keywords: [
    "7 Hermetic principles pdf",
    "Hermetic principles guide",
    "Hermetic principles for beginners",
    "free Hermetic guide",
  ],
});

const included = [
  "A plain-language overview of all seven Hermetic principles",
  "How each principle shows up in everyday life",
  "Reflection prompts to help you begin practicing immediately",
  "A curated next-step path into astrology, meditation, and deeper study",
];

export default function HermeticStarterGuideLandingPage() {
  return (
    <div className="min-h-screen px-6 py-20 text-[color:var(--bone)] sm:px-10 lg:px-20">
      <div className="mx-auto max-w-5xl space-y-12">
        <JsonLd
          id="starter-guide-landing-schema"
          data={buildWebPageSchema({
            name: "7 Hermetic Principles Starter Guide",
            path: "/guides/hermetic-principles-starter-guide",
            description: GUIDE_DESCRIPTION,
          })}
        />

        <header className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div className="space-y-5">
            <p className="text-xs uppercase tracking-[0.4em] text-[color:var(--mist)]">
              Free Starter Guide
            </p>
            <h1 className="font-ritual text-4xl leading-tight sm:text-6xl">
              7 Hermetic Principles Starter Guide
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-[color:var(--mist)] sm:text-lg">
              Begin with a clear map. This guide introduces the seven Hermetic principles in
              accessible language, grounded practice, and beginner-safe next steps.
            </p>
            <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.25em] text-[color:var(--mist)]">
              <span className="rounded-full border border-[color:var(--copper)]/50 px-4 py-2">
                Beginner-friendly
              </span>
              <span className="rounded-full border border-[color:var(--copper)]/50 px-4 py-2">
                Practical prompts
              </span>
              <span className="rounded-full border border-[color:var(--copper)]/50 px-4 py-2">
                Free delivery by email
              </span>
            </div>
          </div>

          <div className="rounded-[1.6rem] border border-[color:var(--copper)]/22 bg-[color:var(--obsidian)]/22 p-6">
            <p className="text-xs uppercase tracking-[0.35em] text-[color:var(--gilt)]">
              What You’ll Get
            </p>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-[color:var(--mist)]">
              {included.map((item) => (
                <li key={item}>— {item}</li>
              ))}
            </ul>
            <div className="mt-6 rounded-xl border border-[color:var(--copper)]/18 bg-[color:var(--obsidian)]/20 p-4">
              <p className="text-xs uppercase tracking-[0.35em] text-[color:var(--mist)]">
                Delivery
              </p>
              <p className="mt-2 text-sm text-[color:var(--mist)]">
                Subscribe on Substack and the guide link is delivered in your welcome email,
                along with weekly letters and your next study steps.
              </p>
            </div>
          </div>
        </header>

        <EmailCtaCard
          title="Send Me the Starter Guide"
          body="Subscribe on Substack to receive the free guide and weekly beginner letters. You can unsubscribe at any time."
          source="starter-guide-landing"
          interests={["beginner-hermetic"]}
          ctaNote="The guide is delivered through the welcome email. Already on the list? Use the private link from that email."
          secondaryHref="/start-here"
          secondaryLabel="Browse Start Here"
        />

        <section className="rounded-[1.6rem] border border-[color:var(--copper)]/20 bg-[color:var(--obsidian)]/18 p-6">
          <h2 className="font-ritual text-2xl">After the Guide</h2>
          <p className="mt-3 text-sm leading-relaxed text-[color:var(--mist)] sm:text-base">
            Once you begin with the Hermetic principles, the next recommended path is{" "}
            <Link href="/astrology" className="underline decoration-[color:var(--copper)]/50 underline-offset-4">
              astrology for self-understanding
            </Link>
            {" "}and the{" "}
            <Link href="/journey" className="underline decoration-[color:var(--copper)]/50 underline-offset-4">
              interactive principles journey
            </Link>
            . Awareness Paradox is designed as a living study path, not a one-time download.
          </p>
        </section>
      </div>
    </div>
  );
}
