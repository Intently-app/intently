// Pure planning logic for plan-week.mjs: GSC aggregation, the cannibalisation guard, cluster coverage and the
// weekly pick. Everything takes plain data and returns plain data, so it is unit-tested without network or disk
// (scripts/content-pipeline.test.mjs).
import { jaccard, sameTokens, tokens, slugify } from './text.mjs';

export const GUARD_MAX_JACCARD = 0.6; // reject a topic above this overlap with any slug, title or tag
export const STRIKING = { min: 8, max: 40 }; // "striking distance" average positions
export const DEMAND_MATCH = 0.34; // a GSC query backs a backlog item at or above this similarity
export const STALE_WINDOW = 3;
export const RANKING_PAGE_OWNS = 0.4; // the page GSC ranks for a query owns it at or above this overlap // GSC demand may promote an item from the N least-recently-covered clusters

const SITE_HOSTS = new Set(['respite.liveintently.app', 'pawse.liveintently.app']); // pawse 301s to respite
// Brand and its misspellings (seen in GSC). Not \"intent\" itself: \"intention app\" is a real topic query.
const BRAND = /\b(respite|pawse|intently|liveintently|intentsly|intensly|itently|intencly|intentely|intentily|intentlly|intenly)\b/;

/** Canonical site path of a GSC page URL, or null when the page is not on the Respite site. */
export function sitePath(pageUrl) {
	let u;
	try { u = new URL(pageUrl); } catch { return null; }
	if (!SITE_HOSTS.has(u.host)) return null;
	let p = u.pathname.replace(/\/{2,}/g, '/');
	if (!p.endsWith('/')) p += '/';
	return p;
}

export const blogSlug = (path) => /^\/blog\/([^/]+)\/$/.exec(path ?? '')?.[1] ?? null;
export const isBrandQuery = (q) => BRAND.test(String(q).toLowerCase());

/**
 * GSC rows with dimensions [query, page] → one entry per query on the Respite site: summed clicks and impressions,
 * impression-weighted position, and the page with the most impressions. Fragments and the old host fold in.
 */
export function aggregateQueries(rows) {
	const byQuery = new Map();
	for (const r of rows ?? []) {
		const [query, page] = r.keys;
		const path = sitePath(page);
		if (!path || isBrandQuery(query)) continue;
		const q = byQuery.get(query) ?? { query, clicks: 0, impressions: 0, posX: 0, pages: new Map() };
		q.clicks += r.clicks;
		q.impressions += r.impressions;
		q.posX += r.position * r.impressions;
		q.pages.set(path, (q.pages.get(path) ?? 0) + r.impressions);
		byQuery.set(query, q);
	}
	return [...byQuery.values()]
		.map((q) => ({
			query: q.query,
			clicks: q.clicks,
			impressions: q.impressions,
			position: q.impressions ? Math.round((q.posX / q.impressions) * 10) / 10 : null,
			page: [...q.pages].sort((a, b) => b[1] - a[1])[0][0],
		}))
		.sort((a, b) => b.impressions - a.impressions || a.query.localeCompare(b.query));
}

/** GSC rows with dimensions [page] → Map(path → { clicks, impressions, position }), merged across hosts. */
export function aggregatePages(rows) {
	const out = new Map();
	for (const r of rows ?? []) {
		const path = sitePath(r.keys[0]);
		if (!path) continue;
		const p = out.get(path) ?? { clicks: 0, impressions: 0, posX: 0 };
		p.clicks += r.clicks;
		p.impressions += r.impressions;
		p.posX += r.position * r.impressions;
		out.set(path, p);
	}
	for (const [k, p] of out) out.set(k, { clicks: p.clicks, impressions: p.impressions, position: p.impressions ? Math.round((p.posX / p.impressions) * 10) / 10 : null });
	return out;
}

/**
 * The comparable fields of a post: slug, title, every tag, and its primary keywords (first tag, and the title
 * up to the first ':' or '(' — the content guide puts the primary query first in both).
 */
