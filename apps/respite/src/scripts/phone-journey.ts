/**
 * One 3D phone that travels down the Home page (desktop, WebGL2, motion allowed).
 *
 * - The page marks where the phone belongs with [data-phone-slot="hero|how|features|end"].
 *   Each frame the phone sits on the slot most in view; between two slots it travels (and turns once).
 * - Each slot has a story. Its progress comes from the slot's scroll track ([data-story-track]), or,
 *   for the hero, from HeroPhone's --p. The story is drawn as layers (real app screens from
 *   public/images/app/3d-*.webp) into a texture that is the phone's screen.
 * - The phone body is built here (an extruded rounded rectangle), no model file.
 *
 * index.astro loads this only when the device can take it; otherwise the CSS phone stays.
 */
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

type SlotName = 'hero' | 'how' | 'features' | 'end';
type LayerState = { x?: number; y?: number; s?: number; o?: number };

const SW = 390; // screen, in app pixels
const SH = 844;
const PHONE_W = 1;
const PHONE_H = 2.12;
const PHONE_D = 0.06;

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
/** 0 before a, 1 after b, eased in between. */
const seg = (p: number, a: number, b: number) => ease(clamp((p - a) / (b - a)));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

// Screens, by layer name: [image slug, width, height] (sheets and toasts are not full screen).
const LAYERS: Record<string, [string, number, number]> = {
	launcher: ['3d-launcher', SW, SH],
	facebook: ['3d-facebook', SW, SH],
	pauseFb: ['3d-pause-facebook', SW, SH],
	tiktok: ['3d-tiktok', SW, SH],
	pauseTt: ['3d-pause-tiktok', SW, SH],
	home: ['3d-home', SW, SH],
	addSheet: ['3d-addsheet', SW, 478],
	limitSheet: ['3d-limitsheet', SW, 608],
	reward: ['3d-reward', SW, SH],
	toastWalked: ['3d-toast-walked', SW, 98],
	toastSnoozed: ['3d-toast-snoozed', SW, 98],
	focus: ['3d-focus', SW, SH],
	journey: ['3d-journey', SW, SH],
	insights: ['3d-insights', SW, SH],
	devices: ['3d-devices', SW, SH],
	ai: ['3d-ai', SW, SH],
};

// Where things are on the screens (measured on the boards).
const AT = {
	facebook: [59, 517],
	tiktok: [59, 620],
	respite: [331, 620],
	leave: [195, 661],
	cont: [195, 724],
	snooze: [195, 775],
	tiktokRow: [195, 709], // in the Add an app sheet, on screen
	save: [195, 790],
} as const;

// How the phone turns on each slot (radians).
const POSE: Record<SlotName, { y: number; x: number }> = {
	hero: { y: -0.42, x: 0.16 },
	how: { y: 0.36, x: 0.1 },
	features: { y: -0.36, x: 0.1 },
	end: { y: 0.3, x: 0.12 },
};

