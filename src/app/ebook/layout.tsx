import type { Metadata } from "next";
import "./ebook-print.css";

export const metadata: Metadata = {
  title: "7 Hermetic Principles Starter Guide — Awareness Paradox",
  description:
    "A clear beginner path into Hermetic thought, self-observation, and contemplative practice.",
  robots: { index: false, follow: false },
};

export default function EbookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
