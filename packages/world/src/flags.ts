/**
 * The switch for shipping the dive dark. On the workers.dev preview hosts (and localhost) it is on; in
 * production it follows DIVE_DEFAULT, and a visitor can turn it on for themselves with ?dive=1
 * (remembered in localStorage; ?dive=0 to undo). Turning the default on is a one-line pull request
 * that needs the owner's go-ahead. The hub's Base.astro repeats this rule inline, before first paint.
 */
export const DIVE_DEFAULT = false;

const DIVE_KEY = 'intently:dive';

interface Where {
	hostname: string;
	search: string;
}

type Store = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'> | null;

export const isPreviewHost = (hostname: string): boolean => hostname.endsWith('.workers.dev') || hostname === 'localhost' || hostname === '127.0.0.1';

function read(store: Store, key: string): string | null {
	try {
		return store?.getItem(key) ?? null;
	} catch {
		return null;
	}
}

function write(store: Store, key: string, value: string | null): void {
	try {
		if (value === null) store?.removeItem(key);
		else store?.setItem(key, value);
	} catch {
		/* private mode */
	}
}

export function diveEnabled(where: Where, store: Store): boolean {
	const q = new URLSearchParams(where.search).get('dive');
	if (q === '1') write(store, DIVE_KEY, '1');
	if (q === '0') write(store, DIVE_KEY, '0');
	const saved = read(store, DIVE_KEY);
	if (saved === '1') return true;
	if (saved === '0') return false;
	return DIVE_DEFAULT || isPreviewHost(where.hostname);
}

/** The browser's own answers. */
export const browserDiveEnabled = () => diveEnabled(location, safeStorage());

function safeStorage(): Store {
	try {
		return localStorage;
	} catch {
		return null;
	}
}
