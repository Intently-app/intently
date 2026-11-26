import { test } from 'node:test';
import assert from 'node:assert/strict';
import { LAYERS } from '../../world/terrain.ts';
import { EYE_Y, MAX_ZETA, REST, clampEye, project, unproject, type Eye } from './depth.ts';

const PARALLAX = LAYERS.map((l) => l.parallax);
const close = (a: number, b: number, eps = 1e-6) => assert.ok(Math.abs(a - b) < eps, `${a} vs ${b}`);

/** A plain pinhole camera, in foreground units: layer p is a plane at depth D/p, scaled so it fills the view at rest. */
function pinhole(e: Eye, p: number, x: number, y: number, D = 1866): [number, number] {
	const depth = D / p;
	// The layer's point in the world (rest eye at the origin, looking down +z).
	const X = (x * depth) / D;
	const Y = ((y - EYE_Y) * depth) / D;
	// Seen from the moved eye.
	const ex = e.cx, ey = e.cy, ez = e.zeta * D;
	const f = D / (depth - ez);
	return [(X - ex) * f, EYE_Y + (Y - ey) * f];
}

test('the map is a true perspective projection of each layer', () => {
	const eyes: Eye[] = [{ zeta: 0.3, cx: 40, cy: -12 }, { zeta: 0.8, cx: -200, cy: 60 }, { zeta: MAX_ZETA, cx: 0, cy: 0 }];
	for (const e of eyes) for (const p of PARALLAX) for (const [x, y] of [[0, 500], [-700, 300], [520, 880]]) {
		const [a, b] = project(e, p, x, y);
		const [c, d] = pinhole(e, p, x, y);
		close(a, c, 1e-6);
		close(b, d, 1e-6);
	}
});

test('at rest everything stays where it is, and the sky never moves', () => {
	for (const p of [0, ...PARALLAX]) assert.deepEqual(project(REST, p, 123, 456), [123, 456]);
	assert.deepEqual(project({ zeta: 0.9, cx: 300, cy: 40 }, 0, 123, 456), [123, 456]);
});

test('unproject undoes project on every layer', () => {
	const e = { zeta: 0.7, cx: 120, cy: -30 };
	for (const p of PARALLAX) {
		const [x, y] = project(e, p, -333, 777);
		const [a, b] = unproject(e, p, x, y);
		close(a, -333, 1e-9);
		close(b, 777, 1e-9);
	}
});

test('near layers rush past, far ones barely move', () => {
	const e = { zeta: 0.8, cx: 0, cy: 0 };
	const grow = PARALLAX.map((p) => project(e, p, 100, 500)[0] / 100);
	for (let i = 1; i < grow.length; i++) assert.ok(grow[i] > grow[i - 1]);
	assert.ok(grow[0] < 1.11 && grow[3] > 4.9);
});

test('the eye never passes the foreground, and never looks beyond the rest view', () => {
	const e = clampEye({ zeta: 2, cx: 9999, cy: -9999 }, 1600);
	assert.equal(e.zeta, MAX_ZETA);
	for (const p of PARALLAX) {
		// Screen edges seen from the moved eye map back inside the rest view.
		for (const sx of [-800, 800]) {
			const [rx] = unproject(e, p, sx, 500);
			assert.ok(Math.abs(rx) <= 800 + 1e-9, `${p}: ${rx}`);
		}
		for (const sy of [0, 1000]) {
			const [, ry] = unproject(e, p, 0, sy);
			assert.ok(ry >= -1e-9 && ry <= 1000 + 1e-9, `${p}: ${ry}`);
		}
	}
});
