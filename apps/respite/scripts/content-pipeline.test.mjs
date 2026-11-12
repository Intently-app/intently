// Unit tests for the pure parts of the weekly content pipeline (content-pipeline/lib). Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isoWeek, jaccard, normalize, offsiteCampaign, sameTokens, slugify, tokens, utmLink } from '../content-pipeline/lib/text.mjs';
import {
	aggregatePages, aggregateQueries, classifyQueries, coverage, demandFor, freeSlug, guard, isBrandQuery, linkCandidates,
	mapPosts, pickOffsite, pickOnsite, postFingerprint, sitePath, staleOrder,
} from '../content-pipeline/lib/plan.mjs';
import { frontmatterProblems, hasFaqInBody, internalBlogLinks, offsiteLinkProblems, shingleOverlap } from '../content-pipeline/lib/check.mjs';

const posts = [
	{ slug: 'stop-tiktok-scrolling', title: 'Stop Scrolling TikTok Without Deleting: 5 Strategies', tags: ['tiktok addiction', 'stop scrolling tiktok', 'reduce tiktok usage'], pubDate: '2026-01-23' },
	{ slug: 'stop-scrolling-at-night', title: 'How to Stop Scrolling at Night: A Sleep-Saving Guide', tags: ['stop scrolling at night', 'phone addiction before bed'], pubDate: '2026-01-23' },
	{ slug: 'screen-time-for-parents', title: 'Screen Time for Parents: Age Guidelines and Family Rules', tags: ['screen time for parents', 'kids screen time'], pubDate: '2026-02-28' },
	{ slug: 'stop-youtube-binge', title: 'How to Stop YouTube Binge Watching: What Actually Works', tags: ['youtube addiction', 'stop youtube binge', 'reduce youtube usage'], pubDate: '2026-01-23' },
	{ slug: 'secret-draft', title: 'A Draft Post', tags: ['draft topic'], pubDate: '2026-11-03', draft: true },
];
const fps = posts.map(postFingerprint);

test('normalize and tokens: punctuation, stopwords, stems, synonyms', () => {
	assert.equal(normalize('One Sec’s “Best” App!'), 'one secs best app');
	assert.deepEqual([...tokens('How to stop scrolling TikTok in 2026')].sort(), ['scroll', 'stop', 'tiktok']);
	assert.ok(sameTokens('stop tiktok scrolling', 'how to stop scrolling on tiktok'));
	assert.ok(sameTokens('screen time for kids', 'children screen time'));
	assert.ok(sameTokens('iOS app blockers', 'iphone app blocker'));
	assert.ok(sameTokens('onesec alternative', 'one sec alternatives'));
});

test('jaccard', () => {
	assert.equal(jaccard('stop tiktok scrolling', 'stop scrolling tiktok'), 1);
	assert.equal(jaccard('screen time teens', 'screen time parents'), 0.5);
	assert.equal(jaccard('', ''), 0);
	assert.equal(jaccard('dopamine detox', 'tiktok'), 0);
});

test('guard rejects a near-duplicate of a slug, title or tag', () => {
	const g = guard({ topic: 'TikTok scrolling', target_query: 'how to stop scrolling tiktok' }, fps);
	assert.equal(g.ok, false);
	assert.match(g.reason, /stop-tiktok-scrolling/);
});

test('guard rejects the same primary keyword and reserved keywords', () => {
	assert.equal(guard({ target_query: 'tiktok addiction' }, fps).ok, false); // first tag of stop-tiktok-scrolling
	const reserved = [{ value: 'connect claude to screen time', owner: '/blog/connect-claude-to-screen-time/' }];
	const g = guard({ topic: 'Claude and your phone', target_query: 'connect claude to screen time' }, fps, reserved);
	assert.equal(g.ok, false);
	assert.match(g.reason, /owned by/);
});

