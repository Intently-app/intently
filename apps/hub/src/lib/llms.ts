/**
 * What an answer engine should know about Intently (/llms.txt, /llms-full.txt; https://llmstxt.org),
 * built from the same records as the pages (CHAPTERS, the registry), so the two can't disagree.
 */
import { APPS, STUDIO, type App } from '@intently/registry';
import { CHAPTERS, type Chapter } from '../data/chapters.ts';

const STATUS: Record<App['status'], string> = {
	live: 'available now',
	review: 'submitted to the store, not public yet',
	soon: 'in development',
};

const chapterOf = (a: App): Chapter | undefined => CHAPTERS.find((c) => c.apps.some((x) => x.id === a.id));

function appLine(a: App): string {
	const ch = chapterOf(a);
	const platforms = a.platforms.length ? a.platforms.join(', ') : 'platforms not announced';
	return `- [${a.name}](https://${a.host}/): ${a.tagline} ${platforms}; ${STATUS[a.status]}.`
		+ (ch ? ` Part of the day: ${ch.name}.` : '')
		+ ` Details: https://${a.host}/llms.txt`;
}

const INTRO = `# ${STUDIO.name}

> ${STUDIO.name} is a small, independent app studio. It makes calm, private apps for living each part of the day on purpose: time, attention, health, money, relationships, self and faith. Each app has its own website on a subdomain of ${STUDIO.host}. No ads and no data selling.

The home page (${STUDIO.url}/) walks through one day, from dawn to night. Each hour is one part of life, with a page of its own and the app made for it.`;

export function llmsTxt(): string {
	return `${INTRO}

## Apps

${APPS.map(appLine).join('\n')}

## The day, one part of life per hour

${CHAPTERS.map((c) => `- [${c.name}: ${c.title}](${STUDIO.url}${c.path}) (${c.clock}): ${c.meta.description}`).join('\n')}

## Studio

- [About](${STUDIO.url}/about/): who makes the apps and what we believe
- [Contact](${STUDIO.url}/contact/): questions, feedback or support for any app (${STUDIO.email})
- [Privacy policy of this website](${STUDIO.url}/legal/privacy/); each app has its own policy on its own site
- [Full text of the chapters](${STUDIO.url}/llms-full.txt)
`;
}

function chapterText(c: Chapter): string {
	const apps = c.apps.map((a) => `[${a.name}](https://${a.host}/)`).join(', ');
	return `## ${c.name} (${c.clock}): ${c.title}

Page: ${STUDIO.url}${c.path}

${c.lede.join('\n\n')}

### ${c.feel.heading}

${c.feel.example}
${c.feel.assumptions.map((a) => `- ${a}`).join('\n')}

### Questions to sit with

${c.reflection.map((r) => `- ${r}`).join('\n')}

### Practice: ${c.practice.heading}

${c.practice.body.join('\n\n')}

### The app for this: ${apps}

${c.appLine}
`;
}

export function llmsFullTxt(): string {
	return `${INTRO}

${CHAPTERS.map(chapterText).join('\n')}
## Apps

${APPS.map(appLine).join('\n')}
`;
}
