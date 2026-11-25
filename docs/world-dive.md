# The dive: from the hub into an app's own world

Status: in progress (Intently-app/tracker#298). Shipped dark: nothing changes in production until
`DIVE_DEFAULT` / `ENGINE_DEFAULT` in `packages/world/src/flags.ts` are turned on with the owner's go-ahead.

Choosing an app on liveintently.app turns the camera into the screen: the day's landscape rushes
past, the app's colour fills the view, and the app's own site picks the flight up in its own three.js
world and settles on its hero. The walk through the day (left to right) stays as it is.

## Why it is a handoff, not a view transition

Cross-document view transitions only work within one origin, and every app lives on its own
subdomain (a different origin, the same site). So the two pages coordinate:

1. The hub flies in (`timing.ts`: 700 ms, navigates at 560 ms) and holds a frame of the app's colour.
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
- Size of the hub's three.js chunk (target ≤ 150 KB gzip).
- WebGL after a bfcache restore and inside a prerender, on iOS Safari and Chrome Android.
