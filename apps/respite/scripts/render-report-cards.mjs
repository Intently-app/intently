// Build time: the social previews of the calculator's result pages, one 1200×630 PNG per daily-hours
// step (27: 1 h to 14 h in 0.5 h steps), at dist/images/report-card/og-<4-5h>.png.
//
// The previews show only the hours ("See what it adds up to"). A result page is static, one per step;
// the ages are in its query, which only the browser reads, so the years figures are drawn there, on
// the page itself (src/lib/report-card.ts). They are never approximated for a preview.
//
// Drawn from the same SVG as the page with resvg (WebAssembly, so the same in every CI runner) and the
// card's own Nunito files: sharp's SVG renderer (librsvg) would use whatever fonts the machine has.
// Nothing here runs on the Worker. Runs as an Astro integration after the build (astro.config.mjs);
// `node scripts/render-report-cards.mjs [outDir]` renders them by hand (default: dist).
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { initWasm, Resvg } from "@resvg/resvg-wasm";
import { cardSvg, DEFAULTS, HOUR_STEPS, ogImagePath } from "../src/lib/report-card.ts";

const root = fileURLToPath(new URL("..", import.meta.url));
const read = (p) => readFileSync(join(root, p));

let started;
/** Render every step's preview into outDir; returns the files written. */
export async function renderReportCards(outDir) {
	started ??= initWasm(readFileSync(createRequire(import.meta.url).resolve("@resvg/resvg-wasm/index_bg.wasm")));
	await started;
	const art = { fox: read("src/assets/card/biscuit-read-chart.svg").toString(), logo: read("src/assets/card/respite-mark.svg").toString() };
	const fontBuffers = ["public/fonts/card/nunito-700.ttf", "public/fonts/card/nunito-800.ttf"].map((p) => new Uint8Array(read(p)));
	const files = [];
	for (const h of HOUR_STEPS) {
		const svg = cardSvg({ ...DEFAULTS, h }, { format: "og", theme: "light", art, hoursOnly: true });
		const resvg = new Resvg(svg, { font: { fontBuffers, loadSystemFonts: false, defaultFontFamily: "Nunito" } });
		const png = resvg.render().asPng();
		resvg.free();
		const file = join(outDir, ogImagePath(h));
		mkdirSync(dirname(file), { recursive: true });
		writeFileSync(file, png);
		files.push(file);
	}
	return files;
}

/** Astro integration: runs after the build, writes the previews into dist. */
export default function reportCards() {
	return {
		name: "report-cards",
		hooks: {
			"astro:build:done": async ({ dir, logger }) => {
				const t = Date.now();
				const files = await renderReportCards(fileURLToPath(dir));
				logger.info(`${files.length} report card previews in ${Date.now() - t} ms`);
			},
		},
	};
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	const out = process.argv[2] ?? join(root, "dist");
	const files = await renderReportCards(out);
	console.log(`${files.length} report card previews in ${join(out, "images/report-card")}`);
}
