// Submit URLs to IndexNow (Bing, and the search engines that share it) after a deploy.
//
//   node scripts/indexnow.mjs https://respite.liveintently.app/ai/ https://respite.liveintently.app/blog/connect-claude-to-screen-time/
//   node scripts/indexnow.mjs --file urls.txt          one URL per line
//   node scripts/indexnow.mjs --sitemap                live sitemap: submit URLs that are new or whose lastmod changed
//                                                      since the last run (state in scripts/.indexnow-seen.json)
//   node scripts/indexnow.mjs --all                    every URL in the live sitemap
//   add --dry-run to print what would be sent without sending it
//
// Run it AFTER the deploy: IndexNow fetches https://<host>/<key>.txt to verify ownership, so the key file in
// public/ must already be live. Never run it from CI on every build; it is for new and changed URLs only.
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const HOST = 'respite.liveintently.app';
const ORIGIN = `https://${HOST}`;
const ENDPOINT = 'https://api.indexnow.org/indexnow';
const publicDir = new URL('../public/', import.meta.url);
const statePath = fileURLToPath(new URL('./.indexnow-seen.json', import.meta.url));

// The key is the name of the 32-hex .txt file in public/ whose content is the same key.
const keyFile = readdirSync(publicDir).find((f) => /^[0-9a-f]{32}\.txt$/.test(f) && readFileSync(new URL(f, publicDir), 'utf8').trim() === f.slice(0, -4));
if (!keyFile) {
	console.error('No IndexNow key file found in public/ (expected <32 hex>.txt containing the same 32 hex characters).');
	process.exit(1);
}
const key = keyFile.slice(0, -4);
const keyLocation = `${ORIGIN}/${keyFile}`;

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const dryRun = flag('--dry-run');

async function fetchText(url) {
	const res = await fetch(url);
	if (!res.ok) throw new Error(`${url} -> ${res.status}`);
	return res.text();
}

// Reads <loc>/<lastmod> pairs from the live sitemap index and everything it points to.
async function readSitemap() {
	const index = await fetchText(`${ORIGIN}/sitemap-index.xml`);
	const maps = [...index.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
	const entries = new Map();
	for (const map of maps) {
		const xml = await fetchText(map);
		for (const [, block] of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
			const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1];
			if (loc) entries.set(loc, block.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1] ?? '');
		}
	}
	return entries;
}

let urls = [];
let nextState = null;
if (flag('--sitemap') || flag('--all')) {
	const entries = await readSitemap();
	const seen = existsSync(statePath) ? JSON.parse(readFileSync(statePath, 'utf8')) : {};
	urls = [...entries].filter(([loc, lastmod]) => flag('--all') || seen[loc] === undefined || seen[loc] !== lastmod).map(([loc]) => loc);
	nextState = Object.fromEntries(entries);
} else if (flag('--file')) {
	const file = args[args.indexOf('--file') + 1];
	urls = readFileSync(file, 'utf8').split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
} else {
	urls = args.filter((a) => !a.startsWith('--'));
}

urls = [...new Set(urls)];
const bad = urls.filter((u) => { try { return new URL(u).host !== HOST; } catch { return true; } });
if (bad.length) {
	console.error(`These are not ${HOST} URLs:\n${bad.join('\n')}`);
	process.exit(1);
}
if (!urls.length) {
	console.log('Nothing to submit.');
	process.exit(0);
}

console.log(`${dryRun ? 'Would submit' : 'Submitting'} ${urls.length} URL(s) with key ${key}:`);
for (const u of urls) console.log('  ' + u);
if (dryRun) process.exit(0);

// The IndexNow limit is 10,000 URLs per request; batch well below it.
for (let i = 0; i < urls.length; i += 1000) {
	const res = await fetch(ENDPOINT, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json; charset=utf-8' },
		body: JSON.stringify({ host: HOST, key, keyLocation, urlList: urls.slice(i, i + 1000) }),
	});
	// 200 = accepted, 202 = accepted and key validation pending. 403 = key not found at keyLocation, 422 = URLs do not match host.
	console.log(`batch ${i / 1000 + 1}: HTTP ${res.status} ${res.statusText}`);
	if (res.status !== 200 && res.status !== 202) {
		console.error(await res.text());
		process.exit(1);
	}
}
if (nextState) writeFileSync(statePath, JSON.stringify(nextState, null, 1) + '\n');
