import { test } from 'node:test';
import assert from 'node:assert/strict';
import { forgetDive, readReturn, rememberDive } from './reverse.ts';

const memory = { app: 'respite', ch: 'attention' as const, y: 4200, u: 2.02, focus: '#m-attention a.app' };

test('the hub remembers a dive in its own history entry, beside what was there', () => {
	const s = rememberDive({ lenis: 1 }, memory);
	assert.deepEqual(s, { lenis: 1, dive: memory });
	assert.deepEqual(forgetDive(s), { lenis: 1 });
	assert.equal(forgetDive(null), null);
});

test('coming back with the browser is a return to the exact spot', () => {
	const s = rememberDive(null, memory);
	assert.deepEqual(readReturn(s, 'back_forward', false, ''), { app: 'respite', ch: 'attention', at: { y: 4200, u: 2.02, focus: memory.focus } });
	assert.ok(readReturn(s, 'navigate', true, ''), 'a bfcache restore counts');
	assert.equal(readReturn(s, 'reload', false, ''), null, 'a reload does not');
});

test('a link from an app is a return to its hour', () => {
	assert.deepEqual(readReturn(null, 'navigate', false, '#from=hisab.wealth'), { app: 'hisab', ch: 'wealth' });
	assert.equal(readReturn(null, 'navigate', false, '#from=hisab.lunch'), null);
	assert.equal(readReturn(null, 'navigate', false, ''), null);
});
