/**
 * Start loading an app's page while the visitor is still deciding, so the dive lands on a page that
 * is already there. Chromium prerenders a same-site page when its response opts in with
 * `Supports-Loading-Mode: credentialed-prerender` (each app site's public/_headers); other browsers get
 * a preconnect. One rule at a time: a new target replaces the old one.
 */
export type Eagerness = 'immediate' | 'eager' | 'moderate' | 'conservative';

export function prerenderRules(url: string, eagerness: Eagerness = 'immediate') {
	return { prerender: [{ urls: [url], eagerness }] };
}

const supportsRules = () => typeof HTMLScriptElement !== 'undefined' && 'supports' in HTMLScriptElement && HTMLScriptElement.supports('speculationrules');

let current: { url: string; el: HTMLElement } | null = null;

/** Prerender `url` (Chromium) or preconnect to its origin (elsewhere). Returns whether a prerender was asked for. */
export function speculate(url: string, eagerness: Eagerness = 'immediate'): boolean {
	if (current?.url === url) return current.el.tagName === 'SCRIPT';
	current?.el.remove();
	let el: HTMLElement;
	if (supportsRules()) {
		const s = document.createElement('script');
		s.type = 'speculationrules';
		s.textContent = JSON.stringify(prerenderRules(url, eagerness));
		el = s;
	} else {
		const l = document.createElement('link');
		l.rel = 'preconnect';
		l.href = new URL(url).origin;
		el = l;
	}
	document.head.append(el);
	current = { url, el };
	return el.tagName === 'SCRIPT';
}

export function cancelSpeculation(): void {
	current?.el.remove();
	current = null;
}
