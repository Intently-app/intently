/**
 * /screen-time-calculator/card.png?h=4.5&age=28&first=14: the report card as a 1200×630 PNG, the
 * social preview (og:image) of a shared result page (/screen-time-calculator/r/?…).
 *
 * Drawn on request from the three numbers in the link (validated and snapped, src/lib/report-card.ts)
 * and stored nowhere but caches: the same numbers always give the same picture, so the response is
 * cached for a year, by Cloudflare's cache here and by browsers and link-preview crawlers.
 * Any other spelling of the numbers is redirected to the one canonical query, so the cache stays small.
 */
export const prerender = false;

import type { APIRoute } from 'astro';
import { cardQuery, cardSvg, parseCardParams } from '../../lib/report-card';
import { ART } from '../../lib/report-card-art';
import { svgToPng } from '../../lib/report-card-png';

const PATH = '/screen-time-calculator/card.png';
const FALLBACK = '/images/blog/what-is-digital-wellbeing.jpg';

type EdgeCache = { match(req: Request): Promise<Response | undefined>; put(req: Request, res: Response): Promise<void> };

export const GET: APIRoute = async ({ request, url, locals }) => {
	const input = parseCardParams(url.searchParams);
	if (!input) return new Response('Not found', { status: 404, headers: { 'Content-Type': 'text/plain', 'X-Robots-Tag': 'noindex' } });
	const query = cardQuery(input);
	if (url.search.slice(1) !== query) {
		return new Response(null, {
			status: 301,
			headers: { Location: `${PATH}?${query}`, 'Cache-Control': 'public, max-age=86400', 'X-Robots-Tag': 'noindex' },
		});
	}

	const cache = (globalThis as { caches?: { default?: EdgeCache } }).caches?.default;
	const hit = await cache?.match(request).catch(() => undefined);
	if (hit) return hit;

	const env = locals.runtime?.env;
	const load = (path: string) => (env?.ASSETS ? env.ASSETS.fetch(new URL(path, url)) : fetch(new URL(path, url)));
	let png: Uint8Array<ArrayBuffer>;
	try {
		png = await svgToPng(cardSvg(input, { format: 'og', theme: 'light', art: ART }), load);
	} catch (e) {
		// A preview without numbers beats a broken one; not cached, so the next request tries again.
		console.error('report card render failed', e);
		return new Response(null, { status: 302, headers: { Location: FALLBACK, 'Cache-Control': 'no-store' } });
	}
	const res = new Response(png, {
		headers: {
			'Content-Type': 'image/png',
			'Content-Length': String(png.byteLength),
			'Cache-Control': 'public, max-age=31536000, immutable',
			'X-Robots-Tag': 'noindex',
		},
	});
	if (cache) {
		const put = cache.put(request, res.clone()).catch(() => {});
		locals.runtime?.ctx?.waitUntil?.(put);
	}
	return res;
};
