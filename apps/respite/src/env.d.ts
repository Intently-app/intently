/// <reference path="../worker-configuration.d.ts" />

type Runtime = import("@astrojs/cloudflare").Runtime<Env>;

declare namespace App {
  interface Locals extends Runtime {}
}

// qrcode (build time only, src/lib/qr-svg.ts): the one call used.
declare module 'qrcode' {
  const QRCode: {
    create(text: string, options?: { errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H' }): { modules: { size: number; data: Uint8Array } };
  };
  export default QRCode;
}

// Cloudflare module imports (@astrojs/cloudflare): a .wasm file as a compiled WebAssembly.Module.
declare module '*.wasm?module' {
	const module: WebAssembly.Module;
	export default module;
}
