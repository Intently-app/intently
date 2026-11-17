// "How to block <app>" pages (/block/<id>/), rendered by src/layouts/BlockAppPage.astro and listed on /block/.
//
// Search intent: the practical settings question ("how to block TikTok on iPhone", "Instagram time limit"). The
// blog posts own the habit side (stop-tiktok-scrolling, reduce-instagram-usage, ...); each page links to its post
// and each post links back. Primary keywords are reserved in docs/ai-keyword-map.md so the content pipeline
// never writes a rival post.
//
// Facts:
// - Respite: docs/content-guide.md only (free: pause, app/website/category limits, 1 schedule, focus up to 25
//   minutes; Plus: unlimited schedules, sync, longer focus). Reels and Shorts blocking is Android only.
// - iPhone and Android menus: Apple's and Google's help pages; the third-party app settings, with sources, are in
//   docs/competitor-facts.md ("Per-app settings"). Where a label varies by version, the copy says so instead of
//   guessing. Re-check after major OS or app releases.
//
// Inline markup: **bold** only (menu paths and button labels).

export type OptionKind = 'reminder' | 'helps' | 'missing' | 'info';

export interface Step {
	title: string;
	text: string;
}

export interface InAppOption {
	name: string;
	kind: OptionKind;
	text: string;
}

export interface Shot {
	slug: string;
	title: string;
	line: string;
}

export interface BlockApp {
	/** URL slug, and the icon in art/app-screens/icons/. */
	id: string;
	/** Name as people search it. */
	name: string;
	/** Short name for tight spots (cards, chips). */
	short: string;
	title: string;
	h1: string;
	description: string;
	dek: string;
	/** 40–70 words that answer the query on their own (AEO). */
	answer: string;
	/** Queries this page is written to win (also in docs/ai-keyword-map.md). */
	queries: string[];
	/** One line for the /block/ index card. */
	card: string;
	/** Whether the app has a daily limit of its own (index badge). */
	ownLimit: boolean;
	ogImage: string;
	iphone: { steps: Step[]; catch: string };
	android: { steps: Step[]; catch: string };
	inApp: { lead: string; options: InAppOption[] };
	/** App-specific ways a limit leaks. */
	watch: string[];
	respite: { line: string; shots: [Shot, Shot]; chips: string[] };
	/** The web version, covered by the Respite Chrome extension. */
	web?: { site: string; line: string };
	related: { href: string; label: string; line: string }[];
	faq: { question: string; answer: string }[];
}

// The OS steps are the same menus for every app; the app name, the website and an optional last step differ.
// iPhone: iOS 27 renamed the Screen Time controls (Apple's iPhone User Guide for iOS 27): App Limits became Time
// Allowances, set per category; Downtime became Screen Time Schedule; the passcode moved under Passcode & Management.
// iOS 26 and earlier keep App Limits, where one app can be picked on its own. The steps lead with iOS 27 and name
// the older label in brackets.
const iphoneSteps = (name: string, extra?: Step): Step[] => [
	{ title: 'Open Time Allowances', text: 'Go to **Settings › Screen Time › Time Allowances** (iOS 26 or earlier: **App Limits**).' },
	{ title: `Cap ${name}'s category`, text: `Tap **Manage Categories**, add the category ${name} is in, and set its daily time. On older iOS, **Add Limit** lets you pick ${name} on its own.` },
	{ title: 'Block set hours', text: `In **Screen Time Schedule** (older: **Downtime**), add a time window without that category, and keep ${name} off **Always Allowed**.` },
	{ title: 'Lock it', text: 'Under **Passcode & Management**, tap **Lock Screen Time Settings** and set a passcode. Ideally, someone else picks it.' },
	...(extra ? [extra] : []),
];

const androidSteps = (name: string, extra?: Step): Step[] => [
	{ title: 'Open Digital Wellbeing', text: 'Go to **Settings › Digital Wellbeing & parental controls** (just "Digital Wellbeing" on some phones).' },
	{ title: `Find ${name}`, text: `Tap the **Dashboard** (or **App timers**) and pick ${name}.` },
	{ title: 'Set an app timer', text: 'Tap **App timer**, choose the daily time, tap **OK**. At zero the app pauses until midnight.' },
	{ title: 'Block set hours', text: `For nights or work hours, add ${name} to **Focus mode** and tap **Set a schedule**.` },
	...(extra ? [extra] : []),
];

const IPHONE_CATCH = 'On iOS 27 an allowance covers a whole category, not one app. On older iOS, **Ignore Limit** is one tap away without a passcode.';
const ANDROID_CATCH = 'Deleting the timer lifts it, and Focus mode has a **Take a break** button. It holds only as long as you let it.';

const websiteStep = (site: string): Step => ({
	title: 'Cover the browser',
	text: `On iOS 27 an allowance also covers an app's own website. On older iOS, add ${site} under **Websites** in **Add Limit**.`,
});

const siteTimerStep = (site: string): Step => ({
	title: 'Cover Chrome',
	text: `In the Dashboard, open **Chrome** and tap **Set site timer** next to ${site}.`,
});

