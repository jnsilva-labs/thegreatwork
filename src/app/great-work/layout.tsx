import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildWebPageSchema } from "@/lib/seo/schema";

const GREAT_WORK_DESCRIPTION =
  "An introduction to the alchemical Magnum Opus, its stages, symbols, and core terms within the Awareness Paradox library.";

export const metadata: Metadata = buildPageMetadata({
  title: "The Great Work",
  path: "/great-work",
  description: GREAT_WORK_DESCRIPTION,
  keywords: ["Great Work", "Magnum Opus", "alchemy", "solve et coagula", "nigredo albedo rubedo"],
});

export default function GreatWorkLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        id="great-work-webpage-schema"
        data={buildWebPageSchema({
          name: "The Great Work",
          path: "/great-work",
          description: GREAT_WORK_DESCRIPTION,
        })}
      />
      {children}
    </>
  );
}
