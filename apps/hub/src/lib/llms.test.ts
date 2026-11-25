import { test } from 'node:test';
import assert from 'node:assert/strict';
import { APPS } from '@intently/registry';
import { CHAPTERS } from '../data/chapters.ts';
import { llmsFullTxt, llmsTxt } from './llms.ts';

test('llms.txt names every app with its site and every chapter with its page', () => {
	const t = llmsTxt();
	assert.match(t, /^# Intently\n\n> /);
	for (const a of APPS) assert.ok(t.includes(`(https://${a.host}/)`), a.id);
	for (const c of CHAPTERS) assert.ok(t.includes(`(https://liveintently.app${c.path})`), c.id);
});

test('llms-full.txt carries every chapter\'s practice and app line', () => {
	const t = llmsFullTxt();
	for (const c of CHAPTERS) {
		assert.ok(t.includes(c.practice.heading), c.id);
		assert.ok(t.includes(c.appLine), c.id);
	}
});
