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
      <div className="mx-auto max-w-6xl space-y-12">
        <JsonLd
          id="gallery-collection-schema"
          data={buildCollectionPageSchema({
            name: "Sacred Geometry Gallery",
            path: "/gallery",
            description: GALLERY_DESCRIPTION,
            itemPaths: GEOMETRY.map((plate) => `/gallery/${plate.slug}`),
          })}
        />
        <header className="space-y-4">
          <p className="text-xs uppercase tracking-[0.4em] text-[color:var(--mist)]">
            Sacred Geometry Gallery
          </p>
          <h1 className="font-ritual text-5xl sm:text-6xl">Geometry Plates</h1>
          <p className="max-w-2xl text-base text-[color:var(--mist)] sm:text-lg">
            A curated cabinet of geometric constructions rendered as engraved plates and
            living linework.
          </p>
          <div className="max-w-3xl space-y-4 text-sm text-[color:var(--mist)] sm:text-base">
            <p>
              For centuries, these forms were treated as instruments, not decoration.
              Artisans set them into temples and cathedrals, scholars drafted them into
              treatises, and initiatory schools used them to train attention, memory, and
              proportion. Geometry was a way to study order with the eyes and the hands at
              the same time.
            </p>
            <p>
              Spend a few minutes with each plate and let your pacing slow down. Follow the
              repetitions, intersections, and expansions until the pattern becomes familiar.
              That practice can settle mental noise, improve spatial clarity, and sharpen
              your sense of relationship across scales, from your own body to the larger
              structures of nature.
            </p>
          </div>
        </header>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {GEOMETRY.map((plate) => (
            <Link
              key={plate.slug}
              href={`/gallery/${plate.slug}`}
              className="group rounded-2xl border border-[color:var(--copper)]/40 bg-[color:var(--char)]/50 p-5 transition hover:border-[color:var(--gilt)]"
            >
              <div className="aspect-[4/3] overflow-hidden rounded-xl border border-[color:var(--copper)]/30 bg-[color:var(--obsidian)]/60">
                <PlateSVG
                  slug={plate.slug}
                  variant="thumbnail"
                  className="h-full w-full opacity-90 transition group-hover:opacity-100"
                />
              </div>
              <div className="mt-4 space-y-2">
                <h2 className="font-ritual text-2xl">{plate.title}</h2>
                <p className="text-sm text-[color:var(--mist)]">{plate.caption}</p>
              </div>
            </Link>
          ))}
        </div>

        <section className="rounded-2xl border border-[color:var(--copper)]/30 bg-[color:var(--char)]/40 p-6">
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