test('guard accepts a different topic, at the threshold and below', () => {
	assert.equal(guard({ topic: 'Revenge Bedtime Procrastination', target_query: 'revenge bedtime procrastination' }, fps).ok, true);
	// {screen,time,rule,teen} vs tag {screen,time,parent}: 0.4, and vs title tokens below 0.6
	assert.equal(guard({ topic: 'Screen time rules for teens', target_query: 'screen time rules for teenagers' }, fps).ok, true);
	// guard checks drafts too
	assert.equal(guard({ target_query: 'draft topic' }, fps).ok, false);
});

test('sitePath and brand filter', () => {
	assert.equal(sitePath('https://pawse.liveintently.app/blog/x'), '/blog/x/');
	assert.equal(sitePath('https://respite.liveintently.app/blog/x/#faq'), '/blog/x/');
	assert.equal(sitePath('https://liveintently.app/'), null);
	assert.ok(isBrandQuery('intently app'));
	assert.ok(isBrandQuery('respite screen time'));
	assert.ok(!isBrandQuery('intention app before opening apps'));
});

test('aggregateQueries folds hosts and fragments, weights position by impressions, drops brand and other sites', () => {
	const rows = [
		{ keys: ['hide youtube shorts', 'https://respite.liveintently.app/blog/youtube-shorts-addiction/'], clicks: 1, impressions: 10, position: 10 },
		{ keys: ['hide youtube shorts', 'https://pawse.liveintently.app/blog/youtube-shorts-addiction/#how'], clicks: 0, impressions: 30, position: 30 },
		{ keys: ['intently', 'https://respite.liveintently.app/'], clicks: 5, impressions: 400, position: 2 },
		{ keys: ['hisab app', 'https://hisab.liveintently.app/'], clicks: 0, impressions: 50, position: 5 },
	];
	const q = aggregateQueries(rows);
	assert.equal(q.length, 1);
	assert.deepEqual(q[0], { query: 'hide youtube shorts', clicks: 1, impressions: 40, position: 25, page: '/blog/youtube-shorts-addiction/' });
	const p = aggregatePages([{ keys: ['https://respite.liveintently.app/blog/a/'], clicks: 1, impressions: 10, position: 4 }, { keys: ['https://pawse.liveintently.app/blog/a'], clicks: 1, impressions: 10, position: 8 }]);
	assert.deepEqual(p.get('/blog/a/'), { clicks: 2, impressions: 20, position: 6 });
});

test('classifyQueries: gaps vs refresh opportunities', () => {
	const queries = [
		{ query: 'stop scrolling tiktok', impressions: 20, clicks: 0, position: 12, page: '/blog/stop-tiktok-scrolling/' },
		{ query: 'how to stop watching youtube', impressions: 16, clicks: 0, position: 29, page: '/blog/stop-youtube-binge/' },
		{ query: 'revenge bedtime procrastination', impressions: 9, clicks: 0, position: 60, page: '/blog/stop-scrolling-at-night/' },
		{ query: 'dopamine detox', impressions: 4, clicks: 0, position: 15, page: '/blog/stop-tiktok-scrolling/' },
		{ query: 'zero', impressions: 0, clicks: 0, position: 15, page: '/' },
	];
	const { gaps, refresh } = classifyQueries(queries, fps);
	assert.deepEqual(gaps.map((g) => [g.query, g.striking]), [['revenge bedtime procrastination', false], ['dopamine detox', true]]);
	assert.deepEqual(refresh.map((r) => [r.query, r.owner]), [['stop scrolling tiktok', '/blog/stop-tiktok-scrolling/'], ['how to stop watching youtube', '/blog/stop-youtube-binge/']]);
});

test('demandFor sums similar gap queries and doubles striking-distance ones', () => {
	const gaps = [
		{ query: 'revenge bedtime procrastination', impressions: 9, position: 60, striking: false },
		{ query: 'bedtime procrastination', impressions: 5, position: 20, striking: true },
		{ query: 'dopamine detox', impressions: 4, position: 15, striking: true },
	];
	const d = demandFor({ topic: 'Revenge Bedtime Procrastination', target_query: 'revenge bedtime procrastination' }, gaps);
	assert.equal(d.impressions, 14);
	assert.equal(d.weighted, 19);
	assert.deepEqual(d.queries.map((q) => q.query), ['revenge bedtime procrastination', 'bedtime procrastination']);
});

