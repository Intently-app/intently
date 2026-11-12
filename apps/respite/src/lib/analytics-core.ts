// Pure helpers behind src/lib/analytics.ts: no DOM, no storage, no globals, so node:test can run
// them directly (scripts/analytics.test.mjs). Keep the syntax erasable (plain annotations only),
// because Node strips the types itself when the tests import this file.
//
// The naming scheme and the event table are in docs/utm.md at the repo root. Keep the three in step.

/** App Store Connect provider token ("pt"). App Analytics › Campaigns › Generate a campaign link. */
export const APPLE_PROVIDER_TOKEN = '128440905';

/** The source and medium of a visitor who arrived with no tags and no outside referrer. */
export const SITE_SOURCE = 'respite_site';
export const SITE_MEDIUM = 'web';

export const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;
export type Utm = Partial<Record<(typeof UTM_KEYS)[number], string>>;
export type Page = { section: string; slug: string };

/** Lowercase, words joined with `_`, at most 60 characters: the docs/utm.md naming rule. */
export const clean = (s: string): string =>
	s.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '').slice(0, 60);

/** The utm_* values in a query string, cleaned. */
export function utmFromSearch(search: string): Utm {
	const params = new URLSearchParams(search);
	const out: Utm = {};
	for (const k of UTM_KEYS) {
		const v = params.get(k);
		if (v) out[k] = clean(v);
	}
	return out;
}

/** No tags: name the referring site, so organic search and links still show up. Same site → {}. */
export function utmFromReferrer(referrer: string, hostname: string): Utm {
	try {
		const ref = referrer && new URL(referrer).hostname.replace(/^www\./, '');
		if (!ref || ref === hostname) return {};
		const search = /(^|\.)(google|bing|duckduckgo|yahoo|ecosia|brave|yandex)\./.test(ref + '.');
		return { utm_source: clean(ref.split('.').slice(-2, -1)[0] || ref), utm_medium: search ? 'organic' : 'referral' };
	} catch {
		return {};
	}
}

/** The section (blog, home, tools, legal, features, …) and the page slug of a path. */
export function pageFromPath(pathname: string): Page {
	const parts = pathname.split('/').filter(Boolean);
	if (!parts.length) return { section: 'home', slug: 'home' };
	const tools = ['quiz', 'screen-time-calculator', 'app-addiction-score'];
	const legal = ['privacy', 'terms', 'delete-account'];
	const section = parts[0] === 'blog' ? 'blog' : tools.includes(parts[0]) ? 'tools' : legal.includes(parts[0]) ? 'legal' : clean(parts[0]);
	return { section, slug: clean(parts[parts.length - 1]) };
}

const STORES: Array<{ id: string; match: (u: URL) => boolean }> = [
	{ id: 'app_store', match: (u) => u.hostname === 'apps.apple.com' },
	{ id: 'google_play', match: (u) => u.hostname === 'play.google.com' && u.pathname.startsWith('/store/apps') },
	{ id: 'chrome_web_store', match: (u) => u.hostname === 'chromewebstore.google.com' || u.hostname === 'chrome.google.com' },
];

/** app_store, google_play or chrome_web_store for a store link; null for anything else. */
export function storeOf(href: string): string | null {
	try {
		const url = new URL(href);
		return STORES.find((s) => s.match(url))?.id ?? null;
	} catch {
		return null;
	}
}

/** The visitor's source and medium as every event reports them. */
export const visitor = (src: Utm) => ({ source: src.utm_source || SITE_SOURCE, medium: src.utm_medium || SITE_MEDIUM });

/** The campaign values a store link carries for this visitor, page and placement. */
export function storeUtm(src: Utm, pg: Page, where: string) {
	const v = visitor(src);
	return {
		utm_source: v.source,
		utm_medium: v.medium,
		// The visitor's own campaign wins; otherwise the site section that sent them.
		utm_campaign: src.utm_campaign || pg.section,
		utm_content: `${pg.slug}__${where}`,
	};
}

