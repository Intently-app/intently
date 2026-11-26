import { test } from 'node:test';
import assert from 'node:assert/strict';
import { canAnimate, decideTier, type DeviceSignals } from './capability.ts';

const desktop: DeviceSignals = { reducedMotion: false, saveData: false, forcedStatic: false, webgl2: true, coarse: false, cores: 8, memoryGb: 8 };

test('a capable desktop gets the full dive', () => assert.equal(decideTier(desktop), 'full'));

test('reduced motion, Save-Data, ?world=static and no WebGL2 navigate plainly', () => {
	for (const k of ['reducedMotion', 'saveData', 'forcedStatic'] as const) assert.equal(decideTier({ ...desktop, [k]: true }), 'instant', k);
	assert.equal(decideTier({ ...desktop, webgl2: false }), 'instant');
	assert.equal(decideTier({ ...desktop, reducedMotion: true, slowFrames: true }), 'instant', 'instant wins over bridge');
});

test('slow frames and small devices get the colour bridge', () => {
	assert.equal(decideTier({ ...desktop, slowFrames: true }), 'bridge');
	assert.equal(decideTier({ ...desktop, cores: 2 }), 'bridge');
	assert.equal(decideTier({ ...desktop, memoryGb: 2 }), 'bridge');
	assert.equal(decideTier({ ...desktop, coarse: true, cores: 3 }), 'bridge');
});

test('phones and tablets that can draw it get the lite dive', () => {
	assert.equal(decideTier({ ...desktop, coarse: true, cores: 6, memoryGb: 4 }), 'lite');
	assert.equal(decideTier({ ...desktop, coarse: true, cores: undefined, memoryGb: undefined }), 'lite', 'Safari hides both');
});

test('slow frames never stop the page from animating, only the dive', () => {
	assert.equal(canAnimate({ ...desktop, slowFrames: true }), true);
	assert.equal(canAnimate({ ...desktop, saveData: true }), false);
});
