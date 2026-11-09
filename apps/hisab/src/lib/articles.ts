import { getCollection, type CollectionEntry } from 'astro:content';

export type Article = CollectionEntry<'articles'>;

/**
 * Every page that lists or builds articles goes through this, so a `draft: true` article never reaches production:
 * not the index, the article pages, RSS, llms.txt, or the sitemap (which is built from rendered pages). Newest first.
 */
export async function publishedArticles(): Promise<Article[]> {
	const all = await getCollection('articles', ({ data }) => import.meta.env.DEV || data.draft !== true);
	return all.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf() || a.data.title.localeCompare(b.data.title));
}

export function wordCount(markdown = ''): number {
	const plain = markdown
		.replace(/\[(.*?)\]\(.*?\)/g, '$1')
		.replace(/[#*_>|`-]/g, ' ')
		.trim();
	return plain ? plain.split(/\s+/).length : 0;
}

export const minutesToRead = (markdown = '') => Math.max(1, Math.ceil(wordCount(markdown) / 220));

export const shortDate = (date: Date) => date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
