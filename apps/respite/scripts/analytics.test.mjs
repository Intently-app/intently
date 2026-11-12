// The pure analytics helpers (src/lib/analytics-core.ts). Node strips the TypeScript types itself.
import { test } from "node:test";
import assert from "node:assert/strict";
import {
	calculatorBand,
	clean,
	ctaClickParams,
	ctaForHref,
	pageFromPath,
	shareParams,
	storeClickParams,
	storeOf,
	tagStoreHref,
	toolCompleteParams,
	utmFromReferrer,
	utmFromSearch,
} from "../src/lib/analytics-core.ts";

const HOST = "respite.liveintently.app";
const blog = { section: "blog", slug: "how_to_stop_doomscrolling" };

test("clean: lowercase, underscores, 60 characters at most", () => {
	assert.equal(clean("Reddit.com"), "reddit_com");
	assert.equal(clean("  Launch 2026-11! "), "launch_2026_11");
	assert.equal(clean("x".repeat(80)).length, 60);
});

test("utmFromSearch keeps only utm_* values, cleaned", () => {
	assert.deepEqual(utmFromSearch("?utm_source=Reddit&utm_medium=social&gclid=abc&utm_campaign=Launch%202026"), {
		utm_source: "reddit",
		utm_medium: "social",
		utm_campaign: "launch_2026",
	});
	assert.deepEqual(utmFromSearch(""), {});
});

test("utmFromReferrer: search engines are organic, other sites referral, our own site nothing", () => {
	assert.deepEqual(utmFromReferrer("https://www.google.com/", HOST), { utm_source: "google", utm_medium: "organic" });
	assert.deepEqual(utmFromReferrer("https://duckduckgo.com/", HOST), { utm_source: "duckduckgo", utm_medium: "organic" });
	assert.deepEqual(utmFromReferrer("https://old.reddit.com/r/nosurf/", HOST), { utm_source: "reddit", utm_medium: "referral" });
	assert.deepEqual(utmFromReferrer("https://liveintently.app/attention/", HOST), { utm_source: "liveintently", utm_medium: "referral" });
	assert.deepEqual(utmFromReferrer(`https://${HOST}/blog/`, HOST), {});
	assert.deepEqual(utmFromReferrer("", HOST), {});
	assert.deepEqual(utmFromReferrer("not a url", HOST), {});
});

test("pageFromPath: section and slug", () => {
	assert.deepEqual(pageFromPath("/"), { section: "home", slug: "home" });
	assert.deepEqual(pageFromPath("/blog/how-to-stop-doomscrolling/"), blog);
	assert.deepEqual(pageFromPath("/quiz/"), { section: "tools", slug: "quiz" });
	assert.deepEqual(pageFromPath("/screen-time-calculator/"), { section: "tools", slug: "screen_time_calculator" });
	assert.deepEqual(pageFromPath("/privacy/website/"), { section: "legal", slug: "website" });
	assert.deepEqual(pageFromPath("/download/"), { section: "download", slug: "download" });
});

test("storeOf recognises the three stores and nothing else", () => {
	assert.equal(storeOf("https://apps.apple.com/app/id6754500620"), "app_store");
	assert.equal(storeOf("https://play.google.com/store/apps/details?id=dev.sadakat.thinkfaster"), "google_play");
	assert.equal(storeOf("https://chromewebstore.google.com/detail/abc"), "chrome_web_store");
	assert.equal(storeOf("https://play.google.com/books"), null);
	assert.equal(storeOf("/download/"), null);
	assert.equal(storeOf(`https://${HOST}/download/`), null);
});

