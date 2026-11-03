# Respite roadmap: competitor feature gaps

Planning list built from `competitor-features.md` (research 2026-11-03), checked against the code on
2026-11-04 (Android `ThinkFast-Android`, iOS `ThinkFast-iOS`, extension `intently-extension`, API
`intently-api`). "Have" means a version of the feature already ships; the gap is what competitors do beyond it.

Positioning filter: calm, non-shaming friction; the game layer; bring-your-own-AI (Respite runs no AI of
its own). Effort: S = days, M = 1–3 weeks, L = a month or more.

## Already in Respite (no new work, but market it)

| Feature | Competitors | Respite today |
|---|---|---|
| Pause before an app | one sec, ScreenZen, MindPause | Core: Android overlay, iOS shield, extension in-page pause |
| Selectable pause styles | one sec, Free Time | Intervention modes and content arms (every time, at limit, lock, nudge; smart timing; time budget) |
| Snooze / short grant after a pause | No Scroll AI, Argue | Snooze for N minutes (all platforms) |
| Strict mode / lock until midnight | Opal, Freedom | Lock + strict mode (extension), lock (apps) |
| Category limits | Apple iOS 27 | iOS category tokens, Android `CATEGORY:` keys, extension categories |
| Schedules and focus sessions | Opal, Freedom, Jomo | Schedules (first free, more with Plus), focus sessions (25 min free) |
| Walk-away counts | ScreenZen | Insights + MCP `get_insights` walk-aways |
| Streaks, quests, leagues, friends | Opal, BePresent, Zenera | Acorns, quests, freezes, leagues, friends |
| Cross-device sync and all-devices view | Freedom | Sync v2 + combined limits (Plus) |
| Bring your own AI over MCP | LockIn (desktop) | MCP read + write tools, approvals, change log, Connected AI screens |

## Gaps to build (priority order)

| # | Feature | Seen in | Why | Effort | Notes |
|---|---|---|---|---|---|
| 1 | **Pause stats card**: "you walked away N times from X this week", per app | ScreenZen, MindPause | Proves the pause works; shareable | S | Data exists (interventions); needs a Home/Insights card on all 3 |
| 2 | **Intention logging at the pause** ("why are you opening this?" one-tap reasons) + MCP `list_intentions` | one sec, Naze, Zensi | Gives the user's own AI real context; strong BYO-AI story | M | Needs a new synced entity or field on `intervention`; privacy policy update |
| 3 | **Timed grant with auto-relock** ("10 more minutes, then locked again") distinct from snooze | No Scroll AI, Argue | Fewer all-or-nothing decisions | S–M | Extend snooze into a counted grant; respect strict mode |
| 4 | **MCP write tools, round 2**: start/stop focus session, temporary unblock (phone approval), block status, agent guidelines tool | LockIn | Chat control; marketing hook | M | Reuse approvals + change log from Phase 3 |
| 5 | **Custom pause messages from your AI** (scope `respite:interventions`) | — (unique) | Already promised as "planned" | M | Server entity + client rendering on 3 platforms |
| 6 | **Custom rules from your AI** (scope `respite:rules`, trigger → action) | — (unique) | Already promised as "planned" | L | Rule evaluator per client, one platform at a time |
| 7 | **Decision timeline**: every open of X and what you chose | Zensi | Self-awareness | S–M | Read model over interventions; also an MCP resource |
| 8 | **Weekly summary card + one daily score** (shareable image) | Opal, Rize, HeadUp | Retention, social sharing, SEO | S–M | iOS has a wellbeing score + weekly screen; make it a shareable card everywhere |
| 9 | **Late-night insights + wind-down nudge** | Apple, Mac exporters | Sleep angle; strong SEO topic | S | Bedtime data exists; add "after 10 pm" stat and a gentle nudge |
| 10 | **Spend acorns for extra minutes** (or earn by walking) | FitScreen, Pushscroll, Habit Doom | Ties the game to behaviour | M | Decide guardrails so it doesn't reward overuse |
| 11 | **Task-based focus allowlist** (extension first; AI can set the task via MCP) | Focus AI, LockIn | Focus without picking sites | M | Extension only at first |
| 12 | **Uninstall-resistant / cooldown before loosening outside AI** | Opal, Freedom | Heavy users | M–L | Platform limits (Android device admin, iOS Family Controls) |
| 13 | **NFC/QR tag unlock or session start** | Brick, Bloom | Physical friction; demo content | M | Opt-in |
| 14 | Desktop app usage in the all-devices view | Freedom, RescueTime | Richer AI answers | L | Needs a desktop client |

## Not doing (conflicts with positioning)
- In-app cloud AI coach/negotiator (FOMO, Zensi, Argue): contradicts "Respite runs no AI"; the user's own AI covers it via MCP.
- Paid hardware.

## Messaging gaps to use now
- AI-coach apps cost about $9–10/month and send reasons and usage to their servers; Respite works with the AI you already pay for.
- Most AI coaches are iPhone-only; Respite covers Android, iPhone and browsers.
- The only other MCP blocker found (LockIn) is desktop-only.
