/**
 * The timing contract of a dive. The hub flies in for HUB_MS and navigates at NAV_AT; the app's world
 * picks the flight up at the same speed and settles in APP_MS. About 1.2 s from click to a readable
 * hero, and any input skips ahead.
 *
 * Speed is measured as zoom rate, d ln(scale)/dt at the point being flown towards (1/s). It means the
 * same thing in any scene, whatever its units, so the hub and the app agree on it without sharing
 * geometry: the hub reaches handoffRate(tier) at NAV_AT, and the app starts at that rate and slows
 * to rest.
 */
import type { Tier } from './handoff.ts';

export interface DiveTiming {
	/** Length of the hub's flight (ms). */
	hubMs: number;
	/** When the hub navigates (ms), before its flight ends so the next page has the rest to load. */
	navAt: number;
	/** When the app's colour starts to fill the hub's screen (ms). */
	fillFrom: number;
	/** ln of how far the hub zooms in over hubMs. */
	logZoom: number;
	/** The app's settle (ms). */
	appMs: number;
}

const FULL: DiveTiming = { hubMs: 700, navAt: 560, fillFrom: 400, logZoom: Math.log(8), appMs: 500 };
const LITE: DiveTiming = { hubMs: 550, navAt: 440, fillFrom: 300, logZoom: Math.log(6), appMs: 450 };
const BRIDGE: DiveTiming = { hubMs: 300, navAt: 300, fillFrom: 0, logZoom: 0, appMs: 250 };

export function diveTiming(tier: Tier): DiveTiming {
	return tier === 'full' ? FULL : tier === 'lite' ? LITE : BRIDGE;
}

/** An arrival waits this long for its world to be ready before it falls back to the CSS parting (ms). */
export const ARRIVAL_WAIT = 350;
/** Whatever happens, the veil is gone this long after the page becomes visible (ms). */
export const FAILSAFE = 1500;
/** The reverse flight back to the hub (ms). */
export const RETURN_MS = 700;

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const smoothstep = (x: number) => { const t = clamp01(x); return t * t * (3 - 2 * t); };

/** The hub's progress, 0..1, at t ms: an ease-in cubic, so the flight gathers speed. */
export function hubProgress(t: number, d: DiveTiming): number {
	const x = clamp01(t / d.hubMs);
	return x * x * x;
}

/** ln(scale) of the hub's view at t ms (0 at rest). */
export function hubLogZoom(t: number, d: DiveTiming): number {
	return d.logZoom * hubProgress(t, d);
}

/** The hub's zoom rate at t ms (1/s). */
export function hubRate(t: number, d: DiveTiming): number {
	const x = clamp01(t / d.hubMs);
	return (d.logZoom * 3 * x * x) / (d.hubMs / 1000);
}

/** The zoom rate the app inherits: the hub's at the moment it navigated (1/s). */
export function handoffRate(d: DiveTiming): number {
	return hubRate(d.navAt, d);
}

/**
 * ln(scale) of the app's view at t ms after it starts, relative to its resting view: it begins zoomed
 * out (negative) and comes to rest at 0 with an ease-out whose starting speed is handoffRate.
 *   x(t) = -A (1 - t/T)², x'(0) = 2A/T = rate  =>  A = rate·T/2
 */
export function appLogZoom(t: number, d: DiveTiming): number {
	const a = (handoffRate(d) * (d.appMs / 1000)) / 2;
	const u = 1 - clamp01(t / d.appMs);
	return u === 0 ? 0 : -a * u * u;
}

/** The app's progress, 0..1, matching appLogZoom (0 at the start, 1 at rest). */
export function appProgress(t: number, d: DiveTiming): number {
	const u = 1 - clamp01(t / d.appMs);
	return 1 - u * u;
}

/** How much of the hub's screen the app's colour covers at t ms: full by the time it navigates. */
export function fillAt(t: number, d: DiveTiming): number {
	if (d.navAt <= d.fillFrom) return t >= d.navAt ? 1 : clamp01(t / Math.max(1, d.navAt));
	return smoothstep((t - d.fillFrom) / (d.navAt - d.fillFrom));
}
