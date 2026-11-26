/**
 * The dive's camera path: from the visitor's choice of an app until the hub hands over to the app's
 * site, and the same path backwards when they come back. The eye flies toward the thing the chapter is
 * about (the phone, the pond, the lantern…), it grows until it is the way in, and the app's colour
 * blooms out of it. Timing comes from @intently/world (the app's site picks the flight up at the same
 * zoom rate); the geometry is depth.ts.
 */
import { RETURN_MS, diveTiming, fillAt, hubLogZoom, hubProgress, type DiveTiming } from '@intently/world/timing';
import type { ChapterId, Tier } from '@intently/world/handoff';
import { clampEye, project, EYE_Y } from './depth.ts';
import type { DiveDraw } from './renderer.ts';
import type { Frame } from './timeline.ts';
import type { Rgb } from '../lib/color.ts';

/** What each chapter's dive flies into. */
export const FOCUS: Record<ChapterId, string> = {
	time: 'walker',
	attention: 'phone',
	health: 'walker',
	wealth: 'pond',
	relationships: 'house',
	self: 'walker',
	faith: 'lantern',
};

/** Where the dive heads in this frame (foreground, rest-screen units): the chapter's thing, else the walker, else the middle of the land. */
export function focusOf(frame: Frame, ch: ChapterId): [number, number] {
	const kind = FOCUS[ch];
	if (kind === 'pond' && frame.pond && frame.pond[2] > 0) return [frame.pond[0], frame.pond[1]];
	const pick = (k: string) => frame.sprites.find((s) => s.kind === k && s.alpha > 0.05);
	const s = pick(kind) ?? pick('walker');
	if (!s) return [0, 700];
	// The sprite's middle: it stands on (x, y) and is about box height tall.
	const [, y0, , y1] = s.sprite.box;
	return [s.x, s.y + ((y0 + y1) / 2) * s.scale];
}

export interface DivePlan {
	tier: Tier;
	focus: [number, number];
	color: Rgb;
	visW: number;
}

/** The eye travels by the foreground's zoom: ln(scale) = hubLogZoom, so the app inherits the rate. */
function eyeAt(plan: DivePlan, t: number, d: DiveTiming) {
	const zeta = 1 - Math.exp(-hubLogZoom(t, d));
	// Turn toward the focus a little ahead of the zoom, so it drifts to the centre as it grows.
	const aim = Math.min(1, Math.sqrt(hubProgress(t, d)) * 1.5);
	return clampEye({ zeta, cx: plan.focus[0] * aim, cy: (plan.focus[1] - EYE_Y) * aim }, plan.visW);
}

/** The frame of the dive t ms after the choice. */
export function diveAt(plan: DivePlan, t: number): DiveDraw {
	const d = diveTiming(plan.tier);
	const eye = plan.tier === 'bridge' ? { zeta: 0, cx: 0, cy: 0 } : eyeAt(plan, t, d);
	const [fx, fy] = project(eye, 1, plan.focus[0], plan.focus[1]);
	return { eye, fill: fillAt(t, d), color: plan.color, focus: [fx, fy] };
}

/** The way back: the dive in reverse, from the full colour to the hub at rest, over RETURN_MS. */
export function returnAt(plan: DivePlan, t: number): DiveDraw {
	const d = diveTiming(plan.tier);
	const x = Math.min(Math.max(t / RETURN_MS, 0), 1);
	const ease = 1 - (1 - x) ** 3;
	return diveAt(plan, d.navAt * (1 - ease));
}

export const diveLength = (tier: Tier) => diveTiming(tier).navAt;
