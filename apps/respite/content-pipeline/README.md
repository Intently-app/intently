# Weekly content pipeline

Two articles a week, prepared on the owner's Mac and reviewed as a pull request:

- **1 on-site post** in `src/content/blog/`, each week for a different topic cluster and audience.
- **1 off-site article** (original, not a copy) for Medium, dev.to, Hashnode, LinkedIn or a guest-post pitch,
  linking back with `utm_source=<site>&utm_medium=partner&utm_campaign=offsite_<YYYY_WW>` (`docs/utm.md`).
  It is written outside the repo, to `~/MyLab/WellbeingApps/Respite/marketing/offsite/<YYYY-WW>/`.

The writing runs through Claude Code headless (`claude -p`) on the owner's subscription. Nothing calls the Claude
API directly and nothing uses an API key. Keyword data comes from Google Search Console only (read-only).
Nothing is ever published, posted or emailed by the pipeline. A merge to main deploys the site.

## How it works

```
launchd (Mon 09:00 local)
  └─ weekly.sh                          ~/Library/Application Support/respite-content/weekly.sh
       1. fresh detached worktree of origin/main in a temp dir, npm ci
       2. node content-pipeline/plan-week.mjs   → content-pipeline/weeks/<YYYY-WW>.json (the brief)
       3. claude -p "<WRITE_PROMPT.md>"         → post + hero SVG/JPG/WebP + off-site drafts + log updates
       4. node content-pipeline/check-week.mjs  → content-guide rules, links, hero, UTMs, no copying
       5. npm test, npm run build (link check)
       6. commit on content/<YYYY-WW>, push, gh pr create --label content
       7. remove the worktree; log in ~/Library/Logs/respite-content/
```

| File | What it is |
|---|---|
| `clusters.yml` | Topic clusters: audience, angle, seed queries, off-site angles and target sites, and the explicit cluster of every existing post |
| `backlog.yml` | Candidate on-site topics (`topic, cluster, target_query, intent, status, notes`); seeded with 25 that overlap no existing post |
| `published.yml` | What the pipeline produced (`date, week, kind, slug / url, cluster, target_query`) |
| `plan-week.mjs` | The planner (below) |
| `WRITE_PROMPT.md` | Instructions for the headless Claude run |
| `check-week.mjs` | Validates the run's output before tests and build |
| `weekly.sh` | The whole run |
| `launchd/…plist`, `install-launchd.sh`, `uninstall-launchd.sh` | The Monday job |
| `lib/` | `text.mjs` (normalising, Jaccard, weeks, UTM), `plan.mjs` (pure planning), `check.mjs`, `gsc.mjs` (token + query), `content.mjs` (reading posts and YAML) |
| `weeks/` | One brief per week, committed with that week's post |

Tests for the pure parts are in `scripts/content-pipeline.test.mjs` (run by `npm test`).

### Planning (`plan-week.mjs`)

1. Search Console, property `sc-domain:liveintently.app`, last 28 complete days (ending 3 days ago), dimensions
   query+page and page. Only Respite pages count (the old `pawse.` host folds in); brand queries are dropped.
2. Candidate queries: impressions > 0 and average position 8–40, or impressions on a query with no dedicated page.
   A query is *owned* when the cannibalisation guard rejects it or the page Google ranks for it clearly covers it;
   owned striking-distance queries become **refresh opportunities** (improve that page), the rest are **gaps**.
3. **Cannibalisation guard** (every candidate): normalise and stem, then reject when the target query or topic
   overlaps any post's slug, title or tag by Jaccard > 0.6, or has the same primary keyword as a post (first tag,
   title head), a `docs/ai-keyword-map.md` primary, or an earlier pipeline target. Drafts count.
4. **On-site pick:** rotating clusters ordered by least recently covered (newest `pubDate` in the cluster, or
   `published.yml`). Among the three stalest clusters with eligible backlog items, the item with the most GSC gap
   demand wins; with no demand there, the first item of the stalest cluster. Empty backlog → the biggest gap query.
5. **Off-site pick:** a different cluster, least recently used off-site, with at least 2 posts to link back to; its
   next unused off-site angle; UTM-tagged link targets.
6. The brief also carries the **last weeks' results** (GSC clicks, impressions, position for each on-site post in
   `published.yml`), refresh opportunities, gap queries (ideas for the backlog) and cluster coverage.

```
node content-pipeline/plan-week.mjs --dry-run          # print the plan, write nothing
node content-pipeline/plan-week.mjs --week 2026-47     # plan a given ISO week
node content-pipeline/plan-week.mjs --check-backlog    # guard result and GSC demand per backlog item
node content-pipeline/plan-week.mjs --no-gsc           # backlog order only
```

Search Console credentials: `GSC_KEY_FILE`, else `~/.config/gsc/service-account.json` (scope
`webmasters.readonly`), or `GOOGLE_ACCESS_TOKEN`. Without them the planner warns and plans from the backlog order.

## Install (once)

From a terminal where `node --version` is the nvm Node you want and `gh auth status` is logged in:

