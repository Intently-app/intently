/**
 * How much of the dive a device gets. The hub decides once, when someone chooses an app, and sends
 * the tier in the handoff, so the app site never measures the device again.
 *
 *   instant  plain navigation: reduced motion, Save-Data, ?world=static, or no WebGL2
 *   bridge   a colour fill in CSS (300 ms): the hub's frames were too slow, or a small device
 *   lite     the 3D dive at lower resolution: phones and tablets that can draw it
 *   full     everything else
 */
import type { Tier } from './handoff.ts';

export type Decided = Tier | 'instant';

export interface DeviceSignals {
	reducedMotion: boolean;
	saveData: boolean;
	/** ?world=static on the page. */
	forcedStatic: boolean;
	webgl2: boolean;
	/** The primary pointer is coarse (a touch screen). */
	coarse: boolean;
	/** navigator.hardwareConcurrency, when known. */
	cores?: number;
	/** navigator.deviceMemory in GB, when known (Chromium only). */
	memoryGb?: number;
	/** The hub's frame budget lowered the resolution, or gave up (budget.ts). */
	slowFrames?: boolean;
}

export function decideTier(s: DeviceSignals): Decided {
	if (s.reducedMotion || s.saveData || s.forcedStatic || !s.webgl2) return 'instant';
	if (s.slowFrames) return 'bridge';
	if ((s.cores !== undefined && s.cores <= 2) || (s.memoryGb !== undefined && s.memoryGb <= 2)) return 'bridge';
	if (s.coarse) return s.cores !== undefined && s.cores < 4 ? 'bridge' : 'lite';
	return 'full';
}

/** Whether the page may run anything animated at all (the hub's live world uses the same rule). */
export const canAnimate = (s: DeviceSignals): boolean => decideTier({ ...s, slowFrames: false }) !== 'instant';

let webgl2Cache: boolean | undefined;

/** The signals of this browser. */
export function deviceSignals(slowFrames = false): DeviceSignals {
	const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
	if (webgl2Cache === undefined) {
		try {
			webgl2Cache = !!document.createElement('canvas').getContext('webgl2');
		} catch {
			webgl2Cache = false;
		}
	}
	return {
		reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
		saveData: !!nav.connection?.saveData,
		forcedStatic: new URLSearchParams(location.search).get('world') === 'static',
		webgl2: webgl2Cache,
		coarse: matchMedia('(pointer: coarse)').matches,
		cores: nav.hardwareConcurrency || undefined,
		memoryGb: nav.deviceMemory,
		slowFrames,
	};
}

export const detectTier = (slowFrames = false): Decided => decideTier(deviceSignals(slowFrames));
