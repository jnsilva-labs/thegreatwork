# Illuminated Archive Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Unify Awareness Paradox into the approved Illuminated Archive visual system while preserving every existing backend contract and interactive feature.

**Architecture:** Establish a small semantic visual foundation and reusable editorial primitives first, then art-direct the homepage, Tarot, Astrology, and editorial routes in independent commits. Finish by consolidating motion/accessibility behavior and running automated plus rendered responsive verification.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, CSS custom properties, GSAP, React Three Fiber, Vitest, Testing Library, Fontsource.

**Design spec:** `docs/plans/2026-07-20-illuminated-archive-design.md`

---

## Chunk 1: Foundation, Editorial System, and Trust Shell

### Task 1: Repair and lock the visual foundation

**Files:**
- Create: `src/test/visual.foundation.test.ts`
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`
- Modify: `src/features/tarot/components/CardVisual.tsx`

- [ ] **Step 1: Write visual-foundation contract tests**

Add Node-based Vitest assertions scoped to `globals.css`, `layout.tsx`, and `CardVisual.tsx` to require declarations for the legacy semantic aliases, reject both CSS `transition: all` and Tailwind `transition-all` on the repaired surfaces, reject `transparenttextures.com`, and require locally packaged font imports. Defer the whole-source transition audit to Task 10.

- [ ] **Step 2: Run the test and verify it fails**

Run: `npx vitest run src/test/visual.foundation.test.ts`

Expected: FAIL because aliases/fonts are not yet present and broad/remote declarations remain.

- [ ] **Step 3: Install local open-source font packages**

Run: `npm install @fontsource/cormorant-garamond @fontsource/manrope`

Import only the weights used by the site. Do not add a runtime Google Fonts request.

- [ ] **Step 4: Normalize tokens and type**

In `globals.css`, define or replace `--teal`, `--gold`, `--stone`, and `--font-ritual`; set Cormorant Garamond and Manrope as the reliable primary faces; add explicit display/title/body/eyebrow/caption utilities; establish 12px minimum essential-label rules and tighter mobile tracking; raise marginal text contrast.

- [ ] **Step 5: Replace broad transitions and the remote Tarot texture**

Use explicit `transition-property` declarations on changed surfaces and recreate the card grain with local CSS gradients/noise. Keep decorative overlays pointer-inert.

- [ ] **Step 6: Run focused and clean-baseline tests**

Run: `npx vitest run src/test/visual.foundation.test.ts && npx vitest run --exclude src/test/nav.dialog.test.tsx --exclude src/test/tarot.reading-dialog.test.tsx`

Expected: visual foundation and all 105 non-dialog baseline tests pass. Run the two dialog tests separately and record their expected failures until Tasks 3 and 6.

- [ ] **Step 7: Commit**

Commit: `feat: establish illuminated archive visual foundation`

### Task 2: Build the editorial primitive set

**Files:**
- Create: `src/components/editorial/EditorialSpread.tsx`
- Create: `src/components/editorial/ArchivalFigure.tsx`
- Create: `src/components/editorial/MarginalNote.tsx`
- Create: `src/components/editorial/EtchedList.tsx`
- Create: `src/components/editorial/RitualLink.tsx`
- Create: `src/components/editorial/OraclePanel.tsx`
- Create: `src/components/editorial/TrustNote.tsx`
- Create: `src/components/editorial/index.ts`
- Create: `src/components/dev/VisualQaFixtures.tsx`
- Create: `src/app/dev/visual-qa/page.tsx`
- Create: `src/data/archivalFigures.ts`
- Create: `src/test/editorial.primitives.test.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Write rendering and semantics tests**

Test that figures expose real `alt` text and visible source captions, spreads preserve heading order, etched lists render semantic lists, trust notes expose an accessible heading, and ritual links keep 44px minimum targets.

- [ ] **Step 2: Run the focused test and verify it fails**

Run: `npx vitest run src/test/editorial.primitives.test.tsx`

