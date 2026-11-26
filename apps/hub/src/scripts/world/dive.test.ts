import { test } from 'node:test';
import assert from 'node:assert/strict';
import { diveTiming } from '@intently/world/timing';
import { MAX_ZETA, project } from './depth.ts';
import { diveAt, returnAt, type DivePlan } from './dive.ts';

const plan: DivePlan = { tier: 'full', focus: [-260, 790], color: [0.18, 0.38, 0.47], visW: 1600 };

test('the dive starts at rest and ends in the app colour', () => {
	const a = diveAt(plan, 0);
	assert.deepEqual(a.eye, { zeta: 0, cx: 0, cy: 0 });
	assert.equal(a.fill, 0);
	const d = diveTiming('full');
	assert.equal(diveAt(plan, d.navAt).fill, 1);
});

test('the eye only moves forward and never passes the foreground', () => {
	let prev = -1;
	for (let t = 0; t <= 700; t += 10) {
		const { eye } = diveAt(plan, t);
		assert.ok(eye.zeta >= prev && eye.zeta <= MAX_ZETA);
		prev = eye.zeta;
	}
});

test('the thing it dives into grows and comes to the middle', () => {
	const d = diveTiming('full');
	const end = diveAt(plan, d.navAt);
	const [x] = project(end.eye, 1, plan.focus[0], plan.focus[1]);
	assert.ok(Math.abs(x) < Math.abs(plan.focus[0]) * 0.5, `focus at ${x}`);
	assert.ok(1 / (1 - end.eye.zeta) > 2.5, 'the foreground is well magnified by the handover');
	assert.ok(1 / (1 - diveAt(plan, d.hubMs).eye.zeta) > 7, 'and 8× at the end of the flight');
	assert.deepEqual(end.focus.map(Math.round), [Math.round(x), Math.round(project(end.eye, 1, ...plan.focus)[1])]);
});

test('the colour bridge does not move the eye', () => {
	for (const t of [0, 150, 300]) assert.deepEqual(diveAt({ ...plan, tier: 'bridge' }, t).eye, { zeta: 0, cx: 0, cy: 0 });
	assert.equal(diveAt({ ...plan, tier: 'bridge' }, 300).fill, 1);
});

test('the way back starts in the colour and ends at rest', () => {
	assert.equal(returnAt(plan, 0).fill, 1);
	const end = returnAt(plan, 700);
	assert.equal(end.fill, 0);
	assert.deepEqual(end.eye, { zeta: 0, cx: 0, cy: 0 });
});
