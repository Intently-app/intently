# Competitor feature catalogue and gap ideas for Respite

Accessed 2026-11-03. Evidence is from store listings and review/roundup pages found during the AI screen time research; most is secondary [S] and some vendor-written, so features may be stale or exaggerated. Described in my own words. "?" = not determined. Source URLs are in the main file (/private/tmp/claude-501/-Users-faddy-MyLab-WellbeingApps-Respite/f6eed04e-4a19-419d-8c31-488a20d638d9/scratchpad/ai-screen-time-research.md, section 2 and section 9). Coverage is thin for Flipd, Brick, Clearspace, Jomo, Refocus (little data found) and Google Digital Wellbeing.

## Part 1: Feature catalogue by competitor

### Opal (iOS richest, Android, Mac)
- Blocking/friction: focus sessions that block chosen apps; "Deep Focus" mode where deleting the app does not lift the block.
- Limits/schedules: recurring sessions for work, study, bedtime, family time; daily time limits per app/category; free plan allows only one recurring rule.
- Insights: daily focus score, pickup counts, weekly reports splitting productive vs distracting time (some reports iOS-only).
- Motivation: gems, streaks, friends leaderboard.
- Social: challenge friends.
- Platforms: iPhone, Android, desktop; no AI found.
- Pricing: free tier is limited; Pro roughly $100/yr.

### one sec (iOS, Android)
- Friction: a delay/intervention before a chosen app opens; many intervention types (breathing, mirror view, maths, emotion/intention logging); newer "conversational reflection" using an on-device LLM.
- Limits: intention picker ("why are you opening this?"), unlock windows.
- Insights: counts of pauses and opens avoided.
- Evidence: published 57% reduction claim for targeted apps, attribution disputed (university study vs own data).
- Platforms: iOS main; integrations with Structured and LENGO mentioned.
- Pricing: free for one app; premium about $50/yr.

### ScreenZen (iOS, Android)
- Friction: per-app delay timers, pause prompts.
- Insights: open-rate stats showing whether the delay deterred you.
- Pricing: free [S]. No AI found.

### Brick (iOS, Android + hardware)
- Blocking: physical device you tap to lock/unlock; hard to bypass.
- Pricing: hardware purchase plus app. No AI found.

### Freedom (iOS, Android, Mac, Windows, Chrome)
- Blocking: block sites and apps across all devices at once; scheduled sessions; Locked Mode that prevents ending a session early.
- Pricing: about $40/yr or $8.99/mo [S]. No AI found.

### Clearspace, Jomo, Refocus (iOS-centric)
- Clearspace: friction/intention-style blocker [U]. Jomo: scheduled focus and timers, framed as cheaper than Opal [S]. Refocus: rules-based blocking, free plus Pro [S]. No AI found for any.

### Forest (iOS, Android, Chrome)
- Motivation: a virtual tree grows while you stay off the phone and dies if you leave; collect trees. Blocks by motivation rather than enforcement. No AI found.

### Rize (Mac, Windows)
- Insights/AI: automatic categorisation of apps and sites, AI productivity insights and coaching reports, session planner. No mobile app.
- Pricing: free tier plus paid (amounts conflict between sources).

### RescueTime (Windows, Mac, Android, Chrome)
- Insights: automatic time tracking with productivity scoring, goals/alerts, "Assistant"; focus sessions that block distractions and mute notifications, optional music integration. Sources conflict about AI. Community MCPs exist, no official one. Paid about $7-12/mo [S].

### Apple Screen Time (iOS 27) and Google Digital Wellbeing
- Apple: app/category limits, downtime schedules; iOS 27 adds category time allowances, more flexible schedules by weekday/weekend, Ask to Browse, communication approvals, Siri controls. Ignore-limit button is easy to bypass; reviewers report bugs. Free.
- Google Digital Wellbeing: dashboards, app timers, bedtime mode, focus mode [from general knowledge, U; not researched].

