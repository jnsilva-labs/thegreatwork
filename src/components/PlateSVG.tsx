"use client";

import { useMemo } from "react";
import type { GeometrySlug } from "@/data/geometryCatalog";
import { GEOMETRY } from "@/data/geometryCatalog";
import { generateGeometry } from "@/lib/geometry/generators";
import { renderPlateSvg, type PlateVariant } from "@/lib/plates/renderPlateSvg";
import { assertGeometryCatalog } from "@/lib/geometry/assertCatalog";

const plateCache = new Map<string, string>();

type PlateSVGProps = {
  slug: GeometrySlug;
  variant?: PlateVariant;
  className?: string;
};

export function PlateSVG({ slug, variant = "thumbnail", className }: PlateSVGProps) {
  const svg = useMemo(() => {
    assertGeometryCatalog();
    const cacheKey = `${slug}-${variant}`;
    const cached = plateCache.get(cacheKey);
    if (cached) return cached;

    try {
      const geometry = generateGeometry(slug, { size: 2, detail: 140 });
      const svg = renderPlateSvg(geometry, {
        width: variant === "thumbnail" ? 320 : 640,
        height: variant === "thumbnail" ? 240 : 480,
        padding: variant === "thumbnail" ? 26 : 40,
        strokeWidth: variant === "thumbnail" ? 1.2 : 1.6,
        styleVariant: variant,
        seed: hashSlug(slug),
      });
      plateCache.set(cacheKey, svg);
      return svg;
    } catch {
      const title = GEOMETRY.find((item) => item.slug === slug)?.title ?? slug;
      const svg = renderErrorPlate(title);
      plateCache.set(cacheKey, svg);
      return svg;
    }
  }, [slug, variant]);

  return (
    <div
      className={className}
      aria-hidden
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

function renderErrorPlate(title: string) {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="320" height="240" viewBox="0 0 320 240">\n  <rect width="320" height="240" fill="#1b1611" stroke="#b89b5e" stroke-width="2"/>\n  <text x="24" y="120" fill="#e8e3d8" font-size="14" font-family="serif">Plate error: ${title}</text>\n</svg>`;
}

function hashSlug(slug: string) {
  let hash = 0;
  for (let i = 0; i < slug.length; i += 1) {
    hash = (hash << 5) - hash + slug.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) + 1;
}
