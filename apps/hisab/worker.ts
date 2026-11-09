/**
 * The site's only server code: the waitlist form. Everything else is static assets, and this Worker runs only for
 * /api/* (run_worker_first in wrangler.json).
 *
 * One KV key per address, with the date and the page it was sent from in the key's metadata, so the whole list comes
 * back from one `wrangler kv key list`. No IP address is stored, and an address is never logged.
 */
interface Env {
	ASSETS: { fetch(request: Request): Promise<Response> };
	WAITLIST: {
		get(key: string): Promise<string | null>;
		put(key: string, value: string, options: { metadata: { at: string; from: string } }): Promise<void>;
	};
	WAITLIST_LIMIT: { limit(options: { key: string }): Promise<{ success: boolean }> };
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PAGE = /^\/[a-z0-9\-/]{0,120}$/;
const MAX_BODY = 2048;

type Refusal = 'email' | 'limit' | 'origin' | 'body';

const MESSAGES: Record<Refusal, { status: number; text: string }> = {
	email: { status: 400, text: "That email address doesn't look right. Check it and try again." },
	limit: { status: 429, text: 'Too many tries from this connection. Wait a minute and try again.' },
	origin: { status: 403, text: 'This form only works from the Hisab site.' },
	body: { status: 400, text: "That form couldn't be read. Reload the page and try again." },
};

function sameOrigin(request: Request, url: URL): boolean {
	const origin = request.headers.get('Origin');
	if (origin === null) return true; // not a browser form post, and it still has to pass everything else
	try {
		return new URL(origin).host === url.host;
	} catch {
		return false;
	}
}

async function readFields(request: Request): Promise<{ email: string; from: string; website: string } | null> {
	if (Number(request.headers.get('Content-Length') ?? 0) > MAX_BODY) return null;
	try {
		const form = await request.formData();
		const text = (name: string) => {
			const value = form.get(name);
			return typeof value === 'string' ? value.trim() : '';
		};
		return { email: text('email').toLowerCase(), from: text('from'), website: text('website') };
	} catch {
		return null;
	}
}

async function join(request: Request, env: Env, url: URL): Promise<Refusal | null> {
	if (!sameOrigin(request, url)) return 'origin';
	const { success } = await env.WAITLIST_LIMIT.limit({ key: request.headers.get('CF-Connecting-IP') ?? 'unknown' });
	if (!success) return 'limit';
	const fields = await readFields(request);
	if (!fields) return 'body';
	// A bot filled the hidden field. It gets the same answer as everyone else and nothing is stored.
	if (fields.website !== '') return null;
	if (fields.email.length > 254 || !EMAIL.test(fields.email)) return 'email';
	const key = `email:${fields.email}`;
	// Joining twice keeps the first date, and looks the same as joining once.
	if ((await env.WAITLIST.get(key)) === null) {
		const metadata = { at: new Date().toISOString().slice(0, 10), from: PAGE.test(fields.from) ? fields.from : '/' };
		await env.WAITLIST.put(key, '1', { metadata });
	}
	return null;
}

const NO_STORE = { 'Cache-Control': 'no-store' };

function answer(refusal: Refusal | null, wantsJson: boolean, url: URL): Response {
	const failure = refusal ? MESSAGES[refusal] : null;
	if (wantsJson) {
		return new Response(JSON.stringify(failure ? { ok: false, error: failure.text } : { ok: true }), {
			status: failure?.status ?? 200,
			headers: { 'Content-Type': 'application/json', ...NO_STORE },
		});
	}
	// Without JavaScript the form posts normally, so it gets a page back.
	if (!failure) return new Response(null, { status: 303, headers: { Location: new URL('/joined/', url).href, ...NO_STORE } });
	return new Response(`<!doctype html><meta charset="utf-8"><title>Hisab</title><p>${failure.text}</p><p><a href="/">Back to Hisab</a></p>`, {
		status: failure.status,
		headers: { 'Content-Type': 'text/html; charset=utf-8', ...NO_STORE },
	});
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url);
		if (url.pathname !== '/api/waitlist') return env.ASSETS.fetch(request);
		if (request.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: { Allow: 'POST', ...NO_STORE } });
		const wantsJson = (request.headers.get('Accept') ?? '').includes('application/json');
		return answer(await join(request, env, url), wantsJson, url);
	},
};
