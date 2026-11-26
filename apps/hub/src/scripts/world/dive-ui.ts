/**
 * The dive on the home page: which link starts it, the flight frame by frame, handing over to the
 * app's site, and the way back. boot.ts owns the world and asks this for each frame's dive (if any).
 *
 * Links stay plain <a href="https://<app>.liveintently.app"> in the HTML; only a plain click on one,
 * with the dive switched on (packages/world flags.ts) and a device that can draw it, is taken over.
 * Everything else is the browser's.
 */
import { app as appOf } from '@intently/registry';
import { browserDiveEnabled } from '@intently/world/flags';
import { diveTarget } from '@intently/world/links';
import { encodeHandoff, type ChapterId, type Tier } from '@intently/world/handoff';
import { browserOrigin } from '@intently/world/hosts';
import { detectTier } from '@intently/world/capability';
import { speculate, cancelSpeculation } from '@intently/world/speculate';
import { diveTiming, RETURN_MS } from '@intently/world/timing';
import { forgetDive, readReturn, rememberDive, type Returning } from '@intently/world/reverse';
import { CHAPTERS } from '../../data/chapters.ts';
import { SCENES } from '../../world/scenes.ts';
import { hexToRgb } from '../lib/color.ts';
import { diveAt, focusOf, returnAt, type DivePlan } from './dive.ts';
import type { DiveDraw } from './renderer.ts';
import type { Frame } from './timeline.ts';

const sceneIndex = (ch: ChapterId) => SCENES.findIndex((s) => s.id === ch);

/** Tests slow the flights down (window.__intentlyDiveSlowmo = 6) to watch them in a software-rendered browser. */
const slowmo = () => Math.max(1, (window as Window & { __intentlyDiveSlowmo?: number }).__intentlyDiveSlowmo ?? 1);
const clock = () => performance.now() / slowmo();
const chapterOfApp = (id: string): ChapterId | undefined => CHAPTERS.find((c) => c.apps.some((a) => a.id === id))?.id;

interface Flight {
	kind: 'dive' | 'return';
	app: string;
	ch: ChapterId;
	tier: Tier;
	t0: number;
	/** The hour the flight happens at, when it isn't where the visitor has scrolled to. */
	u: number | null;
	plan: DivePlan | null;
	url?: string;
	link?: HTMLAnchorElement;
	focus?: string;
	navigated?: boolean;
}

export interface DiveHooks {
	/** The day position the visitor is at. */
	u(): number;
	/** Hand the page over to the flight (stop scrolling, fade the words) or give it back. */
	begin(): void;
	end(): void;
	/** Put the page back where it was (a return). */
	restore(y: number): void;
	/** Scroll position (page y) of a chapter's scene centre. */
	sceneY(ch: ChapterId): number | null;
	/** Whether the hub's frames have been slow (budget.ts lowered or gave up). */
	slow(): boolean;
}

export class DiveDirector {
	private flight: Flight | null = null;
	private live: HTMLElement;
	private dwell = 0;

	constructor(private hooks: DiveHooks) {
		this.live = document.createElement('p');
		this.live.className = 'visually-hidden';
		this.live.setAttribute('aria-live', 'polite');
		document.body.append(this.live);
	}

	get active(): boolean {
		return !!this.flight;
	}

	/** The hour to draw, when the flight isn't at the scroll position. */
	get u(): number | null {
		return this.flight?.u ?? null;
	}

	attach(): void {
		if (!browserDiveEnabled()) return;
		document.addEventListener('click', (e) => this.onClick(e));
		// Start loading the app's page while the visitor is about to choose it.
		const intent = (e: Event) => {
			const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
			if (!a) return;
			clearTimeout(this.dwell);
			this.dwell = window.setTimeout(() => this.prepare(a), e.type === 'pointerover' ? 80 : 0);
		};
		document.addEventListener('pointerover', intent, { passive: true });
		document.addEventListener('focusin', intent);
		document.addEventListener('touchstart', intent, { passive: true });
		addEventListener('keydown', (e) => this.onKey(e), { capture: true });
		addEventListener('pointerdown', () => this.skip(), { capture: true, passive: true });
		addEventListener('wheel', () => this.skip(), { capture: true, passive: true });
		// Coming back through the bfcache: this page still holds the app's colour.
		addEventListener('pageshow', (e) => {
			if (!e.persisted) return;
			const r = readReturn(history.state, 'back_forward', true, '');
			if (r) this.back(r);
		});
	}

	/** The tier for a dive now, or null when the browser should simply navigate. */
	private tier(): Tier | null {
		const t = detectTier(this.hooks.slow());
		return t === 'instant' ? null : t;
	}

	private chapterOf(a: HTMLAnchorElement, appId: string): ChapterId | undefined {
		const m = a.closest<HTMLElement>('[data-moment]')?.dataset.moment as ChapterId | undefined;
		return m ?? chapterOfApp(appId);
	}

	private urlFor(appId: string, ch: ChapterId, tier: Tier): string {
		return `${browserOrigin(appId)}/${encodeHandoff({ app: appId, ch, tier })}`;
	}

