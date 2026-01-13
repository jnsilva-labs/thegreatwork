import { notFound } from "next/navigation";
import { GEOMETRY } from "@/data/geometryCatalog";
import { GalleryDetailClient } from "@/components/gallery/GalleryDetailClient";

export default async function GalleryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const plate = GEOMETRY.find((item) => item.slug === slug);
  if (!plate) {
    notFound();
  }

  return (
    <div className="min-h-screen px-6 py-20 text-[color:var(--bone)] sm:px-10 lg:px-20">
      <GalleryDetailClient plate={plate} />
    </div>
  );
}
