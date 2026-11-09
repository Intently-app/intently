// Draws the 1200x630 social card for the site and for each article into public/og/.
// Run after adding or retitling an article, then commit the images:
//   npm run build -w @intently/hisab-site && node apps/hisab/scripts/og-cards.mjs
// Uses the Playwright already in the workspace and the installed Chrome.
import { readdirSync, readFileSync } from 'node:fs';
import { chromium } from 'playwright';

const root = new URL('../', import.meta.url);
const font = (name) => readFileSync(new URL(`public/fonts/${name}`, root)).toString('base64');
const escape = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;');

function card(title, line) {
	return `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:B;src:url(data:font/woff2;base64,${font('besley.woff2')});font-weight:400 900}
@font-face{font-family:H;src:url(data:font/woff2;base64,${font('hind-latin-500.woff2')})}
*{box-sizing:border-box;margin:0}
body{width:1200px;height:630px;background:#EAF2E7;color:#14263F;border-left:26px solid #B3261E;padding:64px 84px 60px 72px;display:flex;flex-direction:column;justify-content:space-between;font-family:H}
.top{display:flex;align-items:center;gap:18px;font:700 42px/1 B}
h1{font:800 ${title.length > 48 ? 70 : 82}px/1.1 B;letter-spacing:-.012em;max-width:1000px;text-wrap:balance}
.bottom{border-top:6px double #B3261E;padding-top:20px;font-size:30px;color:#4A5B6B}
</style>
<div class="top"><svg width="56" height="56" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="#B3261E"/><path fill="#F6FAF2" d="M8 7h4.5v18H8zM19.5 7H24v18h-4.5zM12.5 13.6h7v1.5h-7zM12.5 16.9h7v1.5h-7z"/></svg>Hisab</div>
<h1>${escape(title)}</h1>
<div class="bottom">${escape(line)}</div>`;
}

const dir = new URL('src/content/articles/', root);
const articles = readdirSync(dir)
	.filter((f) => f.endsWith('.md'))
	.map((f) => {
		const front = readFileSync(new URL(f, dir), 'utf8').split('---')[1];
		return { slug: f.replace(/\.md$/, ''), title: JSON.parse(front.match(/^title:\s*(".*")$/m)[1]) };
	});

const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
const draw = async (name, title, line) => {
	await page.setContent(card(title, line), { waitUntil: 'load' });
	await page.evaluate(() => document.fonts.ready);
	await page.screenshot({ path: new URL(`public/og/${name}.png`, root).pathname, type: 'png' });
};
await draw('default', 'Say what you spent. Hisab keeps the books.', 'A ledger you fill in by talking to your AI or letting bank texts do it');
for (const a of articles) await draw(a.slug, a.title, 'Hisab articles');
await browser.close();
console.log(`${articles.length + 1} cards`);
