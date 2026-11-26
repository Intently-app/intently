import { test } from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { veilCss, veilScript } from './veil.ts';

/** Runs the veil script in a pretend browser and reports what it did. */
function run(hash: string, opts: { reduced?: boolean; prerendering?: boolean; app?: string } = {}) {
	const classes = new Set<string>();
	const attrs = new Map<string, string>();
	const listeners = new Map<string, () => void>();
	const timers: (() => void)[] = [];
	const events: string[] = [];
	const session = new Map<string, string>();
	let url = `/page/?q=1${hash}`;
	const window: Record<string, unknown> = {};
	const ctx = {
		window,
		location: { hash, pathname: '/page/', search: '?q=1' },
		history: { state: { keep: 1 }, replaceState: (_s: unknown, _t: string, u: string) => { url = u; } },
		matchMedia: () => ({ matches: !!opts.reduced }),
		performance: { now: () => 42 },
		sessionStorage: { setItem: (k: string, v: string) => session.set(k, v) },
		setTimeout: (f: () => void) => timers.push(f),
		CustomEvent: class { type: string; constructor(t: string) { this.type = t; } },
		document: {
			prerendering: !!opts.prerendering,
			documentElement: {
				classList: { add: (...c: string[]) => c.forEach((x) => classes.add(x)), remove: (...c: string[]) => c.forEach((x) => classes.delete(x)) },
				setAttribute: (k: string, v: string) => attrs.set(k, v),
				removeAttribute: (k: string) => attrs.delete(k),
			},
			addEventListener: (t: string, f: () => void) => listeners.set(t, f),
			dispatchEvent: (e: { type: string }) => events.push(e.type),
		},
	};
	Object.assign(window, ctx);
	vm.runInNewContext(veilScript(opts.app ?? 'respite'), ctx);
	return { classes, attrs, listeners, timers, events, session, url: () => url, arrival: window.__intentlyArrival as Record<string, unknown> | undefined };
}

test('a handoff for this app raises the veil and strips the fragment', () => {
	const r = run('#intently=v1.respite.attention.full');
	assert.equal(r.url(), '/page/?q=1');
	assert.ok(r.classes.has('arriving'));
	assert.equal(r.attrs.get('data-arrival'), 'full');
	assert.equal(r.arrival?.ch, 'attention');
	assert.equal(r.session.get('intently:chapter'), 'attention');
});

test('the veil always clears: parting after the wait, then the failsafe', () => {
	const r = run('#intently=v1.respite.attention.lite');
	assert.equal(r.timers.length, 2);
	r.timers[0]();
	assert.ok(r.classes.has('arrival-parting'), 'nothing took over, so CSS parts it');
	r.timers[1]();
	assert.ok(!r.classes.has('arriving'));
	assert.deepEqual(r.events, ['intently:arrived']);
	r.timers[2]();
	assert.deepEqual(r.events, ['intently:arrived'], 'only once');
});

test('a prerendered page starts its clock when it is shown', () => {
	const r = run('#intently=v1.respite.attention.full', { prerendering: true });
	assert.equal(r.timers.length, 0);
	assert.equal(r.arrival?.shownAt, undefined);
	r.listeners.get('prerenderingchange')!();
	assert.equal(r.timers.length, 2);
	assert.equal(r.arrival?.shownAt, 42);
});

test('reduced motion: the fragment goes, nothing else happens', () => {
	const r = run('#intently=v1.respite.attention.full', { reduced: true });
	assert.equal(r.url(), '/page/?q=1');
	assert.equal(r.classes.size, 0);
	assert.equal(r.arrival, undefined);
});

test('another app, a bad chapter or no handoff: no veil', () => {
	for (const h of ['#intently=v1.hisab.wealth.full', '#intently=v1.respite.lunch.full', '#intently=v1.respite.attention.fast', '#features', '']) {
		const r = run(h);
		assert.equal(r.classes.size, 0, h);
	}
	assert.equal(run('#features').url(), '/page/?q=1#features', 'other fragments stay');
});

test('ids and colours are checked before they go into the page', () => {
	assert.throws(() => veilScript("x'+alert(1)+'"));
	assert.throws(() => veilCss('red;}body{display:none'));
	assert.match(veilCss('#2F6079'), /background:#2F6079/);
});
