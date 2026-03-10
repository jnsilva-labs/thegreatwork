export const STARTER_GUIDE_PDF_URL =
  "https://cziuwes8ddupfrhu.public.blob.vercel-storage.com/hermetic-principles-starter-guide.pdf";

export function hasStarterGuideAccess(token?: string | null): boolean {
  const expected = process.env.STARTER_GUIDE_ACCESS_TOKEN?.trim();
  if (!expected) {
    return false;
  }

  return token === expected;
}
