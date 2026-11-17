# UTM and campaign links

One naming scheme for every link that brings people to a Respite page or sends them to a store. With it,
Google Analytics 4, Play Console, App Store Connect and the Chrome Web Store dashboard all report the
same names. The site's code is in `apps/respite/src/lib/analytics.ts` (browser) and
`apps/respite/src/lib/analytics-core.ts` (pure helpers, tested by `apps/respite/scripts/analytics.test.mjs`).

## Rules

- Lowercase, words joined with `_`, no spaces: `reddit`, not `Reddit` or `reddit.com`.
- `utm_source` = **where** the link sits (the site or app): `reddit`, `x`, `producthunt`, `newsletter`.
- `utm_medium` = **what kind** of channel: one of the values in the table below. Don't invent new ones.
- `utm_campaign` = **why** it exists: a dated push or a standing placement, e.g. `launch_2026_11`, `bio`.
- `utm_content` = **which** link or creative, when one campaign has several: `top_comment`, `video_1`.
- Never tag internal links (respite.liveintently.app → respite.liveintently.app). It resets the
  visitor's source in analytics. The site carries the visitor's source forward by itself.
- Links from the hub (liveintently.app) to the Respite site count as internal too: both sites send to
  the same GA4 web stream (`G-40F2MVBEQE`) and share its first-party cookie on liveintently.app, so
  hub → Respite stays one session. A UTM there would start a new session and hide the real source.

| utm_medium | Use for |
|---|---|
| `social` | Organic posts and comments: Reddit, X, Threads, LinkedIn, Facebook groups |
| `bio` | Profile links (X bio, Instagram link-in-bio, GitHub profile) |
| `email` | Newsletters and outreach emails you send |
| `app` | Links inside the Respite apps and extension (support, "visit site") |
| `store_listing` | The website link on a store listing |
| `referral` | Other people's sites linking to us without tags (set automatically from the referrer) |
| `partner` | Guest posts, directories, listicles that link to us |
| `paid_social` / `cpc` | Paid ads, if ever |
| `qr` | QR codes: printed, and the site's own codes to the phone (`/get`) |

## Ready-made links

| Where | Link |
|---|---|
| Play listing › website | `https://respite.liveintently.app/?utm_source=google_play&utm_medium=store_listing&utm_campaign=listing` |
| App Store › marketing URL | `https://respite.liveintently.app/?utm_source=app_store&utm_medium=store_listing&utm_campaign=listing` |
| App Store › support URL | `https://respite.liveintently.app/support/?utm_source=app_store&utm_medium=store_listing&utm_campaign=support` |
| Chrome Web Store › website | `https://respite.liveintently.app/?utm_source=chrome_web_store&utm_medium=store_listing&utm_campaign=listing` |
| Android app › about/support | `https://respite.liveintently.app/support/?utm_source=respite_android&utm_medium=app&utm_campaign=settings` |
| iOS app › about/support | `https://respite.liveintently.app/support/?utm_source=respite_ios&utm_medium=app&utm_campaign=settings` |
| Extension › popup/options | `https://respite.liveintently.app/?utm_source=respite_chrome&utm_medium=app&utm_campaign=popup` |
| Reddit post | `https://respite.liveintently.app/blog/<slug>/?utm_source=reddit&utm_medium=social&utm_campaign=<push>&utm_content=<subreddit>` |
| X / Threads bio | `https://respite.liveintently.app/?utm_source=x&utm_medium=bio&utm_campaign=bio` |

Leave untagged any privacy-policy link a store *requires* (Play's privacy field, the App Store privacy
URL). Reviewers and automated checks compare those literally.

## What the site does with them

1. The first `utm_*` set a visitor arrives with is kept for their session.
2. Untagged visitors get a source from the referrer: `google` + `organic`, or `<site>` + `referral`.
3. When a page loads, every store link on it is rewritten:

   | Store | Parameters | Where to read it |
   |---|---|---|
   | Google Play | `referrer=utm_source=…&utm_medium=…&utm_campaign=…&utm_content=…` | Play Console › Grow › Store performance › Acquisition |
   | Chrome Web Store | `utm_source`, `utm_medium`, `utm_campaign`, `utm_content` | Developer Dashboard › Analytics › Acquisition |
   | App Store | `pt=128440905&ct=<source>.<page>&mt=8` (ct ≤ 30 chars) | App Store Connect › App Analytics › Acquisition › Campaigns |

   With no inbound tags, the values are `utm_source=respite_site`, `utm_medium=web`,
   `utm_campaign=<section>` (`home`, `blog`, `tools`, `download`, …), and
   `utm_content=<page slug>__<placement>`. The placement is `hero`, `nav`, `article`, `sidebar`,
   `footer` or `body`, or whatever the nearest `data-placement` attribute says.
4. Each click on a store link, and on any button or link marked `data-cta`, sends a GA4 event. See
   **Events** below.
