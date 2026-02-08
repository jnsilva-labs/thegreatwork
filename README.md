# Sacred Geometry Codex

A ritual interface exploring the seven Hermetic principles through sacred geometry, golden ratio, and fractal fields. The experience blends editorial typography with a living WebGL substrate (aether field + fractal veil), delivering cinematic scroll-driven transitions.

## Principles & Visual Laws

1. **Mentalism** — geometry assembles from invisible points; particles converge, lines remember form.
2. **Correspondence** — mirrored strata; above/below symmetry mapping.
3. **Vibration** — coherent oscillation through the field.
4. **Polarity** — phase and color inversion on scroll.
5. **Rhythm** — pendulum camera drift and cyclic intensity envelope.
6. **Cause & Effect** — ghosted linework traces that reveal causation.
7. **Gender** — two interwoven fields (angular + flowing) generate each other.

## Adding a New Chapter

1. Add the new entry in `src/data/principles.ts` (slug, axiom, body, keys, practice).
2. The homepage, nav, and annotations are generated from this data automatically.
3. Update principle logic in `src/components/scene/AetherField.tsx` and `src/components/scene/SacredGeometrySigil.tsx` if needed.

## Running Locally

```bash
npm install
npm run dev
```

If port 3000 is blocked:

```bash
npm run dev -- -H 127.0.0.1 -p 3001
```

## Deploy (Vercel)

```bash
npm i -g vercel
vercel
vercel --prod
```

## Styleguide

Visit `/styleguide` to see tokens, type scale, and sigils.

## Plate Checks

```bash
npm run check:plates
```

## Astro Share Cards

`/astro` now includes a Share panel that renders deterministic SVG cards from natal chart facts:

- `Chart Totem` (1080x1350)
- `Zodiac Constellation Map` (1080x1080)

Exports:

- `Download PNG` (rendered from the generated SVG)
- `Download SVG` (source vector)

Caveats:

- The export is deterministic from chart placements, so identical chart JSON produces identical SVG output.
- PNG export relies on browser SVG-to-canvas decode; modern desktop/mobile browsers work, but very old browsers may fail silently.
- No AI interpretation is used in share-card rendering; only chart facts are mapped.

## Geometry Plate Assets

Place finalized plate SVGs in `public/geometry` with these filenames:

- `seed-of-life.svg`
- `flower-of-life.svg`
- `metatrons-cube.svg`
- `vesica-piscis.svg`
- `golden-spiral.svg`
- `fibonacci-rectangles.svg`
- `platonic-solids.svg`
- `torus.svg`
- `sphere-lattice.svg`
- `sri-yantra.svg` (optional)
