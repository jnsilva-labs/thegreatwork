import TarotApp from "@/features/tarot/TarotApp";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildWebPageSchema } from "@/lib/seo/schema";

const TAROT_DESCRIPTION =
  "A reflective tarot experience for self-inquiry, spreads, journaling, and symbolic interpretation inside Awareness Paradox.";

export const metadata = buildPageMetadata({
  title: "Tarot Alchemy",
  path: "/tarot",
  description: TAROT_DESCRIPTION,
  keywords: ["tarot reading", "tarot spreads", "tarot journal", "self inquiry tarot"],
});

export default function TarotPage() {
  return (
    <>
      <JsonLd
        id="tarot-webpage-schema"
        data={buildWebPageSchema({
          name: "Tarot Alchemy",
          path: "/tarot",
          description: TAROT_DESCRIPTION,
        })}
      />
      <TarotApp />
    </>
  );
}
