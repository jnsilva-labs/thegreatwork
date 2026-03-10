export const SITE_NAME = "Awareness Paradox";
export const SITE_ORIGIN = "https://www.awarenessparadox.com";
export const SITE_DESCRIPTION =
  "Ancient wisdom for modern awakening. Explore alchemy, tarot, astrology, sacred geometry, and the Hermetic principles.";

export const INDEXABLE_STATIC_ROUTES = [
  "/",
  "/start-here",
  "/study",
  "/guides/hermetic-principles-starter-guide",
  "/letters",
  "/great-work",
  "/tarot",
  "/astrology",
  "/gallery",
  "/principles",
  "/journey",
  "/ripley-scroll",
] as const;

export const NOINDEX_ROUTES = ["/astro", "/styleguide", "/dev/plates", "/thank-you/starter-guide"] as const;

export const absoluteUrl = (path = "/"): string => {
  return new URL(path, SITE_ORIGIN).toString();
};

export const pageTitle = (title?: string): string => {
  return title ? `${title} | ${SITE_NAME}` : SITE_NAME;
};

export const OG_IMAGE_URL = "/opengraph-image";
export const TWITTER_IMAGE_URL = "/twitter-image";
