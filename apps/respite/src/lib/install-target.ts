// Which store a visitor's device installs Respite from. Pure: no DOM, no globals, so node:test runs it
// directly (scripts/install-target.test.mjs). Keep the syntax erasable (plain annotations only),
// because Node strips the types itself when the tests import this file.
//
// Used in the browser by smart-install.ts (install buttons go straight to the right store) and the
// /download/ page, and on the server by /get (the QR code's redirect).
//
//   iPhone, iPad, iPod (and iPadOS, which reports a Mac)  → App Store
//   Android                                               → Google Play
//   Chrome or Edge on a computer (Windows, Mac, Linux, ChromeOS) → Chrome Web Store
//   anything else (Firefox, Safari on a Mac, bots, unknown) → null: keep /download/

export type Device = 'ios' | 'android' | 'chrome';
export type Store = 'app_store' | 'google_play' | 'chrome_web_store';

/** navigator.userAgentData, the parts used here. Safari and Firefox don't have it. */
export interface UAData {
	mobile?: boolean;
	platform?: string;
	brands?: { brand: string }[];
}

export interface Client {
	ua: string;
	uaData?: UAData | null;
	/** navigator.platform ("MacIntel" on iPadOS in desktop mode). */
	platform?: string;
	maxTouchPoints?: number;
}

/** Crawlers, link previews and headless browsers: they get /download/, never a store. */
const BOT =
	/bot\/|\bbot\b|bot;|crawl|spider|slurp|headless|lighthouse|facebookexternalhit|embedly|preview|chatgpt-user|claude-user|perplexity|\+https?:/i;

export function isBot(ua: string): boolean {
	return !ua || BOT.test(ua);
}

/** The device kind, or null when the visitor should pick on /download/. */
export function detectDevice(c: Client): Device | null {
	const ua = c.ua || '';
	if (isBot(ua)) return null;
	const touchMac = (/Macintosh/.test(ua) || c.platform === 'MacIntel') && (c.maxTouchPoints ?? 0) > 1;
	if (/iPhone|iPad|iPod/.test(ua) || touchMac) return 'ios';
	// userAgentData first where the browser has it (Chromium); the UA string otherwise.
	if (c.uaData?.platform === 'Android' || /Android/i.test(ua)) return 'android';
	const mobile = c.uaData?.mobile ?? /Mobi|Tablet|Silk|Kindle/i.test(ua);
	if (mobile) return null;
	// Chrome and Edge only: Opera, Samsung Internet, Yandex and UC need extra steps for Web Store extensions.
	if (!/(Chrome|Chromium)\/\d|Edg\/\d/.test(ua) || /OPR\/|Opera|SamsungBrowser|YaBrowser|UCBrowser|Firefox/.test(ua)) return null;
	const brands = c.uaData?.brands ?? [];
	if (brands.length) {
		const names = brands.map((b) => b.brand).join('|');
		if (!/Google Chrome|Microsoft Edge|Chromium/.test(names) || /Opera/.test(names)) return null;
	}
	return 'chrome';
}

export const STORE_FOR: Record<Device, Store> = { ios: 'app_store', android: 'google_play', chrome: 'chrome_web_store' };

/** The store for a client, or null for /download/. */
export function installStore(c: Client): Store | null {
	const d = detectDevice(c);
	return d ? STORE_FOR[d] : null;
}

/**
 * The server's view (the /get redirect): phones only. A computer, Chrome or not, gets /download/,
 * because the QR code is for the phone. `chPlatform` is the Sec-CH-UA-Platform header ("Android"),
 * which Chrome on Android sends even when the UA string is reduced.
 */
export function phoneStore(ua: string, chPlatform?: string | null): Store | null {
	const platform = (chPlatform ?? '').replace(/"/g, '') || undefined;
	const d = detectDevice({ ua, uaData: platform ? { platform } : null });
	return d === 'ios' || d === 'android' ? STORE_FOR[d] : null;
}

/** Button text that only says "get it", so it can name the store on a computer. */
const GENERIC = /^(get (the app|respite( free)?)|download( respite)?( free)?)$/i;

export function isGenericLabel(text: string): boolean {
	return GENERIC.test(text.replace(/\s+/g, ' ').trim());
}

export const CHROME_LABEL = 'Add to Chrome — free';
