// Pure text helpers for the content pipeline: normalising queries, slugs, titles and tags into comparable
// token sets. No I/O here; covered by scripts/content-pipeline.test.mjs.

// Words that carry no topic on their own. Domain words that DO separate topics ("screen", "time", "phone")
// stay in, so "screen time for teens" and "screen time for parents" remain different.
export const STOPWORDS = new Set([
	'a', 'an', 'the', 'to', 'of', 'for', 'in', 'on', 'and', 'or', 'how', 'what', 'why', 'when', 'which', 'who',
	'is', 'are', 'was', 'be', 'my', 'your', 'you', 'i', 'me', 'we', 'our', 'do', 'does', 'can', 'should', 'will',
	'with', 'without', 'from', 'at', 'by', 'it', 'its', 'that', 'this', 'these', 'best', 'top', 'vs', 'versus',
	'guide', 'tips', 'way', 'ways', 'really', 'actually', 'not', 'no', 'so', 'too', 'much', 'more', 'less', 'get',
	'app', 'apps', 'respite', '2024', '2025', '2026', '2027',
]);

// Spelling variants that mean the same thing in a query.
const SYNONYMS = new Map([
	['ios', 'iphone'], ['smartphone', 'phone'], ['cellphone', 'phone'], ['mobile', 'phone'],
	['x', 'twitter'], ['tweet', 'twitter'], ['insta', 'instagram'], ['ig', 'instagram'], ['yt', 'youtube'],
	['kid', 'child'], ['children', 'child'], ['teenager', 'teen'], ['teenage', 'teen'], ['adolescent', 'teen'],
	['doomscroll', 'scroll'], ['doomscrolling', 'scroll'], ['scrolling', 'scroll'],
	['addicted', 'addiction'], ['addictive', 'addiction'], ['addict', 'addiction'],
	['blocker', 'block'], ['blocking', 'block'], ['blocked', 'block'],
	['studying', 'study'], ['studies', 'study'], ['student', 'study'],
	['sleeping', 'sleep'], ['bedtime', 'bed'], ['nighttime', 'night'],
	['limits', 'limit'], ['limiting', 'limit'], ['timer', 'limit'],
	['pc', 'desktop'], ['computer', 'desktop'], ['laptop', 'desktop'],
]);

/** Light stemmer: enough to match "apps"/"app", "blockers"/"blocker", "scrolling"/"scroll". */
export function stem(word) {
	let w = word;
	if (SYNONYMS.has(w)) return SYNONYMS.get(w);
	if (w.length > 4 && w.endsWith('ies')) w = `${w.slice(0, -3)}y`;
	else if (w.length > 5 && w.endsWith('ing')) w = w.slice(0, -3);
	else if (w.length > 3 && w.endsWith('s') && !w.endsWith('ss') && !w.endsWith('us')) w = w.slice(0, -1);
	return SYNONYMS.get(w) ?? w;
}

/** Lowercase, drop punctuation and accents, collapse spaces. Slugs ("stop-tiktok-scrolling") become words. */
export function normalize(text) {
	return String(text ?? '')
		.normalize('NFKD')
		.replace(/[̀-ͯ]/g, '')
		.toLowerCase()
		.replace(/['\u2018\u2019`]/g, '')
		.replace(/[^a-z0-9]+/g, ' ')
		.replace(/\b(onesec|screentime|screenzen|doomscroll\w*)\b/g, (w) => COMPOUNDS[w] ?? w)
		.trim();
}

// Run-together spellings seen in Search Console.
const COMPOUNDS = { onesec: 'one sec', screentime: 'screen time' };

/** Topic tokens of a text: normalised, stopwords removed, stemmed, de-duplicated. */
export function tokens(text) {
	const out = new Set();
	for (const w of normalize(text).split(' ')) {
		if (!w || STOPWORDS.has(w)) continue;
		const s = stem(w);
		if (s && !STOPWORDS.has(s)) out.add(s);
	}
	return out;
}

/** Jaccard similarity of two token sets (or texts). 0 when both are empty. */
export function jaccard(a, b) {
	const A = a instanceof Set ? a : tokens(a);
	const B = b instanceof Set ? b : tokens(b);
	if (!A.size && !B.size) return 0;
	let inter = 0;
	for (const t of A) if (B.has(t)) inter++;
	return inter / (A.size + B.size - inter);
}

export function sameTokens(a, b) {
	const A = a instanceof Set ? a : tokens(a);
	const B = b instanceof Set ? b : tokens(b);
	return A.size > 0 && A.size === B.size && [...A].every((t) => B.has(t));
}

/** URL slug from a phrase: keeps the readable words (incl. "how to"), drops years and punctuation. */
export function slugify(text, maxWords = 8) {
	return normalize(text)
		.split(' ')
		.filter((w) => w && !/^20\d\d$/.test(w))
		.slice(0, maxWords)
		.join('-');
}

/** ISO 8601 week of a date, as { year, week, id: 'YYYY-WW' }. */
export function isoWeek(date = new Date()) {
	const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
	const day = d.getUTCDay() || 7;
	d.setUTCDate(d.getUTCDate() + 4 - day);
	const year = d.getUTCFullYear();
	const week = Math.ceil(((d - Date.UTC(year, 0, 1)) / 86400000 + 1) / 7);
	return { year, week, id: `${year}-${String(week).padStart(2, '0')}` };
}

export const isoDay = (d) => d.toISOString().slice(0, 10);
export const addDays = (day, n) => isoDay(new Date(Date.parse(`${day}T00:00:00Z`) + n * 86400000));

/** 'YYYY-WW' → the utm_campaign value 'offsite_YYYY_WW' (docs/utm.md: lowercase, underscores). */
export function offsiteCampaign(weekId) {
	if (!/^\d{4}-\d{2}$/.test(weekId)) throw new Error(`bad week id ${weekId} (want YYYY-WW)`);
	return `offsite_${weekId.replace('-', '_')}`;
}

/** A respite.liveintently.app URL tagged per docs/utm.md for an off-site placement. */
export function utmLink(path, site, weekId, content) {
	const url = new URL(path, 'https://respite.liveintently.app/');
	url.searchParams.set('utm_source', normalize(site).replace(/ /g, '_'));
	url.searchParams.set('utm_medium', 'partner');
	url.searchParams.set('utm_campaign', offsiteCampaign(weekId));
	if (content) url.searchParams.set('utm_content', normalize(content).replace(/ /g, '_'));
	return url.toString();
}
