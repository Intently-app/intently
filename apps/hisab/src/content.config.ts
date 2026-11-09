import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

const articles = defineCollection({
	loader: glob({ base: './src/content/articles', pattern: '**/*.md' }),
	schema: z.object({
		title: z.string().max(70),
		description: z.string().min(100).max(170),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		// Drafts are left out of every production listing and build (src/lib/articles.ts).
		draft: z.boolean().optional(),
		topic: z.enum(['ai', 'sms', 'basics']),
		// The answer-first summary at the top of the article, which answer engines can lift whole (40 to 75 words).
		answer: z.string(),
		keyTakeaways: z.array(z.string()).min(3).max(5),
		faq: z.array(z.object({ question: z.string(), answer: z.string() })).default([]),
		tags: z.array(z.string()).default([]),
	}),
});

export const collections = { articles };
