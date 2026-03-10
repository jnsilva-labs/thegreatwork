# Ebook Image Upgrade & PDF Download — Design

Date: 2026-02-26
Status: Approved
Owner: Awareness Paradox

## Goal

Two improvements to the hermetic principles ebook page at `/ebook/hermetic-principles`:

1. Replace images on pages 2-11 with higher-impact public domain alchemical art (Splendor Solis, Aurora Consurgens, Rosarium Philosophorum style)
2. Change the PDF export from browser print dialog to a direct file download

## Part 1: Image Replacement

### What stays
- Page 1 (Cover): img-01 — The Alchemist (Rijksmuseum)
- Page 12 (Closing): img-08 — Zodiac Man (PDIA)

### Sourcing criteria
- Public domain confirmed (pre-1700 manuscript or explicitly PD-marked)
- High-res (at least 800px wide for print quality)
- Thematically matched to the principle on that page
- Richly colored allegorical paintings, not clinical line drawings

### Sources
- Wikimedia Commons
- British Library digitized manuscripts
- BSB Munich digital collections
- Bodleian Library
- Wellcome Collection (for better plates than current selection)

### Page-to-image direction

| Page | Principle | Image Direction |
|------|-----------|----------------|
| 2 | Welcome | Alchemist in study / philosopher with book |
| 3 | What Hermetic Means | Hermes Trismegistus depiction |
| 4 | Mentalism | Sun/moon consciousness allegory (Splendor Solis style) |
| 5 | Correspondence | "As above so below" — Emerald Tablet or macrocosm/microcosm |
| 6 | Vibration | Alchemical transformation / color-change plate |
| 7 | Polarity | Rebis (alchemical hermaphrodite) or sol/luna pairing |
| 8 | Rhythm | Ouroboros or seasonal/cyclical allegory |
| 9 | Cause & Effect | Alchemical process chain / distillation scene |
| 10 | Gender | Chymical wedding / king-queen conjunction |
| 11 | Practice Path | Small decorative motif only (philosopher's stone or similar) |

### Process
1. Search and identify candidate images per page
2. Download to `public/ebook/hermetic-principles/`
3. Update `src/data/ebookHermeticPrinciples.ts` with new filenames, alt text, captions
4. Verify rendering on page
5. Remove old unused images

## Part 2: PDF Download Button

### Current behavior
Button calls `window.print()` — opens browser print dialog.

### New behavior
- Owner exports PDF once manually (Cmd+P > Save as PDF, background graphics ON)
- PDF saved to `public/ebook/hermetic-principles-starter-guide.pdf`
- Button replaced with `<a href="/ebook/hermetic-principles-starter-guide.pdf" download>` styled identically
- Direct download, no dialog

### Changes
- Replace `<button onClick={() => window.print()}>` with styled `<a>` tag
- No new dependencies
- Keep screen-only toolbar (hidden in print CSS)

## Out of scope
- Automated PDF generation (Puppeteer/server-side)
- Client-side PDF rendering libraries
- Interactive elements
