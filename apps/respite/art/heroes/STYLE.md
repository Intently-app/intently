# Blog hero art — style guide

Every blog post gets its own hand-built SVG illustration. The sources live in `art/heroes/svg/<slug>.svg`.
`node scripts/render-heroes.mjs [slug…]` renders them to `public/images/blog/<slug>.jpg` and `.webp` at 1920×1080.
The post then points at that file with `heroImage: '/images/blog/<slug>.jpg'` and gets a matching `heroImageAlt`.
The concept for each post is in `briefs.json`.

## Canvas
- `viewBox="0 0 1600 900"` with `width="1600" height="900"`, and `xmlns="http://www.w3.org/2000/svg"`. The file must be self-contained: no external fonts, images or `<use href>` to other files.
- Pages crop the image to 16:9 and 16:10 (`object-fit: cover`), and cards crop it further. Keep the focal subject within x 200–1400, y 90–810.
- The full canvas is always painted, with no transparent areas.

## Shared palette (one series)
| Role | Hex |
|---|---|
| Ink (darkest) | `#0B1C27` |
| Deep brand | `#24465A` |
| Primary | `#2F6079` |
| Brand mist-blue | `#5E8FA6` |
| Mist | `#BDE1EC` |
| Pale | `#DCEEF4` |
| Paper | `#F7FBFC` / `#EEF5F8` |
| Warm accent (orange) | `#E8A317`, light `#FCEBC4`, dark `#B97F0C` |
| Coral (alarm, sparingly) | `#E8664F` |
| Green (growth) | `#3E9B4F`, light `#D6EFD9` |

Mist blues carry most of the image. Each image has **one** warm focal accent (orange or coral) where the eye should land. Extra hues are allowed when the concept truly needs them (sunset, night sky), but only as tints of the palette.

## Texture (every image)
Add this subtle paper grain as the last layer:
```svg
<filter id="grain" x="0" y="0" width="100%" height="100%">
  <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" stitchTiles="stitch"/>
  <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.16 0"/>
</filter>
<rect width="1600" height="900" filter="url(#grain)"/>
```
The grain filter renders a black noise layer at low opacity. Keep the image readable without it.

## Hard rules
- No text, letters, numbers, UI copy or watermarks.
- No real logos, app icons or trademarked shapes (TikTok note, Instagram camera, YouTube play button, X bird, Reddit alien, Forest's tree icon, Opal's gem, and so on). Show a platform through generic shapes.
- No realistic faces or hands. People are simple faceless silhouettes, used sparingly.
- Use shapes, gradients, clip paths and filters. Gaussian blur and drop shadow are fine. Avoid `<foreignObject>`, CSS animation and `mix-blend-mode`, because librsvg/sharp ignores or mangles them.
- Aim for 6–40 KB of SVG and real craft: layered depth, a light source, and deliberate negative space. Avoid clip-art.

## Families
Every image belongs to one of four families. The palette and grain are shared, and each family has its own visual language.

### versus — comparisons, alternatives, "best of" roundups
A bold, poster-like layout: split screens, strong diagonals, symmetry and lineups (Swiss/Bauhaus poster energy). Large flat colour fields with crisp geometric objects. A comparison uses two contrasting halves, one approach against another; Respite's side gets the warm accent. A roundup shows a lineup, shelf or gallery of distinct objects with one highlighted. Use little texture beyond the grain, and hard shadows rather than soft ones.

### product — Respite features and how-tos
Playful soft-3D or isometric objects with linear gradients for volume, a soft highlight and a soft drop shadow (blurred ellipse beneath). Warmer than the other families: orange, acorn brown (`#8A5A2B` / `#C98B4E`) and green, on mist-blue backdrops. The objects feel collectible and tactile, like toys or game pieces.

### guide — practical "how to stop / reduce" posts
Surreal editorial-magazine scenes built on a visual pun, like a New Yorker spot illustration: horizon lines, landscapes and architecture with flat shapes. Grade the colours along the sky. A tiny faceless figure can set the scale. Wit comes first.

### mind — science, psychology and wellbeing essays
Layered paper-cut depth: 4–7 stacked organic layers, each with a soft drop shadow (`feDropShadow dy=6 stdDeviation=8 flood-opacity=.18`). Calm, contemplative, curvy shapes, with a quiet light source (a glow or a sun disc). The cool mist tones dominate, with a single small warm accent.
