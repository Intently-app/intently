// Render real app screens for the site from the Respite redesign canvas boards.
//   art/app-screens/boards/*.dc.html  -> public/images/app/<slug>.webp and <slug>-dark.webp
// The boards are copies of the canvas artboards (https://claude.ai/artifact/FMLE3b1pnN83XZ6AEGsVdg),
// saved with demo account data. Letter tiles next to a known app name are swapped for the real
// app icon (art/app-screens/icons, from Simple Icons, CC0).
//
// Usage: node scripts/render-app-screens.mjs [slug ...]   (no args = all)
//        node scripts/render-app-screens.mjs --sheet       (also writes art/app-screens/contact-sheet.jpg)
// Any email address outside example.com in a render fails it; APP_SHOTS_DENY adds words that must not appear.
// Needs Playwright's Chromium (npx playwright install chromium) and network access for Google Fonts.
import { readFile, mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

let chromium;
try {
	({ chromium } = await import('playwright'));
} catch {
	console.error('Playwright is not installed. Run: npm i -D playwright && npx playwright install chromium');
	process.exit(1);
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const art = path.join(root, 'art/app-screens');
const outDir = path.join(root, 'public/images/app');
const DPR = 2;
const MAX_KB = 140;
// Words that must never appear in a render (real names on the canvas), kept out of the repo:
// APP_SHOTS_DENY="Name,part-of-email" npm run render-app-screens
const DENY = (process.env.APP_SHOTS_DENY ?? '').split(',').map((w) => w.trim()).filter(Boolean);

const manifest = JSON.parse(await readFile(path.join(art, 'manifest.json'), 'utf8'));
const args = process.argv.slice(2);
const sheet = args.includes('--sheet');
const only = args.filter((a) => !a.startsWith('--'));
const shots = manifest.shots.filter((s) => !only.length || only.includes(s.slug));

// Icons as inline SVG strings, keyed by slug.
const icons = {};
for (const [slug, spec] of Object.entries(manifest.icons)) {
	icons[slug] = { ...spec, svg: await readFile(path.join(art, 'icons', `${slug}.svg`), 'utf8') };
}
const respiteIcon = await readFile(path.join(art, 'icons/respite.svg'), 'utf8');

const type = (f) => (f.endsWith('.css') ? 'text/css' : f.endsWith('.svg') ? 'image/svg+xml' : f.endsWith('.js') ? 'text/javascript' : 'text/html');

// Freeze motion at its end state, so entrance animations don't leave things half-faded.
const FREEZE = `*,*::before,*::after{animation-delay:-60s!important;animation-duration:1ms!important;animation-iteration-count:1!important;transition:none!important;caret-color:transparent!important}`;

await mkdir(outDir, { recursive: true });
const browser = await chromium.launch();
const rendered = [];
let failed = false;

for (const shot of shots) {
	for (const theme of ['light', 'dark']) {
		const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: shot.dpr ?? DPR });
		await page.route('http://board.local/**', async (route) => {
			const u = new URL(route.request().url());
			if (u.pathname.endsWith('support.js')) return route.fulfill({ body: '', contentType: 'text/javascript' });
			const f = u.pathname.startsWith('/_blob/') ? path.join(art, 'blobs', `${u.pathname.slice(7)}.svg`) : path.join(art, 'boards', decodeURIComponent(u.pathname));
			try {
				let body = await readFile(f);
				if (f.endsWith('.dc.html') && shot.replace) {
					let html = body.toString();
					for (const [from, to] of Object.entries(shot.replace)) {
						if (!html.includes(from)) throw new Error(`${shot.slug}: "${from}" not found in ${shot.board}`);
						html = html.split(from).join(to);
					}
					body = Buffer.from(html);
				}
				await route.fulfill({ body, contentType: type(f) });
			} catch (e) {
				if (e.message.includes('not found in')) console.error(`✗ ${e.message}`), (failed = true);
				await route.fulfill({ status: 404, body: '' });
			}
		});
		await page.goto(`http://board.local/${shot.board}.dc.html`);
		await page.addStyleTag({ content: FREEZE });
		await page.evaluate(
			async ({ theme, shot, icons, respiteIcon }) => {
				if (theme === 'dark') document.documentElement.dataset.theme = 'mist-dark';
				const board = document.querySelector('x-dc > div');
				// Transparent shots (sheets, toasts) keep only their own paint.
				if (shot.transparent) {
					document.documentElement.style.background = board.style.background = 'transparent';
					document.body.style.background = 'transparent';
				}
				for (const sel of shot.hide ?? []) for (const el of document.querySelectorAll(sel)) el.style.visibility = 'hidden';
				if (shot.hide?.length && shot.clipTo) for (const sel of shot.hide) for (const el of document.querySelectorAll(sel)) el.style.display = 'none';
				if (shot.expand) {
					board.style.height = 'auto';
					for (const el of board.querySelectorAll('main')) Object.assign(el.style, { overflow: 'visible', flex: 'none', height: 'auto' });
				}
				// Swap letter tiles for real app icons.
				const svgIn = (svg, color) => svg.replace('<svg ', `<svg fill="${color}" width="58%" height="58%" `).replace(/<title>.*?<\/title>/, '');
				for (const el of board.querySelectorAll('[aria-hidden="true"]')) {
					const letter = el.textContent.trim();
					if (el.children.length || !/^[A-Za-z]$/.test(letter)) continue;
					// The app name sits right after the tile ("Instagram", "x.com", "WhatsApp24m today").
					// …or plain text right after it ("<div>I</div>Instagram").
					const next = el.nextSibling?.textContent?.trim() ? el.nextSibling : el.nextElementSibling;
					const name = (next?.textContent ?? '').trim().toLowerCase().replace(/\d.*$/, '').trim();
					let html = null;
					let bg = null;
					let ring = false;
					for (const spec of Object.values(icons)) {
						if (new RegExp(spec.match).test(name)) {
							html = svgIn(spec.svg, spec.fg);
							bg = spec.bg;
							ring = !!spec.ring;
							break;
						}
					}
					if (!html && shot.respiteTile && letter === 'R') {
						html = respiteIcon.replace('<svg ', '<svg width="100%" height="100%" ');
						bg = 'transparent';
					}
					if (!html) continue;
					el.innerHTML = html;
					Object.assign(el.style, { background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', boxShadow: ring ? 'inset 0 0 0 1px rgba(0,0,0,.08)' : '' });
				}
				await document.fonts.ready;
				await Promise.all([...document.images].map((i) => (i.complete ? null : new Promise((r) => (i.onload = i.onerror = r)))));
			},
			{ theme, shot, icons, respiteIcon },
		);
		await page.waitForTimeout(150);

		// Guard: no real account data in what we publish.
		const text = await page.evaluate(() => document.querySelector('x-dc > div').innerText);
		const leak = DENY.find((w) => text.includes(w)) ?? text.match(/[\w.+-]+@(?!example\.com)[\w-]+\.[\w.]+/)?.[0];
		if (leak) {
			console.error(`✗ ${shot.slug}: personal data in render ("${leak}")`);
			failed = true;
			await page.close();
			continue;
		}

		const board = page.locator('x-dc > div').first();
		const b = await board.boundingBox();
		let clip;
		if (shot.full) clip = { x: b.x, y: b.y, width: b.width, height: Math.min(b.height, 844) };
		else if (shot.clipTo) {
			const boxes = await page.evaluate((sels) => sels.flatMap((s) => [...document.querySelectorAll(s)].map((e) => e.getBoundingClientRect().toJSON())).filter((r) => r.width), shot.clipTo);
			const [px, py] = shot.pad ?? [16, 16];
			const x1 = Math.max(b.x, Math.min(...boxes.map((r) => r.x)) - px);
			const y1 = Math.max(b.y, Math.min(...boxes.map((r) => r.y)) - py);
			const x2 = Math.min(b.x + b.width, Math.max(...boxes.map((r) => r.right)) + px);
			const y2 = Math.max(...boxes.map((r) => r.bottom)) + py;
			clip = { x: b.x, y: y1, width: b.width, height: y2 - y1 };
			if (x2 - x1 < b.width - 1) clip = { x: x1, y: y1, width: x2 - x1, height: y2 - y1 };
		} else {
			const [x, y, w, h] = shot.clip;
			clip = { x: b.x + x, y: b.y + y, width: w, height: h };
		}
		const png = await page.screenshot({ clip, fullPage: true, animations: 'disabled', omitBackground: !!shot.transparent });
		await page.close();

		const name = theme === 'dark' ? `${shot.slug}-dark` : shot.slug;
		const file = path.join(outDir, `${name}.webp`);
		await sharp(png).webp({ quality: 86, effort: 6 }).toFile(file);
		const kb = Math.round((await stat(file)).size / 1024);
		const w = Math.round(clip.width);
		const h = Math.round(clip.height);
		if (kb > MAX_KB) {
			console.error(`✗ ${name}: ${kb}KB is over ${MAX_KB}KB`);
			failed = true;
		} else console.log(`✓ ${name}  ${w}x${h}  ${kb}KB`);
		rendered.push({ name, file, w, h });
	}
}
await browser.close();

// Sizes for the site, so <img> gets width and height without guessing.
const sizes = Object.fromEntries(rendered.filter((r) => !r.name.endsWith('-dark')).map((r) => [r.name, [r.w, r.h]]));
if (!only.length) {
	const { writeFile } = await import('node:fs/promises');
	await mkdir(path.join(root, 'src/data'), { recursive: true });
	await writeFile(path.join(root, 'src/data/app-shots.json'), `{\n${Object.entries(sizes).map(([k, [w, h]]) => `\t"${k}": [${w}, ${h}]`).join(',\n')}\n}\n`);
}

if (sheet && rendered.length) {
	const H = 520;
	const tiles = await Promise.all(rendered.map(async (r) => sharp(r.file).resize({ height: H, fit: 'inside' }).toBuffer({ resolveWithObject: true })));
	const rows = [];
	let row = [];
	let rowW = 0;
	for (const t of tiles) {
		if (rowW + t.info.width > 3200 && row.length) rows.push(row), (row = []), (rowW = 0);
		row.push(t);
		rowW += t.info.width + 16;
	}
	rows.push(row);
	const W = Math.max(...rows.map((r) => r.reduce((s, t) => s + t.info.width + 16, 16)));
	const comp = [];
	rows.forEach((r, i) => {
		let x = 16;
		for (const t of r) comp.push({ input: t.data, left: x, top: 16 + i * (H + 16) }), (x += t.info.width + 16);
	});
	await sharp({ create: { width: W, height: rows.length * (H + 16) + 16, channels: 3, background: '#9aa4ad' } })
		.composite(comp)
		.jpeg({ quality: 80 })
		.toFile(path.join(art, 'contact-sheet.jpg'));
	console.log('✓ contact-sheet.jpg');
}
if (failed) process.exitCode = 1;