/** A store link rewritten with that store's own campaign parameters (docs/utm.md, "What the site does"). */
export function tagStoreHref(href: string, store: string, src: Utm, pg: Page, where: string, appleToken = APPLE_PROVIDER_TOKEN): string {
	const url = new URL(href);
	const utm = storeUtm(src, pg, where);
	if (store === 'google_play') {
		url.searchParams.set('referrer', new URLSearchParams(utm).toString());
	} else if (store === 'chrome_web_store') {
		for (const [k, v] of Object.entries(utm)) url.searchParams.set(k, v);
	} else if (store === 'app_store') {
		if (!appleToken) return href;
		url.searchParams.set('pt', appleToken);
		// App Store Connect's generator caps the campaign at 30 characters; source first so it survives the cut.
		url.searchParams.set('ct', `${utm.utm_source}.${pg.slug}`.slice(0, 30));
		url.searchParams.set('mt', '8');
	}
	return url.href;
}

/**
 * The store link the /get redirect (the QR codes on computers) sends a phone to. Defaults:
 * utm_source=respite_site, utm_medium=qr, utm_campaign=<?c=…, else "desktop">; any utm_* on the
 * /get link wins. utm_content is qr_<campaign>__qr, the App Store ct <source>.qr_<campaign>.
 */
export function qrStoreHref(href: string, store: string, search: string, appleToken = APPLE_PROVIDER_TOKEN): string {
	const given = utmFromSearch(search);
	const c = clean(new URLSearchParams(search).get('c') || '') || 'desktop';
	const src: Utm = { utm_source: SITE_SOURCE, utm_medium: 'qr', utm_campaign: c, ...given };
	const campaign = src.utm_campaign || c;
	return tagStoreHref(href, store, src, { section: campaign, slug: `qr_${campaign}` }, 'qr', appleToken);
}

/** store_click: a click on an App Store, Google Play or Chrome Web Store link. `cta` when the link has one. */
export function storeClickParams(store: string, src: Utm, pg: Page, where: string, cta?: string | null) {
	return {
		store,
		...(cta ? { cta: clean(cta) } : {}),
		page: pg.slug,
		section: pg.section,
		placement: where,
		...visitor(src),
	};
}

/** cta_click: a click on any element with data-cta="<id>" that isn't a store link. */
export function ctaClickParams(cta: string, src: Utm, pg: Page, where: string) {
	return { cta: clean(cta), page: pg.slug, section: pg.section, placement: where, ...visitor(src) };
}

/**
 * How something was shared. native_share: the system share sheet (articles, the app score).
 * The calculator's report card: native_image (the sheet, with the card picture), native_link (the
 * sheet, link only, where it can't take a file), download (the picture saved), copy_link, x.
 */
export type ShareMethod = 'native_share' | 'native_image' | 'native_link' | 'download' | 'copy_link' | 'x';

/** share (a GA4 recommended event): an article or a tool page shared with a share button. */
export function shareParams(method: ShareMethod, contentType: 'article' | 'tool', pg: Page) {
	return { method, content_type: contentType, item_id: pg.slug };
}

export type Tool = 'quiz' | 'calculator' | 'addiction_score';

/** share for a tool's result, named by the tool (as in tool_complete), not by the page. */
export function toolShareParams(method: ShareMethod, tool: Tool) {
	return { method, content_type: 'tool' as const, item_id: tool };
}

/** tool_complete: a tool showed its result. The band is coarse on purpose: never the raw answers. */
export function toolCompleteParams(tool: Tool, resultBand: string) {
	return { tool, result_band: clean(resultBand) };
}

/** Screen time calculator: daily hours in five wide bands (never the hours or the ages entered). */
export function calculatorBand(dailyHours: number): string {
	if (!(dailyHours >= 0)) return 'unknown';
	if (dailyHours < 2) return 'under_2h';
	if (dailyHours < 4) return '2_4h';
	if (dailyHours < 6) return '4_6h';
	if (dailyHours < 8) return '6_8h';
	return '8h_plus';
}

/** The data-cta id for a link to one of the site's conversion pages, or null for other links. */
export function ctaForHref(href: string): string | null {
	const [path, hash = ''] = href.split('#');
	const p = path.replace(/\/?$/, '/');
	if (p === '/download/') return 'download';
	if (p === '/quiz/') return 'quiz';
	if (p === '/screen-time-calculator/') return 'calculator';
	if (p === '/app-addiction-score/') return 'addiction_score';
	if (p === '/features/') return hash === 'plans' ? 'plans' : 'features';
	if (p === '/ai/') return 'ai';
	if (p === '/compare/') return 'compare';
	return null;
}
