/**
 * The handoff between the hub's dive and an app site's arrival. The two are different origins
 * (liveintently.app and <app>.liveintently.app), so nothing in storage carries across: the hub adds a
 * fragment to the URL at the moment it navigates, and the app's veil script reads and strips it
 * before anything else runs. Fragments never reach a server, a cache or a log, and links in the HTML
 * never carry one, so crawlers and canonical URLs never see it. The values only steer visuals, so a
 * forged link can do no more than play an arrival.
 *
 *   #intently=v1.<app>.<chapter>.<tier>      hub → app
 *   #from=<app>.<chapter>                     app → hub (its "Intently" links, at click time)
 */
import { APPS } from '@intently/registry';

export const CHAPTER_IDS = ['time', 'attention', 'health', 'wealth', 'relationships', 'self', 'faith'] as const;
export type ChapterId = (typeof CHAPTER_IDS)[number];

/** The hour of the day each app belongs to on liveintently.app (the hub's data/chapters.ts says the same; a test checks). */
export const APP_CHAPTER: Readonly<Record<string, ChapterId>> = {
	loop: 'time',
	respite: 'attention',
	paceshift: 'health',
	hisab: 'wealth',
	twohearts: 'relationships',
	mirror: 'self',
	qandeel: 'faith',
};

/** How much of the dive the device gets (capability.ts). */
export const TIERS = ['full', 'lite', 'bridge'] as const;
export type Tier = (typeof TIERS)[number];

export interface Handoff {
	app: string;
	ch: ChapterId;
	tier: Tier;
}

export interface Return {
	app: string;
	ch: ChapterId;
}

const MAX = 64;
const APP_IDS = new Set(APPS.map((a) => a.id));
const isChapter = (s: string): s is ChapterId => (CHAPTER_IDS as readonly string[]).includes(s);
const isTier = (s: string): s is Tier => (TIERS as readonly string[]).includes(s);

export function encodeHandoff(h: Handoff): string {
	return `#intently=v1.${h.app}.${h.ch}.${h.tier}`;
}

/** The handoff in a location.hash, or null for anything else (unknown app, chapter or tier, other versions). */
export function parseHandoff(hash: string): Handoff | null {
	if (!hash || hash.length > MAX) return null;
	const m = /^#intently=v1\.([a-z]+)\.([a-z]+)\.([a-z]+)$/.exec(hash);
	if (!m) return null;
	const [, app, ch, tier] = m;
	if (!APP_IDS.has(app) || !isChapter(ch) || !isTier(tier)) return null;
	return { app, ch, tier };
}

export function encodeReturn(r: Return): string {
	return `#from=${r.app}.${r.ch}`;
}

export function parseReturn(hash: string): Return | null {
	if (!hash || hash.length > MAX) return null;
	const m = /^#from=([a-z]+)\.([a-z]+)$/.exec(hash);
	if (!m) return null;
	const [, app, ch] = m;
	if (!APP_IDS.has(app) || !isChapter(ch)) return null;
	return { app, ch };
}

/** The URL to put back with history.replaceState once a handoff or return fragment has been read. */
export function stripped(loc: { pathname: string; search: string }): string {
	return loc.pathname + loc.search;
}
