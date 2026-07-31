import Link from "next/link";
import { EmailCtaCard } from "@/components/marketing/EmailCtaCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { GEOMETRY } from "@/data/geometryCatalog";
import { PlateSVG } from "@/components/PlateSVG";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildCollectionPageSchema } from "@/lib/seo/schema";

const GALLERY_DESCRIPTION =
  "Explore sacred geometry plates with interactive linework studies, construction notes, and symbolic context for core geometric forms.";

export const metadata = buildPageMetadata({
  title: "Sacred Geometry Gallery",
  path: "/gallery",
  description: GALLERY_DESCRIPTION,
  keywords: [
    "sacred geometry",
    "flower of life",
    "metatron's cube",
    "golden spiral",
    "geometry plates",
  ],
});

export default function GalleryPage() {
  return (
    <div className="min-h-screen px-6 py-20 text-[color:var(--bone)] sm:px-10 lg:px-20">
      <div className="mx-auto max-w-7xl space-y-16">
        <JsonLd
          id="gallery-collection-schema"
          data={buildCollectionPageSchema({
            name: "Sacred Geometry Gallery",
            path: "/gallery",
            description: GALLERY_DESCRIPTION,
            itemPaths: GEOMETRY.map((plate) => `/gallery/${plate.slug}`),
          })}
        />
        <header className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.4em] text-[color:var(--mist)]">
              Sacred Geometry Gallery
            </p>
            <h1 className="font-ritual text-5xl sm:text-6xl">Geometry Plates</h1>
            <p className="max-w-2xl text-base text-[color:var(--mist)] sm:text-lg">
              A curated cabinet of geometric constructions rendered as engraved plates and
              living linework.
            </p>
          </div>
          <div className="border-l border-[color:var(--copper)]/24 pl-6">
            <p className="text-xs uppercase tracking-[0.35em] text-[color:var(--gilt)]">How to look</p>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-[color:var(--mist)] sm:text-base">
              Spend a few minutes with one plate at a time. Let the repetitions, crossings, and expansions
              settle into the eye until the form starts to feel less decorative and more intelligible.
            </p>
          </div>
        </header>

        <div className="max-w-3xl space-y-4 text-sm text-[color:var(--mist)] sm:text-base">
          <p>
            For centuries, these forms were treated as instruments, not decoration.
            Artisans set them into temples and cathedrals, scholars drafted them into
            treatises, and initiatory schools used them to train attention, memory, and
            proportion. Geometry was a way to study order with the eyes and the hands at
            the same time.
          </p>
          <p>
            Follow one plate slowly. That practice can settle mental noise, improve spatial clarity,
            and sharpen your sense of relationship across scales, from your own body to the larger
            structures of nature.
          </p>
        </div>

        <section aria-labelledby="cabinet-heading" className="space-y-7">
          <div className="flex items-end justify-between gap-6 border-b border-[color:var(--stone)]/20 pb-4">
            <div>
              <p className="type-eyebrow text-[color:var(--gilt)]">Cabinet I</p>
              <h2 id="cabinet-heading" className="mt-2 font-ritual text-3xl sm:text-4xl">
                Eight studies in proportion
              </h2>
            </div>
            <p className="hidden text-xs uppercase tracking-[0.2em] text-[color:var(--mist)] sm:block">
              Plates 01–08
            </p>
          </div>
          <div className="gallery-cabinet grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:gap-x-12">
            {GEOMETRY.map((plate, index) => (
              <article key={plate.slug} className="gallery-plate group">
                <figure>
                  <div className="gallery-plate__figure aspect-[4/3] overflow-hidden border border-[color:var(--stone)]/24 bg-[color:var(--paper)]/90">
                    <PlateSVG
                      slug={plate.slug}
                      variant="detail"
                      className="h-full w-full opacity-90 transition-opacity duration-200 group-hover:opacity-100"
                    />
                  </div>
                  <figcaption className="plate-caption">
                    <span>Fig. {String(index + 1).padStart(2, "0")}</span>
                    <span>{plate.caption}</span>
                  </figcaption>
                </figure>
                <div className="mt-5 flex items-end justify-between gap-5 border-b border-[color:var(--stone)]/18 pb-5">
                  <h3 className="font-ritual text-2xl sm:text-3xl">{plate.title}</h3>
                  <Link
                    href={`/gallery/${plate.slug}`}
                    className="inline-flex min-h-[44px] shrink-0 items-center border-b border-[color:var(--gilt)]/56 px-1 text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--gilt)] transition-colors hover:border-[color:var(--bone)] hover:text-[color:var(--bone)]"
                    aria-label={`Open ${plate.title} plate`}
                  >
                    Open plate
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="open-field px-6 py-8 sm:px-8">
          <h2 className="font-ritual text-2xl">Continue the Study</h2>
          <p className="mt-2 max-w-3xl text-sm text-[color:var(--mist)] sm:text-base">
            Geometry on this site is paired with Hermetic principles and symbolic practice.
            After exploring a plate, continue into the principles index or the alchemical overview.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/principles"
              className="inline-flex min-h-[44px] items-center rounded-full border border-[color:var(--copper)]/60 px-4 py-2 text-xs uppercase tracking-[0.3em] text-[color:var(--bone)] transition hover:border-[color:var(--gilt)]"
            >
              Read the Principles
            </Link>
            <Link
              href="/great-work"
              className="inline-flex min-h-[44px] items-center rounded-full border border-[color:var(--copper)]/60 px-4 py-2 text-xs uppercase tracking-[0.3em] text-[color:var(--bone)] transition hover:border-[color:var(--gilt)]"
            >
              Study the Great Work
            </Link>
          </div>
        </section>

        <EmailCtaCard
          title="Study the principles behind the patterns"
          body="Get the free Hermetic Principles Starter Guide to connect symbolic geometry with the core ideas and practices that animate the rest of the library."
          source="gallery-page"
          interests={["beginner-hermetic"]}
          variant="compact"
          secondaryHref="/principles"
          secondaryLabel="Principles Index"
        />
      </div>
    </div>
  );
}
