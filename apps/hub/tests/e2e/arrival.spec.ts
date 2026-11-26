/**
 * The other end of the dive: Respite's and Hisab's sites finish the flight (packages/world arrival,
 * apps/respite/src/scripts/arrival.ts, apps/hisab/src/scripts/arrival.ts). Their built sites are
 * served here under their real hosts from apps/<app>/dist (build them first; otherwise these skip).
 */
import { test, expect, type Page } from '@playwright/test';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { extname, join } from 'node:path';
import { scrollToScene, skipSplash, waitForWorld } from './helpers.ts';

const DIST = {
	respite: join(import.meta.dirname, '../../../respite/dist'),
	hisab: join(import.meta.dirname, '../../../hisab/dist'),
	loop: join(import.meta.dirname, '../../../loop/dist'),
};
const TYPES: Record<string, string> = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.json': 'application/json' };

async function serveApps(page: Page) {
	// Below 1000 px Respite keeps its flat phone: its 3D phone, drawn in software here, holds the page
	// for seconds after the arrival (in a browser with a GPU it starts in a moment).
	await page.setViewportSize({ width: 960, height: 760 });
	for (const [id, dir] of Object.entries(DIST)) {
		await page.route(new RegExp(`^https://${id}\\.liveintently\\.app/`), (route) => {
			const path = decodeURIComponent(new URL(route.request().url()).pathname);
			let file = join(dir, path);
			if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
			if (!existsSync(file)) return route.fulfill({ status: 404, body: '' });
			return route.fulfill({ body: readFileSync(file), contentType: TYPES[extname(file)] ?? 'application/octet-stream' });
		});
	}
	// Nothing leaves for analytics in tests.
	await page.route(/googletagmanager|google-analytics/, (r) => r.fulfill({ body: '' }));
	// A prerender would bypass these routes (and load the real site): preconnect only.
	await page.addInitScript(() => {
		const supports = HTMLScriptElement.supports.bind(HTMLScriptElement);
		HTMLScriptElement.supports = (type: string) => type !== 'speculationrules' && supports(type);
	});
	// When the arrival ends, by the page's own clock (a busy page can't answer the test right then).
	await page.addInitScript(() => document.addEventListener('intently:arrived', () => {
		const w = window as unknown as { __arrivedAt: number; __worldTook: boolean; __intentlyArrival?: { taken: boolean } };
		w.__arrivedAt = performance.now();
		w.__worldTook = !!w.__intentlyArrival?.taken;
	}));
}

const arrivedAt = (page: Page) => page.waitForFunction(() => (window as unknown as { __arrivedAt?: number }).__arrivedAt, null, { timeout: 60_000 })
	.then((h) => h.jsonValue() as Promise<number>);

/** Layout shifts on the page so far (Chromium). */
const shifts = (page: Page) => page.evaluate(() => new Promise<number>((done) => {
	let sum = 0;
	new PerformanceObserver((l) => { for (const e of l.getEntries() as (PerformanceEntry & { value: number; hadRecentInput: boolean })[]) if (!e.hadRecentInput) sum += e.value; })
		.observe({ type: 'layout-shift', buffered: true });
	setTimeout(() => done(sum), 50);
}));

test.beforeEach(({}, info) => {
	test.skip(info.project.name !== 'desktop-chrome', 'checked in one browser');
	test.skip(Object.values(DIST).some((d) => !existsSync(join(d, 'index.html'))), 'build apps/respite, apps/hisab and apps/loop first');
});
test.describe.configure({ mode: 'serial' });

// Respite and Hisab have worlds of their own; Loop stands for the sites with the shared mist.
for (const [id, ch] of [['respite', 'attention'], ['hisab', 'wealth'], ['loop', 'time']] as const) {
	test(`${id} opens in its colour, strips the hand-over and settles on its page`, async ({ page }) => {
		await serveApps(page);
		await page.goto(`https://${id}.liveintently.app/#intently=v1.${id}.${ch}.full`);
		expect(new URL(page.url()).hash).toBe('');
		const arrival = await page.evaluate(() => (window as unknown as { __intentlyArrival?: { app: string; ch: string } }).__intentlyArrival);
		expect(arrival).toMatchObject({ app: id, ch });
		// The world takes over from the veil and settles within about a second of the page starting.
		expect(await arrivedAt(page)).toBeLessThan(2500);
		// The site's own world finished the flight (not the veil's CSS fallback).
		expect(await page.evaluate(() => (window as unknown as { __worldTook: boolean }).__worldTook)).toBe(true);
		await expect(page.locator('html')).not.toHaveClass(/arriving/);
		await expect(page.locator('h1').first()).toBeVisible();
		// Nothing moved: the veil and the world are layers above the page.
		expect(await shifts(page)).toBeLessThan(0.01);
		// Links back to Intently say where the visitor came from, at click time.
		expect(await page.evaluate(() => sessionStorage.getItem('intently:chapter'))).toBe(ch);
	});

	test(`${id} without a hand-over loads no arrival`, async ({ page }) => {
		await serveApps(page);
		const scripts: string[] = [];
		page.on('request', (r) => r.resourceType() === 'script' && scripts.push(r.url()));
		await page.goto(`https://${id}.liveintently.app/`);
		await page.waitForLoadState('networkidle');
		await expect(page.locator('html')).not.toHaveClass(/arriving/);
		expect(scripts.filter((s) => /\/(arrival|mist)\.[^/]+\.js$/.test(s))).toEqual([]);
	});

	test(`${id} with reduced motion only strips the hand-over`, async ({ page }) => {
		await page.emulateMedia({ reducedMotion: 'reduce' });
		await serveApps(page);
		await page.goto(`https://${id}.liveintently.app/#intently=v1.${id}.${ch}.full`);
		expect(new URL(page.url()).hash).toBe('');
		await expect(page.locator('html')).not.toHaveClass(/arriving/);
		expect(await page.evaluate(() => 'x' + typeof (window as unknown as { __intentlyArrival?: object }).__intentlyArrival)).toBe('xundefined');
	});
}

test('the veil clears even when the arrival world never loads', async ({ page }) => {
	await serveApps(page);
	await page.route(/\/_astro\/arrival\.[^/]+\.js$/, (r) => r.abort());
	await page.goto('https://respite.liveintently.app/#intently=v1.respite.attention.full');
	// 1.5 s at most in a browser with a GPU; here the 3D phone's start-up, drawn in software, can hold
	// the main thread (and the timers) for a few seconds.
	await expect(page.locator('html')).not.toHaveClass(/arriving/, { timeout: 10_000 });
});

test('the whole flight: hub to Respite, and back', async ({ page }) => {
	test.setTimeout(150_000);
	await skipSplash(page);
	await serveApps(page);
	await page.goto('/');
	expect(await waitForWorld(page)).toBe(true);
	await scrollToScene(page, 2);
	await page.waitForTimeout(500);
	await page.locator('[data-moment="attention"] a[href^="https://respite"]').click();
	await page.waitForURL(/^https:\/\/respite\.liveintently\.app\//, { waitUntil: 'commit' });
	expect(await arrivedAt(page)).toBeLessThan(2500);
	// Its footer's link back to Intently carries the hour, at click time (the hub is on 127.0.0.1 here).
	await page.evaluate(() => { (window as unknown as { __intentlyHosts: Record<string, string> }).__intentlyHosts = { hub: location.origin }; });
	await page.goBack();
	expect(await waitForWorld(page)).toBe(true);
	await expect(page.locator('html')).not.toHaveClass(/returning|diving/, { timeout: 20_000 });
});
