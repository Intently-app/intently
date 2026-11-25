/** Page to page within the hub: the chosen hour grows into its chapter (src/scripts/transitions.ts). */
import { test, expect } from '@playwright/test';
import { CHAPTERS } from '../../src/data/chapters.ts';
import { skipSplash } from './helpers.ts';

const PAGES = ['/', ...CHAPTERS.map((c) => c.path), '/about/'];

test('no page names more than one element for a transition', async ({ page }) => {
	test.setTimeout(120_000);
	// The names are the same with the live world or without it; without, the pages load quickly.
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await skipSplash(page);
	for (const path of PAGES) {
		await page.goto(path);
		const named = await page.evaluate(() => [...document.querySelectorAll('*')].map((el) => getComputedStyle(el).viewTransitionName).filter((n) => n && n !== 'none'));
		expect(new Set(named).size, path).toBe(named.length);
		expect(named.length, path).toBeLessThanOrEqual(1);
	}
});

test('the hour carries over from one chapter to the next, and the name is let go after', async ({ page }, info) => {
	// The home page works the same way. Here everything is drawn in software, and the browser skips a
	// cross-document transition when the new page is slow to first paint; so: up to three tries, and
	// the naming is checked on the first transition that runs.
	test.skip(info.project.name !== 'desktop-chrome', 'view transitions: Chromium');
	test.setTimeout(150_000);
	await skipSplash(page);
	await page.emulateMedia({ reducedMotion: 'no-preference' });
	await page.addInitScript(() => {
		addEventListener('pagereveal', (e) => {
			const vt = (e as Event & { viewTransition: ViewTransition | null }).viewTransition;
			const w = window as unknown as { __revealed: string | null };
			w.__revealed = vt ? 'pending' : null;
			// Read once the page's own handler (in the head, after this one) has named it.
			void vt?.ready.then(() => { w.__revealed = document.querySelector<HTMLElement>('main[data-chapter] .hero')?.style.viewTransitionName ?? ''; }, () => { w.__revealed = 'skipped'; });
		});
	});
	let named: string | null = null;
	for (let i = 0; i < 3 && !named; i++) {
		await page.goto('/time/');
		await page.locator('nav.day a.next').click();
		await page.waitForURL(/\/attention\/$/);
		await page.waitForTimeout(1500);
		const r = await page.evaluate(() => (window as unknown as { __revealed: string | null }).__revealed);
		if (r && r !== 'skipped' && r !== 'pending') named = r;
	}
	expect(named).toBe('chapter-hour');
	await expect.poll(() => page.locator('main .hero').evaluate((el) => (el as HTMLElement).style.viewTransitionName)).toBe('');
});

test('with reduced motion there is no page transition', async ({ page }, info) => {
	test.skip(info.project.name !== 'desktop-chrome', 'view transitions: Chromium');
	await skipSplash(page);
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.addInitScript(() => addEventListener('pagereveal', (e) => {
		(window as unknown as { __vt: boolean }).__vt = !!(e as Event & { viewTransition: unknown }).viewTransition;
	}));
	await page.goto('/time/');
	await page.locator('nav.day a.next').click();
	await page.waitForURL(/\/attention\/$/);
	expect(await page.evaluate(() => (window as unknown as { __vt: boolean }).__vt)).toBe(false);
});
