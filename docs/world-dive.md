# The dive: from the hub into an app's own world

Status: in progress (Intently-app/tracker#298). Shipped dark: nothing changes in production until
`DIVE_DEFAULT` / `ENGINE_DEFAULT` in `packages/world/src/flags.ts` are turned on with the owner's go-ahead.

Choosing an app on liveintently.app turns the camera into the screen: the day's landscape rushes
past, the app's colour fills the view, and the app's own site picks the flight up in its own three.js
world and settles on its hero. The walk through the day (left to right) stays as it is.

## Depth on the hub (`apps/hub/src/scripts/world/depth.ts`)

The hub's world stays the raw WebGL2 renderer (decided 2026-11-25, tracker #301). A minimal three.js
build is 485 KB raw / 121 KB gzip, the whole world today 84 KB / 32 KB, and three.js adds nothing to
this scene. The landscape is four flat layers facing the viewer at parallax p = 0.12, 0.3, 0.58 and 1,
and the sky is at infinity. Read in 3D, layer p sits at distance D/p. An eye that moves forward by
ζ·D and sideways by (cx, cy) sees a layer-p point that was at screen (x, y) at

    x' = (x − p·cx) / (1 − p·ζ)        y' = 500 + (y − 500 − p·cy) / (1 − p·ζ)

which is exactly a pinhole projection (`depth.test.ts` checks it). Sprites, dots and the pond's box
use this map; the landscape and pond shaders use its inverse per layer, and so does every light. The
sky never moves. At rest the shaders take the old code path, so the scroll looks exactly as before.

The dive (`dive.ts`) flies toward each chapter's subject: the phone (Attention), the pond (Wealth),
the lantern (Faith), the house (Relationships), the walker otherwise. The app's colour blooms out of
it (`FILL_FS`, drawn last).

## Arrival worlds

| Site | World | Drawn with |
|---|---|---|
| Respite | Mist in #2F6079 that keeps the dive's speed and parts from the middle; on wide screens the 3D phone flies forward out of it into the hero (`phone-journey.ts` reads `arrival-intro.ts`) | A raw WebGL2 shader for the mist, so phones get it without the phone's three.js; three.js for the phone |
| Hisab | Thin lines of light fly out of the green, sort into the debit and credit columns of the ledger sheet's rows and settle on its totals' double rule; then the sheet writes its first entry | A 2D canvas (160 lines for a second) |

## Why it is a handoff, not a view transition

Cross-document view transitions only work within one origin, and every app lives on its own
subdomain (a different origin, the same site). So the two pages coordinate:

1. The hub flies in (`timing.ts`: 700 ms, ease-in, ×12 on the foreground; it navigates at 560 ms,
   once the app's colour covers the screen) and holds that frame.
2. It navigates to `https://<app>.liveintently.app/#intently=v1.<app>.<chapter>.<tier>`. The fragment
   is added only at that moment: links in the HTML stay plain `https://<host>`, so crawlers, canonical
   URLs, servers and logs never see it.
3. The app's first `<head>` script (`ArrivalVeil.astro`, before analytics) checks the fragment,
   strips it with `history.replaceState`, and paints the app's colour as a fixed layer, so the first
   frame matches the hub's last one and nothing moves.
4. The app's arrival world (`arrival.ts`) takes over from the veil, starts at the zoom rate the hub
   left at, and settles in 500 ms. If it isn't ready within 350 ms the veil parts in CSS instead,
   and a failsafe clears it 1.5 s after the page is shown, whatever happens.

While the visitor hovers or focuses an app link, Chromium prerenders the exact URL (`speculate.ts`);
each app site opts in with `Supports-Loading-Mode: credentialed-prerender` in `public/_headers`.
Other browsers get a preconnect.

## Tiers (`capability.ts`)

| Tier | When | What happens |
|---|---|---|
| instant | reduced motion, Save-Data, `?world=static`, no WebGL2 | plain navigation |
| bridge | the hub's frames were slow, or a small device | a 300 ms colour fill, the app's veil fades |
| lite | touch screens that can draw it | the dive at lower resolution, 550 ms |
| full | everything else | the full dive |

The tier travels in the fragment, so the app never measures the device again.

## The way back (`reverse.ts`)

The hub writes `{app, chapter, scroll, u}` into its own history entry before it leaves. Back (or a
bfcache restore) flies out of the app's colour to that spot. An app's links to Intently gain
`#from=<app>.<chapter>` at click time and land on that hour.

## Between the hub's own pages (`apps/hub/src/scripts/transitions.ts`)

Same origin, so the browser's cross-document view transitions do it (`@view-transition` in
`tokens.css`, off with reduced motion). The page cross-fades, and the chosen hour grows into its chapter.
The name `chapter-hour` goes on the finale's light (or a home moment's light) on the way in, and on
the chapter's hero on the way out. Only one element at a time carries the name, and only for the
transition. The arriving side is named by an inline script in `Base.astro`'s head, because
`pagereveal` can fire before deferred scripts run. Browsers without view transitions (Firefox today)
just navigate, and so does a page that takes too long to first paint.

## Testing it

- `npm test -w @intently/hub-site` covers the package, the depth map and the camera path.
- `apps/hub/tests/e2e/dive.spec.ts` checks a click, the hand-over, Esc, back, `#from=`, and the cases
  that must stay plain links. `arrival.spec.ts` serves the built Respite and Hisab sites under their
  real hosts and checks each arrival and the whole flight there and back.
- Headless browsers draw the world in software at a few frames a second, so the specs set
  `window.__intentlyDiveSlowmo` to watch the flight in slow motion.
- `DIVE_LOOK=<dir> npx playwright test dive-look --project=desktop-chrome` saves frames of a dive.
- Try it in a browser: on `localhost` and `*.workers.dev` the dive is on; elsewhere add `?dive=1`
  (`?dive=0` turns it off again).

## Rules

- Content is server-rendered HTML; the canvas is decoration (`aria-hidden`), never the only place
  something is said.
- Only plain primary clicks on an app's root link dive (`links.ts`); modified clicks, new tabs and
  downloads are the browser's.
- Any click, key or wheel input skips ahead; Esc cancels the hub's flight before it navigates.
- One three.js version across the repo (`tools/check-three.mjs`, run by the hub's `check`).

## To settle before launch (Phase 0 spikes)

- Does a prerender with a fragment URL activate on navigation (`activationStart > 0`)? If not, use
  `?intently=` with `No-Vary-Search`.
- Is `workers.dev` on the Public Suffix List (do preview aliases count as same-site)?
- GA4 in a prerendered page: is `page_view` deferred until activation, and does a discarded
  prerender send nothing?
- WebGL after a bfcache restore and inside a prerender, on iOS Safari and Chrome Android.
