#!/usr/bin/env node
// Plans one week of content: 1 on-site post (a new cluster/audience each week) and 1 off-site article.
//
//   node content-pipeline/plan-week.mjs                 writes content-pipeline/weeks/<YYYY-WW>.json
//   node content-pipeline/plan-week.mjs --dry-run       prints the plan, writes nothing
//   node content-pipeline/plan-week.mjs --week 2026-47  plans that ISO week (default: the current one)
//   node content-pipeline/plan-week.mjs --check-backlog prints the guard result for every backlog item
//   node content-pipeline/plan-week.mjs --no-gsc        skips Search Console (backlog order only)
//
// Search Console (read-only, last 28 complete days): candidate queries are those with impressions and an average
// position of 8–40, or with impressions and no dedicated page. A query a page already owns becomes a "refresh"
// suggestion; one no page owns is demand for a new post. Every candidate topic passes the cannibalisation guard
// (lib/plan.mjs) against all slugs, titles, tags, docs/ai-keyword-map.md and published.yml.
//
// Exit codes: 0 planned, 1 nothing eligible to plan, 2 usage error, 3 unexpected error.
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { PIPELINE_DIR, loadPosts, readYaml, keywordMapPrimaries } from './lib/content.mjs';
import { GSC_SITE, searchAnalytics } from './lib/gsc.mjs';
import { addDays, isoDay, isoWeek, offsiteCampaign, utmLink } from './lib/text.mjs';
import {
	aggregatePages, aggregateQueries, classifyQueries, coverage, demandFor, freeSlug, guard, guessCluster, heroFamily,
	linkCandidates, mapPosts, pickOffsite, pickOnsite, postFingerprint, staleOrder,
} from './lib/plan.mjs';

const GSC_LAG_DAYS = 3;
const OFFSITE_ROOT = process.env.OFFSITE_DIR || '/Users/faddy/MyLab/WellbeingApps/Respite/marketing/offsite';

function parseArgs(argv) {
	const o = { dryRun: false, week: null, checkBacklog: false, gsc: true };
	for (let i = 0; i < argv.length; i++) {
		const a = argv[i];
		if (a === '--dry-run') o.dryRun = true;
		else if (a === '--check-backlog') o.checkBacklog = true;
		else if (a === '--no-gsc') o.gsc = false;
		else if (a === '--week') o.week = argv[++i];
		else if (a.startsWith('--week=')) o.week = a.slice(7);
		else if (a === '-h' || a === '--help') o.help = true;
		else throw Object.assign(new Error(`unknown argument ${a}`), { usage: true });
	}
	if (o.week && !/^\d{4}-\d{2}$/.test(o.week)) throw Object.assign(new Error(`--week wants YYYY-WW, got ${o.week}`), { usage: true });
	return o;
}

const fmt = (n) => (n == null ? '–' : String(n));

function summaryMarkdown(b) {
	const L = [];
	L.push(`## Content plan ${b.week}`, '');
	if (b.gsc.error) L.push(`> Search Console unavailable: ${b.gsc.error}. Planned from the backlog order only.`, '');
	L.push(`**On-site:** ${b.onsite.topic}  `);
	L.push(`cluster \`${b.onsite.cluster}\` (${b.onsite.cluster_label}), target query "${b.onsite.target_query}", intent ${b.onsite.intent}, slug \`${b.onsite.slug}\`  `);
	L.push(`why: ${b.onsite.reason}`, '');
	if (b.offsite) {
		L.push(`**Off-site:** ${b.offsite.angle}  `);
		L.push(`cluster \`${b.offsite.cluster}\` (${b.offsite.cluster_label}), utm_campaign \`${b.offsite.utm_campaign}\`, sites: ${b.offsite.target_sites.join(', ')}  `);
		L.push(`why: ${b.offsite.reason}`, '');
	}
	L.push("### Last weeks' results (GSC, last 28 days)", '');
	if (!b.results.length) L.push('_No pipeline posts yet._', '');
	else {
		L.push('| Date | Kind | Post | Clicks | Impressions | Position |', '|---|---|---|---:|---:|---:|');
		for (const r of b.results) L.push(`| ${r.date} | ${r.kind} | ${r.kind === 'onsite' ? `/blog/${r.slug}/` : r.url || r.draft_path || 'TBD'} | ${fmt(r.clicks)} | ${fmt(r.impressions)} | ${fmt(r.position)} |`);
		L.push('');
	}
	if (b.refresh_opportunities.length) {
		L.push('### Refresh opportunities (striking distance on a page that owns the query)', '');
		L.push('| Query | Page | Impressions | Position |', '|---|---|---:|---:|');
		for (const r of b.refresh_opportunities.slice(0, 8)) L.push(`| ${r.query} | ${r.owner} | ${r.impressions} | ${r.position} |`);
		L.push('');
	}
	if (b.gsc_gap_queries.length) {
		L.push('### Queries with no dedicated page (backlog ideas)', '');
		L.push('| Query | Impressions | Position | Cluster guess |', '|---|---:|---:|---|');
		for (const g of b.gsc_gap_queries.slice(0, 10)) L.push(`| ${g.query} | ${g.impressions} | ${g.position} | ${g.cluster_guess ?? '–'} |`);
		L.push('');
	}
	L.push('### Cluster coverage', '', '| Cluster | Posts | Last on-site | Last off-site |', '|---|---:|---|---|');
	for (const c of b.coverage) L.push(`| ${c.cluster}${c.rotate ? '' : ' (not rotated)'} | ${c.posts} | ${c.last_onsite ?? '–'} | ${c.last_offsite ?? '–'} |`);
	return L.join('\n');
}

