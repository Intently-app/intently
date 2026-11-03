# AI + screen time: market, MCP and search landscape for Respite (SEO + AEO plan)

Research date / "accessed" date for every source below: **2026-11-03** (web research only; no repositories edited).
Conventions: **[V]** = verified on a primary page I fetched; **[S]** = from a search-result summary or third-party page, not independently verified; **[U]** = uncertain / inferred. No keyword volume data was available (no paid tool access), so competition is a qualitative estimate from who ranks and how commercial the SERP looks.

---

## 1. Executive summary

1. **Crowded "AI screen time coach" niche, but all of it is the same idea**: a chat/coach inside the app that talks you out of opening a blocked app (FOMO, Zensi, Argue, No Scroll AI, Monk AI, Zario, one sec's on-device "conversational reflection"). Almost all are iPhone-only, new (2025-26), freemium with $5-10/month Pro tiers. [V]/[S] (section 2)
2. **Nobody found markets "bring your own AI"** (your Claude/ChatGPT reads your real usage via a standard connector). Respite's angle is differentiated from the in-app-coach apps. (section 3)
3. **"First" verdict: Respite is very likely the first (or among the first) consumer phone (iOS + Android) screen-time app with a first-party, remote, OAuth MCP server, but NOT the first screen-time/blocking product with MCP.** LockIn MCP (desktop hosts-file site blocker; OAuth into Claude web/ChatGPT; listed on PulseMCP 2026-05-15) calls itself "the only blocker with native MCP", and unofficial MCPs exist for RescueTime, ActivityWatch and Mac Screen Time. Safe wording: "one of the first", or "the first mobile screen time app with a built-in MCP server (to our knowledge, Nov 2026)". (section 3)
4. **MCP directory whitespace is real**: the official registry search for "screen time" returned 0 servers; Glama/PulseMCP/mcp.so show only LockIn plus local Mac hobby servers. A listing would be the only phone-screen-time entry. [V]
5. **Submission priority**: (a) official MCP registry via `mcp-publisher` + DNS/HTTP domain proof (feeds PulseMCP and others), (b) Anthropic Connectors Directory via claude.ai/directory/manage (OAuth + tool annotations + test account; needs paid Claude plan), (c) OpenAI's directory (domain challenge file, test cases, video, 5 positive/3 negative cases), (d) Smithery URL publish, (e) Glama/mcp.so/Cursor forms. PulseMCP submissions are currently closed. (section 4)
6. **Keyword reality**: head terms ("best app blocker for iPhone") are owned by affiliate listicles and app-maker blogs (Habit Doom, Lifestack, Freedom, etc.) - high competition. The winnable space is the AI/MCP long tail ("connect Claude to screen time", "chatgpt screen time prompts", "screen time mcp"), where Google autocomplete returns almost nothing (i.e. the queries barely exist yet, so volume is tiny but there is no competition and we define the topic). (section 5)
7. **Pause-before-open and gamified-limits queries are medium difficulty** and Respite's core features match them; page-1 is mostly app-store listings and small vendor blogs, so a strong, honest comparison/how-to can compete. (section 6)
8. **AEO: AI assistants cite Reddit, YouTube, Wikipedia, listicles and product pages**; most "best X app" results are self-ranking vendor listicles. To be recommended: get on third-party lists, Reddit threads, and have a crisp, quotable, consistent entity page. (section 7)
9. **Technical AEO is mostly classic SEO**: Google states no special markup or AI files are needed for AI Overviews/AI Mode; OpenAI says allow OAI-SearchBot; llms.txt shows no measurable citation effect (SE Ranking, ~300k domains) - cheap to add but do not expect lift. (section 9)
10. **Content plan** = one hub (AI + screen time) + 10 articles/tool pages + 5 comparison pages, led by the MCP tutorial pages ("connect Claude/ChatGPT to your screen time") because those are the only places Respite has a unique, uncontested answer. (section 8)

---

## 2. Competitor table (AI features in screen time / blocking / focus apps)

| App | AI feature (what it does) | Platforms | Price | MCP / Claude / ChatGPT? | Source (accessed 2026-11-03) |
|---|---|---|---|---|---|
| **Opal** | None found. Rules-based focus sessions, limits, scores, gems/streaks. (A 2025-era review says "not AI-driven"; may be stale.) | iOS (richest), Android, Mac | Free plan limited; Pro about $99.99/yr [S] | No. ("Opal MCP" results are Opal Security, an unrelated company.) | https://makeheadway.com/blog/opal-app-review/ [S]; https://docs.opal.dev/docs/mcp/overview [V, unrelated] |
| **one sec** | "Conversational reflection" intervention using on-device LLM (App Store version notes); intention prompts, breathing, mirror. | iOS (Android version exists) | Free 1 app; Premium roughly $50/yr [S] | No | https://apps.apple.com/us/app/one-sec-screen-time-focus/id1532875441 [S via search]; https://www.tryhugo.app/blog/one-sec-app-review-2026 [S] |
| **ScreenZen** | None found; delay timers, open-rate stats | iOS, Android | Free [S] | No | https://habitdoom.com/blog/screen-time-ios-alternatives-2026 [S, competitor blog] |
| **Brick** | None found (physical NFC lock) | iOS, Android | Hardware + app | No evidence | search found nothing [U] |
| **Freedom** | None found; cross-device blocking, locked mode | iOS, Android, Mac, Win, Chrome | about $39.99/yr or $8.99/mo [S] | No | https://focusme.com/?p=3003 [S] |
| **Clearspace** | None found (friction/intention blocker) | iOS (Android [U]) | n/a | No evidence | [U] |
| **Jomo** | None found; scheduled focus | iOS | n/a | No | https://habitdoom.com/blog/jomo-alternative-iphone [S] |
| **Refocus** | None found; rules-based | iOS/Android | Free + Pro [S] | No | habitdoom.com roundup [S] |
| **Forest** | None found; gamified timer (tree grows) | iOS, Android, Chrome | Paid app | No | https://zapier.com/blog/stay-focused-avoid-distractions/ [S] |
| **Flipd** | Not determined (no search hits) | iOS, Android | n/a | Unknown | [U] |
| **Rize** | AI productivity coach: auto-categorisation, insights, session planner. Desktop only, no mobile. Pricing sources conflict ($9.99/mo vs others). | Mac, Windows | Free tier + paid | No MCP found | https://rize.io/pricing [S]; https://subscribed.fyi/rize/reviews/ [S] |
| **RescueTime** | Sources conflict: "The Assistant", focus-session suggestions vs "no AI summaries" (Timing's competitor page). | Win, Mac, Android, Chrome | about $7-12/mo [S] | **Community MCPs only** (JasonBates, ebowman, Pipedream-hosted, adelaidasofia on PulseMCP); not official | https://github.com/JasonBates/rescuetime-mcp [V via search]; https://www.pulsemcp.com/servers?q=rescuetime [V] |
| **Apple Screen Time (iOS 27)** | Redesigned parental controls: time allowances by category, flexible schedules, Ask to Browse; Siri restrictions. No AI coach for adults found. Reports of bugs. | iOS/iPadOS/macOS | Free | No MCP/connector | https://9to5mac.com/2026/06/10/apple-is-giving-screen-time-and-parental-controls-a-long-overdue-upgrade-in-ios-27/ [S]; https://www.macrumors.com/2026/06/08/ios-27-parental-controls/ [S] |
| **Google Digital Wellbeing** | No AI/Gemini feature found in this research (search returned only Apple material) | Android | Free | No | [U - needs follow-up on Google's own announcements] |
| **FOMO - AI Screen Time Coach** (VelMax LLC) | When you open a blocked app the AI coach asks why/is it worth it; learns habits; nudges. Free tier has a daily message cap. Version 1.0 on "July 22" (year not shown). Privacy label lists data linked to identity despite "on-device" claim. | iPhone only (iOS 18.6+) | Free + Pro $8.99/mo or $59.99/yr | No | https://apps.apple.com/us/app/fomo-ai-screen-time-coach/id6784763401 [V] |
| **Zensi - AI Screen Time Control** (Sophos AI) | AI chat "Intercept Flow": explain why you need the app, AI grants/denies; "The Lab" timeline. v1.0 "Feb 9", v1.4.0 "Jun 9" (years not shown). | iOS | Pro $9.99/mo, $79.99/yr, $4.99/wk | No | https://apps.apple.com/us/app/zensi-ai-screen-time-control/id6756569023 [V] |
| **Argue - AI Screentime Blocker** | AI coach "Argo" asks why you want the app; shows remaining allowance; relocks after break | iOS | n/a | No | https://apps.apple.com/us/app/argue-ai-screentime-blocker/id6761279161 [S] |
| **No Scroll AI** | Voice agent: ask it for access, it grants 15-min sessions; uses Family Controls | iOS | n/a | No | https://apps.apple.com/us/app/no-scroll-ai-screen-time/id6759935425 [S] |
| **Monk AI** | Chat coach + craving-resistance streaks; developer states on-device data | iPhone | n/a | No | https://apps.apple.com/in/app/monk-ai-reduce-screen-time/id6746436910 [S] |
| **Zario AI** | AI grants/denies access (listing last updated 2024, may be stale) | iOS | n/a | No | https://apps.apple.com/ch/app/zario-ai-screen-time-coach/id1611031269 [S] |
| **HeadUp / Detoxly / Foqus / blissio.ai** | AI analytics/insights/reports on Android-leaning blockers | Android | Mostly free [S] | No | Play Store listings found in search [S] |
| **Focus AI** (extension) | LLM judges each page against the task you typed and blocks irrelevant pages | Chrome, Firefox | 3 free sessions then $9.99/mo | No | https://chromewebstore.google.com/detail/focus-ai-website-blocker/ngboiiifeoioghodfglighnahefnjbib [S] |
| **LockIn MCP** (lockinmcp.com) | **The MCP-native blocker**: your AI assistant calls `block_domains`, `enter_focus_mode`, `temporarily_unblock_domains`, `get_block_status`. Hosts-file blocking, task-aware blocking sends URL + short excerpt to its server. | macOS (full), Linux/Windows (hosts file); Chrome ext add-on | $2.99/mo, $29.99/yr (3-day trial), $59.99 lifetime | **Yes**: OAuth for Poke, Claude web, ChatGPT, Cursor; Claude Desktop via mcp-remote + API key. Calls itself "the only blocker with native MCP" (vendor claim). PulseMCP listing "lockin-mcp" released 2026-05-15 (SSE endpoint, no auth, iOS-tagged - inconsistent with site) | https://www.lockinmcp.com/ [V]; https://www.lockinmcp.com/blog/best-distraction-blockers-2026 [V, self-ranked #1, 2026-06-18]; https://www.pulsemcp.com/servers/devsrodrigo-lockin [V] |

Takeaways:
- Distinct AI patterns: (1) **in-app AI negotiator** (FOMO, Zensi, Argue, No Scroll AI, Monk), (2) **on-device LLM reflection** (one sec), (3) **AI insights/reports** (HeadUp, Detoxly, Rize), (4) **LLM relevance filter** (Focus AI), (5) **MCP/BYO-AI** (LockIn MCP on desktop; Respite on mobile).
- Pricing norm for AI coach apps: $8.99-9.99/month (Respite Plus at $4.99/mo is cheaper and does not charge for AI because it runs none).
- Respite messaging contrast: those apps send your reasons/usage to their AI (FOMO's privacy label contradicts its "on-device" claim [V]); Respite runs no AI and does not train on data - the user's own AI account does the thinking.

---

## 3. MCP landscape and the "first" verdict

### 3.1 What exists (checked 2026-11-03)

| Server / connector | Type | What it reads/does | Official? | Where listed / evidence |
|---|---|---|---|---|
| **LockIn MCP** | Remote, OAuth (claude.ai, ChatGPT, Poke, Cursor) | Blocks domains / focus mode on desktop | First-party (vendor) | lockinmcp.com [V]; PulseMCP 2026-05-15 [V]; mcp.so `lockin-mcp` ("Lock In: Block Apps & Sites", added about 6 months ago) [V] |
| nichtlegacy/screentime ("Screen Time Exporter") | Local stdio MCP over local SQLite | Mac Screen Time + iPhone/iPad via iCloud/Biome; tools `get_summary`, `get_top_apps`, `get_categories`, `get_late_night` | Unofficial hobby project, 47 stars | https://github.com/nichtlegacy/screentime [V] |
| AgentDank/screentime-mcp | Local | Mac Screen Time to DuckDB, SQL tool; needs Full Disk Access | Unofficial, 15 stars | https://github.com/AgentDank/screentime-mcp [V] |
| tomoyanakano/screentime-mcp-server | Local | knowledgeC.db queries | Unofficial | https://glama.ai/mcp/servers/tomoyanakano/screentime-mcp-server [S] |
| Glama "screen-context", time-tracker-ai-mcp, Time Tracking MCP | Local | Screen-history OCR; work timers | Unofficial | https://glama.ai/mcp/servers?query=screen+time [V] |
| RescueTime MCPs | Local (API key) and Pipedream-hosted; PulseMCP community listing "RescueTime" (remote, released 2026-04-14) | Productivity analytics | **No official RescueTime MCP found** | https://github.com/JasonBates/rescuetime-mcp [S]; https://mcp.pipedream.com/app/rescuetime [S]; https://www.pulsemcp.com/servers?q=rescuetime [V] |
| ActivityWatch MCP (8bitgentleman) | Local, needs ActivityWatch on localhost:5600 | Desktop activity data | Community; listed on ActivityWatch awesome list | https://github.com/8bitgentleman/activitywatch-mcp-server [S] |
| Apple Health MCPs (export.xml, Shortcuts bridges, MetricBridge, hosted "wellness-project-mcp") | Local / hosted community | Health data | Unofficial | https://pypi.org/project/apple-health-mcp/ ; https://glama.ai/mcp/servers/Rafayel306/apple-health-shortcuts-mcp [S] |
| Official MCP registry (registry.modelcontextprotocol.io) | - | Search "screen time": **0 results**; search "usage": only AI-token-usage tools | - | API queries run 2026-11-03 [V] |
| awesome-mcp-servers (punkpeye) | - | Could not read README via fetch; unable to confirm any screen-time entry [U] | - | https://github.com/punkpeye/awesome-mcp-servers |
| Claude Connectors directory | - | No screen-time connector found via web search; could not browse the in-app directory [U]. Time trackers: Jibble/My Hours/WebWork claim listings; Toggl and Clockify reportedly none ("mid-2026" blog) [S] | - | https://www.jibble.io/article/claude-time-tracking-software [S]; https://www.usecarly.com/blog/claude-toggl-integration/ [S] |
| ChatGPT apps/plugin directory | - | No screen-time app found via web search; could not browse the directory [U] | - | - |

### 3.2 Verdict

**Respite is very likely among the first, and probably the first, consumer iPhone + Android screen-time app with an official (first-party) remote OAuth MCP server connecting to Claude/ChatGPT.** It is **not** the first product in the screen-time/blocking category with MCP.

Strongest evidence:
1. Official MCP registry returns **zero** screen-time servers; Glama/PulseMCP/mcp.so show only LockIn plus local Mac-only hobby tools (searches 2026-11-03). [V]
2. Every competitor checked (Opal, one sec, ScreenZen, Brick, Freedom, Clearspace, Jomo, Refocus, Forest, Rize, Apple, Google) shows no MCP/connector in search; the AI-first phone apps (FOMO, Zensi, Argue, No Scroll AI, Monk) all use in-app AI, no connectors. [V]/[S]
3. The only MCP blocker (LockIn MCP) is desktop-centric (hosts file); the only phone-data MCPs are unofficial local Mac tools that read Apple's local DB, not first-party mobile app data. [V]

Caveats to state precisely (do not overclaim):
- **LockIn MCP exists** and says "the only blocker with native MCP" - Respite must not say "the only app with MCP" or "the first screen time MCP". Its own listing metadata is inconsistent (PulseMCP says iOS; site says macOS), so its mobile status is [U].
- Unofficial RescueTime / ActivityWatch / Mac Screen Time MCPs predate Respite's.
- I could not browse the Claude connectors directory or ChatGPT app directory UIs (JS apps); absence there is inferred from web search only.
- App Store / Play searches were not exhaustive; a small indie app could have a niche MCP unseen by search.
- Recommended copy: "To our knowledge, the first mobile screen time app you can connect to Claude or ChatGPT with a built-in MCP server (as of November 2026)." Re-verify before publishing; re-check registries monthly.

---

## 4. Directory submission guide (remote OAuth server, https://respite-api.liveintently.app/mcp)

| Directory | Method | Requirements / fields | Status notes |
|---|---|---|---|
| **Official MCP Registry** (registry.modelcontextprotocol.io) | `mcp-publisher` CLI (`init`, `login`, `publish`). Remote servers use `remotes` in `server.json`. | server.json: `$schema`, `name`, `title`, `description` (validator reportedly caps description at 100 chars [S]), `version`, `remotes: [{type: "streamable-http", url: "https://respite-api.liveintently.app/mcp"}]`. The remote **must be publicly accessible**. **Namespace/auth**: GitHub login gives `io.github.<user-or-org>/name`; custom domain needs `mcp-publisher login dns` (TXT `v=MCPv1; k=ed25519; p=<pubkey>`) or `login http` (host `/.well-known/mcp-registry-auth`) with an Ed25519/ECDSA key. Domain names are reverse-DNS (`com.example/…`) so for liveintently.app it would be `app.liveintently/respite` [U inferred]. Packages (npm `mcpName`) are NOT needed for remote-only. Registry stores metadata only, no security review. Currently "preview". | Sources: https://modelcontextprotocol.io/registry/quickstart , https://modelcontextprotocol.io/registry/remote-servers , https://modelcontextprotocol.io/registry/authentication [V]. Best first step because other directories ingest it (PulseMCP says it picks up the registry). |
| **Anthropic Connectors Directory** | Developer portal https://claude.ai/directory/manage -> Submit new -> **MCP connector**. Need a paid Claude plan. | HTTPS URL; OAuth 2.0 for account tools; every tool needs `title` + `readOnlyHint` or `destructiveHint` (matters for the coming write tools); listing: name <=100 chars, one-liner <=200, description <=2000, 1-5 categories, docs URL, privacy policy URL, support contact, icon, permanent URL slug; use cases; company + contact; authentication; data handling (declare personal data); **test account with populated data + instructions**; confirm each tool was run in MCP Inspector/Claude; 7 compliance acknowledgements (prompt injection, conversation data collection, etc.). Automated scan then listed by default as "Community"; some get human review; "Verified" label is a separate process. Escalations: mcp-review@anthropic.com. | https://claude.com/docs/connectors/building/submission [V] |
| **OpenAI (ChatGPT) directory** (docs call it "Plugin Directory"; formerly apps) | Developer portal, upload plugin ZIP (with MCP server connection), verify identity (individual/business) | Public HTTPS endpoint; **domain verification** by serving challenge token as plain text at `/.well-known/openai-apps-challenge`; auth none/OAuth/mixed (no API-key flows; no server headers); name and short description <=30 chars each, long description <=4000; website, support, privacy policy and ToS HTTPS URLs; square logo + composer icon >=48px (PNG/JPEG/WebP/SVG <=5 MiB); **5 positive + 3 negative test cases, reviewer video walkthrough, release notes**; reviewer credentials (no MFA, sample data); owner or Apps Management Write role. MCP changes rescanned daily. | https://developers.openai.com/apps-sdk/deploy/submission [V]. Note the page title says "Plugin"; naming has changed, re-check. |
| **Smithery** | https://smithery.ai/new, paste public HTTPS URL (or `smithery mcp publish "<url>" -n @org/name`). Smithery Gateway proxies to your server. | Streamable HTTP; OAuth supported (Smithery registers via Client ID Metadata Documents); return **401 not 403** for unauthenticated requests; allowlist `SmitheryBot/1.0` if Cloudflare Bot Fight Mode; optional static `/.well-known/mcp/server-card.json` (only `serverInfo` required) when scan can't pass auth; then Settings -> Verification checklist. | [S] via search summary of https://smithery.ai/docs/build/publish (direct fetch 404'd). Respite is on Cloudflare Workers, so check bot rules. |
| **PulseMCP** | **Submissions currently closed** ("not accepting new submissions"). Ingests the official registry (daily crawl, community says about a week); can email hello@pulsemcp.com with registry name, URL, version, description (from community comment [S]). | Publish to the official registry first. | https://www.pulsemcp.com/submit [V]; https://github.com/modelcontextprotocol/.github/discussions/669 [S] |
| **Glama** | "Add Server" button (GitHub OAuth, repo URL); optional `glama.json` at repo root. Directory has a remote-capable filter and a separate "MCP Connectors" section. | A **GitHub repo** is expected [S]; closed-source server would need a public stub repo with README/docs. | https://glama.ai/mcp/servers [V partial]; discussion #669 [S] |
| **mcp.so** | Submit page has "MCP Server" and "Remote Server" types; Repository URL marked required. Community comments say the form may be paid, with a free GitHub-issue route on chatmcp/mcpso [U]. | name, description, repo link, tags | https://mcp.so/submit [V partial]; discussion #669 [S] |
| **awesome-mcp-servers** (punkpeye) | Fork + PR editing README, alphabetical within category, one line per server. **Remote-only servers belong in the separate awesome-remote-mcp-servers list**, not this one (CONTRIBUTING). Entry needs a public GitHub repo. | link to repo + short description | https://github.com/punkpeye/awesome-mcp-servers/blob/main/CONTRIBUTING.md [V]. The remote list (jaw9c/awesome-remote-mcp-servers) last pushed June 2025 - possibly stale [S]. |
| **Cursor** | cursor.directory (community site) is reportedly fork + PR [S, unverified; fetch rate-limited]. Cursor also supports one-click "Add to Cursor" deeplinks (`cursor://anysphere.cursor-deeplink/mcp/install?...`) from own docs [U, from background knowledge, verify]. | - | Put an install button on respite docs page regardless. |

Cross-cutting prep (do once, reused everywhere): public docs page (setup + tool list + screenshots), privacy policy URL stating "no AI run by Respite, no training", support email, 512px icon + square logo, a **demo account with sample data and no MFA** for reviewers, 5-8 example prompts with expected results, short screen-recorded walkthrough, accurate `readOnlyHint`/`destructiveHint` on every tool (the future write tools carry destructive/approval semantics - document the "loosening needs phone approval" rule in the listing), `/.well-known/openai-apps-challenge` and `/.well-known/mcp-registry-auth` routes on the API host, `/.well-known/mcp/server-card.json`, return 401 on unauthenticated MCP calls.

---

## 5. Keyword clusters

Autocomplete observations (Google suggest endpoint, 2026-11-03; verified): "screen time mcp" returns only "screen time mcp" / "mcps screen time"; "reduce screen time chatgpt", "screen time app with ai", "ai digital wellbeing", "ai phone addiction", "screen time coach", "focus app with ai" return **no suggestions** (nothing, or just echoes); "chatgpt screen time" returns "chatgpt screen time reddit". "ai screen time" returns "ai screen time app", "ai screen time blocker" (plus Character.AI noise). Those long-tail AI queries therefore have near-zero measurable demand today; they are strategic (own the topic, feed AI answers), not traffic plays.

Competition key: Low / Med / High. Intent: I=informational, C=commercial (comparison), T=transactional, N=navigational. Content types: Hub, Tutorial, Listicle, Compare (vs page), Explainer, Tool/Docs page, FAQ, Landing.

### Cluster A: AI + screen time (core)
| Keyword | Intent | Comp. | Who ranks / why | Content |
|---|---|---|---|---|
| ai screen time app | C | Med | App Store listings (FOMO, Zensi, Argue, Zario) | Listicle + landing |
| ai screen time | I/C | Med | Character.AI noise + app listings | Hub |
| ai screen time blocker | C | Med | App listings | Listicle |
| ai screen time coach | C | Med | FOMO, Zario, Meaning (X account) | Compare / hub section |
| screen time app with ai | C | Low | no suggestions; app listings | Listicle |
| ai app blocker | C | Med | Google suggest ambiguous (block AI sites); BlockP, Foqus | Listicle |
| best ai app blocker 2026 | C | Low-Med | No clear ranking page found; self-promo pages | Listicle (flagship) |
| ai app blocker android | C | Low | Play listings (HeadUp, Detoxly) | Listicle section |
| ai app blocker iphone | C | Low-Med | App Store listings | Listicle section |
| ai website blocker | C | Med | Focus AI, BlockP | Compare |
| ai focus app | C | Med | Lifestack, Reclaim blogs | Listicle |
| ai digital wellbeing | I | Low | no suggestions | Hub |
| ai phone addiction | I/C | Low | no suggestions | Explainer |
| ai digital detox app | C | Low | Digital detox coach GPT pages | Listicle |
| ai productivity coach screen time | C | Low | Rize, Lifestack | Compare |
| ai that tracks screen time | I | Low | little | FAQ |
| ai to reduce phone usage | I | Low | blogs | Explainer |
| ai coach for phone addiction | C | Low | Monk AI, FOMO | Landing |
| ai accountability partner phone | C | Low | few | Explainer |
| llm app blocker | I | Low | Focus AI, GitHub | Explainer |
| ai habit coach app blocker | C | Low | - | Listicle |
| ai nudges screen time | I | Low | - | Explainer |
| ai-powered screen time insights | C | Low | HeadUp, Detoxly | Landing |
| ai app limits | C | Low | - | Tutorial |
| zensi alternative | C | Low | - | Compare |
| fomo ai screen time alternative | C | Low | - | Compare |

### Cluster B: ChatGPT / Claude / MCP angle
| Keyword | Intent | Comp. | Who ranks | Content |
|---|---|---|---|---|
| screen time mcp | I | Low | GitHub hobby repos (nichtlegacy, AgentDank), Glama | Tool/docs page |
| screen time mcp server | I | Low | same | Docs page |
| mcp server for screen time claude | I | Low | same | Tutorial |
| connect claude to screen time | I | Low | none | Tutorial |
| connect chatgpt to screen time | I | Low | none | Tutorial |
| connect claude to iphone screen time | I | Low | Mac exporters only | Tutorial |
| claude screen time analysis | I | Low | - | Prompt guide |
| chatgpt screen time | I | Med | mixed noise; Reddit | FAQ |
| chatgpt screen time prompts | I | Low-Med | prompt blogs, "digital detox coach" GPTs | Prompt library |
| can chatgpt help me reduce screen time | I | Low | Tom's Guide piece, assorted blogs | Answer page |
| ask chatgpt about my phone usage | I | Low | - | Tutorial |
| chatgpt phone addiction plan | I | Low-Med | Tom's Guide | Prompt library |
| claude connectors screen time | I | Low | - | Docs |
| mcp for productivity apps | I | Low | Toggl/Clockify connector blogs | Explainer |
| rescuetime mcp | I | Low | GitHub, Glama, Pipedream | Compare mention |
| activitywatch mcp | I | Low | GitHub | Compare mention |
| bring your own ai app | I | Low | - | Explainer |
| what is an mcp server (consumer) | I | Med-High | Anthropic/docs/vendors | Explainer (short, linking to Respite example) |
| how to add a custom connector claude | I | Med | Anthropic docs, guides | Tutorial section |
| how to add mcp server to chatgpt | I | Med | OpenAI docs, guides | Tutorial section |
| is it safe to give ai my screen time data | I | Low | - | Privacy explainer |
| claude desktop mcp setup | I | High | docs | Skip as target |
| ai agent control phone limits | I | Low | - | Roadmap blog (write tools, approval, undo) |
| let claude set app limits | I | Low | - | Feature post |
| chatgpt app blocker | C | Low-Med | nullgen blockers of AI (opposite intent) | Disambiguation section |

### Cluster C: App blockers (commercial head terms)
| Keyword | Intent | Comp. | Who ranks | Content |
|---|---|---|---|---|
| best app blocker | C | High | affiliate/vendor listicles | Listicle (long game) |
| best app blocker for iphone | C | High | habitdoom, shiftyourphone, techlockdown and many pages.dev clones; all vendor-ranked | Listicle |
| best app blocker for android | C | High | dev.to, lifestack, vendor blogs | Listicle |
| best app blocker free | C | High | same | Listicle |
| best app blocker reddit | C | Med | Reddit | Reddit participation |
| app blocker for studying | C | Med | Lifestack, student blogs | Landing |
| app blocker for adhd | C | Med | blogs | Landing |
| app blocker for pc / mac / windows | C | High | Freedom, Cold Turkey | Skip |
| block apps on iphone | I | High | Apple, Wikihow-type | How-to |
| block apps on iphone at certain times | I | Med | Apple Support | How-to |
| how to block apps android | I | High | Google, tech sites | How-to |
| app blocker that cannot be bypassed | C | Med | Freedom, AppBlock | Landing |
| app that locks apps with schedule | C | Med | Jomo, Opal | Landing |
| screen time alternatives ios | C | Med | habitdoom | Listicle |
| screen time bypass how to stop | I | Med | techlockdown | Explainer |

### Cluster D: Alternatives / comparisons (navigational-commercial)
| Keyword | Intent | Comp. | Who ranks | Content |
|---|---|---|---|---|
| opal alternative | C | Med | habitdoom, 12focus, listicle sites | Compare |
| opal alternative free | C | Med | habitdoom | Compare |
| opal alternative android | C | Low-Med | - | Compare |
| opal vs one sec | C | Med | tryhugo, review blogs | Compare |
| one sec vs screenzen / jomo / freedom / opal / brick | C | Med | review blogs | Compare |
| one sec alternative android | C | Low-Med | - | Compare |
| freedom app alternative | C | Med | detox.so, lifestack | Compare |
| brick alternative | C | Med | - | Compare |
| screenzen alternative | C | Low | - | Compare |
| clearspace alternative | C | Low | - | Compare |
| jomo alternative | C | Med | habitdoom | Compare |
| forest app alternative | C | Med | - | Compare |
| rescuetime alternative mobile | C | Med | timing, others | Compare |
| lockin mcp alternative | C | Low | lockinmcp.com | Compare (mobile angle) |
| respite vs opal | N/C | Low | none | Compare |
| respite app review | N | Low | none | Landing / press |

### Cluster E: Pause / friction / mindful
| Keyword | Intent | Comp. | Who ranks | Content |
|---|---|---|---|---|
| app that makes you pause before opening social media | C | Med | Fortune on one sec, Product Hunt, App Store listings (MindPause, Focus Pause, Naze, Mivo) | Listicle + landing |
| app that makes you pause before opening apps | C | Low-Med | same | Listicle |
| pause before opening instagram app | C | Low-Med | App Store | Landing |
| mindful phone use | I | Low | thin | Guide |
| mindful phone use app | C | Low | thin | Landing |
| intention app before opening apps | C | Low | one sec | Guide |
| one sec alternative | C | Med | - | Compare |
| breathing before opening apps | C | Low | - | Guide |
| delay app opening | C | Low | - | Guide |

### Cluster F: Doomscrolling / phone addiction / habit
| Keyword | Intent | Comp. | Who ranks | Content |
|---|---|---|---|---|
| how to stop doomscrolling | I | High | Calm, Positive Psychology, YNHHS, BetterHelp, PureWow | Guide w/ app angle |
| how to stop doomscrolling at night | I | Med | - | Guide |
| how to stop doomscrolling before bed | I | Med | - | Guide |
| how to stop doomscrolling on instagram / youtube | I | Med | - | Guide |
| how to stop doomscrolling adhd | I | Med | - | Guide |
| phone addiction | I | High | Healthline, Mayo etc. | Skip as head |
| phone addiction symptoms / treatment / help | I | High | medical sites | Skip |
| phone addiction app | C | Med | listings | Landing |
| how to break phone addiction | I | High | - | Guide |
| how to use phone less | I | High | - | Guide |
| digital detox app | C | Med | listings | Listicle |
| how to reduce screen time on iphone | I | High | Apple, tech sites | How-to |
| how to reduce screen time on android | I | High | Google | How-to |
| how to reduce screen time reddit | I | Med | Reddit | Reddit |
| how much screen time is too much for adults | I | High | health sites | FAQ |
| how to cut screen time without willpower | I | Low | - | Guide |

### Cluster G: Gamified / motivation
| Keyword | Intent | Comp. | Who ranks | Content |
|---|---|---|---|---|
| gamified screen time | I | Low | thin | Hub page |
| gamified screen time app | C | Low-Med | BePresent, Zenera, TouchGrass, Breakr listings | Listicle |
| screen time app with streaks | C | Low | - | Landing |
| screen time app with rewards | C | Low-Med | - | Landing |
| app that rewards you for not using your phone | C | Med | Forest, BePresent | Listicle |
| screen time leagues / quests | I | Low | - | Feature page |
| forest app alternative | C | Med | - | Compare |
| free screen time game (no social) | C | Low | - | Landing |

### Cluster H: Platform how-to / built-ins
| Keyword | Intent | Comp. | Who ranks | Content |
|---|---|---|---|---|
| screen time app for iphone / android | C | High | listicles | Landing |
| screen time limit android app | I/C | Med | Google, listicles | How-to |
| free app to limit screen time android | C | Med | - | Listicle |
| ios 27 screen time changes | I | Med | MacRumors, 9to5Mac | News/explainer |
| ios screen time not working | I | Med | TechRadar notes bugs | Troubleshooting |
| digital wellbeing app android | I | High | Google | Skip/compare |
| digital wellbeing alternatives | C | Med | - | Compare |
| screen time ignore limit workaround | I | Med | - | Explainer |

### Cluster I: Browser extension
| Keyword | Intent | Comp. | Who ranks | Content |
|---|---|---|---|---|
| block websites chrome extension | C | High | CWS, Creole, FocusMe | Landing |
| website blocker firefox | C | Med | AMO | Landing |
| block distracting sites chrome and phone sync | C | Low | - | Landing |
| stayfocusd alternative | C | Med | - | Compare |
| leechblock alternative | C | Low-Med | - | Compare |
| blocksite alternative | C | Med | - | Compare |
| focus extension for youtube shorts | C | Med | - | Landing |

### Cluster J: Question-style prompts people give AI assistants
| Keyword | Intent | Comp. | Content |
|---|---|---|---|
| what is the best app to reduce screen time | C | High (AI answers cite listicles) | Listicle |
| which app blocker works on both iphone and android | C | Low-Med | FAQ |
| is there an app that connects to chatgpt to track my phone usage | I | Low | Answer page |
| can claude see my screen time | I | Low | FAQ |
| how can I get an ai to analyze my screen time | I | Low | Tutorial |
| best screen time app that doesn't send my data to ai | C | Low | Privacy page |
| what app lets me set limits with an ai assistant | C | Low | Feature page |
| screen time app without subscription | C | Med | Listicle |
| free app blocker no ads | C | Med | Listicle |
| apps like one sec | C | Med | Compare |
| apps like opal | C | Med | Compare |

Count: about 150 keyword rows across clusters A-J (some are placeholders for query families).

---

## 6. SERP and AI-answer gaps (top 10 clusters)

Methodology note: I could not run live Perplexity/ChatGPT/AI Overviews sessions; "what AI says" is inferred from published citation studies plus the pages that dominate the SERPs I did fetch. Treat AI-answer conclusions as [U]. Run a manual test (see section 9) before finalising.

| # | Cluster | Who ranks now | What format wins | Gap / opportunity |
|---|---|---|---|---|
| 1 | best app blocker iPhone/Android | Vendor-run listicles (habitdoom.com, shiftyourphone, lifestack.ai, techlockdown, pages.dev/vercel clones), App Store Tracker, FamiSafe | "I tested N apps (2026)" listicles with comparison tables | Nearly every list ranks its own app first; no independent reviews. Honest "includes our own bias" list with a methodology and update date; but high competition - do as a supporting piece, not the lead |
| 2 | Apple Screen Time / "screen time alternatives ios" | Apple Support, MacRumors/9to5Mac for iOS 27, habitdoom | How-to + news | iOS 27 changes (time allowances, schedules) have bugs per TechRadar; an "iOS 27 Screen Time limits not working / what to use instead" explainer is timely [S] |
| 3 | Pause-before-open | Fortune (one sec, 57% claim cited to Heidelberg; PNAS attribution disputed), Product Hunt entries, App Store listings (MindPause, Focus Pause, Naze, Mivo) | App listings + a few news pieces | No definitive comparison. Make the best pause-app comparison with the research citation handled carefully |
| 4 | Doomscrolling | Calm, Positive Psychology, YNHHS, BetterHelp, PureWow, Substack, vendor blogs | Listicle how-to ("10 ways", "7 ways") | Head is authority-dominated (health brands); win on narrow variants ("at night", "ADHD", "on iPhone with Screen Time vs apps") and give the app-based tactics other lists mention only briefly |
| 5 | Best screen time apps for adults | airdroid, impulsec (parental-control vendors), Marie Claire, Digital Trends, AppBlock, Habi | Listicles; mostly parental-control vendors | Adult self-control angle (not kids) is under-served by editorial brands; add Android + browser + AI in one list |
| 6 | Gamified screen time | BePresent, Zenera, TouchGrass, Breakr, FitScreen, GoalGate (App Store pages) | App listings only, no editorial comparisons | Almost no content outside listings; claims are self-reported with no studies. Create the reference guide: "gamified screen time apps compared" with honest note on evidence |
| 7 | AI app blocker / AI screen time coach | App Store/Play listings (FOMO, Zensi, Argue, Zario, HeadUp, Detoxly, No Scroll AI, Monk AI), BlockP promo article, Lifestack | Store listings; no independent "best AI app blocker 2026" page found | **Largest commercial gap**: no authoritative comparison exists. Own it with a transparent table including the privacy angle (FOMO's label vs claims [V]) |
| 8 | ChatGPT for screen time | Tom's Guide first-person ("I asked ChatGPT to break up with my phone"), movieguide, beehiiv newsletters, prompt directories, custom GPT "Digital Detox Coach" | Anecdotal blog + prompt lists | AI gives generic plans, and says it cannot track usage; the missing piece is real data via connector - exactly what Respite adds. Tutorial + prompts pages are uncontested |
| 9 | MCP / connector for screen time | GitHub READMEs (nichtlegacy, AgentDank), Glama, LockIn MCP's blog (self-ranked #1 in its own listicles, 2026-06-18) | GitHub, vendor blog | Respite can be the only mobile example; also the comparison with LockIn MCP's desktop approach is open ground |
| 10 | Chrome/Firefox website blockers | Chrome Web Store, Creole Studios, FocusMe, Lifestack, StayFocusd/LeechBlock lists | Listicles + store | Extension trust (a Feb 2026 popular blocker incident referenced in a CWS listing, garbled [U]) - emphasise permissions/privacy; sync with phone limits is the differentiator |

### What AI assistants likely answer (5-8 key questions) and what gets cited [U unless noted]
Citation-pattern facts from studies [S]: Peec AI (30M citations) found Reddit most cited overall, then YouTube, LinkedIn, Wikipedia, Forbes ( https://searchengineland.com/ai-search-engines-cite-reddit-youtube-and-linkedin-most-study-473138 ); Ahrefs-based figures: AI Overviews cite YouTube about 22.9%, Reddit 18.5%, Facebook 10.1%; Perplexity skews to Reddit/community; ChatGPT skews to editorial/encyclopedic; platforms agree on only about 11% of domains (https://www.tryprofound.com/blog/ai-platform-citation-patterns , https://contently.com/2026/04/29/top-sources-llms-cite/ ). Vendor studies, methods differ.

1. "Best app to reduce screen time" -> likely names Apple Screen Time / Digital Wellbeing, Opal, one sec, Freedom, Forest, ScreenZen, Jomo; cites listicle sites + Reddit + app stores. Gap: no AI coach / MCP mention.
2. "Best AI app blocker" -> thin; likely FOMO/Zensi-type or generic; hallucination-prone. Chance to be the cited source.
3. "Can ChatGPT help me reduce screen time?" -> yes for planning, no tracking/blocking (matches search summary [S]); sources are blogs/Tom's Guide. A page answering "ChatGPT cannot see your usage unless you connect a tool; here is how" can be cited.
4. "How to stop doomscrolling" -> Calm, Positive Psychology, health systems, plus app mentions (one sec, Opal).
5. "App that makes you pause before opening apps" -> one sec dominates (Fortune, App Store).
6. "Is there an MCP server for screen time?" -> would currently surface LockIn MCP, nichtlegacy/screentime, AgentDank; Respite absent until listed and linked.
7. "How do I connect Claude to my phone data?" -> Anthropic connector docs, generic tutorials.
8. "Gamified screen time app" -> BePresent, Forest, Zenera, TouchGrass.
Actionable: run these 8 prompts monthly in Perplexity, ChatGPT search, Google AI Mode/Overviews, Claude (with search), record citations and whether Respite appears.

---

## 7. Recommended content plan

Principles: answer first (40-60 words), update dates visible, honest comparisons that include our weaknesses, concrete numbers, one consistent entity description (see 9). Each page gets an FAQ section matched to visible Q&A.

### Hub
**H1. "AI and your screen time: connect Claude or ChatGPT to your real phone data"** (URL /ai-screen-time)
- Targets: ai screen time, ai screen time app, bring your own ai app, ai digital wellbeing.
- Angle: map of the 5 AI patterns (in-app coach, on-device reflection, insights, LLM filter, BYO-AI via MCP), what each means for privacy and cost; links to every article below.
- Why it can win: no authoritative overview exists (cluster 7 gap); defines category terminology that AI answers can quote.

### Articles / tool pages
1. **"How to connect Claude to your screen time (MCP, 5 minutes)"** - kw: connect claude to screen time, screen time mcp server. Step-by-step with screenshots, the server URL, OAuth, example prompts; later "set limits" section. Wins: zero competition, only mobile example. 
2. **"How to connect ChatGPT to your phone usage"** - kw: connect chatgpt to screen time, ask chatgpt about my phone usage. Same, with developer-mode/custom connector steps (verify current ChatGPT UI before publishing).
3. **"30 prompts to ask Claude or ChatGPT about your screen time"** - kw: chatgpt screen time prompts, claude screen time analysis. Prompt library with sample outputs; shareable. Wins: prompt-list format is popular; tied to real data.
4. **"Can ChatGPT help you reduce screen time? What it can and cannot do"** - kw: can chatgpt help me reduce screen time, chatgpt phone addiction plan. Answer-first; cites Tom's Guide style experiences; explains the missing-data problem. Wins: low competition, direct match to assistant queries.
5. **"Best AI app blockers and screen time apps in 2026 (honest comparison)"** - kw: best ai app blocker 2026, ai screen time app. Table of FOMO, Zensi, Argue, No Scroll AI, one sec, Focus AI, LockIn MCP, Respite with columns: AI type, platform, price, what data leaves your phone, MCP. Disclose bias. Wins: no equivalent page; commercial gap.
6. **"What is an MCP server, in plain English (with a screen time example)"** - kw: what is an mcp server consumer, bring your own ai. Short explainer, links to docs. 
7. **"Is it safe to give an AI your screen time data?"** - kw: is it safe to give ai my screen time data, best screen time app that doesn't send my data to ai. Contrast: Respite runs no AI, no training; user's chosen AI account sees only what they authorise; revoke access; mention FOMO label discrepancy carefully as an example of why to read privacy labels.
8. **"Let your AI change your limits: how approval, change log and undo work"** (publish when write tools ship) - kw: let claude set app limits, ai agent control phone limits. Explains tighten-instantly / loosen-with-approval rule. Wins: novel.
9. **"The best apps that make you pause before opening Instagram or TikTok"** - kw: app that makes you pause before opening social media. Compare one sec, MindPause, Focus Pause, Naze, Mivo, Respite; cite one sec research carefully (disputed attribution).
10. **"How to stop doomscrolling at night: a 7-step plan with phone settings"** - kw: how to stop doomscrolling at night/before bed. Focused long-tail; includes schedules + bedtime limits; AI-prompt box.
11. **"Gamified screen time apps compared (and does gamification work?)"** - kw: gamified screen time app, screen time app with streaks. Evidence section honest ("no independent studies found").
12. **"iOS 27 Screen Time: what changed and what still doesn't work"** - kw: ios 27 screen time changes, ios screen time not working. Timely news hook, links to alternatives.

### Comparison / alternatives pages (template: verdict box, feature table, price, who should pick which, "where we lose")
- Respite vs Opal (opal alternative, respite vs opal)
- Respite vs one sec
- Respite vs Freedom
- Respite vs LockIn MCP (desktop hosts-file + MCP vs mobile + MCP) - also positions "one of the first" accurately
- Respite vs ScreenZen / Jomo / Brick (one page each if traffic warrants)
- Respite vs Zensi/FOMO (AI inside vs BYO AI)
- Respite vs RescueTime (RescueTime has no official MCP)

### Distribution items that feed AEO (non-site)
- Reddit: r/nosurf, r/digitalminimalism, r/ADHD, r/iphone, r/androidapps threads on "best app blocker" - participate transparently as the maker.
- YouTube: 3-minute demo "Ask Claude about your screen time" (YouTube is the #1-2 AI-citation source per studies [S]).
- Product Hunt launch for "bring your own AI" (no existing AI screen-time Product Hunt hit found in search [U]).
- Directory listings (section 4) with consistent copy; ask Anthropic/OpenAI directory submission to mention screen time use cases.
- Get included in third-party roundups (outreach to authors of "best app blocker" pages; many are vendor pages - target editorial: Digital Trends, Marie Claire, Zapier [S]).

---

## 8. AEO technical checklist

1. **Crawl/index basics (what Google actually requires)**: pages indexed, snippet-eligible; Google says no special optimisations, schema, or AI text files are needed for AI Overviews/AI Mode. https://developers.google.com/search/docs/appearance/ai-features [V]
2. **Allow AI search crawlers**: robots.txt allow `OAI-SearchBot` (needed to appear in ChatGPT search; can still block `GPTBot` for training; `ChatGPT-User` is user-initiated); changes take about 24 hours; allow OpenAI's published IP ranges if a WAF/Cloudflare bot rule is active. https://developers.openai.com/api/docs/bots [V]. Also check Cloudflare AI-bot blocking is not on for the marketing site and that Claude/Perplexity bots (`ClaudeBot`, `Claude-SearchBot`, `PerplexityBot`) are allowed [U - bot names from background knowledge, verify in each vendor doc].
3. **Server-rendered HTML**: guidance says major AI crawlers do not render JS, so key text must be in initial HTML [S]. https://www.honeyb.ai/blog/oai-searchbot
4. **Bing/IndexNow**: ChatGPT's retrieval mix is not public - sources conflict on Bing vs OpenAI's own index ("Labrador") vs scraped Google; Bing is still plausible [U]. Low-cost hedge: verify the site in Bing Webmaster Tools and enable IndexNow on publish. I found no source confirming IndexNow affects ChatGPT citations. https://peec.ai/blog/chatgpt-built-its-own-search-index [S]
5. **llms.txt**: SE Ranking (~300k domains, Nov 2025) found no measurable link between llms.txt and citations; about 10% adoption; Ahrefs (137k sites) reportedly found 97% of llms.txt files got zero requests; Google says not needed. Verdict: optional, 30-minute task; if added, make it a concise map (what Respite is, docs, MCP page, pricing, privacy). Do not expect lift. https://www.searchenginejournal.com/llms-txt-shows-no-clear-effect-on-ai-citations-based-on-300k-domains/561542/ [V]
6. **Schema (hygiene, not magic)**: use `Organization` (name, logo, sameAs to App Store, Play, Chrome Web Store, GitHub, X), `MobileApplication`/`SoftwareApplication` (operatingSystem, offers, aggregateRating only if real), `WebSite`, `Article`+`Person` author, `BreadcrumbList`. `FAQPage` and `HowTo`: Google restricts FAQ rich results to authoritative gov/health sites and HowTo rich results are gone, but the markup is harmless; visible Q&A content matters more than the JSON-LD (a 1,885-page study found no citation gain from JSON-LD alone [S]). Markup must match visible text. https://www.searchenginejournal.com/google-confirms-structured-data-still-essential-in-ai-search-era/544141/ [S]; https://endertech.com/blog/what-structured-data-does-for-seo-and-ai-search [S]
7. **Answer blocks**: every page starts with a 40-60 word direct answer under an H1/H2 phrased like the query; tables for comparisons; short definitional sentences ("Respite is a screen time app for Android, iPhone and Chrome/Firefox that ..."); dated "Updated November 2026"; named author with credentials.
8. **Entity consistency**: one canonical product description, same name (Respite), category terms, pricing, and platform list across website, App Store, Play, CWS, Firefox Add-ons, GitHub, directories, Product Hunt, social. Note the rename from Pawse/old logo (the rename on 2026-10-26 can leave stale "Pawse" entities - set `alternateName`/mention rename on About page, request old-name page redirects) [context from internal memory, not web research].
9. **Citable facts**: publish stats, changelog, MCP tool list, security/privacy statement, pricing page in plain HTML, not images/PDF; stable URLs; /docs/mcp page with tool names and annotations (also feeds directory reviewers).
10. **Third-party signals**: AI citations lean on Reddit, YouTube, Wikipedia, listicles and review sites [S]; plan reviews on G2/Capterra-equivalents (Product Hunt, AlternativeTo, Slant), AlternativeTo listing (they have an "Apps with Block apps" feature index [S]), Wikipedia is not realistic yet.
11. **Measurement**: monthly manual query set (section 6), plus Search Console (gsc-mcp already exists internally) for impressions on long-tail AI queries; track referrals from chatgpt.com / perplexity.ai in analytics; Bing Webmaster for Copilot visibility; server logs for OAI-SearchBot and others.
12. **Host/SEO caution** (internal context): prior SEO drop from host moves - keep respite.liveintently.app stable, keep redirects, do not move the docs or MCP page again.
13. **Avoid claims that assistants may fact-check**: say "to our knowledge" for "first"; keep comparison facts dated and sourced; privacy claims must match App Store privacy labels.

---

## 9. Sources (all accessed 2026-11-03)

Primary / documentation [V]:
- MCP registry quickstart https://modelcontextprotocol.io/registry/quickstart
- Remote servers https://modelcontextprotocol.io/registry/remote-servers
- Registry authentication https://modelcontextprotocol.io/registry/authentication
- Registry API search queries https://registry.modelcontextprotocol.io/v0/servers?search=screen%20time and ?search=usage
- Anthropic connector submission https://claude.com/docs/connectors/building/submission (FAQ moved from https://support.claude.com/en/articles/11596036-anthropic-connectors-directory-faq)
- OpenAI submission https://developers.openai.com/apps-sdk/deploy/submission
- OpenAI crawlers https://developers.openai.com/api/docs/bots
- Google AI features https://developers.google.com/search/docs/appearance/ai-features
- PulseMCP submit (closed) https://www.pulsemcp.com/submit ; LockIn page https://www.pulsemcp.com/servers/devsrodrigo-lockin ; RescueTime search https://www.pulsemcp.com/servers?q=rescuetime
- mcp.so submit https://mcp.so/submit ; search https://mcp.so/search?q=screen%20time
- Glama https://glama.ai/mcp/servers?query=screen+time
- awesome-mcp-servers contributing https://github.com/punkpeye/awesome-mcp-servers/blob/main/CONTRIBUTING.md
- LockIn MCP https://www.lockinmcp.com/ ; https://www.lockinmcp.com/blog/best-distraction-blockers-2026
- nichtlegacy/screentime https://github.com/nichtlegacy/screentime ; AgentDank https://github.com/AgentDank/screentime-mcp
- FOMO https://apps.apple.com/us/app/fomo-ai-screen-time-coach/id6784763401 ; Zensi https://apps.apple.com/us/app/zensi-ai-screen-time-control/id6756569023
- SE Ranking llms.txt study via SEJ https://www.searchenginejournal.com/llms-txt-shows-no-clear-effect-on-ai-citations-based-on-300k-domains/561542/
- Google autocomplete endpoint https://suggestqueries.google.com/complete/search?client=firefox&q=<query> (queries run listed in section 5)

Secondary [S]:
- Smithery publish docs https://smithery.ai/docs/build/publish (via search summary; direct fetch 404)
- MCP community directory thread https://github.com/modelcontextprotocol/.github/discussions/669
- cursor.directory / Cursor directory (couldn't fetch, 429) https://cursor.directory ; summary https://coding-dev-tools.github.io/devforge/blog/mcp-server-directories-where-to-list-your-server.html
- awesome-remote-mcp-servers https://github.com/jaw9c/awesome-remote-mcp-servers
- Opal reviews https://makeheadway.com/blog/opal-app-review/ , https://productivpick.in/opal-vs-freedom-which-screen-time-app-is-better/
- one sec https://apps.apple.com/us/app/one-sec-screen-time-focus/id1532875441 ; https://www.tryhugo.app/blog/one-sec-app-review-2026 ; Fortune https://fortune.com/well/2023/03/06/one-sec-app-can-help-cut-your-social-media-use/
- Argue, No Scroll AI, Monk AI, Zario, HeadUp, Detoxly, Foqus (store URLs in table)
- Rize https://rize.io/pricing , https://subscribed.fyi/rize/reviews/
- RescueTime https://timingapp.com/blog/rescuetime-alternatives/ , https://www.timecamp.com/blog/what-is-rescuetime/
- Apple iOS 27 Screen Time https://www.macrumors.com/2026/06/08/ios-27-parental-controls/ , https://9to5mac.com/2026/06/10/apple-is-giving-screen-time-and-parental-controls-a-long-overdue-upgrade-in-ios-27/ , https://www.techradar.com/phones/ios/im-a-big-screen-time-user-and-apples-shiny-new-ios-27-features-wont-matter-without-a-major-bug-fix
- Focus AI https://chromewebstore.google.com/detail/focus-ai-website-blocker/ngboiiifeoioghodfglighnahefnjbib
- Citation studies https://searchengineland.com/ai-search-engines-cite-reddit-youtube-and-linkedin-most-study-473138 , https://www.tryprofound.com/blog/ai-platform-citation-patterns , https://contently.com/2026/04/29/top-sources-llms-cite/
- ChatGPT index https://peec.ai/blog/chatgpt-built-its-own-search-index , https://searchenginewatch.com/chatgpt-own-search-engine/
- OAI-SearchBot guide https://www.honeyb.ai/blog/oai-searchbot
- Structured data https://www.searchenginejournal.com/google-confirms-structured-data-still-essential-in-ai-search-era/544141/ , https://endertech.com/blog/what-structured-data-does-for-seo-and-ai-search
- Tom's Guide ChatGPT piece (body not retrievable) https://www.tomsguide.com/ai/i-asked-chatgpt-to-help-me-break-up-with-my-phone-it-helped-me-get-my-evenings-back
- SERP samples: habitdoom.com, shiftyourphone.com, lifestack.ai, techlockdown.com, calm.com/blog/how-to-stop-doomscrolling, positivepsychology.com/how-to-stop-doomscrolling, bepresentapp.com
- Apple Health MCPs https://pypi.org/project/apple-health-mcp/ ; Toggl/Clockify connector status https://www.usecarly.com/blog/claude-toggl-integration/

## 10. Open items / not verified
- Could not browse in-app Claude connectors directory or ChatGPT app directory; re-check manually for screen-time entries.
- Google Digital Wellbeing / Gemini AI features: not covered by results.
- Flipd, Brick, Clearspace, Jomo AI status: no evidence either way.
- No keyword volume data; validate with Search Console/Ahrefs/Semrush before committing.
- IndexNow's effect on ChatGPT: no confirming source.
- Cursor directory process, mcp.so fee, Smithery exact docs: partially unverified.
- Could not live-test Perplexity / ChatGPT / AI Overviews answers.

---

## 11. Competitor features worth considering for Respite (added on request)

Source for each is in the section 2 table; all vendor-described [S] unless noted. Ordered by fit with Respite's "no Respite-run AI" stance.

**High fit (works without Respite running AI)**
1. **Open/dismiss stats on the pause screen** (ScreenZen: open-rate stats show whether the delay deterred you). Show "you closed X of Y pauses this week" - feeds the MCP insights too.
2. **Intention picker with logged reason** (one sec: "why are you opening this app?", emotion/intention logging). Store reasons as structured data and expose via MCP so the user's own AI can find patterns (a BYO-AI version of FOMO/Zensi's coach).
3. **Time-boxed grants after a pause** (No Scroll AI: 15-minute sessions; Argue: relock when the timed break ends; Zensi: decision timeline "The Lab"). Respite can offer "allow 10 min" without AI, plus a decision timeline.
4. **Variety of friction types** (one sec: breathing, mirror, maths; Free Time: word scramble/mindfulness; PauseHer: yoga pose). Add 2-3 optional interventions; make them selectable per app.
5. **Strict / uninstall-proof mode and locked schedules** (Opal Deep Focus, Freedom Locked Mode, AppBlock Strict Mode). Matches the "loosening needs approval on the phone" rule; market it as such.
6. **Physical-world friction** (Brick, Bloom NFC tag/keycard). Optional NFC/QR unlock for a strict mode; low engineering cost, strong marketing.
7. **Earn-screen-time mechanics** (FitScreen: walk to earn; Pushscroll: exercise unlocks; Habit Doom: complete habits). Fits Respite's acorn economy: spend acorns for extra minutes (check this does not undermine the "free game layer, no social" decisions).
8. **Weekly report / focus score / gems and leaderboards** (Opal Focus Score, weekly reports, friends leaderboard). Respite already has leagues; add a shareable weekly summary card and a single daily score.
9. **Task-aware web filtering** (Focus AI; LockIn MCP task-aware blocking): user states a task, extension allows relevant pages. Could be done rule-based first (task = allowlist set) in the extension, and exposed as an MCP "start focus session with allowlist" tool when write tools ship.
10. **MCP tools like LockIn's** (`enter_focus_mode`, `temporarily_unblock`, `get_block_status`, `get_agent_guidelines`). Candidate write tools: start focus session, temporary unblock (needs phone approval), block status; plus an agent-guidelines tool/prompt that tells the AI the tighten/loosen rules.
11. **Cross-device sync as headline** (Freedom, Rize is desktop-only, Opal mostly iOS): Respite's Android + iPhone + Chrome/Firefox is a differentiator versus iOS-only AI coaches (FOMO, Zensi, Argue, Monk).
12. **Screen-time sharing across devices / Mac data** (nichtlegacy exporter reads Mac + iPhone via iCloud): consider desktop usage later; shows demand for combined all-device data in AI chats.
13. **Parental/family modes** (Apple iOS 27 time allowances by category, Ask to Browse): category-based allowances ("Social 45 min") are a simple, popular limit model.

**Medium fit / needs a policy decision**
14. **AI negotiator inside the app** (FOMO, Zensi, Argue): conflicts with "Respite runs no AI". Alternative: let the user's connected AI act as coach via MCP prompts; or an optional on-device model (one sec does on-device LLM reflection) - would keep the privacy story if truly on-device.
15. **Accountability partner / social** (Opal friends): conflicts with the "no social" decision; skip.
16. **Streak/plant visuals** (TouchGrass plant withering, Forest tree): already covered by streaks; a visual metaphor may be cheap to add.

**Gaps competitors expose that Respite can message**
- AI coach apps charge $8.99-9.99/month and send data to their AI; FOMO's privacy label lists identity-linked data despite "on-device" copy [V]. Respite Plus at $4.99/mo with no Respite AI is a clear contrast.
- Apple's iOS 27 Screen Time has reported bugs (TechRadar) [S]; a reliable cross-platform alternative is a timely angle.
- Almost no competitor offers Android + iPhone + browser together with AI access.

---

## 12. Competitor feature catalogue and gap ideas

The full catalogue (features by competitor, by theme, and an 18-row gap table with effort and positioning fit) is in the companion file:
/private/tmp/claude-501/-Users-faddy-MyLab-WellbeingApps-Respite/f6eed04e-4a19-419d-8c31-488a20d638d9/scratchpad/competitor-features.md

Top 10 gap ideas: (1) pause stats, (2) intention/reason logging exposed via MCP, (3) timed grants after a pause, (4) MCP write tools modelled on LockIn (focus session, temporary unblock with phone approval, block status, guidelines), (5) selectable friction types, (6) decision timeline, (7) category allowances, (8) weekly summary card plus daily score, (9) strict mode / cooldown before loosening, (10) acorns-for-minutes with care for pressure. Rejected on positioning grounds: in-app cloud AI coach, friend leaderboards.
