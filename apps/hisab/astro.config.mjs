// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { readdirSync, readFileSync } from "node:fs";
import slashRedirects from "./scripts/slash-redirects.mjs";

// An article's lastmod is its real date. Other pages carry none: stamping every URL with the build
// time teaches search engines to ignore lastmod.
const articleDir = new URL("./src/content/articles/", import.meta.url);
const articleDates = Object.fromEntries(
	readdirSync(articleDir)
		.filter((f) => f.endsWith(".md"))
		.map((f) => {
			const front = readFileSync(new URL(f, articleDir), "utf8").split("---")[1] ?? "";
			const date = (/** @type {string} */ key) => front.match(new RegExp(`^${key}:\\s*['"]?([0-9-]+)`, "m"))?.[1];
			return [f.replace(/\.md$/, ""), date("updatedDate") ?? date("pubDate")];
		})
		.filter(([, d]) => d),
);

// Static pages served by Cloudflare as Worker assets; worker.ts handles only /api/*.
export default defineConfig({
	site: "https://hisab.liveintently.app",
	trailingSlash: "always",
	integrations: [
		sitemap({
			filter: (page) => !/\/(joined|404)(\/|$)/.test(new URL(page).pathname),
			serialize(item) {
				const slug = item.url.match(/\/articles\/([^/]+)\/$/)?.[1];
				if (slug && articleDates[slug]) item.lastmod = new Date(articleDates[slug]).toISOString();
				return item;
			},
		}),
		slashRedirects(),
	],
});
