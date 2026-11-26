/** The share card of an app site (scripts/render-og.ts): its mark, large, on a field of its colour. */
import type { App } from '@intently/registry';

const shade = (hex: string, f: number) =>
	'#' + [1, 3, 5].map((i) => Math.round(parseInt(hex.slice(i, i + 2), 16) * f).toString(16).padStart(2, '0')).join('');

/** `mark` is an SVG document (the app's icon or favicon); it is nested, scaled to 300 units. */
export function ogCardSvg(a: App, mark: string): string {
	// Place the mark's own <svg> in a 300-unit square, whatever size it declared, rounded like an icon.
	const inner = mark
		.replace(/<\?xml[^>]*>/, '')
		.replace(/<svg\b[^>]*>/, (open) => open.replace(/\s(width|height|x|y)="[^"]*"/g, '').replace(/^<svg\b/, '<svg x="450" y="165" width="300" height="300"'));
	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">`
		+ `<defs><radialGradient id="g" cx="0.5" cy="0.42" r="0.75"><stop offset="0" stop-color="${a.color}"/><stop offset="1" stop-color="${shade(a.color, 0.55)}"/></radialGradient>`
		+ `<filter id="s" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="18" stdDeviation="22" flood-opacity="0.3"/></filter></defs>`
		+ `<rect width="1200" height="630" fill="url(#g)"/>`
		+ `<clipPath id="r"><rect x="450" y="165" width="300" height="300" rx="78"/></clipPath>`
		+ `<g filter="url(#s)"><g clip-path="url(#r)">${inner}</g></g>`
		+ `</svg>`;
}
