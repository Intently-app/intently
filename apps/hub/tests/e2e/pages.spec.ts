/** Every page: loads, says what it is, has one h1, no errors, and never scrolls sideways. */
import { test, expect } from '@playwright/test';
import { CHAPTERS } from '../../src/data/chapters.ts';
import { collectErrors, expectNoHorizontalScroll, skipSplash } from './helpers.ts';

const PAGES = ['/', ...CHAPTERS.map((c) => c.path), '/about/', '/contact/', '/legal/privacy/', '/legal/terms/'];

test.beforeEach(async ({ page }) => {
	await skipSplash(page);
	await page.emulateMedia({ reducedMotion: 'reduce' });
});

for (const path of PAGES) {
	test(`page ${path}`, async ({ page }) => {
		const errors = collectErrors(page);
		const res = await page.goto(path);
		expect(res?.status()).toBe(200);
		await expect(page).toHaveTitle(/Intently/);
		const description = await page.locator('meta[name="description"]').getAttribute('content');
		expect(description?.length ?? 0).toBeGreaterThan(40);
		await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', new RegExp(`^https://liveintently\\.app${path.replace(/\//g, '\\/')}$`));
		await expect(page.locator('h1')).toHaveCount(1);
		await expect(page.locator('h1')).toBeVisible();
		await expectNoHorizontalScroll(page);
		expect(errors).toEqual([]);
	});
}

test('titles and descriptions are unique', async ({ page }) => {
	const seen = new Map<string, string>();
	for (const path of PAGES) {
		await page.goto(path);
		const key = `${await page.title()}|${await page.locator('meta[name="description"]').getAttribute('content')}`;
		expect(seen.get(key), `${path} duplicates ${seen.get(key)}`).toBeUndefined();
		seen.set(key, path);
	}
});

test('the 404 page answers with 404 and a way back to every hour', async ({ page }) => {
	const res = await page.goto('/no-such-page');
	expect(res?.status()).toBe(404);
	await expect(page.getByRole('link', { name: 'beginning' })).toHaveAttribute('href', '/');
	for (const c of CHAPTERS) await expect(page.locator(`.hours a[href="${c.path}"]`)).toBeVisible();
});

test('header and footer links lead somewhere real', async ({ page, request }) => {
	await page.goto('/time/');
	const hrefs = await page.locator('header a, footer a').evaluateAll((as) => as.map((a) => (a as HTMLAnchorElement).getAttribute('href')!));
	for (const href of new Set(hrefs)) {
		if (!href.startsWith('/') || href.startsWith('/#')) continue;
		const res = await request.get(href);
		expect(res.status(), href).toBe(200);
	}
});

test('every page has a share image and card that exist', async ({ page, request }) => {
	for (const path of PAGES) {
		await page.goto(path);
		const image = await page.locator('meta[property="og:image"]').getAttribute('content');
		expect(image, path).toMatch(/^https:\/\/liveintently\.app\/og\/[a-z]+\.jpg$/);
		await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
		await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute('content', /.{20,}/);
		const res = await request.get(new URL(image!).pathname);
		expect(res.status(), image!).toBe(200);
		expect(res.headers()['content-type']).toContain('image/jpeg');
	}
});

test('answer engines get llms.txt, llms-full.txt and every AI crawler is welcome', async ({ request }) => {
	for (const file of ['/llms.txt', '/llms-full.txt']) {
		const res = await request.get(file);
		expect(res.status(), file).toBe(200);
		expect(res.headers()['content-type']).toContain('text/plain');
		const body = await res.text();
		for (const c of CHAPTERS) expect(body, `${file} ${c.id}`).toContain(c.path);
	}
	const robots = await (await request.get('/robots.txt')).text();
	for (const bot of ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended']) expect(robots).toContain(`User-agent: ${bot}`);
	expect(robots).toContain('Sitemap: https://liveintently.app/sitemap-index.xml');
});

test('the home page lists every app by the @id its own site declares', async ({ page }) => {
	await page.goto('/');
	const graph = await page.locator('script[type="application/ld+json"]').evaluateAll((els) => els.map((e) => JSON.parse(e.textContent!)));
	const list = graph.find((g) => g['@type'] === 'ItemList');
	expect(list.itemListElement.map((i: { item: { '@id': string } }) => i.item['@id'])).toContain('https://respite.liveintently.app/#software');
	expect(graph.find((g) => g['@type'] === 'WebSite')?.['@id']).toBe('https://liveintently.app/#website');
});
