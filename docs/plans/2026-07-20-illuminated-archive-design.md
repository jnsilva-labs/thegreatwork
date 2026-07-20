# Awareness Paradox Illuminated Archive Design

Date: 2026-07-20

## Goal

Unify Awareness Paradox into a premium, authored visual system that feels like a living esoteric archive rather than a collection of adjacent dark applications. Preserve the existing obsidian, bone, gilt, oxidized-teal, grain, armillary, Rider-Waite, and editorial qualities while improving consistency, legibility, trust, responsive composition, and motion discipline.

## Approved Direction

The primary direction is **Illuminated Archive**: a contemporary dark library made from archival plates, asymmetric editorial grids, measured typography, marginalia, etched rules, and generous negative space.

The secondary direction is **Living Instrument**, used only where interaction is the subject:

- the homepage armillary and threshold moments;
- Tarot question, reveal, and card-detail rituals;
- Astrology's celestial orientation and chart result;
- the Sacred Geometry viewer.

Ordinary reading surfaces should remain quiet. The strongest interactive moments should not compete with decorative animation elsewhere.

## Constraints

- Front-end only. Existing AI endpoints, quotas, Render/Vercel topology, schemas, and persistence behavior remain unchanged.
- No paid visual services or external runtime asset dependencies.
- Preserve existing functionality and the three user themes.
- Use locally packaged open-source fonts and existing public-domain or already-cleared archival assets.
- Mobile-first. Essential controls remain at least 44px and essential labels should not fall below 12px.
- Respect reduced motion, stillness mode, low-power fallbacks, and no-WebGL states.
- Avoid a heavier boxed interface. Awe should come from type, imagery, space, light, and selective motion.

## Visual System

### Typography

Use a bundled, open-source high-contrast display serif for ritual headings and a bundled, controlled humanist sans for navigation, labels, forms, and body copy. The selected pair is Cormorant Garamond and Manrope, shipped locally through Fontsource packages. System Didot/Bodoni/Avenir stacks remain fallbacks only.

Type hierarchy:

- display: homepage and route-opening statements only;
- title: one route title or major oracle result;
- subtitle: section openings and pull quotes;
- body: 16–18px with disciplined line length;
- eyebrow/label: 12px minimum when essential, with tighter tracking on mobile;
- caption: 12–13px, sentence case where practical.

### Color and Material

The current semantic tokens remain the source of truth. Undefined legacy aliases are repaired or removed. Route variants derive from `--bg`, `--fg`, `--muted`, `--panel`, `--border`, `--accent`, and their semantic aliases rather than hard-coded navy, slate, or gold utilities.

Surfaces use fewer opaque cards. Prefer:

- open fields separated by etched rules;
- low-opacity vellum washes;
- archival images with restrained warm light;
- marginal annotations;
- hairline borders and corner marks;
- deeper room treatments only for interactive instruments.

### Shared Editorial Primitives

Create a small family of compositional primitives rather than a large component framework:

- `EditorialSpread`: asymmetric text/image or text/marginalia layout;
- `ArchivalFigure`: optimized image, source caption, and optional plate number;
- `MarginalNote`: compact contextual annotation separated by a rule;
- `EtchedList`: unboxed numbered or glyph-led sequence;
- `RitualLink`: consistent rectangular or softly rounded call to action;
- `OraclePanel`: deeper interactive surface reserved for Tarot/Astrology;
- `TrustNote`: concise methodology, privacy, source, or AI-assistance disclosure.

Rounded pills remain appropriate for compact filters, toggles, and genuine choices. They should not be the default shape for every link or content block.

## Route Art Direction

### Homepage

- Keep the armillary as the single visual protagonist.
- Remove the unexplained 50–70vh tail spacer and reduce mobile dead space.
- Use one semantic `h1` while retaining the two-line display.
- Keep the new three-path routing and dual Tarot/Astrology reading choice.
- Vary later chapters between editorial spreads, pull quotes, plates, and restrained text fields rather than repeating one title/body/CTA structure.
- Shorten visibly repetitive chapter copy without changing the site's thesis.
- Quiet secondary marquees, parallax, SVG, and hover motion when they compete with the scene.

