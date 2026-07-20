import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { PostHogProvider } from "@/components/analytics/PostHogProvider";
import { JsonLd } from "@/components/seo/JsonLd";
import { CodexChrome } from "@/components/ui/CodexChrome";
import { NavBar } from "@/components/ui/NavBar";
import { Footer } from "@/components/ui/Footer";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildOrganizationSchema, buildWebsiteSchema } from "@/lib/seo/schema";
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/400-italic.css";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/500.css";
import "@fontsource/manrope/600.css";
import "@fontsource/manrope/700.css";
import "./globals.css";

export const metadata: Metadata = {
  ...buildPageMetadata({ path: "/" }),
  metadataBase: new URL("https://www.awarenessparadox.com"),
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: ["/favicon.ico"],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
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
        <a
          href="#main-content"
          className="fixed left-4 top-4 z-[100] inline-flex min-h-[44px] -translate-y-24 items-center border border-[color:var(--gilt)] bg-[color:var(--obsidian)] px-4 text-xs uppercase tracking-[0.18em] text-[color:var(--bone)] transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        <PostHogProvider>
          <JsonLd id="website-schema" data={buildWebsiteSchema()} />
          <JsonLd id="organization-schema" data={buildOrganizationSchema()} />
          <NavBar />
          <CodexChrome />
          <main id="main-content" tabIndex={-1} className="relative z-10 pt-20">
            {children}
          </main>
          <Footer />
        </PostHogProvider>
        <Analytics />
      </body>
    </html>
  );
}
