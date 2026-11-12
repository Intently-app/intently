// Analytics for the Respite site: GA4 events and store-link attribution. Runs in the browser on
// every page (BaseHead.astro). GA4 itself (gtag, Consent Mode) is set up in BaseHead.astro; without
// it, or when a blocker removes it, every call here does nothing.
//
// 1. Inbound: the first utm_* set a visitor arrives with is kept for the session (sessionStorage),
//    so a visitor from a Reddit post who reads two posts and then installs is still credited to Reddit.
// 2. Outbound: every link to the App Store, Google Play or the Chrome Web Store gets that store's
//    own campaign parameters, so the store consoles show which source, page and button sent the install:
//      - Google Play  → &referrer=utm_source%3D…  (Play Console › Acquisition)
//      - Chrome Store → ?utm_source=…            (Developer Dashboard › Analytics › Acquisition)
//      - App Store    → ?pt=<provider>&ct=…      (App Store Connect › App Analytics › Campaigns)
// 3. Events, all sent to GA4:
//      - store_click   a click on a store link (with `cta` when the link has data-cta)
//      - cta_click     a click on any other element with data-cta="<id>"
//      - share, tool_complete, generate_lead   sent by the pages through track()
//    Clicks are caught by one delegated listener on the document, so links added later count too.
// 4. Before any of that, install buttons to /download/ are pointed at this device's store
//    (smart-install.ts), so they are tagged and counted as store links: store_click with their `cta`.
//
// The pure parts (naming, parameters, bands) are in analytics-core.ts, tested by
// scripts/analytics.test.mjs. The naming scheme and the event table are in docs/utm.md at the
// repo root. Keep them in step.

import {
	clean,
	ctaClickParams,
	pageFromPath,
	storeClickParams,
	storeOf,
	tagStoreHref,
	utmFromReferrer,
	utmFromSearch,
	type Page,
	type Utm,
} from './analytics-core';
import { rewriteInstallLinks } from './smart-install';

export { calculatorBand, shareParams, toolCompleteParams, toolShareParams } from './analytics-core';

const KEY = 'respite_utm';

/** The visitor's campaign: fresh tags win, then the tags kept for this session, then the referrer. */
export function inbound(): Utm {
	const fresh = utmFromSearch(location.search);
	try {
		if (fresh.utm_source) { sessionStorage.setItem(KEY, JSON.stringify(fresh)); return fresh; }
		const kept = sessionStorage.getItem(KEY);
		if (kept) return JSON.parse(kept);
	} catch { /* storage blocked: fall through */ }
	if (fresh.utm_source) return fresh;
	return utmFromReferrer(document.referrer, location.hostname);
}

/** blog, home, features, download, compare, tools, legal… and the page slug. */
export function page(): Page {
	return pageFromPath(location.pathname);
}

/** Where on the page an element sits: an explicit data-placement wins, then the landmark around it. */
export function placement(el: Element): string {
	const explicit = el.closest<HTMLElement>('[data-placement]')?.dataset.placement;
	if (explicit) return clean(explicit);
	if (el.closest('header, nav')) return 'nav';
	if (el.closest('footer')) return 'footer';
	if (el.closest('.hero, .article-hero, [class*="hero"]')) return 'hero';
	if (el.closest('aside')) return 'sidebar';
	if (el.closest('article, .article-body')) return 'article';
	return 'body';
}

type Gtag = (command: 'event', name: string, params: object) => void;

/** Send a GA4 event. Does nothing when GA4 isn't on the page. */
export function track(name: string, params: object = {}): void {
	try {
		(window as unknown as { gtag?: Gtag }).gtag?.('event', name, params);
	} catch { /* analytics never breaks the page */ }
}

let context: { src: Utm; pg: Page } | undefined;

function onClick(e: MouseEvent) {
	// auxclick: only the middle button (open in a new tab), not right-clicks.
	if (e.type === 'auxclick' && e.button !== 1) return;
	const target = e.target instanceof Element ? e.target : null;
	if (!target || !context) return;
	const { src, pg } = context;
	const link = target.closest<HTMLAnchorElement>('a[href]');
	const ctaEl = target.closest<HTMLElement>('[data-cta]');
	const cta = ctaEl?.dataset.cta;
	// beacon: the click usually leaves the page, so GA4 must not wait for a normal request.
	const store = link && storeOf(link.href);
	if (link && store) {
		track('store_click', { ...storeClickParams(store, src, pg, placement(link), cta), transport_type: 'beacon' });
		return;
	}
	if (ctaEl && cta) track('cta_click', { ...ctaClickParams(cta, src, pg, placement(ctaEl)), transport_type: 'beacon' });
}

export function initAnalytics() {
	if (context) return;
	// First point install buttons (/download/) at this device's store, so the loop below tags them too.
	rewriteInstallLinks();
	context = { src: inbound(), pg: page() };
	const { src, pg } = context;
	for (const a of document.querySelectorAll<HTMLAnchorElement>('a[href^="http"]')) {
		const store = storeOf(a.href);
		if (!store || a.dataset.attributed) continue;
		a.href = tagStoreHref(a.href, store, src, pg, placement(a));
		a.dataset.attributed = '1';
	}
	// Capture: a handler further down that stops the event can't hide the click from analytics.
	document.addEventListener('click', onClick, { capture: true });
	document.addEventListener('auxclick', onClick, { capture: true });
}
