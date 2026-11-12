// Pure checks for check-week.mjs: does the week's writing follow docs/content-guide.md and the brief?
import { normalize, offsiteCampaign } from './text.mjs';

/** Slugs of /blog/<slug>/ links in Markdown, in order, de-duplicated. */
export function internalBlogLinks(markdown) {
	return [...new Set([...String(markdown).matchAll(/\]\(\/blog\/([a-z0-9-]+)\/(?:#[^)]*)?\)/g)].map((m) => m[1]))];
}

/** True when the body has its own FAQ section (FAQs belong in frontmatter `faq` only; the layout renders them). */
export function hasFaqInBody(body) {
	return /^#{2,4}\s*(faqs?\b|frequently asked)/im.test(String(body));
}

/** Share of `a`'s n-word shingles that also occur in `b` (0–1). Catches an off-site piece that copies the post. */
export function shingleOverlap(a, b, n = 8) {
	const words = (t) => normalize(t).split(' ').filter(Boolean);
	const shingles = (w) => {
		const s = new Set();
		for (let i = 0; i + n <= w.length; i++) s.add(w.slice(i, i + n).join(' '));
		return s;
	};
	const A = shingles(words(a));
	if (!A.size) return 0;
	const B = shingles(words(b));
	let hit = 0;
	for (const s of A) if (B.has(s)) hit++;
	return hit / A.size;
}

/** Frontmatter problems for a new post, per docs/content-guide.md. Returns a list of messages (empty = fine). */
export function frontmatterProblems(data, { slug, runDate }) {
	const p = [];
	const str = (v) => typeof v === 'string' && v.trim().length > 0;
	const words = (v) => String(v ?? '').trim().split(/\s+/).filter(Boolean).length;
	if (!str(data.title)) p.push('title is missing');
	else if (data.title.length > 60) p.push(`title is ${data.title.length} characters (max 60)`);
	if (!str(data.description)) p.push('description is missing');
	else if (data.description.length < 110 || data.description.length > 160) p.push(`description is ${data.description.length} characters (aim 120–155)`);
	const pub = data.pubDate instanceof Date ? data.pubDate.toISOString().slice(0, 10) : String(data.pubDate ?? '');
	if (pub !== runDate) p.push(`pubDate is ${pub || 'missing'}, expected the run date ${runDate}`);
	if (data.draft === true) p.push('draft: true is set (the weekly post goes live on merge)');
	if (!str(data.answer)) p.push('answer is missing');
	else if (words(data.answer) < 30 || words(data.answer) > 85) p.push(`answer is ${words(data.answer)} words (aim 40–70)`);
	const kt = data.keyTakeaways;
	if (!Array.isArray(kt) || kt.length < 3 || kt.length > 5) p.push('keyTakeaways needs 3–5 lines');
	else if (kt.some((l) => String(l).length > 120)) p.push('a keyTakeaways line is over 110 characters');
	const faq = data.faq;
	if (!Array.isArray(faq) || faq.length < 4 || faq.length > 6) p.push('faq needs 4–6 entries');
	else if (faq.some((f) => !str(f?.question) || !str(f?.answer))) p.push('every faq entry needs a question and an answer');
	if (!Array.isArray(data.tags) || data.tags.length < 3) p.push('tags needs at least 3 entries (primary query first)');
	if (data.heroImage !== `/images/blog/${slug}.jpg`) p.push(`heroImage should be '/images/blog/${slug}.jpg'`);
	if (!str(data.heroImageAlt)) p.push('heroImageAlt is missing');
	return p;
}

/** Problems in the off-site article's links: at least one tagged link back, every site link tagged correctly. */
export function offsiteLinkProblems(markdown, weekId) {
	const p = [];
	const campaign = offsiteCampaign(weekId);
	const links = [...String(markdown).matchAll(/https?:\/\/respite\.liveintently\.app[^\s)>\]"']*/g)].map((m) => m[0]);
	if (!links.length) p.push('no link back to respite.liveintently.app');
	for (const l of links) {
		const u = new URL(l);
		const src = u.searchParams.get('utm_source');
		if (u.searchParams.get('utm_medium') !== 'partner') p.push(`${l}: utm_medium must be partner`);
		if (u.searchParams.get('utm_campaign') !== campaign) p.push(`${l}: utm_campaign must be ${campaign}`);
		if (!src || !/^[a-z0-9_]+$/.test(src)) p.push(`${l}: utm_source must be the site, lowercase with underscores`);
	}
	return p;
}
