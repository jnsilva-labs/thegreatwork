import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildWebPageSchema } from "@/lib/seo/schema";

const RIPLEY_SCROLL_DESCRIPTION =
  "A cinematic scroll reading of the Ripley Scroll tradition with synchronized visual scenes, annotations, and ritual atmosphere.";

export const metadata: Metadata = buildPageMetadata({
  title: "Ripley Scroll",
  path: "/ripley-scroll",
  description: RIPLEY_SCROLL_DESCRIPTION,
  keywords: ["Ripley Scroll", "alchemy scroll", "Great Work", "alchemical symbolism"],
});

export default function RipleyScrollLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        id="ripley-scroll-webpage-schema"
        data={buildWebPageSchema({
          name: "Ripley Scroll",
          path: "/ripley-scroll",
          description: RIPLEY_SCROLL_DESCRIPTION,
        })}
      />
      {children}
    </>
  );
}
