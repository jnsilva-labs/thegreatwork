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
| 2026-07-04 | self | Gated entrance motion on `hermeticStore.qualityTier`, which RitualCanvas auto-sets to "low" for ANY mobile viewport or ≤4GB memory — it would have disabled all reveals on phones. | `qualityTier` is a WebGL render-budget tier, not a motion capability signal. Gate motion on prefers-reduced-motion + stillness + a true low-power heuristic (saveData / 2g / ≤2 cores), like WebGLGuard. |
| 2026-07-04 | self | Exported a helper (`classifyInterpretError`) from a Next.js route.ts and the build failed: route files only allow route-field exports. | Put shared/testable route logic in a sibling module (e.g. `classifier.ts` next to `route.ts`). |
| 2026-07-04 | self | Tried to QA IntersectionObserver-driven reveals in the Claude Preview browser; IO callbacks never fire because the page runs with `document.hidden: true` (and the default viewport is 0×0). | Entrance/reveal choreography must be eyeballed in a visible browser. In the preview tool, verify state/attributes/styles via preview_eval instead, and resize the viewport explicitly before layout checks. |
| 2026-07-10 | self | Used an unquoted dynamic-route path in zsh while gathering review context; `[slug]` was parsed as a glob and prevented the remaining inspection command from running. | Quote filesystem paths containing brackets in zsh commands. |

## User Preferences
- Keep collaboration pragmatic and concise.
- AI access baseline (2026-07): allow a generous shared tier of 10 tarot readings and 3 natal readings per verified visitor per day; avoid adding paid infrastructure where a Vercel-native or no-cost approach is sufficient.
- UX decision (2026-07): do not add daily Turnstile friction to tarot; prioritize acquisition/return visits over making the shared quota hard to evade. Treat the tarot allowance as a soft per-browser cap, paired with strict payload limits and best-effort burst controls.
- Deployment topology (2026-07): the public Next.js app is on Vercel; `astro-service` is hosted on Render. Secure their public server-to-server connection with an application secret rather than assuming a shared private network.
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
- Tarot AI (2026-07): `/api/tarot/interpret` runs AI SDK v6 `generateText` + `Output.object` through Vercel AI Gateway (OIDC; primary `google/gemini-3.5-flash`, fallback `anthropic/claude-sonnet-4.6`). Error contract preserved (`SHARED_*` codes) so the BYOK client fallback still works; BYOK direct path uses Google REST `gemini-3.5-flash`. Verify Gateway model slugs against https://ai-gateway.vercel.sh/v1/models (public), not memory.
- Motion system (2026-07): `src/components/motion/` (Reveal/EtchRule/EtchHeading/Dissolve + motionTokens + useMotionPreference). GSAP core only, no ScrollTrigger — Lenis + hermeticStore stay the only scroll authority; GSAP fires one-shot intersection timelines. Homepage sections choreograph under `[data-gsap]` (CSS transitions disabled there); `.is-revealed` CSS path remains the reduced-motion/stillness/low-power branch.

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
