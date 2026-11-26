import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DIVE_DEFAULT, ENGINE_DEFAULT, diveEnabled, engine } from './flags.ts';

const mem = () => {
	const m = new Map<string, string>();
	return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v), removeItem: (k: string) => void m.delete(k) };
};
const prod = { hostname: 'liveintently.app', search: '' };
const preview = { hostname: 'dive-intently-hub.fsadakathussain.workers.dev', search: '' };

test('production follows the defaults; previews have everything on', () => {
	assert.equal(diveEnabled(prod, mem()), DIVE_DEFAULT);
	assert.equal(engine(prod, mem()), ENGINE_DEFAULT);
	assert.equal(diveEnabled(preview, mem()), true);
	assert.equal(engine(preview, mem()), 'three');
});

test('a visitor can opt in and out, and it is remembered', () => {
	const s = mem();
	assert.equal(diveEnabled({ ...prod, search: '?dive=1' }, s), true);
	assert.equal(diveEnabled(prod, s), true);
	assert.equal(diveEnabled({ ...prod, search: '?dive=0' }, s), false);
	assert.equal(diveEnabled(preview, s), false, 'an explicit no beats the preview default');
	assert.equal(engine({ ...prod, search: '?engine=three' }, s), 'three');
	assert.equal(engine(prod, s), 'three');
	assert.equal(engine({ ...prod, search: '?engine=bogus' }, s), 'three');
});

test('no storage (private mode) still works', () => {
	const broken = { getItem: () => { throw new Error('no'); }, setItem: () => { throw new Error('no'); }, removeItem: () => {} };
	assert.equal(diveEnabled({ ...prod, search: '?dive=1' }, broken), DIVE_DEFAULT);
	assert.equal(engine(prod, null), ENGINE_DEFAULT);
});
