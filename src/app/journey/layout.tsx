import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildWebPageSchema } from "@/lib/seo/schema";

const JOURNEY_DESCRIPTION =
  "A guided ritual session through the seven Hermetic principles using sacred geometry, breath cues, and contemplative prompts.";

export const metadata: Metadata = buildPageMetadata({
  title: "Principles in Motion",
  path: "/journey",
  description: JOURNEY_DESCRIPTION,
  keywords: ["Hermetic principles", "interactive journey", "sacred geometry", "meditative visualization"],
});

export default function JourneyLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        id="journey-webpage-schema"
        data={buildWebPageSchema({
          name: "Principles in Motion",
          path: "/journey",
          description: JOURNEY_DESCRIPTION,
        })}
      />
      {children}
    </>
  );
}
