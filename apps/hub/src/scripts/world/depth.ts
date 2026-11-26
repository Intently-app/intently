/**
 * The world's depth. The landscape is four flat layers facing the viewer, scrolled at parallax p
 * (0.12, 0.3, 0.58, 1; the sky is at infinity, p = 0). Read as a 3D scene, layer p lies at distance
 * D/p from the eye, D being the foreground's distance: scrolling by `cam` moves the eye sideways and
 * each layer slides by cam·p, which is today's parallax.
 *
 * A dive moves the eye forward by ζ·D and sideways by (cx, cy) foreground units. A point that sat at
 * screen (x, y) on layer p then appears at
 *
 *   x' = (x − p·cx) / (1 − p·ζ)        y' = Y0 + (y − Y0 − p·cy) / (1 − p·ζ)
 *
 * which is exactly a pinhole projection of that layer from the new eye (depth.test.ts checks it), so
 * the renderer gets a true perspective flight by applying, per layer, this map (sprites, dots) or its
 * inverse (shaders that work per pixel). At rest (ζ = cx = cy = 0) both are the identity.
 */
export const EYE_Y = 500;
/** The eye must stay in front of the nearest layer (p = 1): ζ < 1. */
export const MAX_ZETA = 0.95;

export interface Eye {
	/** Forward travel, as a fraction of the foreground's distance. */
	zeta: number;
	/** Sideways travel, in foreground units (screen units at rest). */
	cx: number;
	cy: number;
}

export const REST: Eye = { zeta: 0, cx: 0, cy: 0 };

export const isRest = (e: Eye | null | undefined): boolean => !e || (e.zeta === 0 && e.cx === 0 && e.cy === 0);

/** How much layer p is magnified. */
export const layerScale = (e: Eye, p: number): number => 1 / Math.max(1 - p * e.zeta, 1e-3);

/** Where a point of layer p, at rest-screen (x, y), appears from the eye. */
export function project(e: Eye, p: number, x: number, y: number): [number, number] {
	const s = layerScale(e, p);
	return [(x - p * e.cx) * s, EYE_Y + (y - EYE_Y - p * e.cy) * s];
}

/** Which rest-screen point of layer p appears at screen (x, y): the inverse of project(). */
export function unproject(e: Eye, p: number, x: number, y: number): [number, number] {
	const k = 1 - p * e.zeta;
	return [x * k + p * e.cx, EYE_Y + (y - EYE_Y) * k + p * e.cy];
}

/**
 * How far the eye may move sideways at travel ζ and still only see what was on screen at rest (the
 * renderer's ridge columns cover the rest view): |cx| ≤ ζ·visW/2, |cy| ≤ ζ·500 for the foreground,
 * and less for every layer behind it.
 */
export function clampEye(e: Eye, visW: number): Eye {
	const zeta = Math.min(Math.max(e.zeta, 0), MAX_ZETA);
	const lim = (v: number, m: number) => Math.max(-m, Math.min(m, v)) + 0;
	return { zeta, cx: lim(e.cx, (zeta * visW) / 2), cy: lim(e.cy, zeta * EYE_Y) };
}
