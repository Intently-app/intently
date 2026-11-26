import { test } from 'node:test';
import assert from 'node:assert/strict';
import { diveTarget, type ClickLike } from './links.ts';

const click: ClickLike = { button: 0, metaKey: false, ctrlKey: false, shiftKey: false, altKey: false, defaultPrevented: false };
const link = (href: string, target = '', attrs: string[] = []) => ({ href, target, hasAttribute: (n: string) => attrs.includes(n) });

test('a plain click on an app with an arrival world dives', () => {
	assert.equal(diveTarget(click, link('https://respite.liveintently.app')), 'respite');
	assert.equal(diveTarget(click, link('https://hisab.liveintently.app/')), 'hisab');
	assert.equal(diveTarget(click, link('https://respite.liveintently.app/', '_self')), 'respite');
});

test('modified, middle and already-handled clicks never dive', () => {
	for (const k of ['metaKey', 'ctrlKey', 'shiftKey', 'altKey', 'defaultPrevented'] as const)
		assert.equal(diveTarget({ ...click, [k]: true }, link('https://respite.liveintently.app')), null, k);
	assert.equal(diveTarget({ ...click, button: 1 }, link('https://respite.liveintently.app')), null);
});

test('new windows, downloads, deep links and other sites never dive', () => {
	assert.equal(diveTarget(click, link('https://respite.liveintently.app', '_blank')), null);
	assert.equal(diveTarget(click, link('https://respite.liveintently.app', '', ['download'])), null);
	assert.equal(diveTarget(click, link('https://respite.liveintently.app', '', ['data-no-dive'])), null);
	assert.equal(diveTarget(click, link('https://respite.liveintently.app/blog/')), null);
	assert.equal(diveTarget(click, link('https://respite.liveintently.app/?utm=x')), null);
	assert.equal(diveTarget(click, link('http://respite.liveintently.app')), null);
	assert.equal(diveTarget(click, link('https://play.google.com/store/apps/details?id=x')), null);
	assert.equal(diveTarget(click, link('/time/')), null);
});

test('apps without an arrival world navigate plainly', () => {
	assert.equal(diveTarget(click, link('https://loop.liveintently.app')), null);
	assert.equal(diveTarget(click, link('https://loop.liveintently.app'), new Set(['loop'])), 'loop');
});