Expected: FAIL because the primitive modules do not exist.

- [ ] **Step 3: Implement narrow compositional primitives**

Keep components server-compatible unless interaction is required. Use variants only for actual layout differences (`image-left`, `image-right`, `quote`, `map`), not arbitrary styling. `ArchivalFigure` must use `next/image` with sizes and source metadata from `archivalFigures.ts`.

- [ ] **Step 4: Add a deterministic, non-indexed visual QA surface**

Create `/dev/visual-qa` with `robots: noindex` and explicit fixture selectors for editorial primitives. Extend this surface in the Tarot and Astrology tasks with deterministic revealed/dialog/result states so browser QA never consumes quotas or depends on AI output.

- [ ] **Step 5: Add shared material styles**

Add etched-rule, plate-caption, open-field, oracle-room, marginalia, and ritual-link classes. Avoid rounded-card defaults.

- [ ] **Step 6: Run focused tests and lint changed files**

Run: `npx vitest run src/test/editorial.primitives.test.tsx && npx eslint src/components/editorial src/data/archivalFigures.ts`

Expected: PASS.

- [ ] **Step 7: Commit**

Commit: `feat: add illuminated archive editorial primitives`

### Task 3: Rebuild the global shell and trust architecture

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/app/ripley-scroll/page.tsx`
- Modify: `src/components/ui/NavBar.tsx`
- Modify: `src/components/ui/Footer.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/app/start-here/page.tsx`
- Modify: `src/app/study/page.tsx`
- Modify: `src/app/letters/page.tsx`
- Modify: `src/app/great-work/page.tsx`
- Modify: `src/app/principles/page.tsx`
- Modify: `src/app/principles/[slug]/page.tsx`
- Modify: `src/app/gallery/page.tsx`
- Modify: `src/app/gallery/[slug]/page.tsx`
- Modify: `src/app/ripley-scroll/page.tsx`
- Modify: `src/lib/seo/site.ts`
- Create: `src/components/ui/useFocusDialog.ts`
- Create: `src/app/about/page.tsx`
- Create: `src/app/method/page.tsx`
- Create: `src/app/sources/page.tsx`
- Create: `src/app/privacy/page.tsx`
- Modify: `src/test/nav.dialog.test.tsx`
- Create: `src/test/trust.routes.test.tsx`

- [ ] **Step 1: Extend the existing failing navigation-dialog test**

Require trigger `aria-expanded`/`aria-controls`, labelled modal semantics, close-button initial focus, forward/backward focus loop, Escape, body-scroll restoration, and trigger-focus restoration.

- [ ] **Step 2: Write trust-route and global-landmark tests**

Require visible Method, Sources, Privacy, and AI-assistance language plus a global skip link and single `main#main-content` wrapper.

- [ ] **Step 3: Run focused tests and verify failures**

Run: `npx vitest run src/test/nav.dialog.test.tsx src/test/trust.routes.test.tsx`

Expected: FAIL against the current shell.

- [ ] **Step 4: Implement shared dialog focus behavior and simplify navigation**

Complete the menu dialog contract. Move sound/theme/motion controls behind a secondary `Environment` disclosure. Preserve existing analytics and theme behavior.

- [ ] **Step 5: Add global landmarks and static trust pages**

Add the skip link immediately inside the body and one global main wrapper. Convert the route-local `main` elements in `src/app/page.tsx` and `src/app/ripley-scroll/page.tsx` so they do not become nested. Build concise, source-grounded About, Method, Sources, and Privacy pages; do not invent data-retention claims. Register these routes in the indexable site route registry.

- [ ] **Step 6: Recompose the footer**

Use an editorial four-zone footer: purpose statement, Explore, Practice, Trust. Include AI-assisted interpretation disclosure near Method/Privacy without alarming language or hidden fine print.

- [ ] **Step 7: Run focused and full tests**

Run: `npx vitest run src/test/nav.dialog.test.tsx src/test/trust.routes.test.tsx && npx vitest run --exclude src/test/tarot.reading-dialog.test.tsx`

