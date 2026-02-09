import type { Metadata } from "next";
import { cookies } from "next/headers";
import { NatalChartWidget } from "@/components/astro/NatalChartWidget";
import { AstroAccessGate } from "@/components/astro/AstroAccessGate";
import { hasAstroBetaAccess } from "@/lib/astro/auth";

export const metadata: Metadata = {
  title: "Natal Oracle — Awareness Paradox",
  description:
    "Private beta: generate a deterministic natal chart and reflective interpretation for self-inquiry.",
  robots: {
    index: false,
    follow: false
  }
};

export default async function AstroPage() {
  const cookieStore = await cookies();
  const hasAccess = hasAstroBetaAccess(cookieStore);

  return (
    <main className="min-h-screen bg-sacred-geo pb-16 pt-10">
      <div className="mx-auto w-full max-w-6xl">
        {hasAccess ? <NatalChartWidget /> : <AstroAccessGate />}
      </div>
    </main>
  );
}