export async function startPhoneJourney(canvas: HTMLCanvasElement): Promise<() => void> {
	const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
	renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
	renderer.outputColorSpace = THREE.SRGBColorSpace;
	renderer.toneMapping = THREE.ACESFilmicToneMapping;
	renderer.toneMappingExposure = 1;

	// ---------------------------------------------------------------- world
	const scene = new THREE.Scene();
	const pmrem = new THREE.PMREMGenerator(renderer);
	scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
	const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
	camera.position.set(0, 0, 10);
	const key = new THREE.DirectionalLight(0xffffff, 1.2);
	key.position.set(-3, 4, 6);
	scene.add(key, new THREE.AmbientLight(0xffffff, 0.35));

	// ---------------------------------------------------------------- the phone
	const phone = new THREE.Group();
	const tilt = new THREE.Group(); // pose and travel spin
	tilt.add(phone);
	scene.add(tilt);

	const rounded = (w: number, h: number, r: number) => {
		const s = new THREE.Shape();
		s.moveTo(-w / 2 + r, -h / 2);
		s.lineTo(w / 2 - r, -h / 2);
		s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
		s.lineTo(w / 2, h / 2 - r);
		s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
		s.lineTo(-w / 2 + r, h / 2);
		s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
		s.lineTo(-w / 2, -h / 2 + r);
		s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
		return s;
	};

	const bodyGeo = new THREE.ExtrudeGeometry(rounded(PHONE_W - 0.03, PHONE_H - 0.03, 0.13), {
		depth: PHONE_D,
		bevelEnabled: true,
		bevelThickness: 0.015,
		bevelSize: 0.015,
		bevelSegments: 5,
		curveSegments: 24,
	});
	bodyGeo.translate(0, 0, -PHONE_D / 2);
	const glass = new THREE.MeshPhysicalMaterial({ color: 0x07090b, roughness: 0.15, metalness: 0.1, clearcoat: 1, clearcoatRoughness: 0.05 });
	const metal = new THREE.MeshPhysicalMaterial({ color: 0x6d7c86, roughness: 0.28, metalness: 0.9, clearcoat: 0.6 });
	const body = new THREE.Mesh(bodyGeo, [glass, metal]); // caps are glass, sides are the metal frame
	phone.add(body);

	// The back: Pixel-style camera bar.
	const bar = new THREE.Mesh(new THREE.BoxGeometry(PHONE_W - 0.02, 0.17, 0.035), new THREE.MeshPhysicalMaterial({ color: 0x1a2229, roughness: 0.3, metalness: 0.6, clearcoat: 1 }));
	bar.position.set(0, 0.72, -(PHONE_D / 2 + 0.03));
	phone.add(bar);
	for (const x of [-0.26, -0.1]) {
		const lens = new THREE.Mesh(new THREE.CircleGeometry(0.045, 32), new THREE.MeshPhysicalMaterial({ color: 0x020304, roughness: 0.05, clearcoat: 1 }));
		lens.position.set(x, 0.72, -(PHONE_D / 2 + 0.05));
		lens.rotation.y = Math.PI;
		phone.add(lens);
	}
	// Side keys.
	for (const [y, h] of [[0.42, 0.13], [0.15, 0.26]]) {
		const k = new THREE.Mesh(new THREE.BoxGeometry(0.02, h, 0.028), metal);
		k.position.set(PHONE_W / 2 + 0.008, y, 0);
		phone.add(k);
	}

	// The screen: a rounded plane showing what the screen scene draws.
	const SCREEN_W = PHONE_W - 0.07;
	const SCREEN_H = SCREEN_W * (SH / SW);
	const screenGeo = new THREE.ShapeGeometry(rounded(SCREEN_W, SCREEN_H, 0.1), 24);
	const uv = screenGeo.attributes.uv as THREE.BufferAttribute;
	const pos = screenGeo.attributes.position as THREE.BufferAttribute;
	for (let i = 0; i < uv.count; i++) uv.setXY(i, pos.getX(i) / SCREEN_W + 0.5, pos.getY(i) / SCREEN_H + 0.5);
	const rt = new THREE.WebGLRenderTarget(SW * 2, SH * 2, { colorSpace: THREE.SRGBColorSpace, samples: 4 });
	const screen = new THREE.Mesh(screenGeo, new THREE.MeshBasicMaterial({ map: rt.texture, toneMapped: false }));
	screen.position.z = PHONE_D / 2 + 0.016;
	phone.add(screen);

	const hole = new THREE.Mesh(new THREE.CircleGeometry(0.016, 24), new THREE.MeshBasicMaterial({ color: 0x000000 }));
	hole.position.set(0, SCREEN_H / 2 - 0.045, screen.position.z + 0.001);
	phone.add(hole);

	// A soft glare across the glass.
	const glareTex = (() => {
		const c = document.createElement('canvas');
		c.width = 64;
		c.height = 128;
		const g = c.getContext('2d')!;
		const grad = g.createLinearGradient(0, 0, 64, 128);
		grad.addColorStop(0, 'rgba(255,255,255,0.22)');
		grad.addColorStop(0.35, 'rgba(255,255,255,0)');
		g.fillStyle = grad;
		g.fillRect(0, 0, 64, 128);
		return new THREE.CanvasTexture(c);
	})();
	const glare = new THREE.Mesh(screenGeo, new THREE.MeshBasicMaterial({ map: glareTex, transparent: true, depthWrite: false, toneMapped: false }));
	glare.position.z = screen.position.z + 0.002;
	phone.add(glare);

	// A soft shadow under the phone, in the page plane.
	const shadowTex = (() => {
		const c = document.createElement('canvas');
		c.width = c.height = 128;
		const g = c.getContext('2d')!;
		const grad = g.createRadialGradient(64, 64, 4, 64, 64, 64);
		grad.addColorStop(0, 'rgba(19,34,45,0.35)');
		grad.addColorStop(1, 'rgba(19,34,45,0)');
		g.fillStyle = grad;
		g.fillRect(0, 0, 128, 128);
		return new THREE.CanvasTexture(c);
	})();
	const shadow = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.32), new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false }));
	scene.add(shadow);

	// ---------------------------------------------------------------- the screen scene (2D layers)
	const sScene = new THREE.Scene();
	sScene.background = new THREE.Color(0x000000);
	const sCam = new THREE.OrthographicCamera(-SW / 2, SW / 2, SH / 2, -SH / 2, 0.1, 10);
	sCam.position.z = 5;
	const loader = new THREE.TextureLoader();
	const layers: Record<string, THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>> = {};
	let order = 0;
	for (const [name, [, w, h]] of Object.entries(LAYERS)) {
		const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ transparent: true, depthTest: false, depthWrite: false, toneMapped: false }));
		m.renderOrder = order++;
		m.visible = false;
		sScene.add(m);
		layers[name] = m;
	}
	const tapRing = new THREE.Mesh(new THREE.RingGeometry(18, 24, 48), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, depthTest: false, toneMapped: false }));
	const tapDot = new THREE.Mesh(new THREE.CircleGeometry(18, 48), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.4, depthTest: false, toneMapped: false }));
	tapRing.renderOrder = tapDot.renderOrder = 1000;
	sScene.add(tapRing, tapDot);

	const dark = matchMedia('(prefers-color-scheme: dark)');
	async function loadTextures() {
		const suffix = dark.matches ? '-dark' : '';
		await Promise.all(
			Object.entries(LAYERS).map(
				([name, [slug]]) =>
					new Promise<void>((resolve) => {
						loader.load(
							`/images/app/${slug}${suffix}.webp`,
							(t) => {
								t.colorSpace = THREE.SRGBColorSpace;
								t.anisotropy = 4;
								const old = layers[name].material.map;
								layers[name].material.map = t;
								layers[name].material.needsUpdate = true;
								old?.dispose();
								resolve();
							},
							undefined,
							() => resolve(),
						);
					}),
			),
		);
	}
	await loadTextures();
	dark.addEventListener('change', () => void loadTextures());

	const hide = (name: string) => (layers[name].visible = false);
	/** Place a layer by its centre in screen pixels (y down), scale and opacity. No state: full screen;
	 *  null (a step that hasn't started) hides it. */
	function show(name: string, st: LayerState | null = {}) {
		const m = layers[name];
		if (!st || (st.o ?? 1) <= 0.001) {
			m.visible = false;
			return;
		}
		const [, w, h] = LAYERS[name];
		m.visible = true;
		m.position.set((st.x ?? SW / 2) - SW / 2, SH / 2 - (st.y ?? h / 2), 0);
		m.scale.setScalar(st.s ?? 1);
		m.material.opacity = st.o ?? 1;
	}
	/** A full screen zoomed from a point (an app opening from its icon). */
	const zoomFrom = (at: readonly [number, number], t: number): LayerState => ({
		x: mix(at[0], SW / 2, t),
		y: mix(at[1], SH / 2, t),
		s: mix(0.12, 1, t),
		o: clamp(t * 4),
	});
	function tap(at: readonly [number, number] | null, t: number) {
		const on = at && t > 0 && t < 1;
		tapRing.visible = tapDot.visible = !!on;
		if (!on) return;
		const k = Math.sin(t * Math.PI);
		for (const m of [tapRing, tapDot]) {
			m.position.set(at![0] - SW / 2, SH / 2 - at![1], 1);
			m.scale.setScalar(0.7 + t * 0.7);
		}
		tapRing.material.opacity = k * 0.95;
		tapDot.material.opacity = k * 0.45;
	}
	/** A sheet, sliding up from the bottom edge. */
	const sheet = (name: string, t: number): LayerState => {
		const h = LAYERS[name][2];
		return { y: SH - h / 2 + (1 - t) * h, o: t > 0 ? 1 : 0 };
	};
	const toast = (t: number): LayerState => ({ y: mix(-60, 70, t), o: t });

	// ---------------------------------------------------------------- stories
	const STORIES: Record<SlotName, (p: number) => void> = {
		// Facebook opens, the pause rises, "I'll do something else", home and a reward.
		hero(p) {
			const open = seg(p, 0.16, 0.27) * (1 - seg(p, 0.63, 0.72));
			show('launcher', { s: 1 + 0.06 * open });
			const rise = seg(p, 0.3, 0.4);
			const app = zoomFrom(AT.facebook, open);
			show('facebook', open > 0 ? app : null);
			show('pauseFb', rise > 0 && open > 0 ? { ...app, y: (app.y ?? 0) + (1 - rise) * SH * (app.s ?? 1) } : null);
			show('toastWalked', toast(seg(p, 0.74, 0.81)));
			tap(p < 0.3 ? AT.facebook : AT.leave, p < 0.3 ? seg(p, 0.1, 0.18) : seg(p, 0.54, 0.63));
		},
		// Pick an app and a limit, a pause, then the three ways out.
		how(p) {
			// 1. In Respite: Add an app, TikTok, a limit, Save.
			if (p < 0.34) {
				show('home');
				const add = seg(p, 0.05, 0.11) * (1 - seg(p, 0.17, 0.22));
				show('addSheet', sheet('addSheet', add));
				const lim = seg(p, 0.18, 0.24) * (1 - seg(p, 0.29, 0.33));
				show('limitSheet', sheet('limitSheet', lim));
				tap(p < 0.2 ? AT.tiktokRow : AT.save, p < 0.2 ? seg(p, 0.12, 0.17) : seg(p, 0.25, 0.29));
				return;
			}
			// 2. Later, TikTok is opened and the pause rises.
			if (p < 0.6) {
				show('launcher');
				const open = seg(p, 0.42, 0.48);
				const app = zoomFrom(AT.tiktok, open);
				show('tiktok', open > 0 ? app : null);
				const rise = seg(p, 0.49, 0.56);
				show('pauseTt', rise > 0 ? { y: SH / 2 + (1 - rise) * SH } : null);
				const closing = seg(p, 0.34, 0.385);
				show('home', closing < 1 ? zoomFrom(AT.respite, 1 - closing) : null); // Respite closes into its icon
				tap(AT.tiktok, seg(p, 0.37, 0.42));
				return;
			}
			// 3a. Walk away: back home, a quest done.
			if (p < 0.74) {
				const close = seg(p, 0.64, 0.69);
				show('launcher');
				const app = zoomFrom(AT.tiktok, 1 - close);
				show('tiktok', close < 1 ? app : null);
				show('pauseTt', close < 1 ? app : null);
				show('reward', { o: seg(p, 0.69, 0.73) });
				tap(AT.leave, seg(p, 0.6, 0.64));
				return;
			}
			// 3b. Snooze: TikTok opens, pauses rest for 10 minutes.
			if (p < 0.87) {
				show('tiktok');
				show('pauseTt', { y: SH / 2 + seg(p, 0.8, 0.84) * SH });
				show('toastSnoozed', toast(seg(p, 0.83, 0.86)));
				show('reward', { o: 1 - seg(p, 0.74, 0.76) });
				tap(AT.snooze, seg(p, 0.76, 0.8));
				return;
			}
			// 3c. Continue: on purpose, straight in.
			show('tiktok');
			show('pauseTt', { y: SH / 2 + seg(p, 0.93, 0.97) * SH, o: seg(p, 0.87, 0.89) });
			tap(AT.cont, seg(p, 0.89, 0.93));
		},
		// The main features, one screen each.
		features(p) {
			const order = ['home', 'focus', 'journey', 'insights', 'devices', 'ai'];
			const i = Math.min(order.length - 1, Math.floor(p * order.length));
			const local = p * order.length - i;
			// The next screen fades in over the last (later layers draw on top).
			if (i > 0) show(order[i - 1]);
			show(order[i], { o: i > 0 ? seg(local, 0, 0.22) : 1 });
			tap(null, 0);
		},
		end() {
			show('launcher');
			show('toastWalked', toast(1));
			tap(null, 0);
		},
	};

	// ---------------------------------------------------------------- page slots
	const slots = [...document.querySelectorAll<HTMLElement>('[data-phone-slot]')].map((el) => ({
		el,
		name: el.dataset.phoneSlot as SlotName,
		track: el.closest<HTMLElement>('[data-story-track]'),
	}));
	const hp = document.querySelector<HTMLElement>('.hp');

	function trackProgress(track: HTMLElement | null) {
		if (!track) return 1;
		const spacer = track.querySelector<HTMLElement>('[data-story-spacer]');
		const sticky = track.querySelector<HTMLElement>('[data-story-sticky]');
		if (!spacer || !sticky || !spacer.offsetHeight) return 0;
		return clamp((sticky.getBoundingClientRect().bottom - spacer.getBoundingClientRect().top) / spacer.offsetHeight);
	}
	const progress = (s: (typeof slots)[number]) =>
		s.name === 'hero' && hp ? parseFloat(getComputedStyle(hp).getPropertyValue('--p')) || 0 : s.name === 'end' ? 1 : trackProgress(s.track);

	// ---------------------------------------------------------------- frame
	let running = true;
	let mx = 0;
	let my = 0;
	const clock = new THREE.Clock();
	addEventListener('pointermove', (e) => {
		mx = e.clientX / innerWidth - 0.5;
		my = e.clientY / innerHeight - 0.5;
	});

	function frame() {
		if (!running) return;
		requestAnimationFrame(frame);
		const t = clock.getElapsedTime();
		const vw = innerWidth;
		const vh = innerHeight;
		if (canvas.width !== Math.floor(vw * renderer.getPixelRatio()) || canvas.height !== Math.floor(vh * renderer.getPixelRatio())) {
			renderer.setSize(vw, vh, false);
			camera.aspect = vw / vh;
			camera.updateProjectionMatrix();
		}
		const ppu = vh / (2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)));

		// Each story track shares its progress, so the words beside the phone can follow (CSS --p).
		for (const s of slots) if (s.track && s.name !== 'hero') s.track.style.setProperty('--p', progress(s).toFixed(4));

		// How much of each slot is in view; the phone follows the two that are most.
		const seen = slots
			.map((s) => {
				const r = s.el.getBoundingClientRect();
				const w = clamp((Math.min(r.bottom, vh) - Math.max(r.top, 0)) / Math.min(r.height || 1, vh));
				return { s, r, w };
			})
			.filter((v) => v.w > 0)
			.sort((a, b) => b.w - a.w)
			.slice(0, 2)
			.sort((a, b) => a.r.top - b.r.top);
		const total = seen.reduce((n, v) => n + v.w, 0);
		if (!total) {
			if (tilt.visible) {
				tilt.visible = shadow.visible = false;
				renderer.render(scene, camera);
			}
			return;
		}
		tilt.visible = shadow.visible = true;

		let x = 0;
		let y = 0;
		let size = 0;
		let ry = 0;
		let rx = 0;
		for (const v of seen) {
			const k = v.w / total;
			x += k * ((v.r.left + v.r.width / 2 - vw / 2) / ppu);
			y += k * (-(v.r.top + v.r.height / 2 - vh / 2) / ppu);
			size += k * ((v.r.height * 0.86) / ppu / PHONE_H);
			const pose = POSE[v.s.name];
			// The hero turns towards you while its story plays, like the CSS phone.
			const flat = v.s.name === 'hero' ? seg(progress(v.s), 0.2, 0.3) * (1 - seg(progress(v.s), 0.6, 0.75)) : 0;
			ry += k * mix(pose.y, pose.y * 0.4, flat);
			rx += k * mix(pose.x, pose.x * 0.5, flat);
		}
		// Between two slots, one full turn on the way, so the back shows as it travels.
		const travel = seen.length === 2 ? seen[1].w / total : 0;
		const spin = seen.length === 2 ? ease(travel) * Math.PI * 2 : 0;
		const appear = clamp(total * 3);

		tilt.position.set(x, y + Math.sin(t * 1.1) * 0.03, 0);
		tilt.scale.setScalar(size * mix(0.6, 1, appear));
		tilt.rotation.set(rx + my * 0.06 + Math.sin(t * 0.7) * 0.015, ry + spin + mx * 0.12, Math.sin(t * 0.5) * 0.01);
		shadow.position.set(x, y - (PHONE_H / 2) * size - 0.12 * size, -0.4);
		shadow.scale.setScalar(size);
		(shadow.material as THREE.MeshBasicMaterial).opacity = appear * (1 - Math.abs(Math.sin(spin)) * 0.5);

		// The screen shows the story of the slot most in view.
		const main = seen.reduce((a, b) => (b.w > a.w ? b : a));
		for (const n of Object.keys(LAYERS)) hide(n);
		STORIES[main.s.name](progress(main.s));
		renderer.setRenderTarget(rt);
		renderer.render(sScene, sCam);
		renderer.setRenderTarget(null);
		renderer.render(scene, camera);
	}
	requestAnimationFrame(frame);

	const onVisibility = () => {
		const was = running;
		running = document.visibilityState === 'visible';
		if (running && !was) requestAnimationFrame(frame);
	};
	document.addEventListener('visibilitychange', onVisibility);

	return () => {
		running = false;
		document.removeEventListener('visibilitychange', onVisibility);
		renderer.dispose();
	};
}
