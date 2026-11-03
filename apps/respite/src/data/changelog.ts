// What's new in Respite, newest first on /whats-new/. One entry per feature; link each to its announcement post.
// Entries with `draft: true` are hidden in production (they show in `astro dev` with a Draft label). To publish one,
// delete `draft: true`, set its date to the release date, and publish the announcement post it links to.

export type ChangelogPlatform = 'iPhone' | 'Android' | 'Chrome';

export interface ChangelogEntry {
	/** yyyy-mm-dd */
	date: string;
	title: string;
	summary: string;
	platforms: ChangelogPlatform[];
	/** Path of the announcement post, with a trailing slash. */
	link: string;
	/** Hidden in production builds. */
	draft?: boolean;
}

export const changelog: ChangelogEntry[] = [
	{
		date: '2026-11-03',
		title: 'Privacy policies updated',
		summary:
			'Our iPhone, Android and browser privacy policies now cover connecting an AI app you choose, and correct earlier wording on analytics and crash reports, sign-in, sync, purchases, and rewards, friends and leagues.',
		platforms: ['iPhone', 'Android', 'Chrome'],
		link: '/privacy/',
	},
	{
		date: '2026-11-03',
		title: 'Bring your own AI',
		summary:
			'Connect Claude, ChatGPT or Cursor to your Respite account with MCP and ask about your real usage, insights, limits, interruptions and progress. Read-only for now, Respite Plus. Next: letting your AI change limits, with approval on your phone for anything looser, plus a change log with undo.',
		platforms: ['iPhone', 'Android', 'Chrome'],
		link: '/blog/bring-your-own-ai-to-respite/',
	},
	{
		date: '2026-11-10',
		title: 'Sign-in and sync in the browser extension',
		summary:
			'One account across Android, iPhone and the browser. Sign in with Google or Apple, sync your limits and history, and use Respite Plus in the extension. A free account syncs one device; Plus syncs them all.',
		platforms: ['Chrome'],
		link: '/blog/one-respite-account-phone-and-browser/',
		draft: true,
	},
	{
		date: '2026-11-03',
		title: 'Respite Plus',
		summary:
			'An optional upgrade with sync across all your devices, unlimited schedules, focus sessions longer than 25 minutes and richer insights, plus a Live Activity and Control Center control on iPhone. Respite itself stays free.',
		platforms: ['iPhone', 'Android'],
		link: '/blog/respite-plus-whats-included/',
	},
	{
		date: '2026-11-03',
		title: 'Acorns, quests and leagues',
		summary:
			'A free game layer: earn acorns for days kept within your limits, finish daily quests, shop for Biscuit and your garden, protect your streak with freezes, and join optional friends boards and weekly leagues.',
		platforms: ['iPhone', 'Android'],
		link: '/blog/introducing-acorns-quests-and-leagues/',
	},
];

/** Entries to show: drafts only appear when running `astro dev`. Newest first. */
export function getChangelog(): ChangelogEntry[] {
	return changelog
		.filter((entry) => import.meta.env.DEV || !entry.draft)
		.map((entry, index) => ({ entry, index }))
		.sort((a, b) => (a.entry.date < b.entry.date ? 1 : a.entry.date > b.entry.date ? -1 : a.index - b.index))
		.map(({ entry }) => entry);
}
