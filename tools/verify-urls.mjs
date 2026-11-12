// Checks that every legacy liveintently.app URL still ends somewhere real.
// For each path in docs/legacy-urls.txt it requests HUB + path, with and without a trailing slash
// (files only as written), follows redirects (rewriting production hosts to preview hosts when
// given), and reports anything that doesn't end in a 200. Google keeps crawling both forms, and
// Cloudflare's _redirects match a source exactly, so each form needs its own rule (Nov 2026).
// It also checks the old Pawse comparison posts on pawse.liveintently.app (production only: that
// host is the redirects Worker, which answers by hostname).
//   node tools/verify-urls.mjs                       # production: https://liveintently.app
//   node tools/verify-urls.mjs --preview             # workers.dev previews before cutover
import { readFileSync } from 'node:fs';

const preview = process.argv.includes('--preview');
const HOSTS = preview
	? {
		'liveintently.app': 'intently-hub.fsadakathussain.workers.dev',
		'respite.liveintently.app': 'respite-site.fsadakathussain.workers.dev',
		'loop.liveintently.app': 'loop-site.fsadakathussain.workers.dev',
	}
	: {};
// Not pages any more, on purpose (see tools/hub-redirects.mjs): the status they must answer with.
// The contact form's endpoint only takes POST, so a crawler's GET gets 405.
const EXPECT = { '/.well-known/assetlinks.json': 404, '/api/contact': 405 };

const swap = (url) => {
	const u = new URL(url);
	if (HOSTS[u.host]) u.host = HOSTS[u.host];
	return u.toString();
};

const paths = readFileSync(new URL('../docs/legacy-urls.txt', import.meta.url), 'utf8')
	.split('\n').filter((l) => l && !l.startsWith('#')).map((l) => l.split(' ')[1]);

const isFile = (path) => /\.[a-z0-9]+$/i.test(path.split('/').pop());
/** Each path as written and, for pages, with a trailing slash too. */
const forms = (path) => (path === '/' || path.endsWith('/') || isFile(path) ? [path] : [path, `${path}/`]);

const checks = paths.flatMap((path) => forms(path).map((form) => ({
	url: `https://liveintently.app${form}`,
	expect: EXPECT[path] ?? 200,
})));
if (!preview) {
	const slugs = paths.filter((p) => p.startsWith('/blog/intently-vs-')).map((p) => p.slice('/blog/intently-vs-'.length));
	for (const slug of slugs) {
		for (const form of forms(`/blog/pawse-vs-${slug}`)) checks.push({ url: `https://pawse.liveintently.app${form}`, expect: 200 });
	}
}

let failures = 0;
for (const { url: start, expect } of checks) {
	let url = swap(start);
	const hops = [];
	let res;
	for (let i = 0; i < 6; i++) {
		res = await fetch(url, { redirect: 'manual' });
		if (res.status < 300 || res.status >= 400) break;
		url = swap(new URL(res.headers.get('location'), url).toString());
		hops.push(url);
	}
	if (res.status !== expect) {
		failures++;
		console.log(`FAIL ${res.status} (want ${expect}) ${start.replace('https://', '')} -> ${hops.join(' -> ') || '(no redirect)'}`);
	}
}
console.log(`${checks.length - failures}/${checks.length} legacy URLs OK (${paths.length} paths, with and without the trailing slash)${preview ? ' (preview hosts)' : ''}`);
process.exit(failures ? 1 : 0);
