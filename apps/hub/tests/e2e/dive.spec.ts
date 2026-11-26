/**
 * The dive into an app's site (src/scripts/world/dive-ui.ts, packages/world): a plain click on an app
 * link flies into the scene and hands over with #intently=…; the browser keeps everything else.
 * The app's site is stubbed here; the hub runs on 127.0.0.1, where the dive is on (flags.ts).
 */
import { test, expect, type Page } from '@playwright/test';
import { scrollToScene, skipSplash, waitForWorld, world } from './helpers.ts';

const RESPITE = 'https://respite.liveintently.app';

/** Stand-ins for the app sites. `delay` holds the response back, so the hub's last frames stay on screen to be checked. */
async function stubApps(page: Page, delay = 0, prerender = false) {
	// A prerender would bypass these routes and load the real site: preconnect only, unless asked.
	if (!prerender) {
		await page.addInitScript(() => {
			const supports = HTMLScriptElement.supports.bind(HTMLScriptElement);
			HTMLScriptElement.supports = (type: string) => type !== 'speculationrules' && supports(type);
		});
	}
	await page.route(/^https:\/\/[a-z]+\.liveintently\.app\//, async (route) => {
		if (delay) await new Promise((r) => setTimeout(r, delay));
		await route.fulfill({ contentType: 'text/html', body: '<!doctype html><title>App</title><h1>App</h1><a href="https://liveintently.app/">Intently</a>' });
	});
}

async function atAttention(page: Page, delay = 0, slowmo = 10, prerender = false) {
	await skipSplash(page);
	// Software rendering draws a few frames a second: slow the flight down to watch it.
	await page.addInitScript((k) => { (window as unknown as { __intentlyDiveSlowmo: number }).__intentlyDiveSlowmo = k; }, slowmo);
	await stubApps(page, delay, prerender);
	await page.goto('/');
	expect(await waitForWorld(page)).toBe(true);
	await scrollToScene(page, 2);
	await page.waitForTimeout(600);
	return page.locator('[data-moment="attention"] a[href^="https://respite"]');
}

type Dive = { dive: { zeta: number; fill: number } | null };

test.beforeEach(({}, info) => test.skip(info.project.name !== 'desktop-chrome', 'the flight itself is checked in one browser'));
// Each flight is drawn in software here; one at a time keeps them on schedule.
test.describe.configure({ mode: 'serial' });

test('a plain click flies in, then hands over to the app with the chapter and tier', async ({ page }) => {
	const link = await atAttention(page);
	await expect(link).toHaveAttribute('href', RESPITE);
	await link.click({ noWaitAfter: true });
	await expect(page.locator('html')).toHaveClass(/diving/);
	await expect(page.locator('[aria-live="polite"]')).toHaveText('Opening Respite…');
	await expect.poll(async () => ((await world(page)) as unknown as Dive | null)?.dive?.zeta ?? 1).toBeGreaterThan(0.2);
	await page.waitForURL(/respite\.liveintently\.app/);
	expect(page.url()).toBe(`${RESPITE}/#intently=v1.respite.attention.full`);
});

test('pointing at an app link starts loading its page (Chromium prerenders it)', async ({ page }) => {
	const link = await atAttention(page, 0, 10, true);
	await link.hover();
	const rules = page.locator('script[type="speculationrules"]');
	await expect(rules).toHaveCount(1);
	expect(JSON.parse((await rules.textContent())!)).toEqual({ prerender: [{ urls: [`${RESPITE}/#intently=v1.respite.attention.full`], eagerness: 'immediate' }] });
});

test('going back flies out of the colour and lands on the hour it left', async ({ page }) => {
	const link = await atAttention(page);
	await link.click();
	await page.waitForURL(/respite\.liveintently\.app/);
	await page.goBack();
	expect(await waitForWorld(page)).toBe(true);
	await expect.poll(async () => (await world(page))?.u ?? -1).toBeGreaterThan(1.6);
	expect((await world(page))!.u).toBeLessThan(2.4);
	await expect(page.locator('html')).not.toHaveClass(/diving|returning/, { timeout: 20_000 });
	await expect(page.locator('[data-moment="attention"] a[href^="https://respite"]')).toBeFocused();
	expect(await page.evaluate(() => history.state?.dive ?? null)).toBeNull();
});

test('a link back from the app lands on its hour', async ({ page }) => {
	await skipSplash(page);
	await page.goto('/#from=hisab.wealth');
	expect(await waitForWorld(page)).toBe(true);
	await expect.poll(async () => (await world(page))?.u ?? -1).toBeGreaterThan(3.6);
	expect((await world(page))!.u).toBeLessThan(4.4);
	expect(new URL(page.url()).hash).toBe('');
});

test('Esc before the hand-over cancels the dive', async ({ page }) => {
	// Slower still: Esc has to land before the hand-over even on a loaded machine.
	const link = await atAttention(page, 0, 30);
	await link.click({ noWaitAfter: true });
	await expect(page.locator('html')).toHaveClass(/diving/);
	await page.keyboard.press('Escape');
	await expect(page.locator('html')).not.toHaveClass(/diving/, { timeout: 40_000 });
	await page.waitForTimeout(1000);
	expect(page.url()).not.toContain('respite');
	await expect(page.locator('html')).not.toHaveClass(/diving/);
});

test('modified clicks are the browser\'s', async ({ page, context }) => {
	const link = await atAttention(page);
	const popup = context.waitForEvent('page');
	await link.click({ modifiers: ['ControlOrMeta'] });
	await popup;
	await expect(page.locator('html')).not.toHaveClass(/diving/);
	expect(page.url()).not.toContain('respite');
});

test('with reduced motion an app link is a plain link', async ({ page }) => {
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await skipSplash(page);
	await stubApps(page);
	await page.goto('/');
	await page.locator('[data-moment="attention"] a[href^="https://respite"]').click();
	await page.waitForURL(/respite\.liveintently\.app/);
	expect(page.url()).toBe(`${RESPITE}/`);
});

test('apps without an arrival world navigate plainly', async ({ page }) => {
	await skipSplash(page);
	await stubApps(page);
	await page.goto('/');
	expect(await waitForWorld(page)).toBe(true);
	await scrollToScene(page, 1);
	await page.waitForTimeout(400);
	await page.locator('[data-moment="time"] a[href^="https://loop"]').click();
	await page.waitForURL(/loop\.liveintently\.app/);
	expect(page.url()).toBe('https://loop.liveintently.app/');
});
