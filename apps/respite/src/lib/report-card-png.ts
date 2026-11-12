// Server side: the report card SVG as a PNG, with resvg compiled to WebAssembly (runs on Workers).
//
// The fonts are Nunito 700 and 800 as static TrueType files (resvg wants TrueType), instanced
// and subset to Basic Latin from @fontsource-variable/nunito with fontTools. They are served from
// /fonts/card/ so the browser can draw the same card; here they are read through the ASSETS binding.
import { initWasm, Resvg } from '@resvg/resvg-wasm';
import resvgWasm from '@resvg/resvg-wasm/index_bg.wasm?module';

export const CARD_FONTS = ['/fonts/card/nunito-700.ttf', '/fonts/card/nunito-800.ttf'];

let ready: Promise<void> | undefined;
let fonts: Promise<Uint8Array[]> | undefined;

/** The PNG bytes of an SVG document. `load` fetches a site file (the fonts). */
export async function svgToPng(svg: string, load: (path: string) => Promise<Response>): Promise<Uint8Array<ArrayBuffer>> {
	// Once per isolate; a failed start is retried on the next request.
	ready ??= initWasm(resvgWasm).catch((e) => {
		ready = undefined;
		throw e;
	});
	fonts ??= Promise.all(
		CARD_FONTS.map(async (path) => {
			const res = await load(path);
			if (!res.ok) throw new Error(`${path}: ${res.status}`);
			return new Uint8Array(await res.arrayBuffer());
		}),
	).catch((e) => {
		fonts = undefined;
		throw e;
	});
	const [, fontBuffers] = await Promise.all([ready, fonts]);
	const resvg = new Resvg(svg, { font: { fontBuffers, loadSystemFonts: false, defaultFontFamily: 'Nunito' } });
	try {
		return resvg.render().asPng() as Uint8Array<ArrayBuffer>;
	} finally {
		resvg.free();
	}
}
