# Keyword gaps and SEO recovery check — November 2026

Tracker: Intently-app/tracker#10. Data: Search Console API, property `sc-domain:liveintently.app`. "Now" is
the 28 days Oct 20 – Nov 16; "September" is Sep 1 – Oct 1, before the two host moves. Search Console hides
rare queries, so the totals here are lower than the property totals.

## Recovery: on track, not done

Weekly clicks (c), impressions (i) and average position (p) per host:

| Week of | liveintently.app (old) | pawse. (old) | respite. (current) |
|---|---|---|---|
| Sep 21 | 22c 2884i p8.2 | — | — |
| Sep 28 | 24c 3459i p7.9 | 2c 184i p15.4 | — |
| Oct 5 | 11c 2206i p8.8 | 3c 929i p16.4 | 0c 6i |
| Oct 12 | 5c 1037i p9.4 | 2c 655i p19.1 | 0c 5i |
| Oct 19 | 1c 595i p9.9 | 1c 465i p25.0 | 0c 6i |
| Oct 26 | 1c 251i p8.5 | 0c 7i | 1c 424i p39.3 |
| Nov 2 | 1c 226i p9.3 | — | 2c 631i p33.3 |
| Nov 9 | 1c 364i p8.9 | — | 1c 1052i p21.5 |

- The respite host is climbing: impressions 424 → 631 → 1052 a week and position 39 → 33 → 21.5.
- Clicks are still ~1 a week, against ~20 a week in September. That's expected at an average position past 20.
- Old URLs still show for a few queries (the hub `/blog/reduce-instagram-usage/`, a few pawse URLs). All of them answer one 301 to respite (checked 2026-11-19), so this is Google catching up, not a bug.
- `/blog/how-to-stop-doomscrolling` (no slash) still has impressions. It now 301s to the slashed URL and the canonical is correct, so this clears by itself.
- The apex home page gets 536 impressions a month for the brand query "intently" (and typos), at position 9.7. People still search the old name; the hub page should keep saying Intently is now Respite.

**Verdict:** recovery is about halfway. The next check is the week of Dec 1, the end of the 4–8 week window from Nov 1. If respite still averages past position 15 then, rewrite before waiting longer.

## Gaps

### 1. Pages that lost their rank in the move (rewrite first)

| Page | September | Now | What to do |
|---|---|---|---|
| one-sec-alternatives | 1533i, p4.2 | 257i, p8.5, 0 clicks | Still page one but ~10x fewer impressions and no clicks: rewrite title + description for CTR ("free", "apps like one sec", German "alternative zu one sec" shows up too), refresh the comparison table. |
| freedom-alternatives | 479i, p11.2 | 171i, p36.0 | Lost "freedom app alternative", "freedom alternative", "programs like freedom". Deep rewrite; add a short Cold Turkey section and link the new comparison (backlog). |
| free-screen-time-app-android | 207i, p16.4 | 40i, p71.0 | Lost "screen time limit android" (was p5). Rewrite around that query; Android-only facts. |
| best-digital-wellbeing-apps-2026 | ranked p7–21 for "best digital wellbeing app(s)" | almost gone | Check it is indexed (URL Inspection), refresh the list and dates. |
| opal-alternatives | 102i, p22.1 | 30i, p32.2 | Rewrite. |
| screenzen-alternatives | 74i, p10.0 | 39i, p15.2 | Light refresh; close to page one. |
| google-digital-wellbeing-alternatives | "stroll app android wellbeing alternative" p10.9 | gone | Refresh; mention Stroll. |

### 2. Demand we get but rank too low for (rewrite or deepen)

| Page | Now | Queries |
|---|---|---|
| how-to-block-apps-iphone | 138i, p78.9 | can you block social media apps on iphone, block app iphone, block instagram/snapchat on iphone. Use iOS 27 names; link the new `/block/<app>/` pages for app-specific queries. |
| what-is-digital-wellbeing | 198i, p45.8 | digital wellbeing (118i, p50), digital wellbeing programmes. A head term: deepen with a definition box, the research, workplace programmes. |
| how-to-stop-doomscrolling | 68i, p52–64 | how to stop doomscrolling. |
| best-app-blocker | 45i, p58.1 | best app blockers, social media blocker market. |
| how-to-reduce-screen-time | 26i, p81.8 | reduce screen time, how to reduce screen time. |
| youtube-shorts-addiction | 30i, p42.3 | youtube shorts looping: add a section on auto-loop and how to stop it. |
| best-chrome-extensions-focus | 42i, p45.8 | Refresh. |

### 3. New pages (queries with no page that targets them)

| Query | Now | Plan |
|---|---|---|
| freedom vs cold turkey | 42i, p57.9 | New comparison post: added to `content-pipeline/backlog.yml` (comparisons). |
| block instagram / snapchat on iphone | 17i, p85–96 | Already covered by the new `/block/<app>/` pages (intently#21, Nov 17). They aren't in this data yet; check them at the Dec 1 recheck before writing anything new. |

Everything else with demand already has a post. The 25 `idea` items in the backlog had no measurable Search Console demand yet (expected for new topics), and none duplicates a gap above.

## Pages to write or rewrite, in order

1. one-sec-alternatives: titles and description for CTR, then a refresh (the biggest page; on page one already).
2. freedom-alternatives: deep rewrite.
3. how-to-block-apps-iphone: deep rewrite (iOS 27 names, link `/block/<app>/`).
4. free-screen-time-app-android: rewrite around "screen time limit android".
5. what-is-digital-wellbeing: deepen.
6. best-digital-wellbeing-apps-2026: check indexing, then refresh.
7. best-app-blocker, how-to-reduce-screen-time, how-to-stop-doomscrolling: rewrites.
8. opal-, screenzen-, google-digital-wellbeing-alternatives: refreshes.
9. New: Freedom vs Cold Turkey (backlog).

Items 1–8 are the input to the phase-2 deep rewrites (tracker#13). Recheck everything in the week of Dec 1.