5. Before step 3, install buttons are pointed straight at this device's store
   (`apps/respite/src/lib/smart-install.ts`, rule in `install-target.ts`, tested by
   `scripts/install-target.test.mjs`). In the HTML every install button (`data-cta` `download`,
   `article_cta`, `sticky_bar`) links to `/download/`, which crawlers and browsers without JavaScript
   keep. In the browser: Android → Google Play, iPhone and iPad (iPadOS too) → App Store, Chrome or
   Edge on a computer → Chrome Web Store (a generic label such as "Get the App" becomes "Add to
   Chrome — free"); anything else (Firefox, Safari on a Mac, bots) keeps `/download/`. The rewritten
   buttons are then tagged like any store link and send `store_click` with their `cta`.
6. QR codes on computers (blog rail, `/download/`) encode `https://respite.liveintently.app/get?c=<where>`
   (`c=blog`, `c=download`). `/get` (`apps/respite/src/pages/get.ts`) answers 302 by user agent:
   Android → Google Play, iPhone/iPad → App Store, anything else → `/download/`. The store link
   carries `utm_source=respite_site`, `utm_medium=qr`, `utm_campaign=<c>` (default `desktop`),
   `utm_content=qr_<c>__qr` (App Store: `ct=respite_site.qr_<c>`); any `utm_*` on the `/get` link
   wins. For a printed code, use e.g. `/get?c=flyer&utm_source=meetup`.

## Events

All events go to the GA4 web stream "Respite Website" (`G-40F2MVBEQE`), under Consent Mode v2 (no
banner: analytics storage denied in the EEA, the UK and Switzerland, granted elsewhere; ads storage
and Google signals off everywhere). The hub at liveintently.app sends to the same stream.

| Event | Parameters | Fired by |
|---|---|---|
| `store_click` | `store` (`app_store`, `google_play`, `chrome_web_store`), `page`, `section`, `placement`, `source`, `medium`, and `cta` when the link has `data-cta` | Any click (or middle-click) on a store link on the Respite site. Store links never also send `cta_click`. |
| `cta_click` | `cta`, `page`, `section`, `placement`, `source`, `medium` | Respite site: a click on any element with `data-cta="<id>"` that isn't a store link. Hub: links to Respite (`cta=respite_card`, `section=hub`, plus `link_url`; no `source`/`medium`). |
| `share` (GA4 recommended) | `method` (`native_share`, `copy_link`, `x`; the calculator's report card also `native_image`, `native_link`, `download`), `content_type` (`article`, `tool`), `item_id` (page slug; `calculator` for the calculator's report card) | Blog share buttons (`layouts/BlogPost.astro`), the app score's share buttons, and the calculator's report card: share sheet with the card picture (`native_image`) or the link only where the sheet can't take a file (`native_link`), save the picture (`download`), copy the result link (`copy_link`), post to X (`x`). |
| `tool_complete` | `tool` (`quiz`, `calculator`, `addiction_score`), `result_band` | A tool shows its result. Bands only: quiz `healthy`/`mild`/`moderate`/`severe`; calculator daily hours `under_2h`/`2_4h`/`4_6h`/`6_8h`/`8h_plus`; app score `low`/`moderate`/`high`/`critical`. A result restored from a shared link doesn't count. Never send raw answers, ages, hours or apps. |
| `sticky_bar_dismiss` | `page`, `section` | The ✕ on the install bar at the bottom of blog posts on phones (`components/InstallBar.astro`). It stays hidden on that device for 14 days. |
| `generate_lead` (GA4 recommended) | `form` (`contact`) | The contact form, only after the server says the message was sent. Nothing typed goes with it. |

`page` is the page slug (`home`, `quiz`, `how_to_stop_doomscrolling`), `section` the site section
(`home`, `blog`, `tools`, `download`, `features`, `legal`, …). `source` and `medium` are the visitor's
inbound `utm_source`/`utm_medium`, or the referrer-derived values, or `respite_site`/`web` for direct
visits: the same values the store links carry.

`placement` is the nearest `data-placement` attribute (`hero`, `final_cta`, `inline_cta`, `rail_cta`,
`result`, `index_cta`, `changelog`, `download_cards`, `download_hero`, `sticky_bar`, `platforms`, `app_card`, `apps_list`, `moment`,
…), otherwise the landmark around the element: `nav`, `footer`, `hero`, `sidebar`, `article` or `body`.

### `data-cta` ids

| Id | Where |
|---|---|
| `download` | Every "Download" / "Get the App" button to `/download/`, including the header button (placement `nav`) |
| `article_cta` | The download button of the in-article CTA box that `BlogPost.astro` moves into the post (placement `inline_cta`) |
| `sticky_bar` | "Get it free" on the install bar at the bottom of blog posts on phones (placement `sticky_bar`) |
| `quiz` | Buttons and tool cards to `/quiz/` |
| `calculator` | Buttons and tool cards to `/screen-time-calculator/` |
| `addiction_score` | Buttons and tool cards to `/app-addiction-score/` |
| `plans` | "Free or Plus" links to `/features/#plans` |
| `features` | Buttons and feature cards to `/features/` |
| `ai` | Buttons and cards to `/ai/` |
| `compare` | The "Compare screen time apps" link in the blog index CTA |
| `respite_card` | Hub only: links to the Respite site and stores from its app card, app lists and chapter hints |

Plain navigation (header menu, footer lists) and links inside article text aren't tagged. To track a
new button, add `data-cta="<id>"` (reuse an id above where it fits) and, if the landmark isn't enough,
a `data-placement` on it or a wrapper. `ctaForHref()` in `analytics-core.ts` gives the id for a path.

### Set up in GA4 (once)

- **Custom dimensions** (Admin › Custom definitions, event scope): `cta`, `placement`, `page`,
  `section`, `store`, `tool`, `method`. Optional: `result_band`, `source`, `medium`.
- **Key events** (Admin › Events › mark as key event): `store_click`, `generate_lead`.

## Still to do

- App Store campaigns only show in App Store Connect once a campaign has installs from 5 or more
  Apple Accounts. The provider token (`pt=128440905`) is set in `apps/respite/src/lib/analytics-core.ts`.
- Put the ready-made links above into the three store listings and the apps' settings screens.
