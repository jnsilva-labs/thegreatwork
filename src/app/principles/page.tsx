import Link from "next/link";
import { EmailCtaCard } from "@/components/marketing/EmailCtaCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { principles } from "@/data/principles";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildCollectionPageSchema } from "@/lib/seo/schema";

const PRINCIPLES_DESCRIPTION =
  "Study the seven Hermetic principles in canonical order, with axioms, keys, and short contemplative practices.";

export const metadata = buildPageMetadata({
  title: "Hermetic Principles",
  path: "/principles",
  description: PRINCIPLES_DESCRIPTION,
  keywords: ["Hermetic principles", "Kybalion", "mentalism", "correspondence", "esoteric philosophy"],
});

export default function PrinciplesIndexPage() {
  return (
    <div className="min-h-screen px-6 py-20 text-[color:var(--bone)] sm:px-10 lg:px-20">
      <div className="mx-auto max-w-5xl space-y-12">
        <JsonLd
          id="principles-collection-schema"
          data={buildCollectionPageSchema({
            name: "Hermetic Principles Index",
            path: "/principles",
            description: PRINCIPLES_DESCRIPTION,
            itemPaths: principles.map((principle) => `/principles/${principle.slug}`),
          })}
        />
        <header className="space-y-4">
          <p className="text-xs uppercase tracking-[0.4em] text-[color:var(--mist)]">
            Hermetic Principles
          </p>
          <h1 className="font-ritual text-5xl sm:text-6xl">Principles Index</h1>
          <p className="max-w-2xl text-base text-[color:var(--mist)] sm:text-lg">
            Each principle is presented in the canonical order with axiom, marginalia,
            and a brief practice.
          </p>
        </header>

        <div className="divide-y divide-[color:var(--copper)]/30">
          {principles.map((principle, index) => (
            <Link
              key={principle.slug}
              href={`/principles/${principle.slug}`}
              className="group block py-6 transition hover:text-[color:var(--bone)]"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-xs uppercase tracking-[0.4em] text-[color:var(--mist)]">
                    {"I II III IV V VI VII".split(" ")[index]}
                  </div>
                  <h2 className="font-ritual text-3xl">{principle.title}</h2>
                </div>
                <p className="max-w-md text-sm text-[color:var(--mist)]">
                  {principle.short}
                </p>
              </div>
            </Link>
          ))}
        </div>
        <EmailCtaCard
          title="Get the beginner guide before you go deeper"
          body="Receive the free 7 Hermetic Principles Starter Guide with plain-language explanations, reflection prompts, and the weekly Awareness Paradox letters."
          source="principles-index"
          interests={["beginner-hermetic"]}
          secondaryHref="/guides/hermetic-principles-starter-guide"
          secondaryLabel="Free Starter Guide"
        />
        <footer className="border-t border-[color:var(--copper)]/40 pt-6 text-xs uppercase tracking-[0.35em] text-[color:var(--mist)]">
          Axioms and sequence follow The Kybalion (1908). Pair this index with the{" "}
          <Link href="/gallery" className="underline decoration-[color:var(--copper)]/50 underline-offset-4">
            Sacred Geometry Gallery
          </Link>{" "}
          to study form and principle together.
        </footer>
      </div>
    </div>
  );
}
