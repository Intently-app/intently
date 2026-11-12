import { test } from 'node:test';
import assert from 'node:assert/strict';
import { FROM, RESEND_URL, handleContact, notAllowed } from './contact.ts';

const post = (fields: Record<string, string>) => {
	const body = new FormData();
	for (const [k, v] of Object.entries(fields)) body.set(k, v);
	return new Request('https://liveintently.app/api/contact', { method: 'POST', body });
};
const valid = { name: 'Test Person', email: 't@example.com', app: 'loop', message: 'hello there, a full sentence' };

/** A fetch stand-in that records the call and answers with the given status. */
const fakeFetch = (status = 200) => {
	const calls: { url: string; init: RequestInit }[] = [];
	const fn = (async (url: string, init: RequestInit) => {
		calls.push({ url, init });
		return new Response(JSON.stringify(status === 200 ? { id: 'x' } : { message: 'nope' }), { status });
	}) as unknown as typeof fetch;
	return { fn, calls };
};

test('GET answers 405 with Allow: POST', async () => {
	const res = notAllowed();
	assert.equal(res.status, 405);
	assert.equal(res.headers.get('allow'), 'POST');
	assert.equal((await res.json()).success, false);
});

test('an empty or non-form POST is a 400', async () => {
	const { fn, calls } = fakeFetch();
	const res = await handleContact(new Request('https://liveintently.app/api/contact', { method: 'POST' }), { apiKey: 'k', fetch: fn });
	assert.equal(res.status, 400);
	assert.equal(calls.length, 0);
});

test('the honeypot answers success and sends nothing, even without a key', async () => {
	const { fn, calls } = fakeFetch();
	const res = await handleContact(post({ ...valid, website: 'x' }), { fetch: fn });
	assert.equal(res.status, 200);
	assert.deepEqual(await res.json(), { success: true });
	assert.equal(calls.length, 0);
});

test('bad fields come back as 400 with one error per field', async () => {
	const { fn, calls } = fakeFetch();
	const res = await handleContact(post({ name: 'T', email: 'nope', message: 'short' }), { apiKey: 'k', fetch: fn });
	assert.equal(res.status, 400);
	assert.deepEqual(Object.keys((await res.json()).errors).sort(), ['email', 'message', 'name']);
	assert.equal(calls.length, 0);
});

test('a valid message goes to the chosen app inbox through the Resend API', async () => {
	const { fn, calls } = fakeFetch();
	const res = await handleContact(post(valid), { apiKey: 'secret', fetch: fn });
	assert.equal(res.status, 200);
	assert.equal(calls.length, 1);
	assert.equal(calls[0].url, RESEND_URL);
	assert.equal((calls[0].init.headers as Record<string, string>).Authorization, 'Bearer secret');
	const body = JSON.parse(calls[0].init.body as string);
	assert.equal(body.from, FROM);
	assert.deepEqual(body.to, ['loop@liveintently.app']);
	assert.equal(body.reply_to, 't@example.com');
	assert.match(body.subject, /^\[Loop\] Message from Test Person$/);
});

test('an unknown app goes to the studio inbox', async () => {
	const { fn, calls } = fakeFetch();
	await handleContact(post({ ...valid, app: '' }), { apiKey: 'k', fetch: fn });
	assert.deepEqual(JSON.parse(calls[0].init.body as string).to, ['support@liveintently.app']);
});

test('a missing key is a 503 and a Resend error a 502, both naming the inbox', async () => {
	const missing = await handleContact(post(valid), { fetch: fakeFetch().fn });
	assert.equal(missing.status, 503);
	assert.match((await missing.json()).message, /loop@liveintently\.app/);
	const failed = await handleContact(post(valid), { apiKey: 'k', fetch: fakeFetch(422).fn });
	assert.equal(failed.status, 502);
	const thrown = await handleContact(post(valid), { apiKey: 'k', fetch: (async () => { throw new Error('down'); }) as unknown as typeof fetch });
	assert.equal(thrown.status, 502);
});
