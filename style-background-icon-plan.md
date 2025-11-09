# Style & Background Icon Design Plan

## Objectives
- Give users a quick, delightful read on outfit styles and background scenes without relying on raster previews.
- Keep the iconography inclusive, non-gendered, and crisp at 28-36 px so tokens feel compact in the carousel.
- Ensure each icon family communicates hierarchy (category -> variant) so the controls feel cohesive inside the existing card UI while reducing perceived blank space.

## Shared Visual Language
- Drawing style: geometric outlines with 2 px strokes, subtle 1 px interior details, rounded stroke caps/joins for warmth.
- Canvas & container: 40 px square token with 8 px corner radius; glyphs should occupy roughly 88 % of the canvas to avoid dead space.
- Spacing rules: limit internal padding to 2 px per side, pull dominant strokes out toward the edges, and balance negative space evenly top/bottom to keep tokens feeling compact.
- Color system: neutral graphite line work (`#1F2933`) over softly tinted category washes (see palettes below) and accent speckles using 30 % opacity of category hue.
- Lighting cues: single top-left highlight for dimensionality; subtle 8 % shadow at bottom-right to sit naturally on gradient cards.
- Motion: micro 4 % scale-up with 120 ms ease-out on hover/focus; 160 ms spring pop with 6 px y-bounce on selection confirmation.
- Accessibility: ensure 4.5:1 contrast in forced-colors mode by swapping in plain outline glyphs; add `aria-describedby` helpers for screen reader copy.

## Outfit Style Icons
- Base motif: torsos rendered with abstracted lapel/neckhole shapes plus accessory hints (ties, collars, layers) distilled to 2-3 primitives.
- Background badge: circular gradient keyed to category palette sized to 36 px diameter, leaving a 2 px halo around foreground shapes; overlay 18 % noise texture SVG to avoid flat gradients.
- Category palettes & primary glyph ideas:
  - **Formal** - Palette `#0F172A -> #1E293B`; icon: double lapel with tie knot diamond.
  - **Business Casual** - Palette `#1D4ED8 -> #38BDF8`; icon: open collar shirt with layered V-neck overlay, no tie.
  - **Professional** - Palette `#4C1D95 -> #8B5CF6`; icon: modern blazer outline with turtleneck arc.
  - **Creative** - Palette `#BE123C -> #F97316`; icon: blazer + crew neck with asymmetric pocket square.
  - **Seasonal** - Palette `#047857 -> #34D399`; icon: lightweight jacket silhouette with subtle scarf loop.
- Variant differentiation (within same category):
  - Use secondary micro-symbols (e.g., tie bar rectangle, patterned shoulder hash marks) anchored bottom-right and scaled to 6 px height max.
  - Introduce 5 px mask shapes that can toggle (stripe, grid) to hint at fabric or layering cues without literal imagery while staying inside the tighter geometry.
- Disabled/out-of-credit state: desaturate fills to gray scale while keeping 65 % opacity outlines; overlay diagonal hatch stroke to preserve legibility.

## Background Setting Icons
- Base motif: minimal scene vignettes inside a rounded hexagon frame sized to 38 px wide so silhouettes nearly meet the token boundary without crowding.
- Depth cues: two-layer parallax - foreground element at 100 % opacity, background silhouettes at 45 % to represent environment depth.
- Category palettes & glyph concepts:
  - **Studio** - Palette `#1E40AF -> #93C5FD`; icon: softbox rectangle + tripod silhouette with circular halo.
  - **Office** - Palette `#0F172A -> #64748B`; icon: skyline window mullions with floating desk lamp.
  - **Hospitality** - Palette `#B45309 -> #FACC15`; icon: counter arc with coffee steam curls and pendant lights.
  - **Outdoor** - Palette `#047857 -> #6EE7B7`; icon: horizon line with layered hills and rising sun semicircle.
  - **Professional** - Palette `#7C3AED -> #C084FC`; icon: bookshelf outline with document stack & minimalist frame.
  - **Industrial** - Palette `#334155 -> #CBD5F5`; icon: architectural plan grid with drafting compass.
- Animated feedback (optional stretch goal): on select, animate parallax layers via 60 ms y-translation to simulate scene depth.

## Integration Notes
- Token implementation: create shared `IconToken` component with props for `shape`, `palette`, `foregroundGlyph`, `detailGlyph`; render inside existing card button header.
- Keep gradients in CSS (`background: radial-gradient(...)`) so theme switching can adjust hues dynamically.
- Export glyphs as inline SVG React components for full theming (stroke and fill via `currentColor` & CSS variables).
- Provide focus ring alignment by wrapping icon + label in `flex-col` container; collapse top margin to 2 px and set `gap-1` so icons sit closer to captions and eliminate excess blank bands inside the cards.
- Update data models (`lib/maleOutfits.ts`, `lib/femaleOutfits.ts`, `lib/scenes.ts`) with `icon` identifiers instead of `thumbnail` paths to drive glyph selection.
- Document icon usage and tokens in Storybook/MDX so designers and engineers can test states before wiring into generation flow.

## Implementation Checklist
- [ ] Build shared palette tokens in `tailwind.config.ts` (category hue, tint, shade).
- [ ] Produce 12 SVG glyphs (5 outfit categories + 5 setting categories + 2 alternates) at 48 px artboards (export @2x for retina coverage).
- [ ] Create motion variants using `framer-motion` or CSS keyframes aligned with timing specs.
- [ ] Add unit snapshots using Playwright visual regression (future) to protect icon clarity.