const clusters = [
	{ id: 'sleep-night', label: 'Sleep', match: ['night', 'sleep'], posts: ['stop-scrolling-at-night'], offsite_angles: ['A', 'B'] },
	{ id: 'per-app', label: 'Per app', match: ['tiktok', 'youtube'], posts: [], offsite_angles: ['C'] },
	{ id: 'parents-teens', label: 'Parents', match: ['parent', 'teen'], posts: ['screen-time-for-parents'], offsite_angles: ['D'] },
	{ id: 'product', label: 'Product', rotate: false, match: [], posts: ['secret-draft'], offsite_angles: [] },
];

test('mapPosts: explicit list, then published.yml, then match words', () => {
	const m = mapPosts([...posts, { slug: 'new-post', tags: [] }], clusters, [{ kind: 'onsite', slug: 'new-post', cluster: 'parents-teens' }]);
	assert.equal(m.get('stop-scrolling-at-night'), 'sleep-night');
	assert.equal(m.get('stop-tiktok-scrolling'), 'per-app'); // by match word
	assert.equal(m.get('stop-youtube-binge'), 'per-app');
	assert.equal(m.get('new-post'), 'parents-teens');
});

test('coverage and staleOrder: least recently covered first, drafts and non-rotating clusters ignored', () => {
	const m = mapPosts(posts, clusters);
	const cov = coverage(clusters, posts, m, [{ kind: 'offsite', cluster: 'per-app', date: '2026-11-09' }]);
	const byId = Object.fromEntries(cov.map((c) => [c.cluster, c]));
	assert.equal(byId['per-app'].last_onsite, '2026-01-23');
	assert.equal(byId['per-app'].last_offsite, '2026-11-09');
	assert.equal(byId.product.last_onsite, null); // only a draft
	// sleep-night and per-app tie on 2026-01-23; sleep has fewer posts
	assert.deepEqual(staleOrder(cov).map((c) => c.cluster), ['sleep-night', 'per-app', 'parents-teens']);
	assert.deepEqual(staleOrder(cov, 'last_offsite').map((c) => c.cluster), ['sleep-night', 'parents-teens', 'per-app']);
});

test('pickOnsite: stalest cluster by default, GSC demand within the window wins', () => {
	const order = [{ cluster: 'sleep-night', last_onsite: '2026-01-01' }, { cluster: 'per-app', last_onsite: '2026-02-01' }, { cluster: 'parents-teens', last_onsite: '2026-03-01' }, { cluster: 'x', last_onsite: '2026-04-01' }];
	const e = (cluster, index, weighted = 0) => ({ item: { cluster, topic: `t${index}` }, index, demand: { impressions: weighted, weighted, queries: [] } });
	assert.equal(pickOnsite(order, [e('per-app', 0), e('sleep-night', 2), e('sleep-night', 1)]).index, 1);
	assert.equal(pickOnsite(order, [e('per-app', 0, 30), e('sleep-night', 1)]).index, 0);
	// demand outside the 3-cluster window does not count
	assert.equal(pickOnsite(order, [e('x', 0, 500), e('sleep-night', 1), e('per-app', 2), e('parents-teens', 3)]).index, 1);
	assert.equal(pickOnsite(order, []), null);
});

test('pickOffsite: a different cluster with posts to link to, unused angle', () => {
	const offOrder = [
		{ cluster: 'sleep-night', posts: ['a', 'b'] },
		{ cluster: 'per-app', posts: ['a'] },
		{ cluster: 'parents-teens', posts: ['a', 'b'] },
	];
	const byId = new Map(clusters.map((c) => [c.id, c]));
	assert.deepEqual(pickOffsite(offOrder, byId, 'sleep-night', new Set()).cluster, 'parents-teens');
	assert.equal(pickOffsite(offOrder, byId, 'per-app', new Set(['A'])).angle, 'B');
	assert.equal(pickOffsite(offOrder, byId, 'per-app', new Set(['A', 'B', 'D'])), null);
});

