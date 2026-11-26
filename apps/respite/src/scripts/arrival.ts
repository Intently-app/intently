/**
 * Respite's arrival world: the visitor dived in from liveintently.app's Attention hour. The page opens
 * in Respite's colour (the veil, @intently/world); here that colour becomes mist, the mist keeps the
 * dive's speed, then parts from the middle. On wide screens the 3D phone then flies forward from the
 * distance into its place in the hero (PhoneJourney.astro waits for intently:arrived, so its start-up
 * never holds up the mist).
 *
 * The mist is one small WebGL2 shader on its own canvas, not three.js, so phones get it without the
 * 3D phone's download. Its first frame is exactly the veil's colour, so the hand-over can't be seen.
 */
import { runArrival, currentArrival, type ArrivalWorld } from '@intently/world/arrival';
import { app } from '@intently/registry';

const VS = `#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`;

const FS = `#version 300 es
precision highp float;
uniform vec2 uRes;
uniform vec3 uColor;
uniform float uOpen;
uniform float uZoom;
uniform float uTime;
out vec4 outColor;
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
	vec2 i = floor(p), f = fract(p);
	vec2 u = f * f * (3.0 - 2.0 * f);
	return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) {
	float v = 0.0, a = 0.5;
	for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
	return v;
}
void main() {
	vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
	// The mist comes towards you: its pattern grows as the dive slows to rest.
	vec2 q = uv * exp(-uZoom) * 2.2;
	float n = fbm(q + vec2(uTime * 0.05, -uTime * 0.03));
	float n2 = fbm(q * 2.1 - vec2(uTime * 0.08, 0.0));
	// A clearing from the middle, its edge torn by the mist itself.
	float r = length(uv * vec2(0.9, 1.0)) + (n - 0.5) * 0.35;
	float reach = uOpen * 1.35;
	float a = smoothstep(reach - 0.22, reach + 0.04, r) * (1.0 - smoothstep(0.82, 1.0, uOpen));
	// Flat colour while closed (it must equal the veil); wisps of light and shade as it opens.
	float wisp = (n2 - 0.5) * 0.22 * smoothstep(0.0, 0.25, uOpen);
	vec3 c = clamp(uColor + wisp, 0.0, 1.0);
	outColor = vec4(c * a, a);
}`;

function hexRgb(hex: string): [number, number, number] {
	return [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255) as [number, number, number];
}

export function startArrival(): void {
	const a = currentArrival();
	if (!a) return;
	const canvas = document.createElement('canvas');
	canvas.className = 'arrival-mist';
	canvas.setAttribute('aria-hidden', 'true');
	Object.assign(canvas.style, { position: 'fixed', inset: '0', width: '100vw', height: '100vh', zIndex: '2147482999', pointerEvents: 'none' });
	const gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: false });
	let draw: ((open: number, zoom: number) => void) | null = null;
	if (gl) {
		try {
			const sh = (type: number, src: string) => {
				const s = gl.createShader(type)!;
				gl.shaderSource(s, src);
				gl.compileShader(s);
				if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? 'shader');
				return s;
			};
			const prog = gl.createProgram()!;
			gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS));
			gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS));
			gl.linkProgram(prog);
			if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error('link');
			gl.useProgram(prog);
			const buf = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, buf);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
			const loc = gl.getAttribLocation(prog, 'aPos');
			gl.enableVertexAttribArray(loc);
			gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
			const u = (n: string) => gl.getUniformLocation(prog, n);
			gl.uniform3fv(u('uColor'), hexRgb(app('respite').color));
			const t0 = performance.now();
			// The mist is soft: it needn't be drawn at full resolution.
			const dpr = Math.min(devicePixelRatio || 1, 1);
			draw = (open, zoom) => {
				const w = Math.round(innerWidth * dpr);
				const h = Math.round(innerHeight * dpr);
				if (canvas.width !== w || canvas.height !== h) {
					canvas.width = w;
					canvas.height = h;
				}
				gl.viewport(0, 0, w, h);
				gl.uniform2f(u('uRes'), w, h);
				gl.uniform1f(u('uOpen'), open);
				gl.uniform1f(u('uZoom'), zoom);
				gl.uniform1f(u('uTime'), (performance.now() - t0) / 1000);
				gl.drawArrays(gl.TRIANGLES, 0, 3);
			};
		} catch {
			draw = null;
		}
	}

	const world: ArrivalWorld = {
		// Without WebGL2 the world never gets ready, and the veil parts in CSS.
		ready: draw ? Promise.resolve() : new Promise(() => {}),
		frame(progress, logZoom) {
			if (!canvas.isConnected) document.documentElement.appendChild(canvas);
			// The mist holds for a moment (still the dive's colour), then parts.
			draw?.(Math.max(0, (progress - 0.12) / 0.88), logZoom);
		},
		settle() {
			canvas.remove();
		},
	};
	void runArrival(world);
}
