// The screen time report card: the calculator's result as one shareable picture.
//
// Pure (no DOM, no imports), so the same code draws the card everywhere:
//   - on /screen-time-calculator/ in the browser, shown with the result and turned into a PNG to share
//     or download (canvas, client side);
//   - on the result page /screen-time-calculator/r/?h=…&age=…&first=… (inline SVG);
//   - as that page's social preview, /screen-time-calculator/card.png?… (resvg on the Worker).
// Tested by scripts/report-card.test.mjs.
//
// A share link carries only the three numbers the card needs, all from the calculator's inputs:
// daily hours, current age, age at the first smartphone. They are validated and snapped to the
// calculator's own steps and ranges, so a link can't put arbitrary text or numbers on the card.

export type CardInput = { h: number; age: number; first: number };

/** The calculator's own input ranges (hours slider 1–14 in 0.5 steps, age 10–90, first phone 5–60). */
export const LIMITS = {
	h: { min: 1, max: 14, step: 0.5 },
	age: { min: 10, max: 90 },
	first: { min: 5, max: 60 },
} as const;

/** Lifetime expectancy the calculator counts the years ahead to. */
const LIFE = 80;
const HOURS_PER_YEAR = 8760;

const clamp = (n: number, min: number, max: number) => Math.min(Math.max(n, min), max);

/** A number from a query value: plain decimal text only ("4.5", "28"), anything else is null. */
function num(raw: string | null | undefined): number | null {
	if (raw == null) return null;
	const s = raw.trim();
	if (!/^\d{1,3}(\.\d{1,3})?$/.test(s)) return null;
	const n = Number(s);
	return Number.isFinite(n) ? n : null;
}

/** Daily hours snapped to the nearest slider step (the "bucket"), within the slider's range. */
export function snapHours(h: number): number {
	const { min, max, step } = LIMITS.h;
	return clamp(Math.round(h / step) * step, min, max);
}

/** Validated, clamped input from a query string, or null when a number is missing or not a number. */
export function parseCardParams(search: string | URLSearchParams): CardInput | null {
	const q = typeof search === 'string' ? new URLSearchParams(search) : search;
	const h = num(q.get('h'));
	const age = num(q.get('age'));
	const first = num(q.get('first'));
	if (h === null || age === null || first === null) return null;
	return normalize({ h, age, first });
}

/** The calculator's starting values, used for a number that isn't one (an emptied age field). */
export const DEFAULTS: CardInput = { h: 4, age: 28, first: 14 };

const or = (n: number, d: number) => (Number.isFinite(n) ? n : d);

/** Snap and clamp an input the way the calculator's controls do; the first phone can't come after today. */
export function normalize({ h, age, first }: CardInput): CardInput {
	const a = clamp(Math.round(or(age, DEFAULTS.age)), LIMITS.age.min, LIMITS.age.max);
	return {
		h: snapHours(or(h, DEFAULTS.h)),
		age: a,
		first: Math.min(clamp(Math.round(or(first, DEFAULTS.first)), LIMITS.first.min, LIMITS.first.max), a),
	};
}

/** The query string for a share link or the card image, always in one order: h, age, first. */
export function cardQuery(input: CardInput): string {
	const { h, age, first } = normalize(input);
	return `h=${h}&age=${age}&first=${first}`;
}

export type Span = { value: string; unit: 'years' | 'days' | 'day' };

/** Hours as years with one decimal, as the calculator shows them; under a year, as days. */
export function span(hours: number): Span {
	if (hours >= HOURS_PER_YEAR) return { value: (hours / HOURS_PER_YEAR).toFixed(1), unit: 'years' };
	const days = Math.round(hours / 24);
	return { value: String(days), unit: days === 1 ? 'day' : 'days' };
}

/**
 * The calculator's math, unchanged: lifetime hours = daily hours × 365 × years with a phone (at least 1).
 * "Cut 1 hour" is the calculator's 1-hour pledge over its own horizon, the years left to 80
 * (the same span its future-hours figure uses): 1 hour × 365 × years left (at least 1).
 */
export function cardStats(input: CardInput) {
	const { h, age, first } = input;
	const yearsWithPhone = Math.max(age - first, 1);
	const lifetimeHours = Math.round(h * 365 * yearsWithPhone);
	const backHours = Math.round(1 * 365 * Math.max(LIFE - age, 1));
	return { lifetimeHours, lifetime: span(lifetimeHours), backHours, back: span(backHours) };
}

/** "4h", "4.5h". */
export const dailyLabel = (h: number) => `${Number.isInteger(h) ? h : h.toFixed(1)}h`;

