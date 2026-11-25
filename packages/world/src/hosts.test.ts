import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolveOrigin } from './hosts.ts';

test('production goes to the app subdomains and back to the apex', () => {
	assert.equal(resolveOrigin('respite', 'liveintently.app'), 'https://respite.liveintently.app');
	assert.equal(resolveOrigin('hub', 'hisab.liveintently.app'), 'https://liveintently.app');
});

test('previews stay on their alias', () => {
	assert.equal(resolveOrigin('respite', 'dive-intently-hub.acct.workers.dev'), 'https://dive-respite-site.acct.workers.dev');
	assert.equal(resolveOrigin('hub', 'dive-hisab-site.acct.workers.dev'), 'https://dive-intently-hub.acct.workers.dev');
	assert.equal(resolveOrigin('hisab', 'intently-hub.acct.workers.dev'), 'https://hisab-site.acct.workers.dev');
	assert.equal(resolveOrigin('hub', 'pr-12-respite-site.acct.workers.dev'), 'https://pr-12-intently-hub.acct.workers.dev');
});

test('tests can point anywhere', () => {
	assert.equal(resolveOrigin('respite', 'localhost', { respite: 'http://127.0.0.1:8791/' }), 'http://127.0.0.1:8791');
});