	private prepare(a: HTMLAnchorElement): void {
		const fake = { button: 0, metaKey: false, ctrlKey: false, shiftKey: false, altKey: false, defaultPrevented: false };
		const appId = diveTarget(fake, a);
		const tier = appId && this.tier();
		const ch = appId && this.chapterOf(a, appId);
		if (!appId || !tier || !ch || tier === 'bridge') return;
		speculate(this.urlFor(appId, ch, tier));
	}

	private onClick(e: MouseEvent): void {
		const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
		if (!a || this.flight) return;
		const appId = diveTarget(e, a);
		const tier = appId && this.tier();
		const ch = appId && this.chapterOf(a, appId);
		if (!appId || !tier || !ch) return;
		e.preventDefault();
		const idx = sceneIndex(ch);
		const here = Math.abs(this.hooks.u() - idx) < 0.45;
		const where = a.closest<HTMLElement>('[data-moment]') ? `[data-moment="${ch}"]` : '.family-wrap';
		this.flight = {
			kind: 'dive', app: appId, ch, tier, t0: clock(), u: here ? null : idx, plan: null,
			url: this.urlFor(appId, ch, tier), link: a, focus: `${where} a[href^="https://${appOf(appId).host}"]`,
		};
		this.live.textContent = `Opening ${appOf(appId).name}…`;
		this.hooks.begin();
	}

	private onKey(e: KeyboardEvent): void {
		const f = this.flight;
		if (!f) return;
		if (e.key === 'Escape' && f.kind === 'dive' && !f.navigated) {
			e.preventDefault();
			this.cancel();
		} else this.skip();
	}

	/** Any input during a flight: go straight to its end. */
	private skip(): void {
		const f = this.flight;
		if (!f) return;
		const d = diveTiming(f.tier);
		f.t0 = Math.min(f.t0, clock() - (f.kind === 'dive' ? d.navAt : RETURN_MS));
	}

	/** Esc before the hand-over: fly back out from wherever the dive has got to. */
	private cancel(): void {
		const f = this.flight!;
		const d = diveTiming(f.tier);
		const td = Math.min(clock() - f.t0, d.navAt);
		// returnAt(t) shows the dive at navAt·(1 − ease(t)); start where we are.
		const t = RETURN_MS * (1 - Math.cbrt(td / d.navAt));
		this.flight = { ...f, kind: 'return', t0: clock() - t };
		cancelSpeculation();
		this.live.textContent = '';
	}

	/** A return from an app: put the page back, then fly out of its colour. */
	back(r: Returning): void {
		const tier = this.tier();
		const y = r.at?.y ?? this.hooks.sceneY(r.ch);
		if (y !== null && y !== undefined) this.hooks.restore(y);
		history.replaceState(forgetDive(history.state), '', location.pathname + location.search);
		if (!tier) {
			this.done();
			return;
		}
		this.flight = { kind: 'return', app: r.app, ch: r.ch, tier, t0: clock(), u: null, plan: null, focus: r.at?.focus };
		this.hooks.begin();
	}

	/** On a fresh load: is this a return from an app? */
	returning(): Returning | null {
		const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
		return readReturn(history.state, nav?.type ?? 'navigate', false, location.hash);
	}

	/** The dive to draw in this frame, if a flight is on. */
	draw(frame: Frame, now: number): DiveDraw | null {
		const f = this.flight;
		if (!f) return null;
		f.plan ??= { tier: f.tier, focus: focusOf(frame, f.ch), color: hexToRgb(appOf(f.app).color), visW: frame.visW };
		const t = now / slowmo() - f.t0;
		if (f.kind === 'return') {
			if (t >= RETURN_MS) {
				const focus = f.focus;
				this.flight = null;
				this.done(focus);
				return null;
			}
			return returnAt(f.plan, t);
		}
		const d = diveTiming(f.tier);
		if (t >= d.navAt && !f.navigated) this.navigate(f);
		return diveAt(f.plan, Math.min(t, d.hubMs));
	}

	private navigate(f: Flight): void {
		f.navigated = true;
		history.replaceState(rememberDive(history.state, { app: f.app, ch: f.ch, y: scrollY, u: f.u ?? this.hooks.u(), focus: f.focus }), '');
		location.assign(f.url!);
		// If the app's page never comes (offline, blocked), give the hub back.
		setTimeout(() => {
			if (this.flight === f && document.visibilityState === 'visible') this.cancel();
		}, 6000);
	}

	private done(focus?: string): void {
		this.live.textContent = '';
		document.documentElement.classList.remove('returning');
		this.hooks.end();
		if (focus) document.querySelector<HTMLElement>(focus)?.focus({ preventScroll: true });
	}
}

/** For tests and tuning: the dive into `app` from chapter `ch`, t ms in, without going anywhere. */
export function previewDive(frame: Frame, p: { app: string; ch: ChapterId; t: number; tier?: Tier; back?: boolean }): DiveDraw {
	const plan: DivePlan = { tier: p.tier ?? 'full', focus: focusOf(frame, p.ch), color: hexToRgb(appOf(p.app).color), visW: frame.visW };
	return p.back ? returnAt(plan, p.t) : diveAt(plan, p.t);
}