/** One sentence that says what the card shows (alt text, aria-label, share text). */
export function cardSentence(input: CardInput): string {
	const { lifetime, back } = cardStats(input);
	const hrs = Number.isInteger(input.h) ? input.h : input.h.toFixed(1);
	return `My screen time: ${hrs} hours a day = ${lifetime.value} ${lifetime.unit} of my life. Cut 1 hour a day, get ${back.value} ${back.unit} back.`;
}

// ------------------------------------------------------------ drawing

export type Theme = 'light' | 'dark';
/** og: 1200×630 social preview. post: 1080×1350, the picture people share or save (4:5, fits feeds). */
export type Format = 'og' | 'post';
export type CardArt = { fox: string; logo: string };

export const SIZES: Record<Format, { w: number; h: number }> = {
	og: { w: 1200, h: 630 },
	post: { w: 1080, h: 1350 },
};

export const SITE = 'respite.liveintently.app';

/** Mist, from src/styles/info-pages.css and design-system.css: teal for time back, coral for the cost. */
const PALETTE = {
	light: {
		ground: '#f2f6f9', paper: '#ffffff', ink: '#13222d', soft: '#46596a', accent: '#2f6079', accentSoft: '#e2eef4',
		coralSoft: '#fce8e4', coralInk: '#a9493b', coral: '#e0715c', tealSoft: '#ddf1ec', tealInk: '#25705f', teal: '#3aa88f',
		shadow: 0.05,
	},
	dark: {
		ground: '#0f1b24', paper: '#172a35', ink: '#e8f2f7', soft: '#b4c8d4', accent: '#8ec1d6', accentSoft: '#1d3a4a',
		coralSoft: '#3b2528', coralInk: '#f6b4a9', coral: '#e0715c', tealSoft: '#1b3631', tealInk: '#8ad5c4', teal: '#3aa88f',
		shadow: 0.22,
	},
} as const;

const FONT = `font-family="Nunito, 'Nunito Variable', system-ui, sans-serif"`;

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

/**
 * A soft shadow under a surface, as a few faint stacked shapes. A blur filter looks the same but costs
 * ~20× the render time (350 ms vs 20 ms for the og card), and the og card is drawn on a Worker.
 */
function shadow(x: number, y: number, w: number, h: number, rx: number, strength: number): string {
	// Only the band along the bottom edge shows, so only that is drawn (a full-size layer costs as much as the card).
	const top = y + h - 3 * rx;
	return [4, 10, 18, 28]
		.map((d, i) => `<rect x="${x + d / 2}" y="${top}" width="${w - d}" height="${3 * rx + d}" rx="${rx}" fill="#0b151c" fill-opacity="${(strength / (i + 2.2)).toFixed(3)}"/>`)
		.join('');
}

