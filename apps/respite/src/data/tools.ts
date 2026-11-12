// The three free tools, for Home and each tool's "More free tools".
export type ToolId = 'quiz' | 'calculator' | 'score';
export const TOOLS: { id: ToolId; title: string; line: string; href: string }[] = [
	{ id: 'quiz', title: 'Phone addiction quiz', line: '8 questions, a clear next step.', href: '/quiz/' },
	{ id: 'calculator', title: 'Screen time calculator', line: 'Your daily scroll, over a lifetime.', href: '/screen-time-calculator/' },
	{ id: 'score', title: 'App addiction score', line: 'How hard your apps pull, scored.', href: '/app-addiction-score/' },
];
