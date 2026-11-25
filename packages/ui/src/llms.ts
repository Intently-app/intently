/**
 * An app site's /llms.txt (https://llmstxt.org), built from the registry and the site's content.ts,
 * the same records its pages render, so the two can't disagree.
 */
import { STUDIO, type App } from '@intently/registry';
import type { SiteContent } from './site';

const STATUS: Record<App['status'], string> = {
	live: 'Available now.',
	review: 'Submitted to the store; the listing is not public yet.',
	soon: 'In development; not available yet.',
};

export function appLlmsTxt(a: App, c: SiteContent): string {
	const url = `https://${a.host}`;
	const stores = [
		a.stores.play && `- [Google Play](${a.stores.play})`,
		a.stores.appStore && `- [App Store](${a.stores.appStore})`,
		a.stores.chrome && `- [Chrome Web Store](${a.stores.chrome})`,
	].filter(Boolean);
	const pages = [
		`- [Home](${url}/)`,
		`- [Support](${url}/support)`,
		c.legal.privacy && `- [Privacy policy](${url}/privacy)`,
		c.legal.terms && `- [Terms](${url}/terms)`,
		c.accountDeletion && `- [Delete your account](${url}/delete-account)`,
	].filter(Boolean);
	return `# ${a.name}

> ${a.tagline} ${c.subhead}

${a.name} is made by ${STUDIO.name} (${STUDIO.url}/), a small independent app studio. Status: ${STATUS[a.status]}${a.platforms.length ? ` Platforms: ${a.platforms.join(', ')}.` : ''} Contact: ${a.email}.

## What it does

${c.features.map((f) => `- ${f.title}: ${f.body}`).join('\n')}

## Questions

${c.faq.map((f) => `- ${f.q} ${f.a}`).join('\n')}
${stores.length ? `\n## Get it\n\n${stores.join('\n')}\n` : ''}
## Pages

${pages.join('\n')}
- [Other apps by ${STUDIO.name}](${STUDIO.url}/llms.txt)
`;
}
