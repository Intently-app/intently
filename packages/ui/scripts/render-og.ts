/**
 * An app site's share image (Open Graph / Twitter): public/og.jpg, 1200×630. The app's own favicon
 * (its icon, or the monogram tools/create-app.mjs drew) on a field of its brand colour. Runs before
 * the site's build (`prebuild`, in the app's folder); the output is not committed.
 *   node ../../packages/ui/scripts/render-og.ts <app id>
 */
import { readFile } from 'node:fs/promises';
import sharp from 'sharp';
import { app } from '@intently/registry';
import { ogCardSvg } from '../src/og.ts';

const id = process.argv[2];
if (!id) throw new Error('usage: render-og.ts <app id>');
const a = app(id);
const mark = await readFile(a.icon ? `public${a.icon}` : 'public/favicon.svg', 'utf8');
await sharp(Buffer.from(ogCardSvg(a, mark)))
	.resize(1200, 630)
	.jpeg({ quality: 86, mozjpeg: true })
	.toFile('public/og.jpg');
console.log(`${id}: public/og.jpg`);