Expected: navigation/trust and every suite except the explicitly pending Tarot dialog pass. Run the Tarot dialog test separately and record its expected failure until Task 6.

- [ ] **Step 8: Commit**

Commit: `feat: strengthen archive navigation and trust shell`

---

## Chunk 2: Route Art Direction

### Task 4: Recompose the homepage around the armillary

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/components/ui/HomepageHero.tsx`
- Modify: `src/components/ui/HomepageSection.tsx`
- Modify: `src/data/homepage.ts`
- Modify: `src/app/globals.css`
- Create: `src/test/homepage.visual-structure.test.tsx`

- [ ] **Step 1: Write structure tests**

Require one semantic homepage `h1`, no 50/70vh blank tail, preserved three-path routing, dual Tarot/Astrology reading links, and figure/layout metadata for varied chapters.

- [ ] **Step 2: Run the focused test and verify it fails**

Run: `npx vitest run src/test/homepage.visual-structure.test.tsx`

- [ ] **Step 3: Recompose the hero**

Retain the two visual title lines inside one `h1`. Reduce the mobile dead zone so at least the next path cue is discoverable on a 390x844 viewport. Keep the armillary dominant and subordinate the separate sigil/marquee treatment.

- [ ] **Step 4: Add explicit chapter compositions**

Extend homepage data with a small `layout` union and optional `figureId`. Render alternating editorial spread, quote field, stage map, geometry plate, and closing invitation compositions. Use existing archive and geometry assets. Do not add more effects.

- [ ] **Step 5: Tighten copy and motion hierarchy**

Remove duplicated quoted prose and shorten the longest geometry section while preserving its sources and meaning. Limit each section to one reveal sequence and quiet hover motion.

- [ ] **Step 6: Test, lint, and render-check desktop/mobile**

Run: `npx vitest run src/test/homepage.visual-structure.test.tsx && npx eslint src/app/page.tsx src/components/ui/HomepageHero.tsx src/components/ui/HomepageSection.tsx src/data/homepage.ts`

Render-check: 390x844, 1280x720, 1440x900.

- [ ] **Step 7: Commit**

Commit: `feat: recompose homepage as an illuminated archive`

### Task 5: Unify the Tarot reading chamber

**Files:**
- Modify: `src/features/tarot/components/TarotShell.tsx`
- Modify: `src/features/tarot/pages/Home.tsx`
- Modify: `src/features/tarot/components/CardVisual.tsx`
- Modify: `src/features/tarot/components/TarotCardFace.tsx`
- Modify: `src/features/tarot/components/SpreadLayout.tsx`
- Modify: `src/features/tarot/components/PhaseArc.tsx`
- Modify: `src/features/tarot/pages/Reading.tsx`
- Modify: `src/components/dev/VisualQaFixtures.tsx`
- Create: `src/test/tarot.visual-system.test.tsx`

- [ ] **Step 1: Write Tarot visual contract tests**

Require authentic 7:12 card ratio, native button card triggers, no legacy slate/void/mystic hard-coded room surfaces on upgraded components, local material texture, 12px essential phase labels, and a readable labelled question field.

- [ ] **Step 2: Run focused tests and verify failure**

Run: `npx vitest run src/test/tarot.visual-system.test.tsx`

- [ ] **Step 3: Recompose the Tarot entry as a reading table**

Use one high-contrast question field, an understated intention selector, a visually clear spread choice, and one primary action. Preserve validation and state handoff. Ensure the long placeholder wraps or becomes helper copy on phones rather than clipping.

- [ ] **Step 4: Consolidate materials and card proportions**

Derive the room, card backs, mats, labels, and overlays from semantic theme tokens. Use `aspect-[7/12]` consistently and an intentional narrow mat around source art. Remove remote texture and broad transitions.

- [ ] **Step 5: Simplify reading hierarchy**

Keep question, card spread, mirror statement, phase, interpretation, guidance, and journal actions in a continuous reading order. Reduce decorative pill density and microscopic labels.

- [ ] **Step 6: Run tests/lint and responsive visual checks**

Run: `npx vitest run src/test/tarot.visual-system.test.tsx src/test/tarot.home.test.tsx && npx eslint src/features/tarot`

Render-check: entry and revealed spread at 390x844 and 1280x720.

- [ ] **Step 7: Commit**

Commit: `feat: unify tarot as a reading chamber`

### Task 6: Rebuild Tarot card details as an accessible sheet/dialog

**Files:**
- Modify: `src/features/tarot/pages/Reading.tsx`
- Modify: `src/features/tarot/components/CardVisual.tsx`
- Reuse: `src/components/ui/useFocusDialog.ts`
- Modify: `src/test/tarot.reading-dialog.test.tsx`

- [ ] **Step 1: Strengthen the existing red dialog test**

Require labelled dialog, named close/previous/next controls, initial focus, focus loop, Escape, focus restoration, and native trigger semantics.

- [ ] **Step 2: Implement desktop dialog and mobile sheet**

Desktop uses a balanced image/content split. Mobile uses a full-height sheet with compact image header and continuous scroll, safe-area padding, and 44px controls. Prevent background overscroll.

Add deterministic one-card and three-card revealed/dialog fixture states to `/dev/visual-qa` using local Rider-Waite data only.

- [ ] **Step 3: Run dialog and full Tarot tests**

Run: `npx vitest run src/test/tarot.reading-dialog.test.tsx src/test/tarot.visual-system.test.tsx src/test/tarot.home.test.tsx`

Expected: PASS.

- [ ] **Step 4: Commit**

Commit: `feat: rebuild tarot card details for every viewport`

### Task 7: Give Astrology a celestial instrument and editorial result hierarchy

**Files:**
- Create: `src/components/astro/CelestialOrientation.tsx`
- Modify: `src/app/astrology/page.tsx`
- Modify: `src/components/astro/NatalChartWidget.tsx`
- Modify: `src/components/astro/PlanetaryArc.tsx`
- Modify: `src/components/astro/share/SharePanel.tsx`
- Modify: `src/components/motion/useMotionPreference.ts`
- Modify: `src/components/dev/VisualQaFixtures.tsx`
- Create: `src/test/astro.visual-hierarchy.test.tsx`
- Modify: `src/test/motion.preference.test.ts`

- [ ] **Step 1: Write visual hierarchy and motion tests**

Require an early celestial orientation, one route `h1`, widget heading demotion, thesis/Big Three/paradox/chart/supporting-detail order, semantic lists/details, 12px labels, 44px planet targets, and disabled result/ring animation under reduced motion.

- [ ] **Step 2: Run focused tests and verify failure**

Run: `npx vitest run src/test/astro.visual-hierarchy.test.tsx src/test/motion.preference.test.ts`

- [ ] **Step 3: Build the celestial orientation**

Create a lightweight semantic SVG/CSS chart-wheel composition using existing zodiac/planet data. It must render without WebGL and provide a quiet reduced-motion state.

- [ ] **Step 4: Recompose the public page**

Pair opening copy with the celestial plate, move the chart CTA earlier, replace the generic Big Three cards with an etched triptych, and tighten orientation/lineage into editorial fields.

- [ ] **Step 5: Recompose the oracle form/results**

Use `OraclePanel` only for the form. Results begin with a large thesis, then Big Three, paradox, chart/planetary arc, grouped interpretation, month-ahead material, share panel, and advanced disclosures. Replace repeated miniature cards with rules, columns, and lists.

Add a deterministic complete natal-result fixture to `/dev/visual-qa` with representative long copy, unknown-time handling, and advanced disclosure content. Do not call the natal endpoint.

- [ ] **Step 6: Test, lint, and render-check empty/result states**

Run: `npx vitest run src/test/astro.visual-hierarchy.test.tsx src/test/motion.preference.test.ts src/test/astro.big-three-share.test.ts && npx eslint src/app/astrology src/components/astro`

Render-check: empty form and representative result at 390x844 and 1280x720.

- [ ] **Step 7: Commit**

Commit: `feat: turn astrology into a celestial instrument`

### Task 8: De-cardify the editorial archive routes

**Files:**
- Modify: `src/app/study/page.tsx`
- Modify: `src/app/start-here/page.tsx`
- Modify: `src/app/letters/page.tsx`
- Modify: `src/app/great-work/page.tsx`
- Modify: `src/app/principles/page.tsx`
- Modify: `src/app/principles/[slug]/page.tsx`
- Reuse: `src/components/editorial/*`
- Reuse: `src/data/archivalFigures.ts`
- Create: `src/test/editorial.routes.test.tsx`

- [ ] **Step 1: Write editorial-route structure tests**

Require archival figures with captions on selected routes, semantic ordered maps/lists, preserved CTA destinations, one route heading, and a material reduction in rounded content containers compared with the baseline.

- [ ] **Step 2: Run the focused test and verify failure**

Run: `npx vitest run src/test/editorial.routes.test.tsx`

- [ ] **Step 3: Recompose Study and Start Here**

Turn audience modes into an open three-column index, disciplines into an etched correspondence map, and the sequence into a vertical numbered path. Give Start Here a single archival threshold plate and ruled orientation steps.

- [ ] **Step 4: Recompose Letters, Great Work, and Principles**

Use a publication index for Letters, stage plates/timeline for Great Work, and a numbered manuscript index for Principles. Keep all source-grounded copy and existing analytics links.

- [ ] **Step 5: Test, lint, and render-check routes**

Run: `npx vitest run src/test/editorial.routes.test.tsx && npx eslint src/app/study src/app/start-here src/app/letters src/app/great-work src/app/principles`

Render-check at 390, 768, and 1280 widths.

- [ ] **Step 6: Commit**

Commit: `feat: art direct the editorial archive routes`

### Task 9: Refine Sacred Geometry as an instrument

**Files:**
- Modify: `src/app/gallery/page.tsx`
- Modify: `src/app/gallery/[slug]/page.tsx`
- Modify: `src/components/gallery/GalleryDetailClient.tsx`
- Modify: `src/components/gallery/GalleryViewer.tsx`
- Modify: `src/app/globals.css`
- Create: `src/test/gallery.instrument.test.tsx`

- [ ] **Step 1: Write instrument and motion tests**

Require meaningful labels for calibration controls, 44px targets, reduced-motion/stillness-safe auto-rotation behavior, and fewer nested rounded panels.

- [ ] **Step 2: Recompose gallery index/detail controls**

Let pattern imagery dominate. Present index items as plates rather than cards and detail controls as a compact calibration rail with explicit labels and values.

- [ ] **Step 3: Gate motion consistently**

Use the shared motion preference for auto-rotation and transition behavior. Preserve direct manipulation.

- [ ] **Step 4: Test, lint, and render-check**

Run: `npx vitest run src/test/gallery.instrument.test.tsx src/test/motion.preference.test.ts && npx eslint src/app/gallery src/components/gallery`

- [ ] **Step 5: Commit**

Commit: `feat: refine sacred geometry as an instrument`

---

## Chunk 3: Motion Discipline and Final QA

### Task 10: Consolidate motion, contrast, and responsive polish

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/components/ui/ScrollOrchestrator.tsx`
- Modify: `src/components/scene/SceneShell.tsx`
- Modify: `src/components/ui/NavBar.tsx`
- Modify: `src/components/ui/Footer.tsx`
- Modify: `src/components/ui/HomepageHero.tsx`
- Modify: `src/components/ui/HomepageSection.tsx`
- Modify: `src/components/astro/NatalChartWidget.tsx`
- Modify: `src/components/astro/PlanetaryArc.tsx`
- Modify: `src/components/astro/share/SharePanel.tsx`
- Modify: `src/components/gallery/GalleryDetailClient.tsx`
- Modify: `src/components/gallery/GalleryViewer.tsx`
- Modify: `src/features/tarot/pages/Home.tsx`
- Modify: `src/features/tarot/pages/Reading.tsx`
- Modify: `src/features/tarot/pages/Settings.tsx`
- Modify: `src/features/tarot/components/CardVisual.tsx`
- Modify: `src/features/tarot/components/SpreadLayout.tsx`
- Modify: `src/features/tarot/components/PhaseArc.tsx`
- Modify: `src/features/tarot/components/TarotCardFace.tsx`
- Modify: `src/test/motion.preference.test.ts`
- Modify: `src/test/visual.foundation.test.ts`

- [ ] **Step 1: Expand contract tests**

Reject broad transitions and remote visual dependencies across the exact upgraded files listed above. Test reduced-motion scroll predicates and theme-derived scene colors. Add focused assertions for essential label and touch-target utilities where practical. Browser acceptance, rather than a brittle source assertion, verifies that only one dominant motion event appears per viewport and reading sections remain still after entrance.

- [ ] **Step 2: Unify motion preference behavior**

Ensure CSS, GSAP, WebGL, Astrology, Gallery, and scroll orchestration follow reduced motion/stillness. Do not use WebGL quality tier as a motion capability signal.

- [ ] **Step 3: Finish contrast and mobile type pass**

Replace low-opacity essential text, remove 9–11px essential labels, reduce extreme mobile tracking, and keep captions/ornament visually subordinate without becoming illegible.

- [ ] **Step 4: Theme the scene and route accents**

Derive scene fog/light and route room accents from semantic theme variables while preserving the existing performance path and fallback engraving.

- [ ] **Step 5: Run focused tests and lint**

Run: `npx vitest run src/test/motion.preference.test.ts src/test/visual.foundation.test.ts && npm run lint`

- [ ] **Step 6: Commit**

Commit: `fix: unify motion contrast and responsive polish`

### Task 11: Full verification and visual acceptance

**Files:**
- Modify only if verification exposes a regression.

- [ ] **Step 1: Run the full automated suite**

Run: `npm test`

Expected: all tests pass, including the two red baseline dialog tests.

- [ ] **Step 2: Run lint and production build**

Run: `npm run lint && npm run build`

Expected: zero errors; document any pre-existing warnings separately.

- [ ] **Step 3: Start the production-like local app**

Run: `npm run dev`

Use the in-app browser for rendered QA; restart if output contradicts the current filesystem.

- [ ] **Step 4: Review required viewports**

Check homepage, Tarot entry, deterministic Tarot reading/dialog fixtures, Astrology intro/form, deterministic Astrology result fixture, Study, Start Here, Letters, Great Work, Principles, Gallery, About, Method, Sources, and Privacy at 375, 390, 768, 1280, and 1440 widths. Verify clipping, hierarchy, line length, image crops, focus rings, menu/sheets, scroll endings, one dominant motion event per viewport, and still reading sections after entrance.

- [ ] **Step 5: Review preference and fallback states**

Check reduced motion, stillness, crimson/abyssal themes, keyboard-only navigation, no-WebGL fallback, and narrow-height mobile.

Use computed styles to confirm Cormorant Garamond and Manrope are the rendered families on representative heading/body elements. Use the browser page-assets inventory to confirm there are no external font or image requests.

- [ ] **Step 6: Inspect final diff and dependency footprint**

Run: `git diff --check && git status --short && git diff --stat feature/zero-friction-ai-protection...HEAD`

Confirm no backend endpoints, quotas, or environment requirements changed. Confirm no accidental npm lockfile-only churn remains beyond the intentional font dependencies.

- [ ] **Step 7: Final commit if QA required fixes**

Commit: `fix: complete illuminated archive visual QA`

- [ ] **Step 8: Request independent code and visual review**

Provide reviewers the design spec, this plan, branch range, automated output, and representative desktop/mobile screenshots. Address blocking findings before completion.
