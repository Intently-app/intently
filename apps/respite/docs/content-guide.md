# Respite blog content guide

How to write or refresh a post in `src/content/blog/`. Goals, in order: be the best answer to the
searcher's question (SEO), be quotable by AI answer engines (AEO), earn the click (CTR), and turn readers
into installs (conversion). Never trade truth for any of them.

## Product facts (the only claims you may make about Respite)

- Respite puts a short, gentle pause before the apps (and on Chrome, the websites) you pick, so you open
  them on purpose. It also tracks usage, keeps streaks, and has daily limits and timers.
- Platforms: **iPhone, Android and Chrome** (the Chrome extension also works in other Chromium browsers).
  The iPhone app is built on Apple's Screen Time API; it adds an app lock that refreshes at midnight.
- Price: **free**. An optional **Respite Plus** upgrade adds sync across all devices, unlimited schedules,
  focus sessions longer than 25 minutes, richer insights, and on iPhone a Live Activity and Control Center
  control. Prices (checked 2026-11-03, set by the stores, vary by country): $4.99 a month, $29.99 a year with a
  one-week free trial, $59.99 lifetime. Always add "at the time of writing". Free keeps the pause, app, website
  and category limits, 1 schedule, focus sessions up to 25 minutes and the game layer. Plus is bought in the
  iPhone or Android app; the extension only uses the account's Plus.
- Account: **optional**. Everything core works without signing in. An account (Google or Apple sign-in)
  is only needed for sync / Plus on several devices. Say "no account needed" only with that nuance,
  e.g. "no account needed (sign in only if you want sync)". Never say "works fully offline forever" or
  "never collects any data". Say "usage history stays on your device unless you turn on sync".
- No ads.
- What the pause shows (from the app code): on Android and Chrome it rotates built-in content —
  reflection questions, a short guided breathing exercise, your own usage stats, quotes and activity
  suggestions. On iPhone the pause is Apple's Screen Time shield, so keep iPhone wording general
  ("a short, gentle pause"). There is no journaling and no intention-setting feature.
- You **cannot** write your own pause messages or customize prompts per app. Don't promise custom
  messages, custom prompts or per-app prompt text.
- The game layer is **free** and live on **iPhone and Android** (Journey tab): acorns, daily quests, streak
  milestones, a weekly chest, streak freezes, a shop (garden, Biscuit outfits), friends and weekly leagues. It needs a
  free sign-in (Google or Apple) because the server keeps the ledger. Numbers: see
  `src/content/blog/how-acorns-streaks-streak-freezes-work.md`. The browser extension does not show it until the
  extension release with sign-in ships. Never reward-more-use framing.
- Bring your own AI (MCP) is a staged rollout, Respite Plus only. **Live (read-only):** get_account (free plan too),
  get_usage, get_insights, list_limits, list_events, get_progress, and the resources respite://today and
  respite://week. **Not live, write as "coming":** an AI changing limits or schedules (tightening applies at once,
  loosening needs approval on the phone), a change log with undo, the in-app Connected AI screen (iPhone first),
  AI-written pause messages and rules. Disconnect today = the AI app's connector settings; deleting the Respite
  account ends every connection. Never describe a coming tool as available. The draft post
  `let-ai-change-your-limits` goes live only when the write tools ship (checklist inside the file).
- **The "first" claim, exact wording only:** "to our knowledge, the first mobile screen time app with a built-in MCP
  server (November 2026)". Never "only", never "the first screen time MCP": LockIn MCP (a desktop blocker) exists, and
  community MCP servers read Mac Screen Time, RescueTime and ActivityWatch. Re-check the registries monthly.
- **Entity name and description (use verbatim wherever the product is described, incl. schema and llms.txt):**
  "Respite: Screen Time Control" by Intently (short name Respite). "Respite: Screen Time Control is a free screen time
  app for Android, iPhone and Chrome by Intently. It puts a short pause before the apps and sites you pick, with
  limits, streaks and a free game layer. Respite Plus adds sync and lets you connect your own AI (Claude, ChatGPT,
  Cursor) over MCP." Firefox is not mentioned on the site yet; add it everywhere at once when the listing is public.
- iPhone app names: "by default app names stay on your iPhone; if you match an app for cross-device sync, its name
  is saved to your account". Do not write "app names never leave your iPhone".
- Former names: Intently, Pawse. Don't use them in new copy, except "formerly Intently" when a post
  targets the query "intently app".

## Competitor facts

Keep what the post already states unless you know it's wrong. Don't invent prices, ratings, user counts or
studies. If unsure, soften ("around $50/year", "at the time of writing") or remove it. Be fair: every
alternatives post says honestly where the competitor is better.

## Frontmatter, per post

- `title` ≤ 60 characters, primary query first, the year where the query has it ("2026"), no
  "| Respite" suffix. It is also the H1, so it must read naturally.
- `description` 120–155 characters, contains the primary query, promises a concrete payoff, no clickbait.
- `answer` (new): 40–70 words that directly answer the main query in plain language, in the first sentence.
  It must stand alone when quoted by Google AI Overviews / ChatGPT / Perplexity. It names Respite only when
  Respite genuinely belongs in the answer (alternatives and app-choice posts); for health/how-to posts,
  answer the question itself.
