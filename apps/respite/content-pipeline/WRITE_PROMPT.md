# Weekly content run: write this week's posts

You are running headless (`claude -p`) from `weekly.sh`, inside a throwaway git worktree of the Respite website
repo, with your working directory at `apps/respite`. Nobody is watching: do the whole job, then stop. The lines
above this file give you `WEEK`, `RUN_DATE`, `BRIEF` and `OFFSITE_DIR`.

You write files only. **Never publish anything anywhere, never send email or messages, never run git, never call
an external API, and never edit files outside `apps/respite` and `OFFSITE_DIR`.** `weekly.sh` commits, opens the
pull request and the owner reviews it.

## 0. Read first (in this order)

1. The brief: `content-pipeline/weeks/<WEEK>.json` (`BRIEF`). `onsite` is the post to write, `offsite` the
   off-site article. Respect `onsite.slug`, `onsite.target_query`, `onsite.cluster`, `onsite.notes`.
2. `docs/content-guide.md`: product facts (the ONLY claims you may make about Respite), frontmatter and body rules.
3. `docs/competitor-facts.md`: the ONLY competitor facts and prices you may use, with its exact wording.
4. `docs/ai-keyword-map.md` if the cluster is `ai-screen-time` (and add the new URL's row there).
5. Two or three existing posts in the same cluster (see `onsite.internal_link_candidates`), to match voice,
   structure and the ending ("Next step" + "Related Articles").
6. `art/heroes/STYLE.md`, the recipe for `onsite.hero_family` in `art/heroes/recipes/`, two SVGs of that family in
   `art/heroes/svg/` (find them via `art/heroes/briefs.json`), and the `briefs.json` entry format.

## 1. The on-site post: `src/content/blog/<slug>.md`

- New topic for a new audience: write for `onsite.audience`, with `onsite.angle`. Win `onsite.target_query`.
- Frontmatter (single-quoted YAML strings, double any inner `'`), in the order existing posts use:
  `title` (≤ 60 chars, primary query first, also the H1), `description` (120–155 chars, has the query),
  `pubDate: <RUN_DATE>`, `author: 'Respite Team'`, `answer` (40–70 words, answers the query in the first sentence,
  stands alone), `keyTakeaways` (3–5 lines, each ≤ 110 chars), `tags` (primary query first, then 3–6 more),
  `heroImage: '/images/blog/<slug>.jpg'`, `heroImageAlt` (one plain sentence describing the image), `faq` (4–6
  Q&As phrased as people search, answers 40–80 words), and `howToSteps` (3–7) only if it is a true how-to.
  **No `draft` key** (it goes live when the PR merges). No `updatedDate`.
- **FAQ lives in frontmatter only.** No "FAQ" / "Frequently asked questions" section in the body: the layout
  renders the frontmatter FAQ and its schema.
- Body: 1,000–1,500 words. No `# ` H1. Open with 2–4 sentences about the reader's situation (don't repeat the
  answer). `##` headings phrased as the reader's questions or tasks. Short paragraphs, lists, a table where it
  helps. Warm, direct, a little wry; never preachy or clinical.
- **Facts:** product claims only from `content-guide.md`; competitor facts only from `competitor-facts.md`, with
  "at the time of writing" on prices. **Never invent statistics, studies, survey numbers, quotes, user counts or
  experts.** If a claim needs a number you do not have from those files or from a post that already states it,
  write it without the number. Health topics: no diagnosis or medical claims; point to professionals where it fits.
  A hypothetical example must be labelled as one ("Here's a hypothetical example").
- **Internal links:** at least 3 (aim 4–6) to relevant existing posts, in the `/blog/<slug>/` form with the trailing
  slash, only to files that exist in `src/content/blog/` and are not `draft: true`. `onsite.internal_link_candidates`
  is a starting list. Link `/ai/` too if the post is about AI. `npm run build` fails on a bad link.
