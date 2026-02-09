import Link from "next/link";
import { GEOMETRY } from "@/data/geometryCatalog";
import { PlateSVG } from "@/components/PlateSVG";

export default function GalleryPage() {
  return (
    <div className="min-h-screen px-6 py-20 text-[color:var(--bone)] sm:px-10 lg:px-20">
      <div className="mx-auto max-w-6xl space-y-12">
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
      </div>
    </div>
  );
}
