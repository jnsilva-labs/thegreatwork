import { SITE_NAME, absoluteUrl } from "@/lib/seo/site";

type JsonLd = Record<string, unknown>;

type BreadcrumbItem = {
  name: string;
  path: string;
};

export const buildWebsiteSchema = (): JsonLd => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: absoluteUrl("/"),
  potentialAction: {
    "@type": "SearchAction",
    target: `${absoluteUrl("/")}?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
});

export const buildOrganizationSchema = (): JsonLd => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: absoluteUrl("/"),
  logo: absoluteUrl("/icon.png"),
});

export const buildWebPageSchema = ({
  name,
  path,
  description,
}: {
  name: string;
  path: string;
  description: string;
}): JsonLd => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  name,
  url: absoluteUrl(path),
  description,
  isPartOf: {
    "@type": "WebSite",
    name: SITE_NAME,
    url: absoluteUrl("/"),
  },
});

export const buildCollectionPageSchema = ({
  name,
  path,
  description,
  itemPaths,
}: {
  name: string;
  path: string;
  description: string;
  itemPaths: string[];
}): JsonLd => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name,
  url: absoluteUrl(path),
  description,
  isPartOf: {
    "@type": "WebSite",
    name: SITE_NAME,
    url: absoluteUrl("/"),
  },
  hasPart: itemPaths.map((itemPath) => ({
    "@type": "WebPage",
    url: absoluteUrl(itemPath),
  })),
});

export const buildBreadcrumbSchema = (items: BreadcrumbItem[]): JsonLd => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: absoluteUrl(item.path),
  })),
});
