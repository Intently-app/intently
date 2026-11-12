/**
 * /get: the QR codes shown on computers (blog rail, /download/) point here. A phone scanning one is
 * sent straight to its store; anything else lands on /download/ to pick.
 *
 *   /get?c=blog → Android: Google Play (referrer=utm_source%3Drespite_site%26utm_medium%3Dqr…)
 *                 iPhone/iPad: App Store (pt, ct=respite_site.qr_blog)
 *                 other: /download/
 *
 * The user agent is read for this one answer and not stored. The answer varies by device, so it is
 * never cached (Cache-Control: no-store, Vary: User-Agent).
 */
export const prerender = false;

import type { APIRoute } from 'astro';
import { app } from '@intently/registry';
import { phoneStore } from '../lib/install-target';
import { qrStoreHref } from '../lib/analytics-core';

const { stores } = app('respite');
const URLS: Record<string, string | undefined> = { app_store: stores.appStore, google_play: stores.play };

export const GET: APIRoute = ({ request, url }) => {
	const store = phoneStore(request.headers.get('user-agent') ?? '', request.headers.get('sec-ch-ua-platform'));
	const href = store ? URLS[store] : undefined;
	const location = store && href ? qrStoreHref(href, store, url.search) : new URL('/download/', url).href;
	return new Response(null, {
		status: 302,
		headers: {
			Location: location,
			'Cache-Control': 'private, no-store',
			Vary: 'User-Agent, Sec-CH-UA-Platform',
			'X-Robots-Tag': 'noindex',
		},
	});
};
