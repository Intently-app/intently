#!/usr/bin/env node
// Checks what the headless writing run produced for a week, before tests, build and the PR.
//
//   node content-pipeline/check-week.mjs --week 2026-47 [--offsite-dir <dir>] [--skip-offsite]
//
// On-site: the post exists at the brief's slug, frontmatter per docs/content-guide.md, no FAQ section in the body,
// 3+ internal links to existing posts, the hero SVG and its rendered JPG/WebP, published.yml and backlog.yml updated.
// Off-site: article.md, targets.md and pitch-email.md exist, links back carry the week's UTMs, and the article is
// not a copy of the post (8-word shingle overlap under 15%).
// Exit codes: 0 fine, 1 problems found (listed), 2 usage error.
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { BLOG_DIR, PIPELINE_DIR, SITE_DIR, parseFrontmatter, readYaml } from './lib/content.mjs';
import { frontmatterProblems, hasFaqInBody, internalBlogLinks, offsiteLinkProblems, shingleOverlap } from './lib/check.mjs';

const args = process.argv.slice(2);
const val = (name) => (args.includes(name) ? args[args.indexOf(name) + 1] : null);
const week = val('--week');
if (!week || !/^\d{4}-\d{2}$/.test(week)) {
	console.error('usage: check-week.mjs --week YYYY-WW [--offsite-dir <dir>] [--skip-offsite]');
	process.exit(2);
}
const briefFile = path.join(PIPELINE_DIR, 'weeks', `${week}.json`);
if (!existsSync(briefFile)) {
	console.error(`no brief at ${briefFile} (run plan-week.mjs first)`);
	process.exit(2);
}
const brief = JSON.parse(readFileSync(briefFile, 'utf8'));
const problems = [];
const slug = brief.onsite.slug;

// --- On-site -------------------------------------------------------------------------------------------------
const postFile = ['md', 'mdx'].map((e) => path.join(BLOG_DIR, `${slug}.${e}`)).find(existsSync);
let body = '';
if (!postFile) problems.push(`post src/content/blog/${slug}.md is missing`);
else {
	const { data, body: b } = parseFrontmatter(readFileSync(postFile, 'utf8'));
	body = b;
	problems.push(...frontmatterProblems(data, { slug, runDate: brief.run_date }));
	if (hasFaqInBody(body)) problems.push('the body has an FAQ section; FAQs go in frontmatter `faq` only');
	if (/^# /m.test(body)) problems.push('the body has a # H1; the layout renders the title');
	const links = internalBlogLinks(body).filter((s) => s !== slug);
	const missing = links.filter((s) => !['md', 'mdx'].some((e) => existsSync(path.join(BLOG_DIR, `${s}.${e}`))));
	if (missing.length) problems.push(`links to posts that do not exist: ${missing.join(', ')}`);
	if (links.length - missing.length < 3) problems.push(`only ${links.length - missing.length} internal links to existing posts (need 3+)`);
	if (!/\]\(\/download\/\)/.test(body)) problems.push('no link to /download/ (end with a short "Next step" that links it once)');
	const words = body.split(/\s+/).filter(Boolean).length;
	if (words < 800) problems.push(`body is ${words} words (aim 1,000–1,500)`);
}
for (const f of [`art/heroes/svg/${slug}.svg`, `public/images/blog/${slug}.jpg`, `public/images/blog/${slug}.webp`]) {
	if (!existsSync(path.join(SITE_DIR, f))) problems.push(`${f} is missing (create the SVG, then node scripts/render-heroes.mjs ${slug})`);
}
const svg = path.join(SITE_DIR, `art/heroes/svg/${slug}.svg`);
if (existsSync(svg) && /<text\b/.test(readFileSync(svg, 'utf8'))) problems.push('the hero SVG contains <text> (no text in heroes, STYLE.md)');

const published = readYaml('published.yml').entries ?? [];
const thisWeek = published.filter((e) => String(e.week) === week);
if (!thisWeek.some((e) => e.kind === 'onsite' && e.slug === slug)) problems.push(`published.yml has no onsite entry for ${slug} in week ${week}`);
if (brief.onsite.source === 'backlog') {
	const item = (readYaml('backlog.yml').items ?? []).find((i) => i.target_query === brief.onsite.target_query);
	if (item && item.status !== 'written') problems.push(`backlog.yml: "${item.topic}" should have status: written`);
}

// --- Off-site ------------------------------------------------------------------------------------------------
if (!args.includes('--skip-offsite') && brief.offsite) {
	const dir = val('--offsite-dir') || brief.offsite.output_dir;
	if (!thisWeek.some((e) => e.kind === 'offsite')) problems.push(`published.yml has no offsite entry for week ${week}`);
	for (const f of ['article.md', 'targets.md', 'pitch-email.md']) if (!existsSync(path.join(dir, f))) problems.push(`off-site ${path.join(dir, f)} is missing`);
	const art = path.join(dir, 'article.md');
	if (existsSync(art)) {
		const text = readFileSync(art, 'utf8');
		problems.push(...offsiteLinkProblems(text, week).map((m) => `off-site article: ${m}`));
		const overlap = shingleOverlap(text, body);
		if (overlap > 0.15) problems.push(`off-site article repeats ${Math.round(overlap * 100)}% of the on-site post word for word (keep it original)`);
	}
}

if (problems.length) {
	console.error(`check-week ${week}: ${problems.length} problem(s)`);
	for (const p of problems) console.error(`  - ${p}`);
	process.exit(1);
}
console.log(`check-week ${week}: post ${slug}, hero, logs${brief.offsite ? ' and off-site draft' : ''} look right.`);
