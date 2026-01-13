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