export function postFingerprint(post) {
	const tags = post.tags ?? [];
	const titleHead = String(post.title ?? '').split(/[:(|]/)[0];
	return {
		slug: post.slug,
		fields: [
			{ field: 'slug', value: post.slug.replace(/-/g, ' ') },
			{ field: 'title', value: post.title ?? '' },
			...tags.map((t) => ({ field: 'tag', value: t })),
		].map((f) => ({ ...f, tokens: tokens(f.value) })),
		primaries: [tags[0], titleHead].filter(Boolean).map((v) => ({ value: v, tokens: tokens(v) })),
	};
}

/**
 * Cannibalisation guard. A candidate (topic + target query) is rejected when its target query or topic overlaps
 * any existing slug, title or tag by more than GUARD_MAX_JACCARD, or has the same primary keyword as a post, a
 * keyword-map primary, or an earlier pipeline target. Returns { ok, reason, nearest }.
 *   fingerprints: postFingerprint() of every post (drafts included: they will go live)
 *   reserved: [{ value, owner }] extra primary keywords (ai-keyword-map primaries, published.yml targets)
 */
export function guard(candidate, fingerprints, reserved = []) {
	const texts = [candidate.target_query, candidate.topic].filter(Boolean).map((t) => tokens(t));
	let nearest = { score: 0, slug: null, field: null, value: null };
	for (const fp of fingerprints) {
		for (const f of fp.fields) {
			for (const t of texts) {
				const s = jaccard(t, f.tokens);
				if (s > nearest.score) nearest = { score: Math.round(s * 100) / 100, slug: fp.slug, field: f.field, value: f.value };
			}
		}
	}
	if (nearest.score > GUARD_MAX_JACCARD) {
		return { ok: false, reason: `overlaps ${nearest.field} of /blog/${nearest.slug}/ ("${nearest.value}", Jaccard ${nearest.score})`, nearest };
	}
	const q = tokens(candidate.target_query);
	for (const fp of fingerprints) {
		const hit = fp.primaries.find((p) => sameTokens(q, p.tokens));
		if (hit) return { ok: false, reason: `same primary keyword as /blog/${fp.slug}/ ("${hit.value}")`, nearest };
	}
	for (const r of reserved) {
		const rt = tokens(r.value);
		if (sameTokens(q, rt) || jaccard(q, rt) > GUARD_MAX_JACCARD) return { ok: false, reason: `keyword "${r.value}" is owned by ${r.owner}`, nearest };
	}
	return { ok: true, reason: null, nearest };
}

/**
 * Splits aggregated GSC queries into
 *   gaps:    impressions > 0 and no dedicated page (the guard would accept a new post for it), any position
 *   refresh: striking distance (position 8–40) on a page that already owns the query: improve that page instead
 */
export function classifyQueries(queries, fingerprints, reserved = []) {
	const gaps = [];
	const refresh = [];
	const bySlug = new Map(fingerprints.map((f) => [f.slug, f]));
	for (const q of queries) {
		if (!(q.impressions > 0)) continue;
		const g = guard({ target_query: q.query }, fingerprints, reserved);
		const striking = q.position != null && q.position >= STRIKING.min && q.position <= STRIKING.max;
		// The page Google already ranks for the query owns it when it is clearly about it, even below the guard's bar
		// ("how to stop watching youtube" on /blog/stop-youtube-binge/): improve that page, don't write a rival.
		const ranking = bySlug.get(blogSlug(q.page));
		const rankingOverlap = ranking ? Math.max(...ranking.fields.map((f) => jaccard(tokens(q.query), f.tokens))) : 0;
		const owned = !g.ok || rankingOverlap >= RANKING_PAGE_OWNS;
		if (!owned) gaps.push({ ...q, striking });
		else if (striking) refresh.push({ ...q, owner: !g.ok && g.nearest.slug ? `/blog/${g.nearest.slug}/` : q.page, why: g.reason ?? `ranking page overlaps the query (${Math.round(rankingOverlap * 100) / 100})` });
	}
	return { gaps, refresh };
}

/** Impressions of gap queries similar to a backlog item, with the matching queries (best first). */
export function demandFor(item, gaps) {
	const t = tokens(item.target_query);
	const topic = tokens(item.topic);
	const matches = gaps
		.map((g) => ({ g, s: Math.max(jaccard(t, tokens(g.query)), jaccard(topic, tokens(g.query))) }))
		.filter((m) => m.s >= DEMAND_MATCH)
		.sort((a, b) => b.g.impressions - a.g.impressions);
	return {
		impressions: matches.reduce((n, m) => n + m.g.impressions, 0),
		// Striking-distance demand is worth more than a query at position 70.
		weighted: matches.reduce((n, m) => n + m.g.impressions * (m.g.striking ? 2 : 1), 0),
		queries: matches.slice(0, 10).map((m) => ({ query: m.g.query, impressions: m.g.impressions, position: m.g.position, similarity: Math.round(m.s * 100) / 100 })),
	};
}

/** Best cluster for a text by token overlap with each cluster's seed queries and match words; null if none. */
export function guessCluster(text, clusters) {
	const t = tokens(text);
	let best = { id: null, score: 0 };
	for (const c of clusters) {
		const seeds = [...(c.seed_queries ?? []), ...(c.match ?? [])];
		for (const s of seeds) {
			const score = jaccard(t, tokens(s));
			if (score > best.score) best = { id: c.id, score };
		}
	}
	return best.score >= 0.25 ? best.id : null;
}

/**
 * Which cluster each post belongs to: published.yml entries first, then the explicit `posts` lists in
 * clusters.yml, then a slug/tag word match. Returns Map(slug → clusterId|null).
 */
export function mapPosts(posts, clusters, published = []) {
	const explicit = new Map();
	for (const c of clusters) for (const s of c.posts ?? []) explicit.set(s, c.id);
	for (const e of published) if (e.kind === 'onsite' && e.slug) explicit.set(e.slug, e.cluster);
	const out = new Map();
	for (const p of posts) {
		if (explicit.has(p.slug)) { out.set(p.slug, explicit.get(p.slug)); continue; }
		const words = tokens([p.slug.replace(/-/g, ' '), ...(p.tags ?? [])].join(' '));
		let best = { id: null, hits: 0 };
		for (const c of clusters) {
			const hits = (c.match ?? []).filter((m) => [...tokens(m)].every((t) => words.has(t))).length;
			if (hits > best.hits) best = { id: c.id, hits };
		}
		out.set(p.slug, best.id);
	}
	return out;
}

/**
 * Coverage per cluster: number of posts, the latest on-site date (post pubDate or published.yml) and the
 * latest off-site date. Dates are 'YYYY-MM-DD' strings or null (never covered).
 */
export function coverage(clusters, posts, postCluster, published = []) {
	const maxDate = (a, b) => (!a ? b : !b ? a : a > b ? a : b);
	const rows = new Map(clusters.map((c) => [c.id, { cluster: c.id, label: c.label, rotate: c.rotate !== false, posts: [], last_onsite: null, last_offsite: null }]));
	for (const p of posts) {
		const row = rows.get(postCluster.get(p.slug));
		if (!row) continue;
		row.posts.push(p.slug);
		if (!p.draft) row.last_onsite = maxDate(row.last_onsite, p.pubDate);
	}
	for (const e of published) {
		const row = rows.get(e.cluster);
		if (!row) continue;
		if (e.kind === 'onsite') row.last_onsite = maxDate(row.last_onsite, e.date);
		if (e.kind === 'offsite') row.last_offsite = maxDate(row.last_offsite, e.date);
	}
	return [...rows.values()];
}

/** Least recently covered first (never covered first), then fewer posts, then clusters.yml order. */
export function staleOrder(rows, key = 'last_onsite') {
	return rows
		.map((r, i) => ({ r, i }))
		.filter(({ r }) => r.rotate)
		.sort((a, b) => {
			const da = a.r[key] ?? '';
			const db = b.r[key] ?? '';
			if (da !== db) return da < db ? -1 : 1;
			if (a.r.posts.length !== b.r.posts.length) return a.r.posts.length - b.r.posts.length;
			return a.i - b.i;
		})
		.map(({ r }) => r);
}

/**
 * The on-site pick. Eligible backlog items (status 'idea', guard ok) are grouped by cluster in stale order.
 * Among the STALE_WINDOW least-recently-covered clusters that have eligible items, the item with the most
 * weighted GSC demand wins; with no demand anywhere in the window, the first item of the stalest cluster wins.
 * Returns { item, cluster, reason } or null when the backlog has nothing eligible.
 */
export function pickOnsite(order, eligible) {
	const byCluster = new Map();
	for (const e of eligible) {
		if (!byCluster.has(e.item.cluster)) byCluster.set(e.item.cluster, []);
		byCluster.get(e.item.cluster).push(e);
	}
	const window = order.filter((r) => byCluster.has(r.cluster)).slice(0, STALE_WINDOW);
	if (!window.length) return null;
	const inWindow = window.flatMap((r, rank) => byCluster.get(r.cluster).map((e) => ({ ...e, rank })));
	const backed = inWindow.filter((e) => e.demand.weighted > 0).sort((a, b) => b.demand.weighted - a.demand.weighted || a.rank - b.rank || a.index - b.index);
	if (backed.length) {
		const e = backed[0];
		const n = (k, one, many) => `${k} ${k === 1 ? one : many}`;
		return { ...e, reason: `GSC demand (${n(e.demand.impressions, 'impression', 'impressions')} in 28 days on ${n(e.demand.queries.length, 'related query', 'related queries')}) in the cluster ranked #${e.rank + 1} least recently covered` };
	}
	const first = byCluster.get(window[0].cluster).sort((a, b) => a.index - b.index)[0];
	const last = window[0].last_onsite ? `last on-site post ${window[0].last_onsite}` : 'no on-site post yet';
	return { ...first, rank: 0, reason: `least recently covered cluster (${last}); no GSC demand matched the backlog in the ${window.length} stalest clusters` };
}

/**
 * The off-site pick: a different cluster from the on-site one, least recently used off-site (never first), that
 * has at least `minPosts` posts to link back to; the first off-site angle not used before.
 */
export function pickOffsite(offOrder, clustersById, onsiteCluster, usedAngles, minPosts = 2) {
	for (const r of offOrder) {
		if (r.cluster === onsiteCluster || r.posts.length < minPosts) continue;
		const c = clustersById.get(r.cluster);
		const angle = (c.offsite_angles ?? []).find((a) => !usedAngles.has(a));
		if (!angle) continue;
		const last = r.last_offsite ? `last off-site piece ${r.last_offsite}` : 'no off-site piece yet';
		return { cluster: r.cluster, angle, reason: `least recently used off-site (${last}), different cluster from the on-site post` };
	}
	return null;
}

/** A free slug for a target query: slugified, with -2, -3 … when taken. */
export function freeSlug(text, taken) {
	const base = slugify(text) || 'post';
	let s = base;
	for (let n = 2; taken.has(s); n++) s = `${base}-${n}`;
	return s;
}

/** Hero family from the backlog intent (art/heroes/STYLE.md). */
export function heroFamily(intent) {
	return { 'how-to': 'guide', informational: 'mind', comparison: 'versus', listicle: 'versus', product: 'product' }[intent] ?? 'guide';
}

/** Posts to link to from a new post: same cluster first, then shared tokens; GSC impressions break ties. */
export function linkCandidates(topicText, cluster, posts, postCluster, pageStats, limit = 8, min = 5) {
	const t = tokens(topicText);
	return posts
		.filter((p) => !p.draft)
		.map((p) => {
			const same = postCluster.get(p.slug) === cluster ? 1 : 0;
			const sim = jaccard(t, tokens([p.title, ...(p.tags ?? [])].join(' ')));
			const imp = pageStats.get(`/blog/${p.slug}/`)?.impressions ?? 0;
			return { url: `/blog/${p.slug}/`, title: p.title, same_cluster: !!same, impressions: imp, score: same + sim * 2 };
		})
		.sort((a, b) => b.score - a.score || b.impressions - a.impressions)
		// Strong matches first; always offer at least `min` so the writer has 3+ relevant links to choose from.
		.filter((x, i) => x.score > 0.15 || (i < min && x.score > 0))
		.slice(0, limit)
		.map(({ score, ...x }) => x);
}
