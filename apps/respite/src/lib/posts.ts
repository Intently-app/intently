import { getCollection, type CollectionEntry } from 'astro:content';

export type BlogPostEntry = CollectionEntry<'blog'>;

/**
 * Every call site that lists or builds blog posts goes through this helper, so a post with
 * `draft: true` in its frontmatter never reaches production (blog index, post pages, related posts,
 * home page, RSS and, because the sitemap is built from rendered pages, the sitemap). Drafts are
 * only built by `astro dev`, so they can be previewed locally.
 */
export async function getPublishedPosts(): Promise<BlogPostEntry[]> {
	return getCollection('blog', ({ data }) => import.meta.env.DEV || data.draft !== true);
}
