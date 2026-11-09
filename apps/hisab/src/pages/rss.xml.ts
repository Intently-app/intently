import { SITE } from '../lib/site';
import { publishedArticles } from '../lib/articles';

const escape = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export async function GET() {
	const items = (await publishedArticles()).map((article) => {
		const link = `${SITE.url}/articles/${article.id}/`;
		return `<item><title>${escape(article.data.title)}</title><link>${link}</link><guid>${link}</guid><pubDate>${article.data.pubDate.toUTCString()}</pubDate><description>${escape(article.data.answer)}</description></item>`;
	});
	const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel><title>Hisab articles</title><link>${SITE.url}/articles/</link><description>${escape(SITE.description)}</description><language>en</language>${items.join('')}</channel></rss>
`;
	return new Response(body, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
