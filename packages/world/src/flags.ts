/**
 * Switches for shipping the dive dark. On the workers.dev preview hosts both are on; in production
 * they follow the defaults below, and a visitor can turn one on for themselves with ?dive=1 or
 * ?engine=three (remembered in localStorage, ?dive=0 / ?engine=raw to undo). Turning a default on is a
 * one-line pull request that needs the owner's go-ahead.
 */
export const DIVE_DEFAULT = false;
export type Engine = 'raw' | 'three';
export const ENGINE_DEFAULT: Engine = 'raw';

const DIVE_KEY = 'intently:dive';
const ENGINE_KEY = 'intently:engine';

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

export function engine(where: Where, store: Store): Engine {
	const q = new URLSearchParams(where.search).get('engine');
	if (q === 'three' || q === 'raw') write(store, ENGINE_KEY, q);
	const saved = read(store, ENGINE_KEY);
	if (saved === 'three' || saved === 'raw') return saved;
	return isPreviewHost(where.hostname) ? 'three' : ENGINE_DEFAULT;
}

/** The browser's own answers. */
export const browserDiveEnabled = () => diveEnabled(location, safeStorage());
export const browserEngine = () => engine(location, safeStorage());

function safeStorage(): Store {
	try {
		return localStorage;
	} catch {
		return null;
	}
}
