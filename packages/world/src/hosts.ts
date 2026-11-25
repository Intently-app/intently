/**
 * Where an app's site is, as seen from the page we're on. Production links go to <app>.liveintently.app;
 * on a workers.dev preview (`wrangler versions upload --preview-alias <alias>`), the hub at
 * <alias>-intently-hub.<account>.workers.dev dives into <alias>-<app>-site.<account>.workers.dev, so the
 * whole flight can be tried before anything reaches production. Tests set window.__intentlyHosts.
 */
import { STUDIO, app } from '@intently/registry';

export const HUB_WORKER = 'intently-hub';
export const workerOf = (appId: string) => `${appId}-site`;

/** The origin of an app's site (no trailing slash), or of the hub for 'hub'. */
export function resolveOrigin(target: string, currentHostname: string, overrides?: Record<string, string>): string {
	if (overrides?.[target]) return overrides[target].replace(/\/$/, '');
	const worker = target === 'hub' ? HUB_WORKER : workerOf(target);
	const m = /^(?:([a-z0-9-]+?)-)?(intently-hub|[a-z]+-site)\.([a-z0-9-]+)\.workers\.dev$/.exec(currentHostname);
	if (m) {
		const [, alias, , account] = m;
		return `https://${alias ? `${alias}-` : ''}${worker}.${account}.workers.dev`;
	}
	return target === 'hub' ? STUDIO.url : `https://${app(target).host}`;
}

declare global {
	interface Window {
		__intentlyHosts?: Record<string, string>;
	}
}

export const browserOrigin = (target: string) => resolveOrigin(target, location.hostname, window.__intentlyHosts);
