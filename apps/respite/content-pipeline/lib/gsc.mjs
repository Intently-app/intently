// Google Search Console, read-only. A minimal copy of the token approach in respite-docs metrics/lib/google.mjs
// (service-account JWT → access token), kept here so this repo does not import across repos.
//   1. GOOGLE_ACCESS_TOKEN, when set
//   2. a service-account key file: GSC_KEY_FILE, else ~/.config/gsc/service-account.json
// Scope: webmasters.readonly. Never logs or writes a token.
import { existsSync, readFileSync } from 'node:fs';
import { createSign } from 'node:crypto';
import { homedir } from 'node:os';

export const GSC_SITE = process.env.GSC_SITE || 'sc-domain:liveintently.app';
const SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly';
const b64url = (b) => Buffer.from(b).toString('base64url');
let cached;

export function keyFile(env = process.env) {
	return (env.GSC_KEY_FILE || `${homedir()}/.config/gsc/service-account.json`).replace(/^~(?=\/)/, homedir());
}

export async function gscToken({ env = process.env, fetchImpl = globalThis.fetch } = {}) {
	if (cached) return cached;
	if (env.GOOGLE_ACCESS_TOKEN) return (cached = env.GOOGLE_ACCESS_TOKEN);
	const file = keyFile(env);
	if (!existsSync(file)) throw Object.assign(new Error(`no Search Console credentials: ${file} not found (set GSC_KEY_FILE)`), { code: 'NOT_CONNECTED' });
	const key = JSON.parse(readFileSync(file, 'utf8'));
	const now = Math.floor(Date.now() / 1000);
	const head = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
	const claims = b64url(JSON.stringify({ iss: key.client_email, scope: SCOPE, aud: key.token_uri, iat: now, exp: now + 3600 }));
	const sig = createSign('RSA-SHA256').update(`${head}.${claims}`).sign(key.private_key, 'base64url');
	const res = await fetchImpl(key.token_uri, {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: `${head}.${claims}.${sig}` }),
	});
	if (!res.ok) throw new Error(`token exchange for ${key.client_email} → ${res.status}`);
	return (cached = (await res.json()).access_token);
}

/** searchAnalytics.query; pages through results 25,000 rows at a time. */
export async function searchAnalytics(body, { site = GSC_SITE, fetchImpl = globalThis.fetch, env } = {}) {
	const token = await gscToken({ env, fetchImpl });
	const rows = [];
	for (let startRow = 0; ; startRow += 25000) {
		const res = await fetchImpl(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(site)}/searchAnalytics/query`, {
			method: 'POST',
			headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
			body: JSON.stringify({ rowLimit: 25000, ...body, startRow }),
		});
		const data = await res.json().catch(() => null);
		if (!res.ok) throw new Error(`Search Console ${res.status}: ${data?.error?.message || 'error'}`);
		const page = data?.rows ?? [];
		rows.push(...page);
		if (page.length < 25000) return rows;
	}
}