### Tarot

- Treat Tarot as a darker reading chamber built from the same theme tokens.
- Turn the entry surface into a clear reading table with a high-contrast question field and fewer competing chips.
- Use the authentic Rider-Waite aspect ratio (7:12) or an explicitly designed mat.
- Replace remote texture use with local CSS/material treatment.
- Rebuild card details as a full-height mobile sheet and balanced desktop dialog with continuous reading flow.
- Complete dialog focus, naming, close labels, Escape, focus restoration, and 44px navigation controls.
- Preserve reveal ritual, journal, settings, AI fallback, and existing schemas.

### Astrology

- Introduce a celestial orientation visual before the form using the existing chart vocabulary rather than a generic content card.
- Present the oracle form as an instrument, not a dashboard widget.
- Reorder results into: thesis, Big Three, paradox, chart/planetary context, supporting interpretation, advanced details.
- Reduce nested rounded panels, enlarge small labels, and use rules, columns, and grouped lists.
- Keep advanced placements/aspects/houses available in a quiet disclosure.
- Route natal result motion through the shared motion preference.

### Study, Start Here, Letters, Great Work, and Principles

- Replace at least half of the card grids with editorial spreads, stage maps, ruled sequences, pull quotes, and archival figures.
- Use existing ebook images selectively, with captions and source labels.
- Give each route one memorable composition rather than applying spectacle everywhere.
- Preserve source-grounded copy and existing conversion links.

### Gallery

- Keep geometry as the dominant visual.
- Restyle controls as instrument calibration rather than debug/settings UI.
- Reduce panel nesting and pill density.
- Ensure auto-rotation and transitions honor reduced motion and stillness.

## Navigation, Trust, and Footer

- Keep primary navigation concise and move atmosphere controls under an `Environment` disclosure.
- Complete menu dialog semantics and keyboard behavior.
- Add visible About, Method, Sources, Privacy, and AI-assisted interpretation links or disclosures.
- Create concise static trust pages where the information does not already exist.
- Add a global skip link and one global main landmark.
- Use a more editorial footer with a short statement of purpose, provenance/trust navigation, exploration links, and social links.

## Motion

The motion vocabulary remains drift, reveal, etch, and dissolve.

Rules:

- one dominant motion event per viewport;
- no broad `transition: all` or `transition-all` on upgraded surfaces;
- ordinary reading sections become still after entrance;
- Tarot reveal, Astrology result, Gallery rotation, CSS animation, GSAP, and WebGL all respect the same user preference signals;
- decorative layers never intercept pointer input.

## Responsive Behavior

- Validate at 375, 390, 768, 1280, and 1440px.
- Essential labels are at least 12px; tracking reduces below tablet widths.
- Hero space must lead to a visible next action on common phone heights.
- Tarot card details use a mobile sheet rather than a scaled desktop modal.
- Astrology results collapse into a clear reading sequence, not stacked miniature cards.
- Archival figures use controlled crops and readable captions.

## Testing and Acceptance

The branch is ready when:

- all legacy design tokens resolve;
- local fonts render without external requests;
- the homepage no longer contains the blank tail spacer;
- Tarot uses the authentic card ratio and coherent theme materials;
- Astrology establishes a celestial identity before the form and has a clear result hierarchy;
- major editorial routes no longer rely primarily on rounded card grids;
- navigation and Tarot dialog tests pass;
- tests, lint, type/build checks pass;
- browser QA is complete at the required widths, with reduced-motion and no-WebGL checks;
- no backend contracts or quotas changed.

## Explicit Non-Goals

- New AI providers, paid services, accounts, or authentication.
- Rewriting editorial doctrine or changing reading schemas.
- Replacing the existing WebGL engine.
- Turning every route into an immersive animation.
- Redesigning internal developer-only pages unless shared changes require compatibility fixes.
