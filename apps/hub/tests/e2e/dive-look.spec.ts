/** Not a test: frames of the dive for a person to look at (DIVE_LOOK=1). */
import { test } from '@playwright/test';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { extname, join } from 'node:path';
import { scrollToScene, skipSplash, waitForWorld } from './helpers.ts';

test.skip(!process.env.DIVE_LOOK, 'only on request');

for (const [ch, app, i] of [['attention', 'respite', 2], ['wealth', 'hisab', 4]] as const) {
	test(`dive frames ${ch}`, async ({ page }, info) => {
		test.skip(info.project.name !== 'desktop-chrome');
		await skipSplash(page);
		await page.goto('/');
		await waitForWorld(page);
		await scrollToScene(page, i);
		await page.waitForTimeout(800);
		for (const t of [0, 250, 400, 480, 560]) {
			await page.evaluate((p) => { (window as any).__intentlyWorld.preview = p; }, { app, ch, t });
			await page.waitForTimeout(250);
			await page.screenshot({ path: `${process.env.DIVE_LOOK}/${ch}-${t}.png` });
		}
	});
}

// The arrivals, a few stills each (served from the built sites, as in arrival.spec.ts).

for (const [id, ch] of [['respite', 'attention'], ['hisab', 'wealth']] as const) {
	test(`arrival frames ${id}`, async ({ page }, info) => {
		test.skip(info.project.name !== 'desktop-chrome');
		const dir = join(import.meta.dirname, `../../../${id}/dist`);
		const types: Record<string, string> = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.woff2': 'font/woff2' };
		await page.route(new RegExp(`^https://${id}\\.liveintently\\.app/`), (route) => {
			let file = join(dir, decodeURIComponent(new URL(route.request().url()).pathname));
			if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
			return existsSync(file) ? route.fulfill({ body: readFileSync(file), contentType: types[extname(file)] }) : route.fulfill({ status: 404 });
		});
		await page.route(/googletagmanager/, (r) => r.fulfill({ body: '' }));
		await page.setViewportSize({ width: 960, height: 760 });
		await page.goto(`https://${id}.liveintently.app/#intently=v1.${id}.${ch}.full`, { waitUntil: 'commit' });
		for (let i = 0; i < 6; i++) await page.screenshot({ path: `${process.env.DIVE_LOOK}/${id}-arrival-${i}.png`, animations: 'allow', scale: 'css' });
	});
}