```
cd ~/MyLab/WellbeingApps/intently/apps/respite      # with this PR merged and main pulled
content-pipeline/install-launchd.sh --dry-run       # check the time, PATH and claude path
content-pipeline/install-launchd.sh                 # copy weekly.sh, install and load the agent
```

- Default Mondays 09:00 **local** time (`--at HH:MM`, `--weekday 0-7`). launchd only knows local time; a local
  time follows daylight saving by itself. `--utc HH:MM` converts a UTC time with the current offset, as the
  respite-ci jobs do, and then must be rerun after each daylight-saving change.
- Asleep at 09:00 → the job runs on wake. Shut down → the week is skipped; run it by hand.
- `--no-load` installs without loading. `content-pipeline/uninstall-launchd.sh` removes it (logs are kept).
- Rerun the installer whenever `weekly.sh` changes on main. Everything else (`plan-week.mjs`, `WRITE_PROMPT.md`,
  YAML) is read from the fresh worktree each week, so merging is enough.
- The job's `PATH` is captured from your shell; the claude binary is resolved to the real executable
  (`~/.local/bin/claude`). The interactive zsh aliases `claude` to `claude-anthropic`, which unsets
  `ANTHROPIC_AUTH_TOKEN`, `ANTHROPIC_BASE_URL` and `API_TIMEOUT_MS`; `weekly.sh` unsets the same (plus
  `ANTHROPIC_API_KEY`) so the run always uses the subscription login.

## Run by hand

```
bash ~/Library/Application\ Support/respite-content/weekly.sh               # the real thing (opens a PR)
bash …/weekly.sh --dry-run          # plan + write + checks + build, no commit/push/PR; result saved as a patch
bash …/weekly.sh --skip-write       # no Claude step (no usage): worktree, plan, test, build only
bash …/weekly.sh --week 2026-47     # a specific week
launchctl kickstart gui/$(id -u)/app.intently.respite.content   # run the installed job now
```

`CONTENT_REF=<local branch>` bases the worktree on a branch instead of origin/main (only with `--dry-run` or
`--skip-write`), to test pipeline changes before they merge. `CONTENT_CLAUDE_TIMEOUT` (seconds, default 5400)
stops a stuck write step.

Logs: `~/Library/Logs/respite-content/weekly-<week>-<time>.log` (and `content.launchd.log` for launchd itself).
A failed or dry run saves what was written as `<week>-failed.patch` / `<week>.patch` there:
`git apply ~/Library/Logs/respite-content/<week>.patch` on a fresh branch recovers it. A failure also shows a
macOS notification.

| Exit | Meaning |
|---|---|
| 0 | PR opened, or a dry / skip-write run passed |
| 2 | usage, missing tool, or another run in progress (`~/Library/Logs/respite-content/.weekly.lock`) |
| 3 | setup: fetch, worktree or npm ci |
| 4 | planning failed or nothing to plan |
| 5 | Claude step failed or timed out |
| 6 | `check-week.mjs` found problems |
| 7 | `npm test` or `npm run build` failed |
| 8 | commit, push or PR failed |
| 9 | `content/<week>` already exists on origin; nothing done |

## Reviewing the PR

The PR (label `content`, branch `content/<YYYY-WW>`, never `auto:merge`) contains the post, its hero SVG and
renders, the week's brief, and the `published.yml` / `backlog.yml` updates. Its description has the plan, the last
weeks' results and the off-site draft path.

- Read the post as a reader: does it answer the target query, sound like the other posts, and claim only what
  `docs/content-guide.md` and `docs/competitor-facts.md` allow? Any number or study not already on the site is
  a reason to edit. The FAQ is in frontmatter only.
- Look at the hero at thumbnail size (`public/images/blog/<slug>.jpg`): no text, logos or faces.
- Edit on the branch if needed (`gh pr checkout <n>`), push, then merge yourself.
- The off-site draft is in `~/MyLab/WellbeingApps/Respite/marketing/offsite/<YYYY-WW>/`: `article.md`,
  `targets.md` (where to publish, which `utm_source` to use), `pitch-email.md` (a draft; send it yourself if at all).

To skip a topic, close the PR and set its backlog item to `status: dropped` on main.

## After merge

The merge deploys the site. Then, from `apps/respite`:

1. `node scripts/indexnow.mjs --sitemap` (Bing and IndexNow engines), and commit `scripts/.indexnow-seen.json`.
2. Search Console › URL inspection › `https://respite.liveintently.app/blog/<slug>/` › Request indexing.
3. When you publish the off-site article, replace its `url: TBD` in `published.yml` with the live URL. Its traffic
   shows in GA4 under `utm_campaign = offsite_<YYYY_WW>`.

## Keeping it healthy

- Add ideas to `backlog.yml` (the brief's "Queries with no dedicated page" is a good source) and check them with
  `--check-backlog`. Mark ideas you never want as `dropped`.
- New posts written outside the pipeline: add their slug to a cluster's `posts` in `clusters.yml` (the planner warns
  about unmapped posts).
- `comparisons` and `product` are tracked for coverage but not rotated; weekly topics come from the audience clusters.