/** A whole <svg> file placed in a box, its ids prefixed so two cards on one page don't collide. */
function place(markup: string, prefix: string, x: number, y: number, size: number): string {
	const m = markup.match(/<svg\b[^>]*?viewBox="([^"]+)"[^>]*>([\s\S]*)<\/svg>\s*$/);
	if (!m) return '';
	const inner = m[2]
		.replace(/<!--[\s\S]*?-->/g, '')
		.replace(/\bid="([^"]+)"/g, `id="${prefix}$1"`)
		.replace(/url\(#([^)]+)\)/g, `url(#${prefix}$1)`);
	return `<svg x="${x}" y="${y}" width="${size}" height="${size}" viewBox="${m[1]}">${inner}</svg>`;
}

type Tile = { x: number; y: number; w: number; h: number; fill: string; ink: string; badge: string; badgeFill: string; value: string; cap1: string; cap2: string };

function tile(t: Tile, s: { badge: number; value: number; cap: number }): string {
	const cx = t.x + t.w / 2;
	const r = s.badge;
	const top = t.y + t.h * 0.1 + r;
	const bw = 2 * r + (t.badge.length - 1) * r * 0.7;
	return [
		`<rect x="${t.x}" y="${t.y}" width="${t.w}" height="${t.h}" rx="${Math.round(t.w * 0.1)}" fill="${t.fill}"/>`,
		`<rect x="${cx - bw / 2}" y="${top - r}" width="${bw}" height="${2 * r}" rx="${r}" fill="${t.badgeFill}"/>`,
		`<text x="${cx}" y="${top + r * 0.34}" text-anchor="middle" font-size="${r * 0.95}" font-weight="800" fill="#ffffff">${esc(t.badge)}</text>`,
		`<text x="${cx}" y="${top + r + s.value * 1.02}" text-anchor="middle" font-size="${s.value}" font-weight="800" fill="${t.ink}">${esc(t.value)}</text>`,
		`<text x="${cx}" y="${top + r + s.value * 1.02 + s.cap * 1.45}" text-anchor="middle" font-size="${s.cap}" font-weight="800" fill="${t.ink}">${esc(t.cap1)}</text>`,
		`<text x="${cx}" y="${top + r + s.value * 1.02 + s.cap * 2.75}" text-anchor="middle" font-size="${s.cap}" font-weight="700" fill="${t.ink}" fill-opacity="0.8">${esc(t.cap2)}</text>`,
	].join('');
}

export type CardOptions = {
	format: Format;
	theme: Theme;
	art: CardArt;
	/** Prefix for every id in the drawing (two cards on one page). */
	idPrefix?: string;
	/** @font-face rules to embed (a PNG drawn from an <img> can't see the page's fonts). */
	fontCss?: string;
};

/** The report card as a standalone SVG document. */
export function cardSvg(raw: CardInput, opts: CardOptions): string {
	const input = normalize(raw);
	const { lifetime, back } = cardStats(input);
	const c = PALETTE[opts.theme];
	const p = opts.idPrefix ?? 'rc-';
	const { w, h } = SIZES[opts.format];
	const daily = dailyLabel(input.h);
	const coral = { fill: c.coralSoft, ink: c.coralInk, badge: '=', badgeFill: c.coral, value: lifetime.value, cap1: `${lifetime.unit} of my life`, cap2: 'on screens' };
	const teal = { fill: c.tealSoft, ink: c.tealInk, badge: '−1h', badgeFill: c.teal, value: back.value, cap1: `${back.unit} back`, cap2: 'if I cut 1 hour a day' };

	const body: string[] = [];
	if (opts.format === 'post') {
		const pad = 48;
		body.push(shadow(pad, pad, w - 2 * pad, h - 2 * pad, 64, c.shadow));
		body.push(`<rect x="${pad}" y="${pad}" width="${w - 2 * pad}" height="${h - 2 * pad}" rx="64" fill="${c.paper}"/>`);
		body.push(`<circle cx="540" cy="300" r="172" fill="${c.accentSoft}"/>`);
		body.push(place(opts.art.fox, `${p}fox-`, 390, 142, 300));
		body.push(`<text x="540" y="566" text-anchor="middle" font-size="56" font-weight="800" fill="${c.ink}">My screen time report</text>`);
		body.push(`<text x="540" y="716" text-anchor="middle" font-weight="800"><tspan font-size="150" fill="${c.accent}">${esc(daily)}</tspan><tspan font-size="52" fill="${c.soft}" dx="14">a day</tspan></text>`);
		const s = { badge: 34, value: 96, cap: 32 };
		body.push(tile({ x: 112, y: 776, w: 416, h: 330, ...coral }, s));
		body.push(tile({ x: 552, y: 776, w: 416, h: 330, ...teal }, s));
		body.push(place(opts.art.logo, `${p}logo-`, 512, 1136, 56));
		body.push(`<text x="540" y="1238" text-anchor="middle" font-size="34" font-weight="800" fill="${c.soft}">${SITE}</text>`);
	} else {
		const pad = 28;
		body.push(shadow(pad, pad, w - 2 * pad, h - 2 * pad, 48, c.shadow));
		body.push(`<rect x="${pad}" y="${pad}" width="${w - 2 * pad}" height="${h - 2 * pad}" rx="48" fill="${c.paper}"/>`);
		// Left: Biscuit and the site. Right: the numbers.
		body.push(`<circle cx="290" cy="270" r="182" fill="${c.accentSoft}"/>`);
		body.push(place(opts.art.fox, `${p}fox-`, 130, 104, 320));
		body.push(place(opts.art.logo, `${p}logo-`, 270, 478, 40));
		body.push(`<text x="290" y="560" text-anchor="middle" font-size="26" font-weight="800" fill="${c.soft}">${SITE}</text>`);
		const cx = 836;
		body.push(`<text x="${cx}" y="118" text-anchor="middle" font-size="42" font-weight="800" fill="${c.ink}">My screen time report</text>`);
		body.push(`<text x="${cx}" y="236" text-anchor="middle" font-weight="800"><tspan font-size="112" fill="${c.accent}">${esc(daily)}</tspan><tspan font-size="40" fill="${c.soft}" dx="10">a day</tspan></text>`);
		const s = { badge: 24, value: 70, cap: 24 };
		body.push(tile({ x: 544, y: 276, w: 280, h: 290, ...coral }, s));
		body.push(tile({ x: 848, y: 276, w: 280, h: 290, ...teal }, s));
	}

	const style = opts.fontCss ? `<style>${opts.fontCss}</style>` : '';
	return (
		`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" ${FONT}>` +
		`${style}<rect width="${w}" height="${h}" fill="${c.ground}"/>${body.join('')}</svg>`
	);
}
