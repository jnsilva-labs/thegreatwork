# 7 Hermetic Principles Starter Guide (Figma Layout + Art Direction Spec)

Date: 2026-02-26
Status: Ready for Design Build
Pairs with: `/Users/jnsilva/Codex Projects/SacredGeometry/docs/content/2026-02-26-hermetic-principles-starter-guide-v1.md`

## Objective

Design a high-taste editorial PDF lead magnet for Awareness Paradox that feels:
- mystical
- precise
- calm
- premium
- readable on desktop and mobile PDF viewers

The design should support the copy, not overpower it.

## Format Recommendation

### Primary format (recommended)
- US Letter portrait (`8.5 x 11 in`)
- Easy for PDF export, print-at-home, and readable on phones

### Alternative (if you want more editorial feel)
- A4 portrait

Use one format only for V1.

## Page Count Target

12 pages

## Visual Direction (Awareness Paradox-Aligned)

### Design language
- dark editorial field
- warm metallic accents (copper/gilt)
- bone text on obsidian background
- sacred geometry / alchemical engravings used sparingly
- wide margins and generous spacing
- ritual / archival feel, not fantasy-game aesthetic

### Mood references (descriptive)
- illuminated manuscript restraint
- occult print archive
- modern museum catalog
- contemplative workbook

## Typography System (Figma)

Use a two-family system:

### 1) Display (titles)
Use the same or similar family as site `font-ritual` if available in your design toolkit.

Role:
- cover title
- page titles
- section dividers

Character:
- ceremonial
- legible
- not overly decorative

### 2) Body (reading text)
Choose a highly readable serif or humanist sans.

Suggested direction:
- serif for main reading text (more editorial)
- sans for captions, labels, small UI-like callouts

### Type hierarchy (starting point)
- Cover title: `36-46 pt`
- Page title: `22-28 pt`
- Section label / principle label: `10-12 pt` uppercase tracking
- Body text: `10.5-12 pt` with generous leading
- Reflection prompt / practice headings: `12-14 pt`
- Footer / page number: `8-9 pt`

## Color System (Map to Site Direction)

Translate site palette into print-safe tones.

Recommended roles:
- `Obsidian` (background)
- `Bone` (primary text)
- `Mist` (secondary text)
- `Copper` (rules, borders, accents)
- `Gilt` (small highlight accents)

### Usage rules
- Keep body text high contrast
- Use metallic tones for lines, page ornaments, labels, and CTA accents
- Avoid large flat gold fills
- Use one accent color per spread focus

## Grid System

### Base grid
- 12-column grid
- generous margins (`0.65-0.9 in`)
- baseline alignment for body copy where practical

### Layout rhythm
- left page: text-first
- right page: text + image or text + diagram

Do not force symmetry on every page. Variation should feel deliberate.

## Image Strategy (Public Domain)

### Principle
Images should feel like visual anchors, not wallpaper.

Use `4-8` images total across the 12-page guide.

### Best image categories
- alchemical engravings
- Hermetic manuscript pages
- geometric plates / diagrams
- celestial charts or astrolabe engravings
- symbolic line art (public domain)

### Placement rules
- full-page image only once (optional)
- most images should be:
  - half-page plates
  - margin inserts
  - low-opacity background panels
  - cropped details with captions

### Caption style
- small serif/sans
- source-oriented, simple
- no long academic notes in V1

Example:
`Alchemical engraving (public domain), cropped detail`

## Page-by-Page Layout Plan (12 Pages)

## Page 1 — Cover
- Full bleed or framed dark background
- central title block
- subtle geometry linework or faded engraving detail
- brand mark / wordmark at bottom

## Page 2 — Welcome / How to Use
- text-first page
- optional small top-right engraving detail
- callout box: “Use them as lenses, not slogans.”

## Page 3 — Hermetic Orientation
- two-column body layout
- one narrow sidebar with beginner framing or “how to read the principles”
- small diagram/ornamental rule

## Pages 4-10 — One Principle Per Page (7 pages)
Each principle page uses the same template for rhythm and speed.

### Principle page template
- top label: `Principle I`, `Principle II`, etc.
- main heading: `Mentalism`, `Correspondence`, etc.
- short “Core phrase” block
- body copy (plain-language meaning)
- reflection prompt callout
- practice box (visually distinct)
- optional image detail (25-35% of page area)

### Template variation
Alternate image placement:
- odd pages: image top-right or bottom-right
- even pages: image left strip or bottom band

This keeps repetition from becoming flat.

## Page 11 — 7-Day Practice Path
- structured workbook feel
- day-by-day list in clear modular rows
- subtle divider lines
- “Daily format (10-15 minutes)” in boxed panel

## Page 12 — Closing / Next Steps / CTA
- spacious closing statement
- clear next-step links
- optional signature visual plate or geometric motif
- QR code placeholder (optional for V2)

## UI Elements / Components to Build in Figma (Reusable)

Create these as components/styles so future guides are fast:
- page title block
- principle label chip
- core phrase panel
- reflection prompt callout
- practice box
- small caption style
- footer with page number + brand mark
- CTA panel (closing page)

## Accessibility / Readability Rules (PDF)

- body text must remain readable when viewed on mobile
- avoid over-textured backgrounds behind paragraphs
- minimum strong contrast for all body copy
- do not rely on color alone to indicate section type
- keep line length comfortable (roughly `55-80` characters)

## Figma Build Workflow (Recommended)

1. Create file: `Awareness Paradox - Hermetic Principles Starter Guide`
2. Set up page styles (colors, type, effects)
3. Build one master principle page template
4. Lay out pages 1-3 and 11-12
5. Duplicate principle template for pages 4-10
6. Drop imagery after all text styles are locked
7. Export PDF and test on:
   - desktop
   - phone PDF viewer

## Public-Domain Image Sourcing Workflow (Next Pass)

Track each image in a source table with:
- working title
- source institution/site
- URL
- rights/public-domain note
- creator (if known)
- year (if known)
- caption text

Create a companion sourcing sheet before final export.

## V1 Design Rules (to preserve taste)

Keep:
- restraint
- whitespace
- stable typography
- symbolic precision

Avoid:
- overloaded textures
- faux parchment cliches
- excessive sigils/ornament
- low-contrast decorative type
- “occult aesthetic” kitsch
