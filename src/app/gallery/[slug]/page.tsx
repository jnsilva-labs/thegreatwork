import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { GalleryDetailClient } from "@/components/gallery/GalleryDetailClient";
import { GEOMETRY } from "@/data/geometryCatalog";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbSchema, buildWebPageSchema } from "@/lib/seo/schema";

type RouteParams = { slug: string };

export function generateStaticParams(): RouteParams[] {
  return GEOMETRY.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const plate = GEOMETRY.find((item) => item.slug === slug);

  if (!plate) {
    return buildPageMetadata({
      title: "Geometry Plate Not Found",
      path: `/gallery/${slug}`,
      description: "Requested sacred geometry plate was not found.",
      noIndex: true,
    });
  }

  return buildPageMetadata({
    title: `${plate.title} Geometry Plate`,
    path: `/gallery/${plate.slug}`,
    description: `${plate.caption} Explore an interactive rendering and construction notes for ${plate.title.toLowerCase()}.`,
    keywords: [...plate.tags, plate.title, "sacred geometry"],
  });
}

export default async function GalleryDetailPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { slug } = await params;
  const plate = GEOMETRY.find((item) => item.slug === slug);
  if (!plate) {
    notFound();
  }

  return (
    <div className="min-h-screen px-6 py-20 text-[color:var(--bone)] sm:px-10 lg:px-20">
      <div className="mx-auto mb-6 max-w-6xl">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.3em] text-[color:var(--mist)]"
        >
          <Link href="/" className="transition hover:text-[color:var(--bone)]">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <Link href="/gallery" className="transition hover:text-[color:var(--bone)]">
            Sacred Geometry
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-[color:var(--bone)]">{plate.title}</span>
        </nav>
      </div>
      <JsonLd
        id={`gallery-detail-breadcrumb-${plate.slug}`}
        data={buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Sacred Geometry Gallery", path: "/gallery" },
          { name: plate.title, path: `/gallery/${plate.slug}` },
        ])}
      />
      <JsonLd
        id={`gallery-detail-webpage-${plate.slug}`}
        data={buildWebPageSchema({
          name: `${plate.title} Geometry Plate`,
          path: `/gallery/${plate.slug}`,
          description: `${plate.caption} ${plate.description[0]}`,
        })}
      />
      <GalleryDetailClient plate={plate} />
      <div className="mx-auto mt-10 max-w-6xl rounded-2xl border border-[color:var(--copper)]/30 bg-[color:var(--char)]/40 p-6">
        <h2 className="font-ritual text-2xl">Related Study Paths</h2>
        <p className="mt-2 text-sm text-[color:var(--mist)]">
          Compare this plate against the Hermetic principles or return to the full gallery
          to continue the geometric sequence.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/gallery"
            className="inline-flex min-h-[44px] items-center rounded-full border border-[color:var(--copper)]/60 px-4 py-2 text-xs uppercase tracking-[0.3em] transition hover:border-[color:var(--gilt)]"
          >
            Back to Gallery
          </Link>
          <Link
            href="/principles"
            className="inline-flex min-h-[44px] items-center rounded-full border border-[color:var(--copper)]/60 px-4 py-2 text-xs uppercase tracking-[0.3em] transition hover:border-[color:var(--gilt)]"
          >
            Hermetic Principles
          </Link>
        </div>
      </div>
    </div>
  );
}
