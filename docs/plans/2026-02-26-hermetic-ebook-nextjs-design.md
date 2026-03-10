# Hermetic Principles Starter Guide - Next.js Ebook Page Design

Date: 2026-02-26
Status: Approved
Owner: Awareness Paradox

## Purpose

Build a print-optimized ebook page in the existing Next.js site that renders the full 12-page "7 Hermetic Principles Starter Guide" using the site's design system. Export to PDF for use as a lead magnet.

## Why Next.js (not Canva)

The Awareness Paradox brand has a specific dark editorial aesthetic (obsidian backgrounds, bone text, gilt/copper accents, Didot headers) that Canva's AI generation cannot reproduce. The site already has the complete design system in `globals.css`. Building the ebook as a page gives pixel-perfect brand fidelity and reusability for future guides.

## Route

`/ebook/hermetic-principles`

## Page Dimensions

- US Letter portrait: 8.5 x 11 inches (816 x 1056 px at 96dpi)
- Print at 300dpi for high-quality PDF output
- Generous margins: 0.65-0.9 inches

## Design Tokens (from globals.css)

- `--obsidian / --bg`: #0b0c10 (background)
- `--bone / --fg`: #e8e3d8 (primary text)
- `--mist / --muted`: #b9b2a5 (secondary text)
- `--gilt / --accent`: #b89b5e (gold accents)
- `--copper / --border`: #2b6f6a (borders, rules)
- `--char / --panel`: #15141b (panel backgrounds)
- `--font-ritual-serif`: Didot, Bodoni 72 (display)
- `--font-ritual-sans`: Avenir Next, Helvetica Neue (body)

## Typography Scale

- Cover title: 36-46pt
- Page title: 22-28pt
- Section label: 10-12pt uppercase tracking
- Body text: 10.5-12pt with generous leading
- Reflection/practice headings: 12-14pt
- Footer/page number: 8-9pt

## Content Structure (12 pages)

### Page 1: Cover
- Full-bleed obsidian background
- `img-01-cover-the-alchemist-rijksmuseum.jpg` as darkened background plate
- Central title block in font-ritual
- Subtitle in body font
- Brand mark at bottom
- Optional quote: "Take one idea. Work with it. Return."

### Page 2: Welcome / How to Use
- Text-first page
- Optional small `img-02-ms879-apparatus-wellcome.jpg` at low opacity (20-35%)
- Callout box: "Use them as lenses, not slogans."

### Page 3: What "Hermetic" Means
- Two-column body layout
- Small `img-03-m0007044-alchemical-allegory-wellcome.jpg` detail crop
- Sidebar with beginner framing

### Pages 4-10: One Principle Per Page (template)
Each uses the same PrinciplePage component:
- Top label: Principle I, II, etc. (small uppercase)
- Main heading: Mentalism, Correspondence, etc.
- Core phrase in styled callout panel
- Body copy (plain-language meaning)
- Reflection prompt in accent-bordered callout
- Practice box (visually distinct panel)
- Optional image (25-35% of page area)

Image assignments (from page-asset-map):
- P4 Mentalism: img-03 (alchemical allegory)
- P5 Correspondence: img-04 (Solomon Seal, motif only)
- P6 Vibration: alt-02 (flask plate, side panel)
- P7 Polarity: img-06 (manuscript plate)
- P8 Rhythm: img-07 (zodiac planets diagram)
- P9 Cause & Effect: img-02 (apparatus crop)
- P10 Gender: img-06 (manuscript plate, second use)

### Page 11: 7-Day Practice Path
- Workbook-style layout
- Day-by-day rows with divider lines
- "Daily format" in bordered panel
- Small img-04 motif in header/footer only

### Page 12: Closing / Next Steps
- Spacious closing text
- CTA links panel
- `img-08-zodiac-man-pdia.jpg` as faded background
- Closing quote

## Component Architecture

```
/src/app/ebook/hermetic-principles/
  page.tsx            - Route entry, assembles all pages
  components/
    EbookWrapper.tsx  - Print styles, page dimensions
    CoverPage.tsx     - Cover layout
    TextPage.tsx      - Reusable text-first page (pages 2, 3)
    PrinciplePage.tsx - Template for pages 4-10
    PracticePath.tsx  - 7-day practice layout (page 11)
    ClosingPage.tsx   - CTA and closing (page 12)
    Callout.tsx       - Styled callout/quote component
    PracticeBox.tsx   - Practice exercise panel
  ebook.css           - Print-specific styles
```

## Print CSS

```css
@media print {
  @page {
    size: letter portrait;
    margin: 0;
  }
  body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .ebook-page {
    width: 8.5in;
    height: 11in;
    page-break-after: always;
    overflow: hidden;
  }
}
```

## Image Handling

- Copy images from `docs/content/assets/hermetic-principles-starter-guide/raw/` to `public/ebook/hermetic-principles/`
- Use standard `<img>` tags for print compatibility (Next.js Image optimization not needed for PDF)
- Apply dark overlays via CSS gradients where images sit behind text

## PDF Export

Option 1 (simple): Browser print dialog (Cmd+P > Save as PDF)
Option 2 (automated): Puppeteer script for consistent output

## Accessibility / Readability

- Body text minimum 10.5pt
- Strong contrast (bone on obsidian)
- No text directly on textured images without overlay
- Line length 55-80 characters
- Readable on mobile PDF viewers

## Out of Scope (V1)

- Fillable journaling fields
- QR codes
- Glossary pages
- Interactive elements

## Content Source

All copy from: `docs/content/2026-02-26-hermetic-principles-starter-guide-v1.md`

## Dependencies

- Existing globals.css design tokens
- Public-domain images (already downloaded)
- No new packages required
