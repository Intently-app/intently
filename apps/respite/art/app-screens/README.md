# Real app screens for the site

`public/images/app/*.webp` are crops of the Respite redesign canvas
(https://claude.ai/artifact/FMLE3b1pnN83XZ6AEGsVdg), which matches the shipped apps.
They replace drawn, made-up UI on Home and Features.

- `boards/`: copies of the canvas artboards (`project/<Board>.dc.html`) and `ds/respite/tokens.css`.
  Account details on them are demo data (Sam, sam@example.com). Never commit a real name or email:
  the render fails on any address outside example.com, and on the words in `APP_SHOTS_DENY`
  (comma-separated, set it locally to the real names on the canvas).
- `blobs/`: the Biscuit images the boards use (`/_blob/<id>` on the canvas).
- `icons/`: real app icons from Simple Icons (CC0, see `icons/LICENSE.md`), plus Respite's own.
  The render swaps each letter tile ("I", "F", "Y"…) for the icon of the app named beside it.
- `manifest.json`: one entry per shot: the board, the crop (`clip` [x, y, w, h] or `clipTo`
  selectors with `pad` [x, y]), elements to `hide`, and text to `replace`.

To refresh after the canvas changes: copy the boards again (with demo data), then run

    npm run render-app-screens -w @intently/respite-site -- --sheet

and check `contact-sheet.jpg` (not committed), light and dark. Each shot is written as
`<slug>.webp` and `<slug>-dark.webp`, and `src/data/app-shots.json` gets their sizes.
Pages show them with `components/ui/AppShot.astro`; alt text lives in `src/data/appShots.ts`.