- **CTA, as existing posts do:** mention Respite only where it genuinely solves the problem, at most two links to
  `/download/` in the body; end with `## Next step` (2–3 sentences, links `/download/` once), then a `---` and a
  `**Related Articles:**` list of 3–5 posts. Do not add store links.

## 2. The hero image

1. Write `art/heroes/svg/<slug>.svg` by hand, following STYLE.md and the family recipe exactly: `viewBox="0 0 1600 900"`,
   `width="1600" height="900"`, the shared palette, one warm accent, the grain layer last, **no text, letters,
   numbers, logos, app icons, faces or hands**, focal subject inside x 200–1400, y 90–810, 6–40 KB. Make it a real
   concept (a visual pun for `guide`, layered paper for `mind`), not clip-art.
2. Add a matching entry to `art/heroes/briefs.json` (same fields as the others: slug, title, family, draft: false,
   intent, concept, palette_note, alt, twist, avoid, build_notes). Keep the file valid JSON.
3. Run `node scripts/render-heroes.mjs <slug>` and confirm it prints `✓ <slug>`.

## 3. The off-site article: `<OFFSITE_DIR>/` (outside the repo)

An **original** piece for `offsite.target_sites` (Medium, dev.to, Hashnode, LinkedIn, or a guest-post pitch) in
`offsite.cluster` with `offsite.angle`. It is NOT a copy or rewrite of the on-site post or of any existing post:
different angle, different structure, different examples; `check-week.mjs` rejects word-for-word overlap. Same
fact rules as above. Create the directory if needed, then write:

- `article.md`: 900–1,400 words, a title line (`# ...`), written for the target site's readers (first person
  "we" from the Respite team is fine; dev.to/Hashnode pieces can be more technical). Link back to the Respite site
  2–4 times, to the pages in `offsite.link_targets` that genuinely fit, **every link tagged**:
  `https://respite.liveintently.app/<path>?utm_source=<site>&utm_medium=partner&utm_campaign=<offsite.utm_campaign>`
  where `<site>` is the primary target site, lowercase with underscores (`medium`, `dev_to`, `hashnode`,
  `linkedin`, or the blog's name). Never tag links in the on-site post.
- `targets.md`: 3–5 suggested places to publish (from `offsite.target_sites`), for each why it fits and what to
  change for it (tags, canonical URL note, length), and the `utm_source` value to swap in for that site.
- `pitch-email.md`: a short guest-post pitch (subject line + under 150 words) for the best guest-post target,
  with placeholders like `[Editor name]`. It is a draft for the owner; never send it.
- `README.md`: one paragraph: the week, the angle, the on-site post it pairs with, and "not published yet".

## 4. Logs

- `content-pipeline/published.yml`: under `entries:` (replace `entries: []` with a list the first time) append
  two entries, keeping the comment block above:
  `{date: <RUN_DATE>, week: '<WEEK>', kind: onsite, slug: <slug>, cluster: <onsite.cluster>, target_query: <onsite.target_query>}` and
  `{date: <RUN_DATE>, week: '<WEEK>', kind: offsite, url: TBD, draft_path: <OFFSITE_DIR>/article.md, cluster: <offsite.cluster>, target_query: '<offsite.angle>'}`
  written as block YAML like the commented example in the file. Quote the week (`'2026-47'`).
- `content-pipeline/backlog.yml`: if `onsite.source` is `backlog`, set that item's `status: written` (match on
  `target_query`). Leave other items alone.
- AI cluster only: add the new URL's row to `docs/ai-keyword-map.md`.

## 5. Check your work

Run, from `apps/respite`:

1. `node content-pipeline/check-week.mjs --week <WEEK>`: fix every problem it lists and run it again until it passes.
2. `npm test` and `npm run build` (the build includes the link check). Fix what fails.

Then stop. Finish with a 3–5 line summary: post title, slug, word count, hero family, off-site title.
