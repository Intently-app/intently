// Render blog hero illustrations: art/heroes/svg/<slug>.svg -> public/images/blog/<slug>.{jpg,webp}
// Usage: node scripts/render-heroes.mjs [slug ...]   (no args = all)
//        node scripts/render-heroes.mjs --sheet       (also writes art/heroes/contact-sheet.jpg)
import { readdir, readFile, mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const srcDir = path.join(root, 'art/heroes/svg');
const outDir = path.join(root, 'public/images/blog');
const W = 1920;
const H = 1080;

const args = process.argv.slice(2);
const sheet = args.includes('--sheet');
const only = args.filter((a) => !a.startsWith('--'));

await mkdir(outDir, { recursive: true });
const files = (await readdir(srcDir)).filter((f) => f.endsWith('.svg')).sort();
const slugs = files.map((f) => f.replace(/\.svg$/, '')).filter((s) => !only.length || only.includes(s));

const rendered = [];
for (const slug of slugs) {
	const svg = await readFile(path.join(srcDir, `${slug}.svg`));
	const vb = /viewBox="0 0 (\d+(?:\.\d+)?) (\d+(?:\.\d+)?)"/.exec(svg.toString());
	if (!vb || Number(vb[1]) * 9 !== Number(vb[2]) * 16) {
		console.error(`✗ ${slug}: viewBox must be 16:9 (expected "0 0 1600 900")`);
		process.exitCode = 1;
		continue;
	}
	const density = (72 * W) / Number(vb[1]);
	const base = sharp(svg, { density }).resize(W, H).flatten({ background: '#F7FBFC' });
	const jpg = path.join(outDir, `${slug}.jpg`);
	const webp = path.join(outDir, `${slug}.webp`);
	await base.clone().jpeg({ quality: 80, mozjpeg: true }).toFile(jpg);
	await base.clone().webp({ quality: 78 }).toFile(webp);
	const kb = (f) => stat(f).then((s) => Math.round(s.size / 1024));
	console.log(`✓ ${slug}  jpg ${await kb(jpg)}KB  webp ${await kb(webp)}KB`);
	rendered.push(slug);
}

if (sheet) {
	const all = files.map((f) => f.replace(/\.svg$/, ''));
	const cols = 5;
	const tw = 480;
	const th = 270;
	const pad = 12;
	const rows = Math.ceil(all.length / cols);
	const tiles = await Promise.all(
		all.map(async (slug, i) => ({
			input: await sharp(path.join(outDir, `${slug}.jpg`)).resize(tw, th).toBuffer(),
			left: pad + (i % cols) * (tw + pad),
			top: pad + Math.floor(i / cols) * (th + pad),
		})),
	);
	await sharp({
		create: { width: pad + cols * (tw + pad), height: pad + rows * (th + pad), channels: 3, background: '#0B1C27' },
	})
		.composite(tiles)
		.jpeg({ quality: 82 })
		.toFile(path.join(root, 'art/heroes/contact-sheet.jpg'));
	console.log('✓ contact sheet');
}
