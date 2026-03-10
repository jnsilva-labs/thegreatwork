# Awareness Paradox Site Code Review + SEO Audit

Date: February 26, 2026
Scope: Public Next.js site + key public APIs (`/api/tarot/interpret`, `/api/astro/*`) using repo review + live site checks

## Executive Summary

Overall status after this pass: technically healthy, buildable, and substantially improved for indexation and crawlability.

Top outcomes implemented in this pass:
- Added App Router `robots.txt` and `sitemap.xml` generation.
- Added route-level metadata coverage for public pages and dynamic detail pages.
- Added `generateStaticParams` + SSG for `/gallery/[slug]` and `/principles/[slug]`.
- Added canonical URLs aligned to `https://www.awarenessparadox.com` (www canonical host).
- Added JSON-LD structured data (site/org + key page/breadcrumb schemas).
- Improved runtime resilience for `/api/tarot/interpret` (timeout + network failure handling).
- Reduced lint noise by excluding generated `astro-service/dist` artifacts.
- Improved WebGL fallback gating for reduced-motion / low-power devices.

## Verification Snapshot

Confirmed locally on February 26, 2026:
- `npm test`: passed (32 tests)
- `npm run build`: passed
- `npm run lint`: no errors; 2 warnings remain in `src/lib/astro/sharecards/constellation.ts`
- `GET /robots.txt`: valid rules + sitemap pointer
- `GET /sitemap.xml`: valid XML with core pages + detail routes
- `GET /astro`: includes `noindex`
- `GET /styleguide`: includes `noindex`
- `GET /gallery/seed-of-life`: slug-specific title + canonical + JSON-LD present

## Prioritized Findings (Code Review)

### High (fixed)

1. Missing SEO infrastructure routes (`robots.txt` / `sitemap.xml`)
- Impact: Search engines had no canonical crawl instructions or sitemap discovery path.
- Fix implemented: App Router metadata routes in `src/app/robots.ts` and `src/app/sitemap.ts`.

2. Dynamic content pages lacked metadata and static params
- Impact: Duplicate/default metadata, weaker SERP relevance, and on-demand rendering for static data routes.
- Fix implemented: `generateMetadata` + `generateStaticParams` for:
  - `src/app/gallery/[slug]/page.tsx`
  - `src/app/principles/[slug]/page.tsx`

3. Canonical host mismatch (code apex vs production `www` redirect)
- Impact: Mixed canonical signals and potential duplicate-host indexing ambiguity.
- Fix implemented: canonical base aligned to `https://www.awarenessparadox.com` in shared SEO helpers + layout metadata.

4. `/api/tarot/interpret` lacked controlled timeout/network failure handling
- Impact: Upstream outages/timeouts could produce unstructured failures.
- Fix implemented: AbortController timeout + explicit `504/502` JSON responses in `src/app/api/tarot/interpret/route.ts`.

### Medium (fixed)

5. ESLint scanned generated `astro-service/dist` output
- Impact: Lint failures from compiled artifacts obscured real source issues.
- Fix implemented: ignore `astro-service/dist/**` in `eslint.config.mjs`.

6. WebGL gating did not account for reduced motion / low-power devices
- Impact: Heavy visual path could run on weak devices even when a fallback would be better.
- Fix implemented: `WebGLGuard` now checks reduced-motion, save-data/slow network, low hardware concurrency, and WebGL support before rendering the canvas.

7. Remote tarot image rendering used plain `<img>` in key UI surfaces
- Impact: Next.js image optimization/lazy behavior warnings and avoidable performance overhead in card-heavy views.
- Fix implemented: migrated common tarot card image surfaces to `next/image` and added remote image allowlist in `next.config.ts`.

### Low / Follow-up (not fully addressed in this pass)

8. Remaining lint warnings in `src/lib/astro/sharecards/constellation.ts`
- Impact: Low; no correctness breakage.
- Recommendation: remove or rename unused callback params.

9. In-memory IP rate limiter in `/api/astro/natal` resets per process
- Impact: Acceptable for beta, but weak for distributed/edge scaling.
- Recommendation: move to durable/shared rate limiting (Upstash KV/Redis, Vercel KV, or middleware-backed store) before wider launch.

10. WebGL fallback now defaults to fallback on first render in server/hydration path
- Impact: Slight visual delay on capable devices, but improves safety/perf on weak devices.
- Recommendation: keep unless UX testing shows unacceptable perceived delay.

## Technical SEO Findings

### Implemented
- Canonical URLs for public pages and dynamic detail pages.
- Robots rules with exclusions for `/api/`, `/astro`, `/dev/`, `/styleguide`.
- XML sitemap including core indexable routes and detail pages.
- Noindex on beta/dev utility routes (`/astro`, `/styleguide`, `/dev/plates`).
- Structured data:
  - `WebSite`
  - `Organization`
  - `WebPage`
  - `CollectionPage`
  - `BreadcrumbList`

### Remaining recommendations (next pass)
- Add page-specific OG/Twitter image generation for top pillar pages (currently shared image with route-specific titles/descriptions).
- Validate JSON-LD in Google Rich Results Test / Schema Markup Validator after deployment.
- Add `lastModified` values sourced from content timestamps rather than `new Date()` if content publishing cadence increases.

## On-Page SEO Findings

### Implemented
- Improved route-level titles and descriptions for major pages and detail pages.
- Added contextual internal links on gallery and principles pages/detail pages.
- Added slug-specific titles for geometry and principles detail pages.

### Remaining recommendations
- Expand route-specific intro copy on `/tarot` and `/great-work` for clearer search-intent alignment (currently strong experience pages, but some discovery queries need more crawlable explanatory copy above the fold).
- Add author/editorial provenance pages if the site expands into more educational articles (E-E-A-T support).

## Performance / Smoothness Findings

### Implemented
- Safer WebGL gating for reduced-motion and low-capability contexts.
- Lazy-loaded Ripley page ritual canvas via `next/dynamic(..., { ssr: false })` inside a client page.
- Reduced image warnings and enabled Next image optimization for tarot image host.
- Resolved Next build tracing-root warning by setting `outputFileTracingRoot`.

### Remaining recommendations
- Profile homepage hydration cost with Lighthouse/Performance panel on mid-tier mobile devices.
- Consider extracting a small client wrapper for homepage heavy components if future perf tuning requires `ssr:false` lazy loading from a server page.
- Add a user-facing “Lite mode” toggle if WebGL experience expands further.

## Files Added / Updated (High Impact)

Key additions:
- `src/app/robots.ts`
- `src/app/sitemap.ts`
- `src/lib/seo/site.ts`
- `src/lib/seo/metadata.ts`
- `src/lib/seo/schema.ts`
- `src/components/seo/JsonLd.tsx`

Key SEO page updates:
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/app/gallery/page.tsx`
- `src/app/principles/page.tsx`
- `src/app/gallery/[slug]/page.tsx`
- `src/app/principles/[slug]/page.tsx`
- `src/app/astrology/page.tsx`
- `src/app/tarot/page.tsx`
- `src/app/astro/page.tsx`

Key reliability/perf updates:
- `src/components/ui/WebGLGuard.tsx`
- `src/app/api/tarot/interpret/route.ts`
- `next.config.ts`
- `eslint.config.mjs`

## Suggested Next Steps

1. Deploy and validate live `robots.txt`, `sitemap.xml`, and canonical tags on `https://www.awarenessparadox.com`.
2. Run Lighthouse on `/`, `/gallery`, `/principles/mentalism`, `/tarot` (mobile + desktop) and record CWV baselines.
3. Prioritize one or two pillar content pages from the content strategy doc to improve non-branded discovery.