- `keyTakeaways` (new): 3–5 lines, each ≤ 110 characters, each a fact or action, not fluff.
- `faq`: 4–6 Q&As phrased the way people search ("Is…", "How do I…", "What is the best…"). Answers 40–80
  words, self-contained. These become FAQPage schema.
- `howToSteps`: only on true how-to posts; 3–7 steps.
- `updatedDate`: set to today when you change the body meaningfully. Leave `pubDate` alone.
- Quote YAML strings with single quotes and double any single quote inside ('One Sec''s').

## Body

- Keep depth. A refresh must not shrink a post: aim for 1,000–1,500 words for comparison and how-to
  posts. Replace removed filler or invented claims with real substance (who it suits, setup steps,
  day-to-day scenarios, trade-offs), never with new numbers.

- No `# ` H1 in the body; the layout renders the title.
- Open with 2–4 sentences that speak to the reader's situation; don't restate the Quick answer.
- `##` headings: prefer the question or the task the reader has ("How do I stop scrolling at night?",
  "Is One Sec free?"). Keep the post's strongest existing structure; don't churn headings for nothing.
- Short paragraphs, lists and tables where they help comparison. At least one table in comparison posts.
- Internal links: 3–6 relevant links to other posts or tools, always in the `/path/` form with a trailing
  slash (`[quiz](/quiz/)`, `[One Sec alternatives](/blog/one-sec-alternatives/)`). `npm run build` fails
  on a link without the slash or to a page that doesn't exist.
- Conversion: the layout already adds a call to action mid-article and the sidebar has one. In the body,
  mention Respite where it naturally solves the problem being discussed, with at most two links to
  `/download/`. End with a short "Getting started" or "Next step" paragraph that links `/download/` once.
- Don't touch store links (apps.apple.com, play.google.com, chromewebstore…): the site tags them at runtime.
- Keep the voice: warm, direct, a little wry, never preachy or clinical. No "In today's fast-paced world".
- Health topics (ADHD, anxiety, mental health): no diagnosis or medical claims. Point to professionals
  where appropriate. Cite only well-known findings already in the post.

## Drafts

Set `draft: true` in the frontmatter to keep a post out of production: it is not built, listed, in the RSS feed,
the sitemap or related posts (all through `getPublishedPosts()` in `src/lib/posts.ts`). `astro dev` still shows
drafts. Published posts must not link to draft posts (the link check fails). To go live: remove `draft: true`,
set `pubDate`, flip the matching entry in `src/data/changelog.ts`.

## Done means

`npm run build -w @intently/respite-site` passes (including the link check) and the post reads well.


## AI + screen time content (added 2026-11-03)

- **Hub:** `/ai/` (`src/pages/ai.astro`) owns "ai screen time (app)", "screen time mcp" and "bring your own ai". It is in
  the header nav, the footer and the features page. Every AI post links to it; keep that true for new AI posts.
  When a tool ships, flip its row in the `live` list in `ai.astro` and the `tools` table, and update llms.txt.
- **Keyword map:** `docs/ai-keyword-map.md` assigns every keyword in `docs/ai-screen-time-research.md` to exactly one
  primary URL. Check it before writing a post: if the intent matches an existing URL, extend that post (update
  the body and `updatedDate`), never create a competing page. Update the map in the same commit as any new post.
- **Competitor AI facts:** only those in `docs/competitor-facts.md` (section "AI features"), each with a source URL and
  date. Add a row there before using a new fact. Say "as far as we could find" for absences, and never imply a
  competitor "sends your data" except by quoting its own privacy label.
- **Sources on comparison posts:** posts that state competitor AI facts end with a "Sources (accessed ...)" list of
  links, above "Next step" / "Related articles".
- **Structured data:** posts get BlogPosting, BreadcrumbList, FAQPage and (with `howToSteps`) HowTo from the
  layout. `/ai/` adds SoftwareApplication (with the free and Plus offers), WebPage, BreadcrumbList and FAQPage.
  Product schema for the three apps is `components/SEO/ProductSchema.astro`; Organization is site-wide in BaseHead.
- **Crawlers:** `public/robots.txt` allows OAI-SearchBot, ChatGPT-User, PerplexityBot, ClaudeBot, Claude-SearchBot,
  Google-Extended, Bingbot and Applebot(-Extended) explicitly. `public/llms.txt` and `llms-full.txt` are concise
  site maps for AI tools (measurable effect is unproven; keep them accurate, not long). Check Cloudflare's AI bot
  blocking setting is off for this zone after deploys.
- **IndexNow (Bing, and engines that share it):** the key file is `public/<32 hex>.txt` (content = the same 32 hex).
  After a deploy, from `apps/respite`: `node scripts/indexnow.mjs --sitemap` submits URLs that are new or whose
  lastmod changed since the last run (state in `scripts/.indexnow-seen.json`; commit it afterwards), or pass URLs:
  `node scripts/indexnow.mjs https://respite.liveintently.app/ai/ ...`. Add `--dry-run` to preview. Never run it
  before the key file is live, and never on every build.
