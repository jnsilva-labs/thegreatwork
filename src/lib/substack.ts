export const DEFAULT_SUBSTACK_URL = "https://substack.com/@awarenessparadox";

export function getSubstackUrl() {
  const envUrl = process.env.NEXT_PUBLIC_SUBSTACK_URL?.trim();
  return envUrl && envUrl.length > 0 ? envUrl : DEFAULT_SUBSTACK_URL;
}

export function isExternalHref(href: string) {
  return href.startsWith("https://") || href.startsWith("http://");
}