async function main() {
	const opts = parseArgs(process.argv.slice(2));
	if (opts.help) {
		console.log('usage: plan-week.mjs [--dry-run] [--week YYYY-WW] [--check-backlog] [--no-gsc]');
		return 0;
	}
	const today = isoDay(new Date());
	const week = opts.week ?? isoWeek(new Date()).id;

	const clusters = readYaml('clusters.yml').clusters ?? [];
	const clustersById = new Map(clusters.map((c) => [c.id, c]));
	const backlog = readYaml('backlog.yml').items ?? [];
	const published = (readYaml('published.yml').entries ?? []).map((e) => ({ ...e, date: String(e.date), week: String(e.week ?? '') }));
	const posts = loadPosts();
	const postCluster = mapPosts(posts, clusters, published);
	const fingerprints = posts.map(postFingerprint);
	const reserved = [
		...keywordMapPrimaries(),
		...published.filter((e) => e.kind === 'onsite' && e.target_query).map((e) => ({ value: e.target_query, owner: `/blog/${e.slug}/ (published.yml)` })),
	];

	for (const item of backlog) if (!clustersById.has(item.cluster)) console.error(`WARN backlog item "${item.topic}" has unknown cluster ${item.cluster}`);
	const unmapped = posts.filter((p) => !postCluster.get(p.slug)).map((p) => p.slug);
	if (unmapped.length) console.error(`WARN posts without a cluster (add them to clusters.yml): ${unmapped.join(', ')}`);

	// --- Search Console -------------------------------------------------------------------------------------
	const end = addDays(today, -GSC_LAG_DAYS);
	const start = addDays(end, -27);
	const gsc = { site: GSC_SITE, start, end, ok: false, query_rows: 0 };
	let queries = [];
	let pageStats = new Map();
	if (opts.gsc) {
		try {
			const [qp, pages] = await Promise.all([
				searchAnalytics({ startDate: start, endDate: end, dimensions: ['query', 'page'] }),
				searchAnalytics({ startDate: start, endDate: end, dimensions: ['page'] }),
			]);
			queries = aggregateQueries(qp);
			pageStats = aggregatePages(pages);
			Object.assign(gsc, { ok: true, query_rows: qp.length, queries: queries.length });
		} catch (e) {
			gsc.error = e.message;
			console.error(`WARN Search Console: ${e.message} (planning from the backlog order only)`);
		}
	} else gsc.error = 'skipped (--no-gsc)';

	const { gaps, refresh } = classifyQueries(queries, fingerprints, reserved);

	// --- Backlog through the guard ---------------------------------------------------------------------------
	const eligible = [];
	const rejected = [];
	backlog.forEach((item, index) => {
		if (item.status !== 'idea') return;
		if (!clustersById.has(item.cluster)) return rejected.push({ topic: item.topic, reason: `unknown cluster ${item.cluster}` });
		const g = guard(item, fingerprints, reserved);
		if (!g.ok) return rejected.push({ topic: item.topic, reason: g.reason });
		eligible.push({ item, index, guard: g, demand: demandFor(item, gaps) });
	});

	if (opts.checkBacklog) {
		for (const e of eligible) console.log(`ok   [${e.item.cluster}] ${e.item.target_query}  (nearest ${e.guard.nearest.slug ?? '–'} ${e.guard.nearest.score}; demand ${e.demand.impressions})`);
		for (const r of rejected) console.log(`SKIP ${r.topic}: ${r.reason}`);
		return 0;
	}

	const cov = coverage(clusters, posts, postCluster, published);
	const order = staleOrder(cov, 'last_onsite');
	let pick = pickOnsite(order, eligible);

	// No backlog item left: fall back to the biggest gap query in the stalest cluster that has one.
	if (!pick) {
		for (const r of order) {
			const g = gaps.find((q) => guessCluster(q.query, clusters) === r.cluster);
			if (!g) continue;
			const item = { topic: g.query, cluster: r.cluster, target_query: g.query, intent: 'how-to', notes: 'From GSC: no backlog item was eligible.' };
			pick = { item, index: -1, guard: guard(item, fingerprints, reserved), demand: demandFor(item, gaps), reason: 'backlog empty; biggest GSC gap query in the stalest cluster' };
			break;
		}
	}
	if (!pick) {
		console.error('Nothing to plan: no eligible backlog item and no GSC gap query. Add ideas to content-pipeline/backlog.yml.');
		return 1;
	}

	const onCluster = clustersById.get(pick.item.cluster);
	const taken = new Set([...posts.map((p) => p.slug), ...published.map((e) => e.slug).filter(Boolean)]);
	const slug = freeSlug(pick.item.target_query, taken);
	const onsite = {
		topic: pick.item.topic,
		cluster: pick.item.cluster,
		cluster_label: onCluster.label,
		audience: onCluster.audience,
		angle: onCluster.angle,
		target_query: pick.item.target_query,
		intent: pick.item.intent,
		notes: pick.item.notes ?? '',
		source: pick.index >= 0 ? 'backlog' : 'gsc',
		backlog_index: pick.index,
		slug,
		hero_family: heroFamily(pick.item.intent),
		reason: pick.reason,
		gsc_demand: pick.demand,
		guard: { nearest: pick.guard.nearest },
		internal_link_candidates: linkCandidates(`${pick.item.topic} ${pick.item.target_query}`, pick.item.cluster, posts, postCluster, pageStats),
	};

	// --- Off-site --------------------------------------------------------------------------------------------
	const usedAngles = new Set(published.filter((e) => e.kind === 'offsite').map((e) => e.target_query));
	const off = pickOffsite(staleOrder(cov, 'last_offsite'), clustersById, onsite.cluster, usedAngles);
	let offsite = null;
	if (off) {
		const c = clustersById.get(off.cluster);
		const sites = c.offsite_sites ?? [];
		const firstSite = (sites[0] ?? 'medium').split(/[ (]/)[0];
		const targets = linkCandidates(`${off.angle} ${(c.seed_queries ?? []).join(' ')}`, off.cluster, posts, postCluster, pageStats, 4);
		offsite = {
			cluster: off.cluster,
			cluster_label: c.label,
			audience: c.audience,
			angle: off.angle,
			reason: off.reason,
			target_sites: sites,
			utm_campaign: offsiteCampaign(week),
			utm_rule: `utm_source=<site, lowercase, underscores: medium | dev_to | hashnode | linkedin | <blog_name>>&utm_medium=partner&utm_campaign=${offsiteCampaign(week)}`,
			link_targets: [...targets.map((t) => ({ url: t.url, title: t.title })), { url: '/download/', title: 'Download Respite' }].map((t) => ({
				...t,
				example: utmLink(t.url, firstSite, week),
			})),
			output_dir: path.join(OFFSITE_ROOT, week),
		};
	}

	const brief = {
		week,
		run_date: today,
		generated_at: new Date().toISOString(),
		gsc,
		onsite,
		offsite,
		results: published.slice(-12).map((e) => {
			const s = e.kind === 'onsite' ? pageStats.get(`/blog/${e.slug}/`) : null;
			return { date: e.date, week: e.week, kind: e.kind, slug: e.slug ?? null, url: e.url ?? null, draft_path: e.draft_path ?? null, cluster: e.cluster, clicks: s?.clicks ?? (e.kind === 'onsite' && gsc.ok ? 0 : null), impressions: s?.impressions ?? (e.kind === 'onsite' && gsc.ok ? 0 : null), position: s?.position ?? null };
		}),
		refresh_opportunities: refresh.slice(0, 15),
		gsc_gap_queries: gaps.slice(0, 25).map((g) => ({ query: g.query, impressions: g.impressions, position: g.position, page: g.page, striking: g.striking, cluster_guess: guessCluster(g.query, clusters) })),
		coverage: cov.map((c) => ({ cluster: c.cluster, rotate: c.rotate, posts: c.posts.length, last_onsite: c.last_onsite, last_offsite: c.last_offsite })),
		rejected_backlog: rejected,
	};
	brief.summary_md = summaryMarkdown(brief);

	console.log(brief.summary_md);
	if (opts.dryRun) {
		console.log('\n(dry run: nothing written)');
		return 0;
	}
	const dir = path.join(PIPELINE_DIR, 'weeks');
	mkdirSync(dir, { recursive: true });
	const file = path.join(dir, `${week}.json`);
	writeFileSync(file, `${JSON.stringify(brief, null, '\t')}\n`);
	console.log(`\nwrote ${path.relative(process.cwd(), file)}`);
	return 0;
}

main().then(
	(code) => process.exit(code),
	(e) => {
		console.error(`plan-week: ${e.message}`);
		process.exit(e.usage ? 2 : 3);
	},
);
