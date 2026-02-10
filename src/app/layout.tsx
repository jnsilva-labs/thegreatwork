import type { Metadata } from "next";
import { CodexChrome } from "@/components/ui/CodexChrome";
import { NavBar } from "@/components/ui/NavBar";
import { Footer } from "@/components/ui/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Awareness Paradox",
  description:
    "Ancient wisdom for modern awakening. Explore alchemy, tarot, astrology, sacred geometry, and the Hermetic principles.",
  metadataBase: new URL("https://awarenessparadox.com"),
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: ["/favicon.ico"],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "Awareness Paradox",
    description:
      "Ancient wisdom for modern awakening. Explore alchemy, tarot, astrology, sacred geometry, and the Hermetic principles.",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Awareness Paradox",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Awareness Paradox",
    description:
      "Ancient wisdom for modern awakening. Explore alchemy, tarot, astrology, sacred geometry, and the Hermetic principles.",
    images: ["/twitter-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="obsidian" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
(() => {
  try {
    const stored = localStorage.getItem("ap-theme");
    const theme = stored === "obsidian" || stored === "abyssal" || stored === "crimson" ? stored : "obsidian";
    document.documentElement.dataset.theme = theme;
  } catch (e) {}
})();`,
          }}
        />
      </head>
      <body className="antialiased">
        <NavBar />
        <CodexChrome />
        <div className="relative z-10 pt-20">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