### AI-first phone apps
- **FOMO** (iPhone): AI coach chats when you open a blocked app (why, is it worth it, alternatives); learns habits, nudges; free daily message cap; Pro $8.99/mo or $59.99/yr.
- **Zensi** (iOS): AI intercept: explain why you need the app and AI grants or denies; decision timeline; usage stats history in Pro; $9.99/mo, $79.99/yr.
- **Argue** (iOS): AI persona questions you before unlock, shows remaining allowance on the block screen, relocks after timed break.
- **No Scroll AI** (iOS): voice agent you ask for access; grants 15-minute sessions; built on Apple Family Controls.
- **Monk AI** (iPhone): chat coach, craving-resistance streaks; states on-device data.
- **Zario** (iOS, stale since 2024): AI grants/denies access.
- **HeadUp, Detoxly, Foqus, blissio.ai** (Android-leaning): AI analytics/reports and recommendations, app blocking; mostly free.
- **Focus AI** (Chrome, Firefox): LLM judges whether each page serves the task you typed and blocks the rest; 3 free sessions then $9.99/mo.

### Gamified / reward apps (listing-level)
- BePresent: daily quests and streaks. Zenera: focus-session tokens, leaderboards. TouchGrass: plant thrives or withers by daily screen time. FitScreen: earn screen time by walking. Pushscroll: exercise unlocks apps. Habit Doom: apps locked until daily habits done (also photo-verified AI check-ins). Breakr, Game for Time, GoalGate, Doppy: game/reward variants. Mostly unverified claims.

### Pause-style indie apps
- MindPause (breathing pause, tracks opens vs cancels), Focus Pause (breath then ask purpose), Naze (Android: choose reason and duration), Free Time (word scramble/maths/mindfulness prompt), PauseHer (yoga pose to unlock), Mivo (reflection moment), Pausee.

### LockIn MCP (desktop)
- Blocking: hosts-file level domain blocking, survives restarts/private windows; focus mode; timed temporary unblock; block status; guidelines tool for the agent.
- AI: driven by your own assistant (Claude, ChatGPT, Poke, Cursor) over MCP with OAuth; task-aware blocking sends URL + short excerpt for a relevance check.
- Platforms: macOS full; Linux/Windows hosts file; Chrome extension add-on. Pricing $2.99/mo, $29.99/yr, $59.99 lifetime.

### Unofficial data MCPs
- Mac Screen Time exporters (read Screen Time DB, include iPhone/iPad via iCloud; tools for top apps, categories, late-night use; SQL access), RescueTime and ActivityWatch MCPs (productivity analytics).

## Part 2: Features by theme (who has what)

| Theme | Features seen | Seen in |
|---|---|---|
| Blocking / friction | Hard block during sessions; uninstall-resistant mode; locked sessions; delay before opening; breathing/maths/mirror/word puzzles; physical tag or hardware to unlock; yoga/photo challenges; AI conversation before unlock; relock after timed break; OS-level hosts blocking | Opal, Freedom, Brick, one sec, ScreenZen, Free Time, PauseHer, FOMO, Zensi, Argue, No Scroll AI, LockIn |
| Limits / schedules | Per-app and category limits; recurring schedules (work/study/bed); category allowances; temporary grants (e.g. 15 min); weekday/weekend schedules | Opal, Apple iOS 27, No Scroll AI, Freedom |
| Insights / AI | Focus score; weekly report; pickup counts; open-rate vs delay stats; late-night usage; auto-categorisation; AI habit insights; decision timeline; usage history; BYO-AI over MCP | Opal, ScreenZen, Rize, RescueTime, Zensi, HeadUp, nichtlegacy exporter, LockIn, Respite |
| Motivation / gamification | Streaks; gems; growing tree or plant; quests; tokens and leaderboards; earn time by exercise or habits; craving-resistance streaks | Opal, Forest, TouchGrass, BePresent, Zenera, FitScreen, Pushscroll, Habit Doom, Monk |
| Social / accountability | Friend leaderboards and challenges; parental approval flows; AI accountability persona | Opal, Zenera, Apple, Argue |
| Focus | Focus sessions with notification muting and optional music; task-defined filtering; Pomodoro-style timers | RescueTime, Forest, Focus AI, Freedom, Opal |
| Platforms / integrations | Cross-device blocking (phone + desktop + browser); Apple Family Controls; Mac+iPhone data sync via iCloud; MCP/OAuth connectors; integrations with Structured/LENGO | Freedom, Opal, one sec, No Scroll AI, nichtlegacy, LockIn |
| Pricing model | Freemium with one free rule/app, then ~$50-100/yr; AI coach apps $8.99-9.99/mo with free message cap; lifetime option; hardware purchase | Opal, one sec, FOMO, Zensi, LockIn, Brick |

## Part 3: Feature gap ideas for Respite

