import type { Metadata } from "next";
import { NatalChartWidget } from "@/components/astro/NatalChartWidget";

export const metadata: Metadata = {
  title: "Natal Oracle — Awareness Paradox",
  description:
    "Private beta: generate a deterministic natal chart and reflective interpretation for self-inquiry.",
  robots: {
    index: false,
    follow: false
  }
};

export default function AstroPage() {
  return (
    <main className="min-h-screen bg-sacred-geo pb-16 pt-10">
      <div className="mx-auto w-full max-w-6xl">
        <NatalChartWidget />
      </div>
    </main>
  );
}
