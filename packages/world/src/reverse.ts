/**
 * The way back. Leaving for an app, the hub writes where it was into its own history entry; when the
 * visitor comes back (the back button, or bfcache restoring the page) it flies out of the app's colour
 * to that spot. An app site's links to Intently carry #from=<app>.<chapter> at click time, so following
 * one lands on the hour it came from (the href in the HTML stays plain).
 */
import { encodeReturn, parseReturn, type ChapterId, type Return } from './handoff.ts';
import { browserOrigin } from './hosts.ts';

export interface DiveMemory {
	app: string;
	ch: ChapterId;
	/** Scroll position and day position (u) when the visitor left. */
	y: number;
	u: number;
	/** A selector for the link that started the dive, to give focus back to. */
	focus?: string;
}

export interface Returning {
	app: string;
	ch: ChapterId;
	/** Where to put the page back, when the hub remembered it. */
	at?: { y: number; u: number; focus?: string };
}

type HistoryState = Record<string, unknown> | null;

export function rememberDive(state: HistoryState, memory: DiveMemory): Record<string, unknown> {
	return { ...(state ?? {}), dive: memory };
}

export function forgetDive(state: HistoryState): Record<string, unknown> | null {
	if (!state || !('dive' in state)) return state;
	const { dive: _, ...rest } = state;
	return rest;
}

/**
 * Whether this page view is a return from an app: the hub's own history entry says it dived (a back
 * or forward navigation, or a bfcache restore), or the URL carries #from= (a link from the app).
 */
export function readReturn(state: HistoryState, navigationType: string, restored: boolean, hash: string): Returning | null {
	const dive = state && typeof state === 'object' ? (state.dive as DiveMemory | undefined) : undefined;
	if (dive && (restored || navigationType === 'back_forward')) {
		return { app: dive.app, ch: dive.ch, at: { y: dive.y, u: dive.u, focus: dive.focus } };
	}
	const r: Return | null = parseReturn(hash);
	return r ? { app: r.app, ch: r.ch } : null;
}

/** On an app site: links to the hub's home carry #from=<app>.<chapter> when clicked. */
export function markHubLinks(root: ParentNode, appId: string, ch: ChapterId): void {
	const hub = browserOrigin('hub');
	const apex = new Set([hub, 'https://liveintently.app']);
	root.addEventListener('click', (e) => {
		const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
		if (!a) return;
		let url: URL;
		try {
			url = new URL(a.href);
		} catch {
			return;
		}
		if (!apex.has(url.origin) || (url.pathname !== '/' && url.pathname !== '') || url.hash) return;
		a.href = `${hub}/${encodeReturn({ app: appId, ch })}`;
	}, { capture: true });
}
