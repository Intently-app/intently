/**
 * The app side of a dive. The veil (veil.ts) has painted the app's colour; an arrival world takes
 * over from it, flies in at the speed the hub left at, and settles on the page's hero. If the world
 * isn't ready within ARRIVAL_WAIT of the page being shown, the veil parts in CSS instead and the world
 * just starts at rest. Any click, key or wheel skips to the end.
 */
import type { ChapterId, Tier } from './handoff.ts';
import { ARRIVAL_WAIT, appLogZoom, appProgress, diveTiming } from './timing.ts';

export interface ArrivalState {
	app: string;
	ch: ChapterId;
	tier: Tier;
	/** Set by the world when it takes over from the veil. */
	taken: boolean;
	done: boolean;
	/** When the veil started its clock: performance.now() once the page was shown. */
	shownAt?: number;
	/** Clears the veil and dispatches intently:arrived (once). */
	finish: () => void;
}

declare global {
	interface Window {
		__intentlyArrival?: ArrivalState;
	}
	interface Document {
		/** Speculation Rules: true while the page is prerendered and not yet shown (Chromium). */
		readonly prerendering?: boolean;
	}
}

export interface ArrivalWorld {
	/** Resolves when the world can draw a first frame that matches the veil exactly. */
	ready: Promise<unknown>;
	/** Draw the flight: progress 0..1, and ln(scale) relative to rest (negative: still zoomed out). */
	frame(progress: number, logZoom: number): void;
	/** At rest (also after a skip, or when the world was too late to fly). */
	settle(): void;
}

/** The arrival in progress on this page view, if any and not yet over. */
export function currentArrival(): ArrivalState | null {
	const a = typeof window === 'undefined' ? undefined : window.__intentlyArrival;
	return a && !a.done ? a : null;
}

/** ms since the veil started its clock (the page was shown: a prerendered page counts from its activation). */
function sinceShown(a: ArrivalState): number {
	const nav = performance.getEntriesByType?.('navigation')[0] as (PerformanceNavigationTiming & { activationStart?: number }) | undefined;
	return performance.now() - (a.shownAt ?? nav?.activationStart ?? 0);
}

const later = (ms: number) => new Promise<'late'>((r) => setTimeout(() => r('late'), Math.max(0, ms)));

/** Whether the world flew (true) or the CSS parting ran (false). */
export async function runArrival(world: ArrivalWorld): Promise<boolean> {
	const a = currentArrival();
	if (!a || a.tier === 'bridge') {
		world.settle();
		return false;
	}
	if (document.prerendering) await new Promise((r) => document.addEventListener('prerenderingchange', r, { once: true }));
	const won = await Promise.race([world.ready.then(() => 'ready' as const), later(ARRIVAL_WAIT - sinceShown(a))]);
	if (won !== 'ready' || a.done || document.documentElement.classList.contains('arrival-parting')) {
		await world.ready.catch(() => undefined);
		world.settle();
		return false;
	}
	a.taken = true;
	const d = diveTiming(a.tier);
	world.frame(0, appLogZoom(0, d));
	document.documentElement.classList.remove('arriving');

	await new Promise<void>((resolve) => {
		const t0 = performance.now();
		let skipped = false;
		const skip = () => { skipped = true; };
		const opts = { capture: true, passive: true, once: true } as const;
		for (const ev of ['pointerdown', 'keydown', 'wheel'] as const) addEventListener(ev, skip, opts);
		const tick = () => {
			const t = skipped ? d.appMs : performance.now() - t0;
			world.frame(appProgress(t, d), appLogZoom(t, d));
			if (t < d.appMs) requestAnimationFrame(tick);
			else {
				for (const ev of ['pointerdown', 'keydown', 'wheel'] as const) removeEventListener(ev, skip, { capture: true });
				resolve();
			}
		};
		requestAnimationFrame(tick);
	});
	world.settle();
	a.finish();
	return true;
}
