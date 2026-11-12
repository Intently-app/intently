// The build-time QR code (src/lib/qr-svg.ts): rasterise the SVG and decode it, in the light and the
// dark theme's colours (components/ui/QrCode.astro), so a phone camera can read what the site shows.
import { test } from "node:test";
import assert from "node:assert/strict";
import sharp from "sharp";
import jsQR from "jsqr";
import { QUIET, qrSvg, qrSvgPath } from "../src/lib/qr-svg.ts";

async function decode(svg, px = 240) {
	const { data, info } = await sharp(Buffer.from(svg)).resize(px, px, { kernel: "nearest" }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
	return jsQR(new Uint8ClampedArray(data), info.width, info.height)?.data ?? null;
}

for (const c of ["blog", "download"]) {
	const url = `https://respite.liveintently.app/get?c=${c}`;
	test(`QR for ?c=${c} decodes in light and dark colours`, async () => {
		assert.equal(await decode(qrSvg(url, "#13222d", "#ffffff")), url);
		assert.equal(await decode(qrSvg(url, "#0f1b24", "#e4edf2")), url);
		// Small, as on the page (about 3 px a module).
		assert.equal(await decode(qrSvg(url, "#13222d", "#ffffff"), 132), url);
	});
}

test("QR draws in currentColor with a 4-module quiet zone", () => {
	const svg = qrSvg("https://respite.liveintently.app/get?c=blog");
	assert.match(svg, /fill="currentColor"/);
	const { size, d } = qrSvgPath("https://respite.liveintently.app/get?c=blog");
	assert.equal(size, 33 + 2 * QUIET); // version 4 at level M
	const xs = [...d.matchAll(/M(\d+) (\d+)/g)].flatMap((m) => [Number(m[1]), Number(m[2])]);
	assert.equal(Math.min(...xs), QUIET);
});
