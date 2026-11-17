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

## Per-app settings and OS menus (checked 2026-11-12)

Used by the `/block/<app>/` pages (`src/data/blockApps.ts`). Menu labels move between app versions, so the pages name
the section ("the screen time section", "under General or Time management") rather than a full path wherever sources
disagree. [V] = read on the vendor's own page, [S] = from news or how-to coverage. Absence claims mean "none found on
2026-11-12" and are worded "as far as we could find". Re-check after major OS or app releases.

| Product | Fact used | Confidence | Source (accessed 2026-11-12) |
|---|---|---|---|
| Android Digital Wellbeing | App timers (app closes and its icon dims; timers reset at midnight; delete the timer to reopen), Focus mode (pick apps, Turn on now, Set a schedule, Take a break), Bedtime mode (schedule, grayscale and other screen options; it does not block apps), Chrome site timers (Dashboard › Chrome › Set site timer). Pixel menus read "Digital Wellbeing & parental controls"; pages also say "just Digital Wellbeing on some phones". | [V] | https://support.google.com/android/answer/9346420 |
| iPhone Screen Time (iOS 27) | iOS 27 renamed the controls: **Time Allowances** (daily time per category, via Manage Categories; an allowance also covers an app's own website when the app declares it), **Screen Time Schedule** (time windows with the categories allowed; replaces Downtime), **Always Allowed**, and **Passcode & Management › Lock Screen Time Settings**. Apple's guide describes allowances by category only, so the pages say "the category <app> is in" and give the iOS 26 path (App Limits › Add Limit, one app, Websites, Ignore Limit, Downtime) as the older option. Require Face ID (long press on an icon) is an iOS 18 feature, assumed unchanged. The iOS 27 parental-control changes for children are still not described on the site. | [V] | https://support.apple.com/guide/iphone/set-up-screen-time-for-yourself-iphbfa595995/27/ios/27 ; https://support.apple.com/guide/iphone/set-schedules-and-time-allowances-iphb0c7313c9/27/ios/27 ; https://support.apple.com/guide/iphone/create-change-remove-a-screen-time-passcode-iph272b4c4bd/27/ios/27 ; iOS 26: https://support.apple.com/guide/iphone/set-up-screen-time-for-yourself-iphbfa595995/26/ios/26 |
| TikTok | Profile › ☰ › Settings and privacy › screen time section: daily screen time (per-day option), screen time breaks, sleep reminders (mutes notifications), weekly updates; Family Pairing for parents. | [S] | https://www.neowin.net/guides/heres-how-to-limit-your-tiktok-screen-time/ ; https://www.internetmatters.org/blog/parental-controls/social-media/tiktok-privacy-and-safety-settings/ |
| Instagram | Time management (older: Your activity › Time spent): daily limit (a dismissible reminder), sleep mode (mutes notifications), take a break reminders. No setting to remove the Reels tab found. | [S] | https://techradar.com/how-to/how-to-limit-your-instagram-usage-on-ios-and-android ; https://www.gizbot.com/how-to/tips-tricks/instagram-tips-how-to-set-a-daily-time-limit-and-turn-on-sleep-mode-115033.html |
| YouTube | Remind me to take a break (pauses the video), bedtime reminder, autoplay switch, Shorts feed limit (announced October 2025, dismissible prompt). Location: Settings › General or Time management. | [S] | https://techcrunch.com/2025/10/22/youtube-adds-at-timer-for-you-to-stop-scrolling-shorts/ ; https://www.engadget.com/apps/youtube-is-adding-a-timer-to-shorts-so-you-dont-scroll-the-day-away-185204383.html |
| Facebook | Your time on Facebook: daily time reminder (a notification only), Quiet mode (mutes most notifications, can be scheduled), daily average. Messenger is a separate app. | [S] (sources 2020–2021) | https://about.fb.com/wp-content/uploads/2021/11/Time-Management-Tools-on-FB_IG-1.pdf ; https://www.macrumors.com/2020/04/10/facebook-app-gains-quiet-mode-setting/ |
| Snapchat | No daily limit for adult accounts found. Family Center shows teen activity (a per-area time breakdown added January 2026) but does not cap time. | [S] absence | https://techcrunch.com/2026/01/22/snapchat-gives-parents-new-insights-into-teens-screen-time-and-friends/ |
| Netflix | No time limit. Autoplay next episode and autoplay previews are per-profile switches (on the website if the app does not show them); "still watching" prompt; Kids profiles, maturity ratings, profile lock. | [S] | https://www.techadvisor.com/article/730080/how-to-stop-netflix-autoplay-previews-and-next-episode.html |
| Reddit, X | No daily limit or break reminder found in either app. Both have autoplay and notification settings; X has the Following tab. | [S] absence | app settings as described in the existing `stop-reddit-scrolling` and `stop-twitter-doomscrolling` posts |
