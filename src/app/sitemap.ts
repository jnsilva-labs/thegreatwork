import type { MetadataRoute } from "next";
import { GEOMETRY } from "@/data/geometryCatalog";
import { principles } from "@/data/principles";
import { INDEXABLE_STATIC_ROUTES, absoluteUrl } from "@/lib/seo/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticEntries = INDEXABLE_STATIC_ROUTES.map((path) => ({
    url: absoluteUrl(path),
    lastModified,
  }));

  const principleEntries = principles.map((principle) => ({
    url: absoluteUrl(`/principles/${principle.slug}`),
    lastModified,
  }));

  const galleryEntries = GEOMETRY.map((plate) => ({
    url: absoluteUrl(`/gallery/${plate.slug}`),
    lastModified,
  }));

  return [...staticEntries, ...principleEntries, ...galleryEntries];
}
