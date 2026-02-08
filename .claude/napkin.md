# Napkin

## Corrections
| Date | Source | What Went Wrong | What To Do Instead |
|------|--------|----------------|-------------------|
| 2026-02-07 | self | Used `rg` immediately, but this environment does not have ripgrep installed. | Fall back to `find`/`grep` quickly when `rg` is unavailable. |
| 2026-02-07 | self | `next build` failed because imported `tarot/tarot-alchemy` source was included in TypeScript checks and required missing dependencies. | Exclude snapshot/import-only folders (e.g., `tarot/`) in `tsconfig.json` and eslint ignores when they are not part of runtime app code. |
| 2026-02-07 | self | Write tool fails with "File has not been read yet" when in parallel batch with a failed sibling. | Always re-read files after a parallel tool batch failure before re-attempting writes/edits. |

## User Preferences
- Keep collaboration pragmatic and concise.
- Copy voice: avoid "LLM speak" (e.g., "it's not X, it's Y"), minimize em dashes. Ground claims in real source texts (Corpus Hermeticum, Emerald Tablet, Rosarium Philosophorum, Kybalion, Plato's Timaeus, Eliphas Levi). Bridge mystical to personable. Linguistics of a poet laureate/top academia but 8th-grade reading level.
- Mobile-first: all interactive elements need 44px minimum touch targets.

## Patterns That Work
- Start by checking git status and deployment config before modifying routes/pages.
- Integrate external app exports into `src/features/...` and keep raw exports as ignored snapshots to avoid build/lint contamination.
- For AI features, default to a server-side shared key endpoint and fall back to BYOK only on quota/auth failures so users get zero-friction first use.
- ScrollOrchestrator accepts optional `slugs` prop for page-specific section IDs. Default falls back to `useChapterNavigation()` (principleSlugs). This pattern lets the homepage use different sections without breaking other pages.
- When modifying shared state arrays (like `progressByChapter`), ensure all consumers use `?? 0` fallback — the codebase already does this.
- Footer.tsx is a server component (no `"use client"`) since it has no interactive state — SocialLinks inside it is the client boundary.
- Homepage data lives in `src/data/homepage.ts` with `trackedSections` export for the scroll-tracked subset (excludes hero).

## Patterns That Don't Work
- Assuming integration details without inspecting imported project files.

## Domain Notes
- Repo: SacredGeometry. Site: awarenessparadox.com.
- Brand is "Awareness Paradox" — a multi-disciplinary esoteric platform (alchemy, tarot, astrology, sacred geometry, Hermetic principles).
- Homepage redesigned from 7-principle scroll to 9-section scrollytelling journey (Phase 1 complete).
- Future phases: Phase 2 (scroll animations, section dividers, geometry watermarks), Phase 3 (WebGL per-section sync), Phase 4 (polish, SEO, mobile).
- Nav order: Home, The Great Work, Tarot, Astrology, Sacred Geometry, Principles.
- Three themes: obsidian (default), abyssal, crimson. CSS vars in globals.css.
- GSAP is installed but unused — all animation is custom (scroll-driven + useFrame).
