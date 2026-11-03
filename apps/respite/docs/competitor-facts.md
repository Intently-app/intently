# Competitor facts (checked 2026-11-01)

Canonical wording for competitor prices across the Respite site. Prices change and vary by country, so
always add "at the time of writing" (or "around") the first time a price appears in a post, and never be
more precise than this table. Re-check before relying on it after early 2027.

| App | Model | Use this wording | Don't say |
|---|---|---|---|
| Freedom | Subscription + lifetime | "around $40 a year (about $9 monthly; a lifetime plan is also sold)" | "$120 a year" (outdated) |
| One Sec | Free for one app; Pro subscription | "free for one app; One Sec Pro is around $20 a year" | "$50 a year", "~$50/year" (outdated) |
| Opal | Free tier (one rule); Pro subscription | "Opal Pro is around $100 a year (also monthly or lifetime)" | "$99 per year" is fine; don't quote the lifetime figure |
| Forest | Free + Forest Plus subscription | "free, with a paid Plus subscription" | any one-time price ($1.99, $2, $3.99): the one-time Pro is discontinued |
| Cold Turkey | Free + Pro one-time (Windows, Mac) | "Cold Turkey Blocker Pro is a one-time purchase of around $40" | exact "$39" as a hard fact |
| Brick | Physical device | "a one-time hardware purchase" | a dollar figure (unverified) |
| ScreenZen | Free (donations) | "free" | — |
| Socratic, ActionDash, StayFree, ClearSpace, Refocus, FlowBuddy, LeechBlock, StayFocusd, Unhook | various | keep existing wording only if it is non-numeric or clearly hedged; otherwise "free" / "freemium" / "paid" | invented exact prices |

Sources (2026): Freedom: App Store US listing and 2026 reviews (makerstack.co, neurolaunch.com).
One Sec: help.1se.co (price shown in-app, varies by region) and apppricinglab.com snapshot of May 2026
($19.99/yr Pro). Opal: 2026 reviews (autonomous.ai, habitdoom.com: $99.99/yr, $19.99/mo, $399
lifetime). Forest: forestapp.cc/llms-full.txt (one-time Pro discontinued; Free or Plus). Cold Turkey:
2026 reviews ($39–45 one-time).

The One Sec / Max Planck study (57% fewer app opens) stays as the one attributed effectiveness figure.

## AI features (checked 2026-11-03)

Added with the AI screen time content (`docs/ai-screen-time-research.md`, `docs/competitor-features.md`). Confidence:
[V] = read on the primary page, [S] = from a search summary or third-party page. Only use [S] facts with hedged wording
("as far as we could find", "according to its App Store listing"). Re-check before relying on it after early 2027.
Absence claims ("no MCP connector") mean "none found on 2026-11-03", never "does not exist".

