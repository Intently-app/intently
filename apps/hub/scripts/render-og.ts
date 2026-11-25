/**
 * Share images (Open Graph / Twitter): public/og/<scene>.jpg, 1200×630, one per scene of the day,
 * rasterised from the same SVG landscapes the pages show (src/world/render-svg.ts). No text is drawn,
 * so the result doesn't depend on the fonts installed where the build runs; the card shows the title.
 * Runs before every build (`prebuild`); the output is not committed.
 */
import { mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { SCENES } from '../src/world/scenes.ts';
import { renderScene } from '../src/world/render-svg.ts';

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'public/og');
const logo = await readFile(path.join(root, 'public/brand/intently-logo.svg'), 'utf8');
const markInner = logo
	.replace(/^[\s\S]*?<\/title>/, '')
	.replace(/<\/svg>\s*$/, '')
	.replace(/id="/g, 'id="m-');

await mkdir(outDir, { recursive: true });
for (const scene of SCENES) {
	const svg = renderScene(scene, 'wide', markInner);
	const vb = /viewBox="0 0 (\d+(?:\.\d+)?) (\d+(?:\.\d+)?)"/.exec(svg);
	if (!vb) throw new Error(`${scene.id}: no viewBox`);
	const [w, h] = [Number(vb[1]), Number(vb[2])];
	// The wide landscape is composed for its middle 1600 units; crop to that band, then to 1.9:1 from
	// the bottom, as the page does (preserveAspectRatio xMidYMax slice).
	const scale = OG_WIDTH / 1600;
	const density = 72 * scale;
	const full = sharp(Buffer.from(svg), { density });
	const fw = Math.round(w * scale);
	const fh = Math.round(h * scale);
	const top = Math.max(0, fh - OG_HEIGHT);
	await full
		.extract({ left: Math.round((fw - OG_WIDTH) / 2), top, width: OG_WIDTH, height: Math.min(OG_HEIGHT, fh) })
		.resize(OG_WIDTH, OG_HEIGHT, { fit: 'cover', position: 'bottom' })
		.jpeg({ quality: 82, mozjpeg: true })
		.toFile(path.join(outDir, `${scene.id}.jpg`));
	console.log(`og/${scene.id}.jpg`);
}
