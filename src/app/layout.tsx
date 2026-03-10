import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { PostHogProvider } from "@/components/analytics/PostHogProvider";
import { JsonLd } from "@/components/seo/JsonLd";
import { CodexChrome } from "@/components/ui/CodexChrome";
import { NavBar } from "@/components/ui/NavBar";
import { Footer } from "@/components/ui/Footer";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildOrganizationSchema, buildWebsiteSchema } from "@/lib/seo/schema";
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
        <PostHogProvider>
          <JsonLd id="website-schema" data={buildWebsiteSchema()} />
          <JsonLd id="organization-schema" data={buildOrganizationSchema()} />
          <NavBar />
          <CodexChrome />
          <div className="relative z-10 pt-20">{children}</div>
          <Footer />
        </PostHogProvider>
        <Analytics />
      </body>
    </html>
  );
}