export const BLOCK_APPS: BlockApp[] = [
	{
		id: 'tiktok',
		name: 'TikTok',
		short: 'TikTok',
		title: 'How to Block TikTok on iPhone and Android (2026)',
		h1: 'How to block TikTok on iPhone and Android',
		description: "Block TikTok or set a daily limit on iPhone and Android: Screen Time and Digital Wellbeing steps, TikTok's own screen time tools, and what each misses.",
		dek: "Your phone's limits, TikTok's own timer, and a pause that sticks.",
		answer: "On iPhone, go to Settings › Screen Time › Time Allowances and set a daily time for the category TikTok is in (on iOS 26 or earlier, App Limits › Add Limit picks TikTok alone). On Android, set an App timer for TikTok in Settings › Digital Wellbeing & parental controls. TikTok's own daily limit is one you can extend.",
		queries: ['how to block tiktok on iphone', 'block tiktok android', 'tiktok time limit', 'how to set a time limit on tiktok'],
		card: 'Has its own daily limit',
		ownLimit: true,
		ogImage: '/images/blog/stop-tiktok-scrolling.jpg',
		iphone: { steps: iphoneSteps('TikTok', websiteStep('tiktok.com')), catch: IPHONE_CATCH },
		android: { steps: androidSteps('TikTok'), catch: ANDROID_CATCH },
		inApp: {
			lead: 'In TikTok: **Profile › ☰ › Settings and privacy**, then the screen time section. Labels shift between versions.',
			options: [
				{ name: 'Daily screen time', kind: 'reminder', text: 'A daily limit, the same every day or set per day. You set it, so you can raise it.' },
				{ name: 'Screen time breaks', kind: 'reminder', text: 'A prompt to step away after a stretch of nonstop scrolling.' },
				{ name: 'Sleep reminders', kind: 'reminder', text: 'Pick a bedtime; TikTok reminds you and mutes its notifications overnight.' },
				{ name: 'Weekly updates', kind: 'info', text: 'A weekly summary of your time in the app.' },
			],
		},
		watch: [
			'**tiktok.com** in a browser or on a laptop can slip past an app limit. Cover the site too.',
			"TikTok's limit lives inside TikTok. The person who set it can switch it off in the same menu.",
		],
		respite: {
			line: 'A short pause each time TikTok opens, so scrolling is a choice. Set a daily limit and TikTok locks until midnight once it is used.',
			shots: [
				{ slug: '3d-pause-tiktok', title: 'A pause before TikTok', line: 'Do something else, or continue on purpose.' },
				{ slug: '3d-limitsheet', title: 'A daily limit', line: 'Pick the minutes. When they run out, TikTok locks.' },
			],
			chips: ['Pause before TikTok', 'Daily limit', '1 schedule free'],
		},
		web: { site: 'tiktok.com', line: 'On a laptop, the Respite Chrome extension puts the same pause before tiktok.com.' },
		related: [
			{ href: '/blog/stop-tiktok-scrolling/', label: 'Stop scrolling TikTok without deleting it', line: 'The habit side: cues, rules and what to do instead.' },
			{ href: '/blog/apps-that-make-you-pause-before-opening-instagram-tiktok/', label: 'Apps that pause you before TikTok', line: 'One Sec, ScreenZen and Respite compared.' },
		],
		faq: [
			{ question: "Can you block TikTok on iPhone without deleting it?", answer: "Go to Settings › Screen Time › Time Allowances, tap Manage Categories, add the category TikTok is in and set a daily time; on iOS 26 or earlier, App Limits › Add Limit lets you pick TikTok alone. Lock it under Passcode & Management › Lock Screen Time Settings. For fixed hours, a Screen Time Schedule (Downtime on older iOS) keeps it closed outside the windows you allow." },
			{ question: 'How do I set a time limit on TikTok itself?', answer: "In TikTok, open Profile, the ☰ menu, then Settings and privacy and its screen time section, and set a daily screen time limit. It is a limit you set yourself, so you can extend it. For a limit that holds better, use the phone's own tools: App Limits on iPhone or an app timer in Digital Wellbeing on Android." },
			{ question: 'How do I block TikTok on Android?', answer: 'Open Settings › Digital Wellbeing & parental controls, tap the Dashboard, choose TikTok and set an App timer. When it runs out, TikTok pauses until midnight. To block it during set hours, add TikTok to Focus mode and give Focus mode a schedule. Menu names vary a little between phone makers.' },
			{ question: 'Why does my TikTok limit keep failing?', answer: "Every built-in limit can be waved away without a passcode: Ignore Limit or a changed allowance on iPhone, a deleted app timer on Android, or a raised TikTok limit. A passcode someone else sets helps. So does catching the moment before TikTok opens, which is what a pause app such as Respite does." },
			{ question: 'Can I limit TikTok on my teen’s phone?', answer: "Yes. On iPhone, set up Screen Time for your child through Family Sharing, with a passcode only you know. On Android, Google Family Link sets app limits. TikTok's Family Pairing links your account to your teen's to manage their screen time settings. Limits you agree on together are usually easier to keep." },
		],
	},
	{
		id: 'instagram',
		name: 'Instagram',
		short: 'Instagram',
		title: 'How to Block Instagram on iPhone and Android (2026)',
		h1: 'How to block Instagram on iPhone and Android',
		description: "Block Instagram or cap it with a daily limit on iPhone and Android: Screen Time and Digital Wellbeing steps, Instagram's own limit, and blocking Reels.",
		dek: "Phone limits, Instagram's own reminder, and a way past Reels.",
		answer: "On iPhone, go to Settings › Screen Time › Time Allowances and set a daily time for the category Instagram is in (on iOS 26 or earlier, App Limits › Add Limit picks Instagram alone). On Android, set an App timer for Instagram in Settings › Digital Wellbeing & parental controls. Instagram's own daily limit is a reminder you can close.",
		queries: ['how to block instagram on iphone', 'block instagram android', 'instagram time limit', 'instagram daily limit'],
		card: 'Has its own reminder',
		ownLimit: true,
		ogImage: '/images/blog/reduce-instagram-usage.jpg',
		iphone: { steps: iphoneSteps('Instagram'), catch: IPHONE_CATCH },
		android: { steps: androidSteps('Instagram'), catch: ANDROID_CATCH },
		inApp: {
			lead: 'In Instagram: **Profile › ☰**, then **Time management** (older versions: Your activity › Time spent).',
			options: [
				{ name: 'Daily limit', kind: 'reminder', text: 'A full-screen reminder once your time is up. One tap closes it.' },
				{ name: 'Sleep mode', kind: 'helps', text: 'Mutes Instagram notifications during the hours you set.' },
				{ name: 'Take a break', kind: 'reminder', text: 'Reminders to step away after a stretch of scrolling.' },
				{ name: 'Turn off Reels', kind: 'missing', text: 'There is no setting that removes the Reels tab, as far as we could find.' },
			],
		},
		watch: [
			'**instagram.com** in a browser has Reels too, and an app limit may not cover it.',
			"Instagram's daily limit doesn't lock anything. Treat it as a clock, not a door.",
		],
		respite: {
			line: 'A pause before Instagram opens, a daily limit that locks it until midnight, and on Android, optional Reels blocking.',
			shots: [
				{ slug: 'pause-android', title: 'A pause before Instagram', line: 'Do something else, or continue on purpose.' },
				{ slug: 'limits-android', title: 'Limits you can see', line: 'Minutes left today, per app.' },
			],
			chips: ['Pause before Instagram', 'Daily limit', 'Reels block on Android'],
		},
		web: { site: 'instagram.com', line: 'On a laptop, the Respite Chrome extension pauses instagram.com and gives it a daily limit.' },
		related: [
			{ href: '/blog/reduce-instagram-usage/', label: 'Reduce Instagram usage without deleting it', line: 'The habit side: feed, notifications, ending a session.' },
			{ href: '/blog/instagram-reels-addiction/', label: 'Instagram Reels addiction', line: 'Why Reels is so sticky, and how to get Instagram back.' },
		],
		faq: [
			{ question: "How do I block Instagram on iPhone?", answer: "Go to Settings › Screen Time › Time Allowances, tap Manage Categories, add the category Instagram is in and set a daily time; on iOS 26 or earlier, App Limits › Add Limit lets you pick Instagram alone. Lock it under Passcode & Management › Lock Screen Time Settings. Instagram stays installed and your account is untouched." },
			{ question: 'How do I set a daily limit in Instagram?', answer: "In Instagram, tap Profile, the ☰ menu, then Time management, and choose a daily limit. When you reach it, Instagram shows a reminder that you can close with one tap, so it works as a clock rather than a lock. For a firmer limit, use Screen Time on iPhone or an app timer in Digital Wellbeing on Android." },
			{ question: 'Can I block Instagram Reels but keep messages?', answer: "Not with Instagram's settings or the phone's: both treat Instagram as one app. On Android, Respite has optional Reels and Shorts blocking (it uses the Accessibility service), so the rest of Instagram stays usable. On iPhone, the closest is a short daily limit and messaging from a computer." },
			{ question: 'How do I block Instagram on Android?', answer: 'Open Settings › Digital Wellbeing & parental controls, tap the Dashboard, choose Instagram and set an App timer. When the time runs out, Instagram pauses until midnight. To block it during set hours, add it to Focus mode with a schedule. On Samsung phones the same tools sit under Digital Wellbeing and parental controls.' },
			{ question: "Does Instagram's daily limit lock the app?", answer: "No. Instagram's daily limit shows a reminder when your time is up, and you can dismiss it and keep scrolling. Locking needs the phone's tools: a Screen Time limit with a passcode on iPhone, or an app timer on Android, which pauses Instagram until midnight unless you delete the timer." },
		],
	},
	{
		id: 'youtube',
		name: 'YouTube',
		short: 'YouTube',
		title: 'How to Block YouTube on iPhone and Android (2026)',
		h1: 'How to block YouTube on iPhone and Android',
		description: "Block YouTube or set a daily limit on iPhone and Android, plus YouTube's own Shorts limit, break reminders and autoplay switch, and what each one misses.",
		dek: "Phone limits, YouTube's own timers, and Shorts.",
		answer: "On iPhone, go to Settings › Screen Time › Time Allowances and set a daily time for the category YouTube is in (on iOS 26 or earlier, App Limits › Add Limit picks YouTube alone). On Android, set an App timer for YouTube in Settings › Digital Wellbeing & parental controls. YouTube's break reminders and Shorts limit can be dismissed.",
		queries: ['how to block youtube on iphone', 'block youtube app android', 'youtube time limit', 'youtube shorts limit'],
		card: 'Reminders and a Shorts limit',
		ownLimit: true,
		ogImage: '/images/blog/stop-youtube-binge.jpg',
		iphone: { steps: iphoneSteps('YouTube', websiteStep('youtube.com')), catch: IPHONE_CATCH },
		android: { steps: androidSteps('YouTube', siteTimerStep('youtube.com')), catch: ANDROID_CATCH },
		inApp: {
			lead: "In YouTube: **Profile › Settings**, under **General** or **Time management**, depending on your version.",
			options: [
				{ name: 'Remind me to take a break', kind: 'reminder', text: 'Pauses the video at the interval you choose and suggests a break.' },
				{ name: 'Bedtime reminder', kind: 'reminder', text: 'A nudge to stop at the time you pick.' },
				{ name: 'Shorts feed limit', kind: 'reminder', text: 'A daily cap on scrolling Shorts, rolling out since late 2025. The prompt can be dismissed.' },
				{ name: 'Autoplay', kind: 'helps', text: "Switch it off so the next video doesn't start by itself." },
			],
		},
		watch: [
			"YouTube on a TV, tablet or laptop isn't touched by your phone's limit.",
			'Phone limits cover all of YouTube. Neither iPhone nor Android can limit Shorts alone.',
		],
		respite: {
			line: 'A pause before YouTube and youtube.com, a daily limit, and on Android, optional Shorts blocking that leaves long videos alone.',
			shots: [
				{ slug: 'pause-chrome', title: 'A pause before youtube.com', line: 'The Chrome extension pauses the site, too.' },
				{ slug: 'limits-android', title: 'A daily limit', line: 'Minutes left today, per app.' },
			],
			chips: ['Pause before YouTube', 'Daily limit', 'Shorts block on Android'],
		},
		web: { site: 'youtube.com', line: 'On a laptop, the Respite Chrome extension pauses youtube.com and gives it a daily limit.' },
		related: [
			{ href: '/blog/stop-youtube-binge/', label: 'How to stop YouTube binge watching', line: 'Autoplay, watch lists and stopping on purpose.' },
			{ href: '/blog/youtube-shorts-addiction/', label: 'YouTube Shorts addiction', line: 'Why Shorts loops, and how to keep the rest of YouTube.' },
		],
		faq: [
			{ question: "How do I block YouTube on iPhone?", answer: "Go to Settings › Screen Time › Time Allowances, tap Manage Categories, add the category YouTube is in and set a daily time; on iOS 26 or earlier, App Limits › Add Limit lets you pick YouTube alone. Lock it under Passcode & Management › Lock Screen Time Settings. On iOS 27 the allowance also covers an app's own website; on older iOS, add youtube.com under Websites." },
			{ question: 'Can I block YouTube Shorts but keep YouTube?', answer: "On Android, Respite's optional Reels and Shorts blocking does this (it uses the Accessibility service). On iPhone, no setting removes Shorts from the YouTube app; YouTube's own Shorts feed limit is the closest, and it can be dismissed. On a computer, browser extensions can hide Shorts on youtube.com." },
			{ question: 'How do I set a time limit on YouTube?', answer: "Inside YouTube, open Settings and look under General or Time management for Remind me to take a break and the Shorts feed limit. Both are reminders. For a limit that closes the app, use Screen Time on iPhone or an app timer in Digital Wellbeing on Android." },
			{ question: 'How do I turn off autoplay on YouTube?', answer: 'Tap the autoplay switch at the top of the video player, or turn Autoplay off in Settings. With it off, a video ends and waits instead of starting the next one, which is often where a binge begins. The setting can differ per device, so switch it off on your TV and laptop too.' },
			{ question: 'Does a YouTube limit on my phone work on the TV?', answer: "No. Screen Time and Digital Wellbeing limit the YouTube app on that phone only. A TV, tablet or laptop needs its own setting: YouTube's reminders on each device, the TV's own controls, or on a computer, a browser extension such as Respite's." },
		],
	},
	{
		id: 'reddit',
		name: 'Reddit',
		short: 'Reddit',
		title: 'How to Block Reddit on iPhone and Android (2026)',
		h1: 'How to block Reddit on iPhone and Android',
		description: 'Reddit has no daily limit of its own. How to block Reddit or cap it on iPhone and Android, step by step, including reddit.com in the browser.',
		dek: 'Reddit has no limit of its own, so your phone does the work.',
		answer: "Reddit has no daily limit of its own, so use your phone's. On iPhone, go to Settings › Screen Time › Time Allowances and set a daily time for the category Reddit is in (on iOS 26 or earlier, App Limits › Add Limit picks Reddit alone). On Android, set an App timer for Reddit in Settings › Digital Wellbeing & parental controls.",
		queries: ['how to block reddit on iphone', 'block reddit android', 'reddit time limit', 'block reddit website'],
		card: 'No limit of its own',
		ownLimit: false,
		ogImage: '/images/blog/stop-reddit-scrolling.jpg',
		iphone: { steps: iphoneSteps('Reddit', websiteStep('reddit.com')), catch: IPHONE_CATCH },
		android: { steps: androidSteps('Reddit', siteTimerStep('reddit.com')), catch: ANDROID_CATCH },
		inApp: {
			lead: 'As far as we could find, the Reddit app has no daily limit or break reminder. What its **Settings** can do:',
			options: [
				{ name: 'Time limit', kind: 'missing', text: 'No daily limit, no break reminder, no bedtime mode.' },
				{ name: 'Autoplay', kind: 'helps', text: 'Turn off video autoplay for a stiller feed.' },
				{ name: 'Notifications', kind: 'helps', text: 'Turn off the ones that are not replies or messages.' },
			],
		},
		watch: [
			'**reddit.com** in a browser is the classic way around an app limit. Limit it as well.',
			'Other Reddit apps count as different apps. Limit each one by name.',
		],
		respite: {
			line: 'Pick Reddit and it gets a short pause every time it opens, and a daily limit. The Chrome extension covers reddit.com.',
			shots: [
				{ slug: 'step-pick', title: 'Pick Reddit', line: 'Add the apps you want a pause before.' },
				{ slug: 'limits-chrome', title: 'Limits for sites, too', line: 'In Chrome, each site keeps its own limit.' },
			],
			chips: ['Pause before Reddit', 'Daily limit', 'reddit.com in Chrome'],
		},
		web: { site: 'reddit.com', line: 'On a laptop, the Respite Chrome extension pauses reddit.com and gives it a daily limit.' },
		related: [
			{ href: '/blog/stop-reddit-scrolling/', label: 'How to stop Reddit scrolling', line: 'Keep the communities, lose the rabbit holes.' },
			{ href: '/blog/best-chrome-extensions-focus/', label: 'Best Chrome extensions for focus', line: 'Website blockers and pause tools for the laptop.' },
		],
		faq: [
			{ question: 'Does Reddit have a screen time limit?', answer: "Not as far as we could find. The Reddit app has no daily limit, break reminder or bedtime mode. You can turn off video autoplay and most notifications in its Settings, but the time limit has to come from your phone: Screen Time on iPhone or Digital Wellbeing on Android, or an app like Respite." },
			{ question: "How do I block Reddit on iPhone?", answer: "Go to Settings › Screen Time › Time Allowances, tap Manage Categories, add the category Reddit is in and set a daily time; on iOS 26 or earlier, App Limits › Add Limit lets you pick Reddit alone. Lock it under Passcode & Management › Lock Screen Time Settings. On older iOS, also add reddit.com under Websites so Safari counts." },
			{ question: "Does an iPhone limit on Reddit cover reddit.com?", answer: "On iOS 27, Apple says a Time Allowance also applies to an app's own website when the app declares it. On iOS 26 or earlier, add reddit.com under Websites in App Limits › Add Limit, or block it outright in Content & Privacy Restrictions by adding it to the Never Allow list for web content." },
			{ question: 'How do I block Reddit on Android?', answer: 'Open Settings › Digital Wellbeing & parental controls, tap the Dashboard, choose Reddit and set an App timer. Then open Chrome in the same Dashboard and set a site timer for reddit.com, because the browser is the easy way around. Menu names vary a little between phone makers.' },
			{ question: 'Can I keep one subreddit and block the rest?', answer: "Not with phone settings: they treat Reddit as one app or one site. What helps is going in with a purpose: bookmark the subreddit you want and open it directly, skip the home feed, and keep a daily limit as the backstop." },
		],
	},
	{
		id: 'x',
		name: 'X (Twitter)',
		short: 'X',
		title: 'How to Block X (Twitter) on iPhone and Android (2026)',
		h1: 'How to block X (Twitter) on iPhone and Android',
		description: 'X has no screen time setting. How to block X (Twitter) or set a daily limit on iPhone and Android, and the X settings that make the feed less sticky.',
		dek: 'X has no timer of its own. Here is what does work.',
		answer: "X (Twitter) has no time limit of its own, so use your phone's. On iPhone, go to Settings › Screen Time › Time Allowances and set a daily time for the category X is in (on iOS 26 or earlier, App Limits › Add Limit picks X alone). On Android, set an App timer for X in Settings › Digital Wellbeing & parental controls.",
		queries: ['how to block twitter on iphone', 'block x app android', 'twitter time limit', 'x screen time limit'],
		card: 'No limit of its own',
		ownLimit: false,
		ogImage: '/images/blog/stop-twitter-doomscrolling.jpg',
		iphone: { steps: iphoneSteps('X', websiteStep('x.com')), catch: IPHONE_CATCH },
		android: { steps: androidSteps('X'), catch: ANDROID_CATCH },
		inApp: {
			lead: 'As far as we could find, X has no time limit at all. A few settings make it less sticky:',
			options: [
				{ name: 'Time limit', kind: 'missing', text: 'No daily limit, no break reminder.' },
				{ name: 'Following tab', kind: 'helps', text: 'Read Following instead of For you: only accounts you chose.' },
				{ name: 'Notifications', kind: 'helps', text: 'Trim them in **Settings and privacy › Notifications**.' },
				{ name: 'Video autoplay', kind: 'helps', text: 'Set it to never, in the data usage settings.' },
			],
		},
		watch: [
			'The app is called **X** now. Look for X, not Twitter, in Screen Time and Digital Wellbeing.',
			'**x.com** in a browser can skip an app limit. Cover the site too.',
		],
		respite: {
			line: 'A pause before X opens and a daily limit. When the time is used, X locks until midnight.',
			shots: [
				{ slug: 'limits-android', title: 'Locked until midnight', line: "When today's time is used, X stays shut." },
				{ slug: 'pause-ios', title: 'A pause on iPhone', line: 'A short check-in before the app opens.' },
			],
			chips: ['Pause before X', 'Daily limit', '1 schedule free'],
		},
		web: { site: 'x.com', line: 'On a laptop, the Respite Chrome extension pauses x.com and gives it a daily limit.' },
		related: [
			{ href: '/blog/stop-twitter-doomscrolling/', label: 'Stop Twitter/X doomscrolling', line: 'Seven strategies that keep the good parts.' },
			{ href: '/blog/how-to-stop-doomscrolling/', label: 'How to stop doomscrolling', line: 'Why bad news is so hard to put down.' },
		],
		faq: [
			{ question: 'Does X (Twitter) have a time limit setting?', answer: "Not as far as we could find. X has no daily limit or break reminder. You can switch to the Following tab, turn off notifications and stop video autoplay, but a time limit has to come from your phone's Screen Time or Digital Wellbeing, or from an app like Respite." },
			{ question: "How do I block Twitter on iPhone?", answer: "Go to Settings › Screen Time › Time Allowances, tap Manage Categories, add the category X is in and set a daily time; on iOS 26 or earlier, App Limits › Add Limit lets you pick X alone. Lock it under Passcode & Management › Lock Screen Time Settings. Look for X, not Twitter: the app was renamed." },
			{ question: 'How do I block X on Android?', answer: 'Open Settings › Digital Wellbeing & parental controls, tap the Dashboard, choose X and set an App timer. When it runs out, X pauses until midnight. For set hours, add X to Focus mode with a schedule. Menu names vary a little between phone makers.' },
			{ question: 'How do I stop X from autoplaying videos?', answer: "In X, open Settings and privacy, find the data usage settings under accessibility and display, and set video autoplay to never. Videos then wait for a tap. It doesn't limit time, but it takes some pull out of the feed." },
			{ question: 'Can I block x.com on my computer?', answer: "Yes. Respite's Chrome extension puts a pause before x.com and can give it a daily limit; it also works in other Chromium browsers. On a Mac, Screen Time's website limits cover Safari. Website blockers such as Cold Turkey or Freedom are stricter options." },
		],
	},
	{
		id: 'facebook',
		name: 'Facebook',
		short: 'Facebook',
		title: 'How to Block Facebook on iPhone and Android (2026)',
		h1: 'How to block Facebook on iPhone and Android',
		description: "Block Facebook or set a daily limit on iPhone and Android: phone settings step by step, Facebook's own reminder and Quiet mode, and the Messenger catch.",
		dek: "Phone limits, Facebook's own reminder, and the Messenger catch.",
		answer: "On iPhone, go to Settings › Screen Time › Time Allowances and set a daily time for the category Facebook is in (on iOS 26 or earlier, App Limits › Add Limit picks Facebook alone). On Android, set an App timer for Facebook in Settings › Digital Wellbeing & parental controls. Facebook's own reminder only notifies you, and Messenger is a separate app.",
		queries: ['how to block facebook on iphone', 'block facebook android', 'facebook time limit', 'facebook daily time reminder'],
		card: 'Has its own reminder',
		ownLimit: true,
		ogImage: '/images/blog/how-to-block-apps-iphone.jpg',
		iphone: { steps: iphoneSteps('Facebook', websiteStep('facebook.com')), catch: IPHONE_CATCH },
		android: { steps: androidSteps('Facebook'), catch: ANDROID_CATCH },
		inApp: {
			lead: "In Facebook: **Menu › Settings & privacy**, then **Your time on Facebook**. Where it sits varies by version.",
			options: [
				{ name: 'Daily time reminder', kind: 'reminder', text: 'A notification when you reach your time. Nothing closes.' },
				{ name: 'Quiet mode', kind: 'helps', text: 'Mutes most Facebook notifications, on a schedule if you like.' },
				{ name: 'Time stats', kind: 'info', text: 'Your daily average on this device.' },
			],
		},
		watch: [
			'**Messenger** is its own app. Limiting Facebook leaves it open, and blocking it leaves Facebook open.',
			'**facebook.com** in a browser can skip an app limit. Cover the site too.',
		],
		respite: {
			line: 'A pause before Facebook opens and a daily limit that locks it until midnight, with Messenger left alone unless you add it.',
			shots: [
				{ slug: '3d-pause-facebook', title: 'A pause before Facebook', line: 'Do something else, or continue on purpose.' },
				{ slug: 'limits-android', title: 'A daily limit', line: 'Minutes left today, per app.' },
			],
			chips: ['Pause before Facebook', 'Daily limit', '1 schedule free'],
		},
		web: { site: 'facebook.com', line: 'On a laptop, the Respite Chrome extension pauses facebook.com and gives it a daily limit.' },
		related: [
			{ href: '/blog/social-media-addiction-signs/', label: 'Signs of social media addiction', line: 'When it is more than a habit.' },
			{ href: '/blog/how-to-block-apps-iphone/', label: 'Block social media apps on iPhone', line: 'Every iPhone option, including Focus and Shortcuts.' },
		],
		faq: [
			{ question: "How do I block Facebook on iPhone?", answer: "Go to Settings › Screen Time › Time Allowances, tap Manage Categories, add the category Facebook is in and set a daily time; on iOS 26 or earlier, App Limits › Add Limit lets you pick Facebook alone. Lock it under Passcode & Management › Lock Screen Time Settings. Messenger is a separate app: add it only if you want it limited." },
			{ question: 'Does Facebook have a time limit?', answer: "Facebook has a daily time reminder, under Settings & privacy and Your time on Facebook. When you reach your time it sends a notification, and nothing closes. Quiet mode mutes most notifications, on a schedule if you like. For a limit that closes the app, use Screen Time or Digital Wellbeing." },
			{ question: 'Will blocking Facebook block Messenger?', answer: "No. On both iPhone and Android, Facebook and Messenger are separate apps with separate limits. That's useful if you want to keep messages and lose the feed: limit Facebook and leave Messenger alone. To block both, add both to the same limit." },
			{ question: 'How do I block Facebook on Android?', answer: 'Open Settings › Digital Wellbeing & parental controls, tap the Dashboard, choose Facebook and set an App timer. When it runs out, Facebook pauses until midnight. For set hours, add it to Focus mode with a schedule. Menu names vary a little between phone makers.' },
			{ question: 'How do I block facebook.com on a computer?', answer: "Respite's Chrome extension puts a pause before facebook.com and can give it a daily limit; it also works in other Chromium browsers. On a Mac, Screen Time's website limits cover Safari. Stricter website blockers such as Cold Turkey or Freedom lock sites for a set time." },
		],
	},
	{
		id: 'snapchat',
		name: 'Snapchat',
		short: 'Snapchat',
		title: 'How to Block Snapchat on iPhone and Android (2026)',
		h1: 'How to block Snapchat on iPhone and Android',
		description: 'Block Snapchat or set a daily limit on iPhone and Android without losing your friends: phone settings step by step, Spotlight, streaks and Family Center.',
		dek: 'Limit the scrolling, keep the people.',
		answer: "On iPhone, go to Settings › Screen Time › Time Allowances and set a daily time for the category Snapchat is in (on iOS 26 or earlier, App Limits › Add Limit picks Snapchat alone). On Android, set an App timer for Snapchat in Settings › Digital Wellbeing & parental controls. Snapchat has no limit of its own, and a full block also cuts off chats.",
		queries: ['how to block snapchat on iphone', 'block snapchat android', 'snapchat time limit', 'snapchat screen time limit'],
		card: 'No limit of its own',
		ownLimit: false,
		ogImage: '/images/blog/how-to-block-apps-iphone.jpg',
		iphone: {
			steps: iphoneSteps('Snapchat', { title: 'Add a lock', text: 'Touch and hold the Snapchat icon and choose **Require Face ID**: one more beat before it opens.' }),
			catch: IPHONE_CATCH,
		},
		android: { steps: androidSteps('Snapchat'), catch: ANDROID_CATCH },
		inApp: {
			lead: 'As far as we could find, Snapchat has no daily limit for your own account. What it has:',
			options: [
				{ name: 'Time limit', kind: 'missing', text: 'No daily limit or break reminder for adults.' },
				{ name: 'Notifications', kind: 'helps', text: 'Keep chats, turn off the rest in **Settings › Notifications**.' },
				{ name: 'Family Center', kind: 'info', text: "For parents of teens: shows activity, doesn't cap time." },
			],
		},
		watch: [
			'Spotlight, Stories and chats are one app. Phone tools limit all of it or none of it.',
			'A full-day block can break a streak. A daily limit leaves room for the one Snap you meant to send.',
		],
		respite: {
			line: 'A pause instead of a wall: Snapchat opens when you mean it, so replies still get through. Add a daily limit for the scrolling.',
			shots: [
				{ slug: 'step-pick', title: 'Pick Snapchat', line: 'Add the apps you want a pause before.' },
				{ slug: 'pause-ios', title: 'A pause on iPhone', line: 'A short check-in before the app opens.' },
			],
			chips: ['Pause before Snapchat', 'Daily limit', 'Free, no ads'],
		},
		related: [
			{ href: '/blog/screen-time-for-parents/', label: 'Screen time for parents', line: 'Family rules that hold up.' },
			{ href: '/blog/social-media-addiction-signs/', label: 'Signs of social media addiction', line: 'When it is more than a habit.' },
		],
		faq: [
			{ question: 'Does Snapchat have a screen time limit?', answer: "Not for your own account, as far as we could find. Snapchat has no daily limit or break reminder for adults. Family Center lets parents of teens see activity, but it doesn't cap time. For a limit, use Screen Time on iPhone, Digital Wellbeing on Android, or an app like Respite." },
			{ question: "How do I block Snapchat on iPhone?", answer: "Go to Settings › Screen Time › Time Allowances, tap Manage Categories, add the category Snapchat is in and set a daily time; on iOS 26 or earlier, App Limits › Add Limit lets you pick Snapchat alone. Lock it under Passcode & Management › Lock Screen Time Settings. Require Face ID, from a long press on the icon, adds a smaller speed bump." },
			{ question: 'Will I lose my Snapchat streak if I block the app?', answer: 'A streak needs a Snap each day, so a block that lasts a whole day can end one. A daily limit, or a pause before Snapchat opens, leaves room to send the Snap you meant to and close the app. Decide whether the streak is worth keeping before you set a full block.' },
			{ question: 'How can parents limit Snapchat?', answer: "Use the phone's parental controls: Screen Time through Family Sharing on iPhone, or Google Family Link on Android, to set a daily limit for Snapchat. Snapchat's Family Center shows a teen's friends and activity but doesn't cap time. A limit you agree on together is usually easier to keep." },
			{ question: 'Can I block Spotlight but keep chats?', answer: 'Not with any setting we could find. Spotlight, Stories and chats live in one app, so phone limits cover all of them. What helps: turn off notifications for everything except chats, and open Snapchat to the camera or chat screen, not Spotlight.' },
		],
	},
	{
		id: 'netflix',
		name: 'Netflix',
		short: 'Netflix',
		title: 'How to Block Netflix on iPhone and Android (2026)',
		h1: 'How to block Netflix on iPhone and Android',
		description: 'Block Netflix or set a daily limit on iPhone and Android, turn off autoplay so the next episode waits, and set bedtime blocks that hold, step by step.',
		dek: 'Stop the next episode before it starts.',
		answer: "Netflix has no time limit of its own. On iPhone, go to Settings › Screen Time › Time Allowances and set a daily time for the category Netflix is in (on iOS 26 or earlier, App Limits › Add Limit picks Netflix alone). On Android, set an App timer for Netflix in Settings › Digital Wellbeing & parental controls. In Netflix, switch off autoplay for the next episode.",
		queries: ['how to block netflix on iphone', 'block netflix android', 'netflix time limit', 'turn off netflix autoplay'],
		card: 'No limit, but an autoplay switch',
		ownLimit: false,
		ogImage: '/images/blog/revenge-bedtime-procrastination.jpg',
		iphone: {
			steps: iphoneSteps('Netflix', { title: 'Mind the TV', text: 'Screen Time on your iPhone covers the iPhone. A TV or laptop needs its own settings.' }),
			catch: IPHONE_CATCH,
		},
		android: {
			steps: androidSteps('Netflix', { title: 'Wind down', text: '**Bedtime mode** greys the screen at night. It dims Netflix, it does not block it.' }),
			catch: ANDROID_CATCH,
		},
		inApp: {
			lead: 'Netflix has no time limit. Its autoplay switches are per profile, in profile settings (on the Netflix website if the app does not show them).',
			options: [
				{ name: 'Time limit', kind: 'missing', text: 'No daily limit in Netflix itself.' },
				{ name: 'Autoplay next episode', kind: 'helps', text: 'Off: each episode ends and waits for you.' },
				{ name: 'Autoplay previews', kind: 'helps', text: 'Off: no trailers playing while you browse.' },
				{ name: '"Still watching?"', kind: 'info', text: 'Netflix asks now and then. A check, not a limit.' },
			],
		},
		watch: [
			"A TV, laptop or tablet isn't covered by your phone's limit. Turn autoplay off for each profile you use.",
			'Downloads play inside the Netflix app, so an app limit still counts them.',
		],
		respite: {
			line: 'A Bedtime schedule (22:00 to 07:00, yours to change) that a snooze cannot lift, a pause before Netflix, and a daily limit that warns you before it locks.',
			shots: [
				{ slug: 'limits-ios', title: 'A heads-up first', line: 'A warning before the limit, then it locks for the day.' },
				{ slug: 'pause-ios', title: 'A pause before the next episode', line: 'A short check-in before the app opens.' },
			],
			chips: ['Bedtime schedule', 'Daily limit', '1 schedule free'],
		},
		related: [
			{ href: '/blog/revenge-bedtime-procrastination/', label: 'Revenge bedtime procrastination', line: 'Why the late episode feels earned, and what helps.' },
			{ href: '/blog/stop-scrolling-at-night/', label: 'How to stop scrolling at night', line: 'Make the last tap of the day a choice.' },
		],
		faq: [
			{ question: 'Does Netflix have a time limit?', answer: 'No. Netflix has no daily time limit. It has autoplay switches, profile locks and maturity ratings for kids, and it sometimes asks whether you are still watching. For a time limit, use Screen Time on iPhone, Digital Wellbeing on Android, or an app like Respite.' },
			{ question: "How do I block Netflix on iPhone?", answer: "Go to Settings › Screen Time › Time Allowances, tap Manage Categories, add the category Netflix is in and set a daily time; on iOS 26 or earlier, App Limits › Add Limit lets you pick Netflix alone. Lock it under Passcode & Management › Lock Screen Time Settings. For nights only, use a Screen Time Schedule (Downtime on older iOS)." },
			{ question: 'How do I turn off autoplay on Netflix?', answer: "Open your profile's settings (Manage profiles, or on the Netflix website, your account's profile settings) and switch off autoplay for the next episode and for previews. The setting is per profile, so change it for each one you use. It can take a moment to apply on other devices." },
			{ question: 'How do I block Netflix at bedtime?', answer: "On iPhone, use a Screen Time Schedule (Downtime on older iOS) with Netflix's category left out of the night window and Netflix off Always Allowed. On Android, put Netflix in Focus mode with a nightly schedule; Bedtime mode alone only greys the screen. In Respite, a Bedtime schedule blocks the apps you choose, and a snooze doesn't lift it." },
			{ question: "Can I stop my kids watching Netflix on their phone?", answer: "Set a Screen Time limit for your child through Family Sharing on iPhone, or in Google Family Link on Android, with a passcode only you know. In Netflix, a Kids profile, maturity ratings and a profile lock on your own profile keep them out of adult content." },
		],
	},
];

export const blockApp = (id: string) => BLOCK_APPS.find((a) => a.id === id);

/** **bold** to <strong>, everything else escaped. */
export function inline(text: string): string {
	const esc = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
	return esc.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}

/** Plain text for schema and meta: markup removed. */
export const plain = (text: string) => text.replace(/\*\*(.+?)\*\*/g, '$1');