test("tagStoreHref: each store gets its own campaign parameters", () => {
	const src = { utm_source: "reddit", utm_medium: "social" };
	const play = new URL(tagStoreHref("https://play.google.com/store/apps/details?id=x", "google_play", src, blog, "article"));
	assert.equal(play.searchParams.get("id"), "x");
	assert.deepEqual(Object.fromEntries(new URLSearchParams(play.searchParams.get("referrer"))), {
		utm_source: "reddit",
		utm_medium: "social",
		utm_campaign: "blog",
		utm_content: "how_to_stop_doomscrolling__article",
	});

	const cws = new URL(tagStoreHref("https://chromewebstore.google.com/detail/abc", "chrome_web_store", {}, { section: "home", slug: "home" }, "hero"));
	assert.equal(cws.searchParams.get("utm_source"), "respite_site");
	assert.equal(cws.searchParams.get("utm_medium"), "web");
	assert.equal(cws.searchParams.get("utm_campaign"), "home");
	assert.equal(cws.searchParams.get("utm_content"), "home__hero");

	const ios = new URL(tagStoreHref("https://apps.apple.com/app/id1", "app_store", src, blog, "nav", "999"));
	assert.equal(ios.searchParams.get("pt"), "999");
	assert.equal(ios.searchParams.get("ct"), "reddit.how_to_stop_doomscrolli");
	assert.equal(ios.searchParams.get("ct").length, 30);
	assert.equal(ios.searchParams.get("mt"), "8");
	assert.equal(tagStoreHref("https://apps.apple.com/app/id1", "app_store", src, blog, "nav", ""), "https://apps.apple.com/app/id1");
});

test("store_click carries cta only when the link has one", () => {
	assert.deepEqual(storeClickParams("google_play", {}, blog, "footer"), {
		store: "google_play",
		page: "how_to_stop_doomscrolling",
		section: "blog",
		placement: "footer",
		source: "respite_site",
		medium: "web",
	});
	assert.equal(storeClickParams("app_store", {}, blog, "hero", "download").cta, "download");
});

test("cta_click: the visitor's source and medium, as store_click reports them", () => {
	assert.deepEqual(ctaClickParams("article_cta", { utm_source: "google", utm_medium: "organic" }, blog, "inline_cta"), {
		cta: "article_cta",
		page: "how_to_stop_doomscrolling",
		section: "blog",
		placement: "inline_cta",
		source: "google",
		medium: "organic",
	});
});

test("share follows GA4's recommended parameters", () => {
	assert.deepEqual(shareParams("copy_link", "article", blog), { method: "copy_link", content_type: "article", item_id: "how_to_stop_doomscrolling" });
	assert.deepEqual(shareParams("x", "tool", pageFromPath("/screen-time-calculator/")), { method: "x", content_type: "tool", item_id: "screen_time_calculator" });
});

test("tool_complete bands are coarse", () => {
	assert.deepEqual(toolCompleteParams("addiction_score", "Critical"), { tool: "addiction_score", result_band: "critical" });
	assert.deepEqual(toolCompleteParams("quiz", "moderate"), { tool: "quiz", result_band: "moderate" });
	const bands = [0, 1.5, 2, 3.9, 4, 5.5, 6, 7.5, 8, 14].map(calculatorBand);
	assert.deepEqual(bands, ["under_2h", "under_2h", "2_4h", "2_4h", "4_6h", "4_6h", "6_8h", "6_8h", "8h_plus", "8h_plus"]);
	assert.equal(calculatorBand(Number.NaN), "unknown");
	assert.equal(new Set([...Array(141).keys()].map((i) => calculatorBand(i / 10))).size, 5, "five bands at most");
});

test("ctaForHref maps the conversion pages and ignores the rest", () => {
	assert.equal(ctaForHref("/download/"), "download");
	assert.equal(ctaForHref("/download"), "download");
	assert.equal(ctaForHref("/quiz/"), "quiz");
	assert.equal(ctaForHref("/screen-time-calculator/"), "calculator");
	assert.equal(ctaForHref("/app-addiction-score/"), "addiction_score");
	assert.equal(ctaForHref("/features/#plans"), "plans");
	assert.equal(ctaForHref("/features/#sync"), "features");
	assert.equal(ctaForHref("/features/"), "features");
	assert.equal(ctaForHref("/ai/"), "ai");
	assert.equal(ctaForHref("/blog/"), null);
	assert.equal(ctaForHref("/blog/what-is-digital-wellbeing/"), null);
});
