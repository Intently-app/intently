import { test } from 'node:test';
import assert from 'node:assert/strict';
import { encodeHandoff, encodeReturn, parseHandoff, parseReturn, stripped } from './handoff.ts';

test('a handoff survives the round trip', () => {
	const h = { app: 'respite', ch: 'attention', tier: 'full' } as const;
	assert.equal(encodeHandoff(h), '#intently=v1.respite.attention.full');
	assert.deepEqual(parseHandoff(encodeHandoff(h)), h);
	assert.deepEqual(parseHandoff('#intently=v1.hisab.wealth.lite'), { app: 'hisab', ch: 'wealth', tier: 'lite' });
});

test('anything else is not a handoff', () => {
	for (const bad of [
		'', '#', '#features', '#intently=v2.respite.attention.full', '#intently=v1.nope.attention.full',
		'#intently=v1.respite.lunch.full', '#intently=v1.respite.attention.instant', '#intently=v1.respite.attention',
		'#intently=v1.respite.attention.full.extra', '#intently=v1.Respite.attention.full',
		`#intently=v1.respite.attention.full${' '.repeat(60)}`, '#intently=v1.respite.attention.full&x=<script>',
	]) assert.equal(parseHandoff(bad), null, bad);
});

test('a return survives the round trip and rejects the rest', () => {
	assert.equal(encodeReturn({ app: 'hisab', ch: 'wealth' }), '#from=hisab.wealth');
	assert.deepEqual(parseReturn('#from=hisab.wealth'), { app: 'hisab', ch: 'wealth' });
	for (const bad of ['#from=hisab', '#from=x.wealth', '#from=hisab.noon', '#intently=v1.hisab.wealth.full']) assert.equal(parseReturn(bad), null, bad);
});

test('stripping keeps the path and the query', () => {
	assert.equal(stripped({ pathname: '/blog/', search: '?q=1' }), '/blog/?q=1');
});
