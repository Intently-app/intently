// Topics on /blog/. The ids are in URLs (/blog/#comparisons, breadcrumbs on every post), so keep
// them when relabelling. Every post should be in BLOG_CATEGORY_MAP; 'insights' is only the fallback.
export type BlogCategoryId =
	| 'getting-started'
	| 'app-guides'
	| 'time-solutions'
	| 'recovery'
	| 'comparisons'
	| 'ai'
	| 'respite'
	| 'privacy'
	| 'insights';

export interface BlogCategoryMeta {
	id: BlogCategoryId;
	label: string;
	description: string;
	accentColor: string;
}

export const BLOG_CATEGORIES: BlogCategoryMeta[] = [
	{
		id: 'getting-started',
		label: 'Getting started',
		description: 'The basics: how much is too much, why it is hard to stop, and what helps.',
		accentColor: 'var(--ds-primary)',
	},
	{
		id: 'app-guides',
		label: 'App guides',
		description: 'TikTok, Instagram, YouTube, Reddit and X, one at a time.',
		accentColor: 'var(--ds-purple)',
	},
	{
		id: 'time-solutions',
		label: 'Routines',
		description: 'Mornings, nights, work, study, family and detox plans.',
		accentColor: 'var(--ds-orange-dark)',
	},
	{
		id: 'recovery',
		label: 'Mind and habits',
		description: 'Anxiety, ADHD, dopamine and the psychology of the scroll.',
		accentColor: 'var(--ds-green-dark)',
	},
	{
		id: 'comparisons',
		label: 'Comparisons',
		description: 'Screen time apps and blockers side by side, with prices.',
		accentColor: 'var(--ds-primary-dark)',
	},
	{
		id: 'ai',
		label: 'AI and screen time',
		description: 'Using ChatGPT, Claude and MCP to understand and change your habits.',
		accentColor: 'var(--ds-purple-dark)',
	},
	{
		id: 'respite',
		label: 'Using Respite',
		description: 'How Respite works: sync, Plus, schedules, acorns and leagues.',
		accentColor: 'var(--ds-primary)',
	},
	{
		id: 'privacy',
		label: 'Privacy',
		description: 'Keeping your usage data yours.',
		accentColor: 'var(--ds-green-dark)',
	},
	{
		id: 'insights',
		label: 'Insights',
		description: 'Research and perspectives.',
		accentColor: 'var(--ds-text-secondary)',
	},
];

export const BLOG_CATEGORY_LOOKUP: Record<BlogCategoryId, BlogCategoryMeta> = BLOG_CATEGORIES.reduce(
	(lookup, category) => {
		lookup[category.id] = category;
		return lookup;
	},
	{} as Record<BlogCategoryId, BlogCategoryMeta>,
);