Positioning filter: mindful pause (calm, non-shaming friction), free game layer without social, bring-your-own-AI (no Respite-run AI). Respite already has pause, limits, schedules, focus sessions, acorns/quests/streaks/leagues, MCP read tools. Effort is a rough guess: S = days, M = 1-3 weeks, L = a month or more. Check against what is already built before scheduling.

| # | Feature | Competitors with it | User value | Effort | Fit |
|---|---|---|---|---|---|
| 1 | Pause stats: "pauses you walked away from" per app/week | ScreenZen, MindPause | Proves the pause works; motivating | S | Excellent (core + feeds MCP insights) |
| 2 | Intention/reason logging at the pause, exposed through MCP | one sec, Naze, Zensi | Reveals why you scroll; gives your own AI real context | M | Excellent (BYO-AI differentiator) |
| 3 | Timed grants after a pause ("10 more minutes", then relock) | No Scroll AI, Argue | Fewer all-or-nothing decisions | S-M | Excellent |
| 4 | Selectable friction types per app (breath, count, type a phrase, mirror, maths) | one sec, Free Time, PauseHer | Reduces habituation to one pause | M | Good (keep calm, avoid punitive ones) |
| 5 | MCP write tools modelled on LockIn: start focus session, temporary unblock (approval on phone), block status, agent-guidelines tool | LockIn | Voice/chat control of limits; marketing hook | M (already planned) | Excellent |
| 6 | Strict mode: uninstall-resistant / locked sessions / cooldown before loosening | Opal, Freedom, AppBlock | Appeals to heavy users; matches loosening-needs-approval rule | M-L (platform limits) | Good |
| 7 | Earn extra minutes by spending acorns (or by walking) | FitScreen, Pushscroll, Habit Doom | Ties game layer to real behavior | M | Good (decide it doesn't create pressure; no social) |
| 8 | Weekly summary card and one daily score | Opal, Rize, HeadUp | Shareable, simple; also good for AEO/social | S-M | Good |
| 9 | Decision timeline ("every time you opened X and what you chose") | Zensi | Self-awareness; reviewable | S-M | Good (without AI) |
| 10 | Category-based allowances ("Social: 45 min") | Apple iOS 27 | Faster setup than per-app limits | S-M | Good |
| 11 | Task-based allowlist for focus sessions (extension first) | Focus AI, LockIn | Focus without hand-picking sites; AI can set the task via MCP | M | Good |
| 12 | NFC/QR tag as optional unlock or session start | Brick, Bloom | Physical friction; strong demo content | M | Fair-good (opt-in) |
| 13 | Late-night/bedtime insights and wind-down schedule | Mac exporter ("late night"), Apple | Sleep angle, strong SEO (doomscrolling at night) | S | Good |
| 14 | All-device combined usage (phone + browser + maybe desktop) in one view and MCP | Freedom, nichtlegacy, RescueTime | Unique for mobile + browser; richer AI answers | M-L | Good |
| 15 | Growing-visual reward (plant/tree metaphor) | Forest, TouchGrass | Emotional stickiness | S-M | Fair (acorns/oak may already cover it) |
| 16 | Optional on-device reflection prompt (no cloud) | one sec | AI-ish reflection while keeping privacy story | L | Fair (only if truly on-device; conflicts with "no AI") |
| 17 | In-app cloud AI coach/negotiator | FOMO, Zensi, Argue, No Scroll AI | Hype | M | Poor (contradicts no-AI positioning; let user's AI do it via MCP) |
| 18 | Friend leaderboards / challenges | Opal, Zenera | Retention | M | Poor (owner decided no social) |

## Top 10 gap ideas (priority)
1. Pause stats (S, excellent fit)
2. Intention/reason logging exposed via MCP
3. Timed grants after a pause
4. MCP write tools (focus session, temporary unblock with phone approval, block status, guidelines)
5. Selectable friction types
6. Decision timeline
7. Category allowances
8. Weekly summary card and daily score
9. Strict mode / cooldown before loosening
10. Acorns-for-minutes (or earn-by-walking) with care for pressure

## Messaging gaps competitors leave open
- AI-coach apps cost about $8.99-9.99/mo and send reasons and usage to their servers; FOMO's privacy label lists identity-linked data despite on-device copy.
- Most AI coaches are iPhone-only; Respite covers Android, iPhone and browsers.
- LockIn MCP is the only MCP blocker found and is desktop-centric.
