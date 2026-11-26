import { test } from 'node:test';
import assert from 'node:assert/strict';
import { TIERS } from './handoff.ts';
import { appLogZoom, appProgress, diveTiming, fillAt, handoffRate, hubLogZoom, hubProgress } from './timing.ts';

test('click to readable hero takes about 1.2 s on the full tier, less on the others', () => {
	const f = diveTiming('full');
	assert.ok(f.navAt < f.hubMs);
	assert.ok(Math.abs(f.navAt + f.appMs - 1100) <= 150, `${f.navAt + f.appMs} ms`);
	for (const tier of TIERS) {
		const d = diveTiming(tier);
		assert.ok(d.navAt + d.appMs <= f.navAt + f.appMs, tier);
	}
});

test('the curves are monotone and end at rest', () => {
	for (const tier of ['full', 'lite'] as const) {
		const d = diveTiming(tier);
		let prevHub = -1, prevApp = -Infinity, prevFill = -1;
		for (let t = 0; t <= Math.max(d.hubMs, d.appMs); t += 5) {
			assert.ok(hubLogZoom(t, d) >= prevHub); prevHub = hubLogZoom(t, d);
			assert.ok(appLogZoom(t, d) >= prevApp); prevApp = appLogZoom(t, d);
			assert.ok(fillAt(t, d) >= prevFill); prevFill = fillAt(t, d);
		}
		assert.equal(hubProgress(0, d), 0);
		assert.equal(hubProgress(d.hubMs, d), 1);
		assert.equal(appLogZoom(d.appMs, d), 0);
		assert.equal(appProgress(d.appMs, d), 1);
		assert.ok(appLogZoom(0, d) < 0, 'the app starts zoomed out');
	}
});

test('the app starts at the speed the hub left at', () => {
	for (const tier of ['full', 'lite'] as const) {
		const d = diveTiming(tier);
		const dt = 0.01;
		const appStart = (appLogZoom(dt, d) - appLogZoom(0, d)) / (dt / 1000);
		const rate = handoffRate(d);
		assert.ok(Math.abs(appStart - rate) / rate < 1e-3, `${tier}: ${appStart} vs ${rate}`);
	}
});

test('the colour covers the screen by the time the hub navigates', () => {
	for (const tier of TIERS) {
		const d = diveTiming(tier);
		assert.equal(fillAt(d.navAt, d), 1, tier);
		if (tier !== 'bridge') assert.equal(fillAt(d.fillFrom, d), 0, tier);
	}
});