test('slugs, weeks and UTM links', () => {
	assert.equal(slugify('How to Stop Using Your Phone in Class (2026)'), 'how-to-stop-using-your-phone-in-class');
	assert.equal(freeSlug('dopamine detox', new Set(['dopamine-detox'])), 'dopamine-detox-2');
	assert.equal(isoWeek(new Date('2026-11-12T10:00:00Z')).id, '2026-46');
	assert.equal(isoWeek(new Date('2026-11-16T08:00:00Z')).id, '2026-47');
	assert.equal(isoWeek(new Date('2027-01-01T00:00:00Z')).id, '2026-53');
	assert.equal(offsiteCampaign('2026-47'), 'offsite_2026_47');
	assert.equal(
		utmLink('/blog/stop-scrolling-at-night/', 'dev.to', '2026-47'),
		'https://respite.liveintently.app/blog/stop-scrolling-at-night/?utm_source=dev_to&utm_medium=partner&utm_campaign=offsite_2026_47',
	);
});

test('linkCandidates prefers the same cluster and skips drafts', () => {
	const m = mapPosts(posts, clusters);
	const l = linkCandidates('scrolling in bed at night', 'sleep-night', posts, m, new Map(), 8, 3);
	assert.equal(l[0].url, '/blog/stop-scrolling-at-night/');
	assert.ok(!l.some((x) => x.url === '/blog/secret-draft/'));
});

test('check helpers: links, FAQ in body, copying, frontmatter, UTMs', () => {
	const body = 'See [a](/blog/a/), [b](/blog/b/#x), [a again](/blog/a/) and [dl](/download/).\n\n## Next step\n';
	assert.deepEqual(internalBlogLinks(body), ['a', 'b']);
	assert.ok(hasFaqInBody('text\n\n## FAQ\n\nq'));
	assert.ok(hasFaqInBody('## Frequently asked questions'));
	assert.ok(!hasFaqInBody('## How do I stop?'));
	const post = 'one two three four five six seven eight nine ten eleven twelve';
	assert.equal(shingleOverlap(post, post), 1);
	assert.equal(shingleOverlap('a b c d e f g h i j', post), 0);
	const good = {
		title: 'Revenge Bedtime Procrastination: Why You Scroll Late',
		description: 'Revenge bedtime procrastination explained: why you stay up scrolling after a long day, and five calm fixes that give you the evening back.',
		pubDate: '2026-11-16',
		answer: Array(50).fill('word').join(' '),
		keyTakeaways: ['a', 'b', 'c'],
		faq: Array(4).fill({ question: 'Q?', answer: 'A.' }),
		tags: ['revenge bedtime procrastination', 'sleep', 'scrolling'],
		heroImage: '/images/blog/revenge-bedtime-procrastination.jpg',
		heroImageAlt: 'alt',
	};
	assert.deepEqual(frontmatterProblems(good, { slug: 'revenge-bedtime-procrastination', runDate: '2026-11-16' }), []);
	const bad = frontmatterProblems({ ...good, draft: true, pubDate: '2026-11-01', faq: [] }, { slug: 'revenge-bedtime-procrastination', runDate: '2026-11-16' });
	assert.equal(bad.length, 3);
	assert.deepEqual(offsiteLinkProblems('[x](https://respite.liveintently.app/blog/a/?utm_source=medium&utm_medium=partner&utm_campaign=offsite_2026_47)', '2026-47'), []);
	assert.equal(offsiteLinkProblems('no links here', '2026-47').length, 1);
	assert.equal(offsiteLinkProblems('https://respite.liveintently.app/?utm_source=Medium&utm_medium=social&utm_campaign=x', '2026-47').length, 3);
});
