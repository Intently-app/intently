/**
 * Hisab's arrival world: the visitor dived in from liveintently.app's Wealth hour. The page opens in
 * Hisab's green (the veil, @intently/world); out of it come thin lines of light, still flying at the
 * dive's speed, which sort themselves into two columns, debit and credit, on the ledger sheet's own
 * rows, and come to rest on its totals' double rule: every entry balances. Then the green clears and
 * the sheet writes its first entry.
 *
 * Drawn with a 2D canvas: some 160 lines for a second needs no WebGL. No numbers, no amounts.
 */
import { runArrival, currentArrival, type ArrivalWorld } from '@intently/world/arrival';
import { app } from '@intently/registry';

interface Line {
	/** Where it starts, from the middle of the screen (px, at rest scale). */
	sx: number;
	sy: number;
	/** Where it lands (px, viewport). */
	tx: number;
	ty: number;
	w: number;
	delay: number;
}

const LINES = 160;
const rnd = (() => {
	let s = 20260;
	return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
})();

/** The rows the lines land on: under each debit and credit cell, and twice under the totals. */
function targets(): { x: number; y: number; w: number }[] {
	const sheet = document.querySelector<HTMLElement>('[data-sheet] .postings');
	const out: { x: number; y: number; w: number }[] = [];
	if (sheet) {
		const cells = [...sheet.querySelectorAll<HTMLElement>('td.num, th.num')];
		for (const c of cells) {
			const r = c.getBoundingClientRect();
			if (r.width === 0 || r.bottom < 0 || r.top > innerHeight) continue;
			out.push({ x: r.left + 6, y: r.bottom - 1, w: r.width - 12 });
			if (c.hasAttribute('data-total')) out.push({ x: r.left + 6, y: r.bottom + 3, w: r.width - 12 });
		}
	}
	if (out.length) return out;
	// No sheet in view: two columns of ruled lines in the middle of the screen.
	for (let i = 0; i < 12; i++) {
		for (const side of [-1, 1]) out.push({ x: innerWidth / 2 + side * 90 - (side < 0 ? 140 : 0), y: innerHeight * 0.3 + i * 26, w: 140 });
	}
	return out;
}

export function startArrival(): void {
	const a = currentArrival();
	if (!a) return;
	const canvas = document.createElement('canvas');
	canvas.setAttribute('aria-hidden', 'true');
	Object.assign(canvas.style, { position: 'fixed', inset: '0', width: '100vw', height: '100vh', zIndex: '2147482999', pointerEvents: 'none' });
	const ctx = canvas.getContext('2d');
	const color = app('hisab').color;
	const dpr = Math.min(devicePixelRatio || 1, 2);
	const spots = targets();
	const lines: Line[] = Array.from({ length: LINES }, (_, i) => {
		const t = spots[i % spots.length];
		const ang = rnd() * Math.PI * 2;
		const r = 40 + rnd() * Math.hypot(innerWidth, innerHeight) * 0.6;
		return { sx: Math.cos(ang) * r, sy: Math.sin(ang) * r * 0.7, tx: t.x, ty: t.y, w: t.w * (0.55 + 0.45 * rnd()), delay: rnd() * 0.25 };
	});
	const ease = (x: number) => 1 - (1 - x) ** 3;

	const draw = (progress: number, logZoom: number, fade = 1) => {
		if (!ctx) return;
		const w = Math.round(innerWidth * dpr);
		const h = Math.round(innerHeight * dpr);
		if (canvas.width !== w || canvas.height !== h) {
			canvas.width = w;
			canvas.height = h;
		}
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		ctx.clearRect(0, 0, innerWidth, innerHeight);
		// The green: whole at first (it must equal the veil), clearing as the lines find their rows.
		const green = Math.min(1, Math.max(0, 1 - (progress - 0.25) / 0.6)) * fade;
		ctx.globalAlpha = green;
		ctx.fillStyle = color;
		ctx.fillRect(0, 0, innerWidth, innerHeight);
		// The lines: flying out of the middle with the dive (scaled by its zoom), then onto their rows.
		const zoom = Math.exp(logZoom);
		const cx = innerWidth / 2;
		const cy = innerHeight / 2;
		ctx.lineCap = 'round';
		for (const l of lines) {
			const k = ease(Math.min(1, Math.max(0, (progress - l.delay) / (1 - l.delay))));
			const fx = cx + l.sx / zoom ** 0.5;
			const fy = cy + l.sy / zoom ** 0.5;
			const x = fx + (l.tx - fx) * k;
			const y = fy + (l.ty - fy) * k;
			const len = (12 + 40 * (1 - k)) * (1 - k) + l.w * k;
			ctx.globalAlpha = (0.35 + 0.65 * Math.min(1, progress * 3)) * fade;
			ctx.strokeStyle = '#f2fbef';
			ctx.lineWidth = 1.6 - 0.6 * k;
			ctx.beginPath();
			ctx.moveTo(x, y);
			ctx.lineTo(x + len, y);
			ctx.stroke();
		}
		ctx.globalAlpha = 1;
	};

	const world: ArrivalWorld = {
		// Without a 2D canvas (never, in practice), the veil parts in CSS.
		ready: ctx ? Promise.resolve() : new Promise(() => {}),
		frame(progress, logZoom) {
			if (!canvas.isConnected) document.documentElement.appendChild(canvas);
			draw(progress, logZoom);
		},
		settle() {
			if (!canvas.isConnected) return;
			// The lines rest on the sheet for a moment, then fade into it.
			const t0 = performance.now();
			const out = (now: number) => {
				const f = 1 - (now - t0) / 320;
				if (f <= 0) return canvas.remove();
				draw(1, 0, f);
				requestAnimationFrame(out);
			};
			requestAnimationFrame(out);
		},
	};
	void runArrival(world);
}