export const BLOG_CATEGORY_MAP: Record<string, BlogCategoryId> = {
	'how-to-reduce-screen-time': 'getting-started',
	'what-is-digital-wellbeing': 'getting-started',
	'mindful-tech-interventions-vs-blocking': 'getting-started',
	'how-to-stop-doomscrolling': 'getting-started',
	'how-much-screen-time-is-too-much': 'getting-started',
	'why-willpower-fails-phone-addiction': 'getting-started',

	'stop-tiktok-scrolling': 'app-guides',
	'reduce-instagram-usage': 'app-guides',
	'stop-youtube-binge': 'app-guides',
	'stop-twitter-doomscrolling': 'app-guides',
	'stop-reddit-scrolling': 'app-guides',
	'youtube-shorts-addiction': 'app-guides',
	'instagram-reels-addiction': 'app-guides',

	'stop-checking-phone-morning': 'time-solutions',
	'stop-scrolling-at-night': 'time-solutions',
	'digital-detox-challenge': 'time-solutions',

	'how-to-stop-phone-addiction': 'recovery',
	'phone-addiction-help': 'recovery',
	'productive-without-deleting-social': 'recovery',
	'psychology-of-app-addiction': 'recovery',
	'phone-addiction-adhd': 'recovery',
	'social-media-addiction-signs': 'recovery',
	'screen-time-apps-for-students': 'recovery',

	'respite-vs-opal': 'comparisons',
	'respite-vs-one-sec': 'comparisons',
	'respite-vs-freedom': 'comparisons',
	'respite-vs-forest': 'comparisons',
	'respite-vs-screenzen': 'comparisons',
	'respite-vs-brick': 'comparisons',
	'respite-vs-google-digital-wellbeing': 'comparisons',
	'best-digital-wellbeing-apps-2026': 'comparisons',
	'google-digital-wellbeing-alternatives': 'comparisons',
	'opal-alternatives': 'comparisons',
	'freedom-alternatives': 'comparisons',
	'one-sec-alternatives': 'comparisons',
	'apple-screen-time-alternatives': 'comparisons',
	'forest-app-alternatives': 'comparisons',

	'privacy-first-screen-time-tracking': 'privacy',

	'what-is-doomscrolling': 'getting-started',
	'do-app-blockers-work': 'getting-started',
	'how-to-block-apps-iphone': 'getting-started',

	'digital-wellbeing-at-work': 'time-solutions',
	'healthy-alternatives-scrolling': 'time-solutions',
	'attention-span-rebuild-focus': 'time-solutions',
	'digital-detox-benefits': 'time-solutions',
	'screen-time-for-parents': 'time-solutions',

	'phone-addiction-anxiety': 'recovery',
	'science-of-friction': 'recovery',
	'screen-time-and-mental-health': 'recovery',

	'ai-screen-time-coach-apps-compared': 'comparisons',
	'apps-that-make-you-pause-before-opening-instagram-tiktok': 'comparisons',
	'best-ai-app-blockers-screen-time-apps-2026': 'comparisons',
	'best-app-blocker': 'comparisons',
	'best-chrome-extensions-focus': 'comparisons',
	'best-screen-time-apps-2026': 'comparisons',
	'free-screen-time-app-android': 'comparisons',
	'gamified-screen-time-apps': 'comparisons',
	'respite-vs-clearspace': 'comparisons',
	'respite-vs-flowbuddy': 'comparisons',
	'respite-vs-refocus': 'comparisons',
	'respite-vs-lockin-mcp': 'comparisons',
	'screenzen-alternatives': 'comparisons',
	'stayfocusd-alternatives': 'comparisons',

	'bring-your-own-ai-to-respite': 'ai',
	'chatgpt-claude-screen-time-prompts': 'ai',
	'connect-chatgpt-to-phone-usage': 'ai',
	'connect-claude-chatgpt-cursor-to-respite-mcp': 'ai',
	'connect-claude-to-screen-time': 'ai',
	'is-it-safe-to-give-ai-your-screen-time-data': 'ai',
	'let-ai-change-your-limits': 'ai',
	'use-chatgpt-claude-to-reduce-screen-time': 'ai',
	'what-is-an-mcp-server': 'ai',

	'how-acorns-streaks-streak-freezes-work': 'respite',
	'introducing-acorns-quests-and-leagues': 'respite',
	'one-respite-account-phone-and-browser': 'respite',
	'respite-leagues-and-friends': 'respite',
	'respite-plus-whats-included': 'respite',
	'sync-respite-android-iphone-chrome': 'respite',
	'schedule-app-blocking-iphone-android': 'respite',
	'focus-session-app-iphone': 'respite',
};

export function getBlogCategoryId(slug: string): BlogCategoryId {
	return BLOG_CATEGORY_MAP[slug] ?? 'insights';
}

export function getBlogCategoryMeta(slug: string): BlogCategoryMeta {
	return BLOG_CATEGORY_LOOKUP[getBlogCategoryId(slug)];
}

export function getNormalizedHeroImage(image?: string): string {
	if (!image || image.trim().length === 0) {
		return '/images/blog/what-is-digital-wellbeing.jpg';
	}

	return image;
}
