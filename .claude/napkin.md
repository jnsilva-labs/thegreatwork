# Napkin

## Corrections
| Date | Source | What Went Wrong | What To Do Instead |
|------|--------|----------------|-------------------|
| 2026-02-07 | self | Used `rg` immediately, but this environment does not have ripgrep installed. | Fall back to `find`/`grep` quickly when `rg` is unavailable. |
| 2026-02-07 | self | `next build` failed because imported `tarot/tarot-alchemy` source was included in TypeScript checks and required missing dependencies. | Exclude snapshot/import-only folders (e.g., `tarot/`) in `tsconfig.json` and eslint ignores when they are not part of runtime app code. |
| 2026-02-07 | self | Write tool fails with "File has not been read yet" when in parallel batch with a failed sibling. | Always re-read files after a parallel tool batch failure before re-attempting writes/edits. |
| 2026-03-10 | self | Tried to elevate flagship pages by adding heavier editorial panels and larger framing, but it made the homepage and supporting pages feel clunky and oppressive. | For this brand, preserve the calmer baseline and add awe through motion, pacing, and atmosphere before adding more box treatment. |
| 2026-03-10 | self | Left Substack/newsletter URLs duplicated across pages, which created circular fallbacks into `/letters` and brittle CTA behavior. | Use one shared Substack URL source of truth and keep `/letters` as an editorial/archive destination, not a required bridge in the signup flow. |
| 2026-03-10 | self | Let the principles rail render on all non-home routes, which crowded unrelated pages and was especially bad on mobile. | Scope route-level chrome to the routes it actually belongs to; do not let global UI leak across content sections. |
| 2026-03-11 | self | Trusted a stale `next start` preview and spent time judging outdated homepage/Great Work output. | When a layout report conflicts with the code on disk, restart the local production preview before diagnosing the UI. |
| 2026-03-11 | self | Treated `LineSet` as objects with `.points` during the Journey refactor and broke the build. | In SacredGeometry geometry helpers, `LineSet` is `Vector3[][]`; iterate points directly and use `.x/.y/.z`. |
| 2026-03-12 | self | Tarot buttons appeared dead because decorative overlays and the fallback engraving layer could still sit over interactive UI. | Any full-screen decorative layer or expanding corner treatment must get `pointer-events-none` by default unless it is intentionally interactive. |
| 2026-03-12 | self | Left the default Rider–Waite deck pointed at a third-party archive host, then bypassed those URLs in the card face component. | Vendor canonical default-deck assets into `public/` and let the default deck render local images directly; reserve the decorative fallback for genuinely missing art. |

## User Preferences
- Keep collaboration pragmatic and concise.
- Copy voice: avoid "LLM speak" (e.g., "it's not X, it's Y"), minimize em dashes. Ground claims in real source texts (Corpus Hermeticum, Emerald Tablet, Rosarium Philosophorum, Kybalion, Plato's Timaeus, Eliphas Levi). Bridge mystical to personable. Linguistics of a poet laureate/top academia but 8th-grade reading level.
- Mobile-first: all interactive elements need 44px minimum touch targets.
- Social/video direction: prioritize audience growth through awe, curiosity, and inspiration. Synthetic on-screen talent is acceptable if it feels realistic, wise, and cinematically mythic rather than cheesy or cosplay-like.

## Patterns That Work
- Start by checking git status and deployment config before modifying routes/pages.
- Integrate external app exports into `src/features/...` and keep raw exports as ignored snapshots to avoid build/lint contamination.
- For AI features, default to a server-side shared key endpoint and fall back to BYOK only on quota/auth failures so users get zero-friction first use.
- ScrollOrchestrator accepts optional `slugs` prop for page-specific section IDs. Default falls back to `useChapterNavigation()` (principleSlugs). This pattern lets the homepage use different sections without breaking other pages.
- When modifying shared state arrays (like `progressByChapter`), ensure all consumers use `?? 0` fallback — the codebase already does this.
- Footer.tsx is a server component (no `"use client"`) since it has no interactive state — SocialLinks inside it is the client boundary.
- Homepage data lives in `src/data/homepage.ts` with `trackedSections` export for the scroll-tracked subset (excludes hero).
- Award-level direction for this brand is `Editorial Ritual`: preserve sacred-library restraint, then add selective cinematic moments, stronger editorial pacing, and richer materiality.
- For third-party Codex skills, inspect the source repo's `.codex/INSTALL.md` before using the generic installer; some use native discovery through `~/.agents/skills/<name>` symlinks instead of copying into `~/.codex/skills`.

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
