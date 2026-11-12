// A QR code as a small inline SVG, built at build time (components/ui/QrCode.astro). The dark
// modules are one path in currentColor, so the page's colours draw it; the quiet zone (4 modules,
// as the spec asks) is part of the viewBox. Tested by decoding it: scripts/qr-svg.test.mjs.
// Keep the syntax erasable (plain annotations only): Node strips the types when the test imports it.
import QRCode from 'qrcode';

export const QUIET = 4;

export function qrSvgPath(text: string): { size: number; d: string } {
	const { modules } = QRCode.create(text, { errorCorrectionLevel: 'M' });
	const n = modules.size;
	let d = '';
	// One rectangle per run of dark modules in a row: a far shorter path than one square each.
	for (let y = 0; y < n; y++) {
		let x = 0;
		while (x < n) {
			if (!modules.data[y * n + x]) { x++; continue; }
			const start = x;
			while (x < n && modules.data[y * n + x]) x++;
			d += `M${start + QUIET} ${y + QUIET}h${x - start}v1h${start - x}z`;
		}
	}
	return { size: n + QUIET * 2, d };
}

/** The whole <svg>, for tests and anything outside Astro. */
export function qrSvg(text: string, ink = 'currentColor', paper?: string): string {
	const { size, d } = qrSvgPath(text);
	const bg = paper ? `<rect width="${size}" height="${size}" fill="${paper}"/>` : '';
	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" shape-rendering="crispEdges">${bg}<path fill="${ink}" d="${d}"/></svg>`;
}