| Product | Fact to use | Confidence | Source (accessed 2026-11-03) |
|---|---|---|---|
| Respite | To our knowledge, the first mobile screen time app with a built-in MCP server (November 2026). Never "only", never "first screen time MCP". | own claim, see `ai-screen-time-research.md` section 3 | official MCP registry search "screen time": 0 results, https://registry.modelcontextprotocol.io/v0/servers?search=screen%20time [V] |
| LockIn MCP | Desktop-centric blocker driven by your own assistant over MCP with OAuth (Claude web, ChatGPT, Cursor, Poke). Tools: block_domains, enter_focus_mode, temporarily_unblock_domains, get_block_status. macOS full; Linux and Windows via hosts file; Chrome extension add-on. $2.99 a month, $29.99 a year, $59.99 lifetime. Calls itself "the only blocker with native MCP" (vendor claim; do not repeat as fact). | [V] | https://www.lockinmcp.com/ ; https://www.pulsemcp.com/servers/devsrodrigo-lockin |
| Unofficial MCPs | Community MCP servers exist for Mac Screen Time (local, reads the Mac database), RescueTime (no official one found) and ActivityWatch (local). | [V] for Mac Screen Time exporters; [S] RescueTime | https://github.com/nichtlegacy/screentime ; https://github.com/AgentDank/screentime-mcp ; https://www.pulsemcp.com/servers?q=rescuetime ; https://github.com/8bitgentleman/activitywatch-mcp-server |
| FOMO - AI Screen Time Coach | iPhone only (iOS 18.6+). An AI coach asks why you want a blocked app when you open it. Free tier with a daily message cap; Pro $8.99 a month or $59.99 a year. Its App Store privacy label lists data linked to identity. | [V] | https://apps.apple.com/us/app/fomo-ai-screen-time-coach/id6784763401 |
| Zensi - AI Screen Time Control | iOS. You explain why you need an app and the AI grants or denies it ("Intercept Flow"); "The Lab" timeline. Pro $9.99 a month, $79.99 a year or $4.99 a week. | [V] | https://apps.apple.com/us/app/zensi-ai-screen-time-control/id6756569023 |
| Argue - AI Screentime Blocker | iOS. An AI coach questions you before unlock; shows your remaining allowance. No price quoted. | [S] | https://apps.apple.com/us/app/argue-ai-screentime-blocker/id6761279161 |
| No Scroll AI | iOS. A voice agent you ask for access; grants 15-minute sessions. | [S] | https://apps.apple.com/us/app/no-scroll-ai-screen-time/id6759935425 |
| Monk AI | iPhone. Chat coach with craving-resistance streaks. | [S] | https://apps.apple.com/in/app/monk-ai-reduce-screen-time/id6746436910 |
| one sec | Conversational reflection using an on-device language model, per its App Store version notes. No MCP or connector found. Price: keep the table above ("free for one app; One Sec Pro is around $20 a year"); the research's "about $50" is a conflicting [S] figure, do not use. | [S] | https://apps.apple.com/us/app/one-sec-screen-time-focus/id1532875441 |
| Opal | No AI feature and no MCP found. Rules-based focus sessions, limits, scores. ("Opal MCP" results are Opal Security, an unrelated company.) | [S] absence | https://makeheadway.com/blog/opal-app-review/ ; https://docs.opal.dev/docs/mcp/overview |
| ScreenZen, Brick, Freedom, Clearspace, Refocus, Forest, Jomo | No AI feature and no MCP connector found. | [S] absence | https://habitdoom.com/blog/screen-time-ios-alternatives-2026 ; https://focusme.com/?p=3003 ; https://zapier.com/blog/stay-focused-avoid-distractions/ |
| Rize | AI productivity coaching, desktop only (Mac, Windows), no mobile app. | [S] | https://rize.io/pricing |
| Focus AI (extension) | Chrome and Firefox. An LLM judges each page against the task you typed and blocks irrelevant ones. Three free sessions then $9.99 a month. | [S] | https://chromewebstore.google.com/detail/focus-ai-website-blocker/ngboiiifeoioghodfglighnahefnjbib |
| Apple Screen Time | iOS 27 reworks parental controls (category time allowances, flexible schedules, Ask to Browse). No AI coach for adults and no MCP found. Not used in posts beyond this line: sources are secondary. | [S] | https://www.macrumors.com/2026/06/08/ios-27-parental-controls/ ; https://9to5mac.com/2026/06/10/apple-is-giving-screen-time-and-parental-controls-a-long-overdue-upgrade-in-ios-27/ |
| Google Digital Wellbeing | Not researched for AI features. Say only "no MCP connector found". | n/a | |

Contrast lines that are safe to use (each backed by the rows above): AI coach apps cost roughly $9 to $10 a month and run
the AI themselves; Respite Plus runs no AI (your own AI account does the thinking). Most AI coach apps found are
iPhone-only; Respite covers Android, iPhone and the browser. Never say a competitor "sends your data" unless the
listing's own privacy label says so, and then quote the label, not an inference.
