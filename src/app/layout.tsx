import type { Metadata } from "next";
import { CodexChrome } from "@/components/ui/CodexChrome";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sacred Geometry Codex",
  description:
    "A ritual interface exploring the seven Hermetic principles through sacred geometry.",
  openGraph: {
    title: "Sacred Geometry Codex",
    description:
      "A ritual interface exploring the seven Hermetic principles through sacred geometry.",
    images: [
      {
        url: "/og.svg",
        width: 1200,
        height: 630,
        alt: "Sacred Geometry Codex",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sacred Geometry Codex",
    description:
      "A ritual interface exploring the seven Hermetic principles through sacred geometry.",
    images: ["/og.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <CodexChrome />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
