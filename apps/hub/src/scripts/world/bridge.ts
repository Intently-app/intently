/**
 * On a chapter page, choosing the app (its card, "Visit the … site") opens it the short way: the app's
 * colour blooms from where the visitor clicked and covers the page, then the app's own world finishes
 * the flight (the hand-over is the same as the home page's dive). Plain links everywhere else, and
 * with reduced motion, Save-Data or no WebGL2.
 */
import { app as appOf } from '@intently/registry';
import { browserDiveEnabled } from '@intently/world/flags';
import { diveTarget } from '@intently/world/links';
import { encodeHandoff, type ChapterId } from '@intently/world/handoff';
import { browserOrigin } from '@intently/world/hosts';
import { detectTier } from '@intently/world/capability';
import { speculate } from '@intently/world/speculate';
import { rememberDive } from '@intently/world/reverse';

const BLOOM_MS = 320;

export function attachBridge(ch: ChapterId): void {
	if (!browserDiveEnabled()) return;
	const target = (a: HTMLAnchorElement, e?: MouseEvent) => {
		const click = e ?? { button: 0, metaKey: false, ctrlKey: false, shiftKey: false, altKey: false, defaultPrevented: false };
		const id = diveTarget(click, a);
		const tier = detectTier();
		return id && tier !== 'instant' ? { id, url: `${browserOrigin(id)}/${encodeHandoff({ app: id, ch, tier })}` } : null;
	};
	document.addEventListener('pointerover', (e) => {
		const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
		const t = a && target(a);
		if (t) speculate(t.url);
	}, { passive: true });
	document.addEventListener('click', (e) => {
		const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
		const t = a && target(a, e);
		if (!t) return;
		e.preventDefault();
		const veil = document.createElement('div');
		veil.setAttribute('aria-hidden', 'true');
		const x = e.clientX || innerWidth / 2;
		const y = e.clientY || innerHeight / 2;
		Object.assign(veil.style, {
			position: 'fixed', inset: '0', zIndex: '2147483000', pointerEvents: 'none', background: appOf(t.id).color,
			clipPath: `circle(0px at ${x}px ${y}px)`, transition: `clip-path ${BLOOM_MS}ms cubic-bezier(.5,0,.75,0)`,
		});
		document.body.append(veil);
		requestAnimationFrame(() => requestAnimationFrame(() => { veil.style.clipPath = `circle(${Math.hypot(innerWidth, innerHeight)}px at ${x}px ${y}px)`; }));
		history.replaceState(rememberDive(history.state, { app: t.id, ch, y: scrollY, u: 0 }), '');
		setTimeout(() => location.assign(t.url), BLOOM_MS);
		// Back through the bfcache: the page comes back as it was.
		addEventListener('pageshow', () => veil.remove(), { once: true });
	});
}
