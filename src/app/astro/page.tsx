import { redirect } from "next/navigation";
import { buildPageMetadata } from "@/lib/seo/metadata";

const ASTRO_BETA_DESCRIPTION =
  "Natal oracle route retained as a legacy alias that redirects into the public astrology experience.";

export const metadata = buildPageMetadata({
  title: "Natal Oracle",
  path: "/astro",
  description: ASTRO_BETA_DESCRIPTION,
  noIndex: true,
  keywords: ["natal chart", "astrology reading"],
});

export default function AstroPage() {
  redirect("/astrology");
}
