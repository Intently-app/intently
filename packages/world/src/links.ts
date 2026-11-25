/**
 * Which clicks the dive may take over. Only a plain, primary click on a link to the root of an app
 * site that has an arrival world; anything that asks the browser for something else (a new tab or
 * window, a download, a modified click) is left alone.
 */
import { APPS } from '@intently/registry';

/**
 * Apps whose sites can finish the flight: Respite and Hisab with worlds of their own, the rest with
 * the shared mist (packages/ui AppLayout). An app missing here gets a plain navigation.
 */
export const ARRIVAL_APPS: ReadonlySet<string> = new Set(APPS.map((a) => a.id));

export interface ClickLike {
	button: number;
	metaKey: boolean;
	ctrlKey: boolean;
	shiftKey: boolean;
	altKey: boolean;
	defaultPrevented: boolean;
}

export interface LinkLike {
	href: string;
	target: string;
	hasAttribute(name: string): boolean;
}

const HOSTS = new Map(APPS.map((a) => [a.host, a.id]));

/** The app a click dives into, or null to let the browser handle it. */
export function diveTarget(e: ClickLike, a: LinkLike, arrival: ReadonlySet<string> = ARRIVAL_APPS): string | null {
	if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return null;
	if ((a.target && a.target !== '_self') || a.hasAttribute('download') || a.hasAttribute('data-no-dive')) return null;
	let url: URL;
	try {
		url = new URL(a.href);
	} catch {
		return null;
	}
	if (url.protocol !== 'https:' || (url.pathname !== '/' && url.pathname !== '') || url.search || url.hash) return null;
	const id = HOSTS.get(url.hostname);
	return id && arrival.has(id) ? id : null;
}
