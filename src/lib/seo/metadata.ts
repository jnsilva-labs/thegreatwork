import type { Metadata } from "next";
import {
  OG_IMAGE_URL,
  SITE_DESCRIPTION,
  SITE_NAME,
  TWITTER_IMAGE_URL,
  absoluteUrl,
  pageTitle,
} from "@/lib/seo/site";

type BuildPageMetadataInput = {
  title?: string;
  description?: string;
  path: string;
  noIndex?: boolean;
  keywords?: string[];
};

export const buildPageMetadata = ({
  title,
  description = SITE_DESCRIPTION,
  path,
  noIndex = false,
  keywords,
}: BuildPageMetadataInput): Metadata => {
  const canonical = absoluteUrl(path);
  const resolvedTitle = pageTitle(title);

  return {
    title: resolvedTitle,
    description,
    keywords,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      url: canonical,
      title: resolvedTitle,
      description,
      images: [
        {
          url: OG_IMAGE_URL,
          width: 1200,
          height: 630,
          alt: title ? `${title} — ${SITE_NAME}` : SITE_NAME,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description,
      images: [TWITTER_IMAGE_URL],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          nocache: true,
          googleBot: {
            index: false,
            follow: false,
            noimageindex: true,
          },
        }
      : undefined,
  };
};

