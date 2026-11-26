import { test } from 'node:test';
import assert from 'node:assert/strict';
import { APPS, appSchemaId } from '@intently/registry';
import { appList, organization, website, ORG_ID } from './schema.ts';

test('every app is listed once, by the @id its own site declares', () => {
	const list = appList();
	assert.equal(list.itemListElement.length, APPS.length);
	const ids = list.itemListElement.map((i) => i.item['@id']);
	assert.equal(new Set(ids).size, ids.length);
	assert.ok(ids.includes('https://respite.liveintently.app/#software'), "Respite's site declares #software");
	assert.ok(ids.includes('https://hisab.liveintently.app/#app'));
	for (const a of APPS) assert.match(appSchemaId(a), /^https:\/\/[a-z]+\.liveintently\.app\/#[a-z]+$/);
});

test('the website and the brands belong to the organization', () => {
	assert.deepEqual(website().publisher, { '@id': ORG_ID });
	assert.equal(organization().brand.length, APPS.length);
});
