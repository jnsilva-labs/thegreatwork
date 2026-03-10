import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Styleguide",
  path: "/styleguide",
  description: "Internal styleguide and token reference for Awareness Paradox.",
  noIndex: true,
});

export default function StyleguideLayout({ children }: { children: React.ReactNode }) {
  return children;
}
