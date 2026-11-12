// Reads the site's content and the pipeline's YAML files from disk.
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';

export const PIPELINE_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const SITE_DIR = path.resolve(PIPELINE_DIR, '..');
export const BLOG_DIR = path.join(SITE_DIR, 'src/content/blog');

const toDay = (v) => {
	if (v == null || v === '') return null;
	const d = v instanceof Date ? v : new Date(/^\d{4}-\d{2}-\d{2}$/.test(String(v)) ? `${v}T00:00:00Z` : `${v} UTC`);
	return Number.isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
};

/** Splits a Markdown file into { data, body }; data is the parsed YAML frontmatter. */
export function parseFrontmatter(text) {
	const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(text);
	if (!m) return { data: {}, body: text };
	return { data: YAML.parse(m[1]) ?? {}, body: m[2] };
}

/** Every blog post: slug, title, tags, pubDate (YYYY-MM-DD), draft. Drafts are included and flagged. */
export function loadPosts(dir = BLOG_DIR) {
	return readdirSync(dir)
		.filter((f) => /\.mdx?$/.test(f))
		.sort()
		.map((f) => {
			const { data } = parseFrontmatter(readFileSync(path.join(dir, f), 'utf8'));
			return {
				slug: f.replace(/\.mdx?$/, ''),
				title: data.title ?? '',
				description: data.description ?? '',
				tags: data.tags ?? [],
				pubDate: toDay(data.pubDate),
				draft: data.draft === true,
			};
		});
}

export function readYaml(file) {
	const p = path.isAbsolute(file) ? file : path.join(PIPELINE_DIR, file);
	return existsSync(p) ? YAML.parse(readFileSync(p, 'utf8')) ?? {} : {};
}

/**
 * Primary keywords from docs/ai-keyword-map.md, as [{ value, owner }]: each keyword has exactly one URL there, so a
 * new post must not target one of them.
 */
export function keywordMapPrimaries(file = path.join(SITE_DIR, 'docs/ai-keyword-map.md')) {
	if (!existsSync(file)) return [];
	const out = [];
	for (const line of readFileSync(file, 'utf8').split('\n')) {
		const cells = line.split('|').map((c) => c.trim());
		if (cells.length < 5 || !/^`\//.test(cells[1])) continue;
		const owner = cells[1].replace(/`/g, '');
		for (const kw of cells[3].split(';')) {
			const value = kw.replace(/\([^)]*\)/g, '').trim();
			if (value && !value.startsWith('(')) out.push({ value, owner });
		}
	}
	return out;
}
