// Install buttons go straight to the right store. In the HTML every install button links to
// /download/ (no JavaScript, crawlers, search engines); here, in the browser, the ones marked as
// install buttons are pointed at this device's store instead: Google Play on Android, the App Store on
// iPhone and iPad, the Chrome Web Store in Chrome or Edge on a computer. Anything else keeps /download/.
// The rule is in install-target.ts (tested by scripts/install-target.test.mjs).
//
// initAnalytics() (analytics.ts) runs this first, so the rewritten links then get the store's campaign
// tags and send store_click (with their `cta`) like any other store link.

import { app } from '@intently/registry';
import { CHROME_LABEL, detectDevice, isGenericLabel, STORE_FOR, type Client, type Device, type Store } from './install-target';

const { stores } = app('respite');
export const STORE_URLS: Record<Store, string | undefined> = {
	app_store: stores.appStore,
	google_play: stores.play,
	chrome_web_store: stores.chrome,
};

/** data-cta ids of buttons that install Respite (the ones to /download/). */
const INSTALL_CTAS = new Set(['download', 'article_cta', 'sticky_bar']);

type Nav = Navigator & { userAgentData?: Client['uaData'] };

/** This browser's device kind, or null (pick on /download/). */
export function myDevice(): Device | null {
	try {
		const nav = navigator as Nav;
		return detectDevice({ ua: nav.userAgent, uaData: nav.userAgentData ?? null, platform: nav.platform, maxTouchPoints: nav.maxTouchPoints });
	} catch {
		return null;
	}
}

/**
 * Point every install button at this device's store. Marks <html data-device="ios|android|chrome">
 * so styles can show what fits (the QR code to the phone is for computers only).
 */
export function rewriteInstallLinks(): Device | null {
	const device = myDevice();
	if (device) document.documentElement.dataset.device = device;
	const store = device && STORE_FOR[device];
	const href = store && STORE_URLS[store];
	if (!store || !href) return device;
	for (const a of document.querySelectorAll<HTMLAnchorElement>('a[data-cta][href="/download/"]')) {
		if (!INSTALL_CTAS.has(a.dataset.cta ?? '')) continue;
		a.href = href;
		a.dataset.store = store;
		// "Get the App" says what happens next on a computer; buttons with their own words keep them.
		if (store === 'chrome_web_store' && !a.children.length && isGenericLabel(a.textContent ?? '')) a.textContent = CHROME_LABEL;
	}
	return device;
}
