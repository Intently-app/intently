import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { twinnable, withSlashRules } from "./slash-redirects.mjs";

const rules = (text) =>
	text
		.split("\n")
		.map((l) => l.trim())
		.filter((l) => l && !l.startsWith("#"))
		.map((l) => l.split(/\s+/));

test("twinnable: only exact page paths without a trailing slash", () => {
	for (const s of ["/resources", "/blog/intently-vs-brick", "/privacy/ios"]) assert.equal(twinnable(s), true, s);
	for (const s of ["/", "/blog/", "/blog/*", "/blog-*", "/posts/:slug", "/privacy-policy-chrome.html", "/a.jpg", "https://x.app/a"])
		assert.equal(twinnable(s), false, s);
});

test("each exact rule gets a slashed twin right after it, same target and status", () => {
	const out = withSlashRules("/blog/intently-vs-brick  /blog/respite-vs-brick/  301\n/comparisons  /blog/#comparisons  302\n", []);
	assert.deepEqual(rules(out), [
		["/blog/intently-vs-brick", "/blog/respite-vs-brick/", "301"],
		["/blog/intently-vs-brick/", "/blog/respite-vs-brick/", "301"],
		["/comparisons", "/blog/#comparisons", "302"],
		["/comparisons/", "/blog/#comparisons", "302"],
	]);
});

test("a rule without a status keeps the default (no status written)", () => {
	assert.deepEqual(rules(withSlashRules("/old  /new/\n", [])), [["/old", "/new/"], ["/old/", "/new/"]]);
});

test("splats, placeholders, files and slashed sources get no twin", () => {
	const text = "/a.html  /b/  301\n/posts/:slug  /blog/:slug/  301\n/x/  /y/  301\n/blog/*  /b/:splat  301\n";
	assert.equal(withSlashRules(text, []), text);
});

test("twins stay ahead of a later splat (first match wins)", () => {
	const out = rules(withSlashRules("/blog/old  /blog/new/  301\n/blog/*  /b/:splat  301\n", []));
	assert.deepEqual(out.map((r) => r[0]), ["/blog/old", "/blog/old/", "/blog/*"]);
});

test("a twin already written by hand is not duplicated", () => {
	const text = "/old  /new/  301\n/old/  /elsewhere/  301\n";
	assert.equal(withSlashRules(text, []), text);
});

test("no twin that would shadow a built page or point at itself", () => {
	// /privacy/ios is a page here, so /privacy/ios/ must keep serving it.
	assert.deepEqual(rules(withSlashRules("/privacy/ios  /privacy/  301\n", ["/privacy/ios"])), [["/privacy/ios", "/privacy/", "301"]]);
	assert.deepEqual(rules(withSlashRules("/a  /a/  301\n", [])), [["/a", "/a/", "301"]]);
});

test("pages still get their trailing-slash 301, after the twins, and not twice", () => {
	const out = rules(withSlashRules("/old  /blog/  301\n", ["/blog", "/old"]));
	assert.deepEqual(out, [
		["/old", "/blog/", "301"],
		["/blog", "/blog/", "301"],
	]);
	const twice = withSlashRules(withSlashRules("/old  /new/  301\n", ["/blog"]), ["/blog"]);
	assert.equal(rules(twice).length, 3);
});

test("comments and blank lines are kept", () => {
	const out = withSlashRules("# Moved\n/old  /new/  301\n\n# Files\n/a.jpg  /b.jpg  301\n", []);
	assert.equal(out, "# Moved\n/old  /new/  301\n/old/  /new/  301\n\n# Files\n/a.jpg  /b.jpg  301\n");
});

test("the rule limit counts the twins", () => {
	const many = Array.from({ length: 901 }, (_, i) => `/old-${i}  /new/  301`).join("\n");
	assert.throws(() => withSlashRules(many, []), /limit/);
	assert.doesNotThrow(() => withSlashRules(many.split("\n").slice(0, 900).join("\n"), []));
});

test("the site's own _redirects: every legacy comparison slug answers with and without the slash", () => {
	const text = readFileSync(new URL("../public/_redirects", import.meta.url), "utf8");
	const sources = new Map(rules(withSlashRules(text, [])).map(([from, to]) => [from, to]));
	for (const old of ["intently", "pawse"]) {
		for (const slug of ["brick", "clearspace", "flowbuddy", "forest", "freedom", "google-digital-wellbeing", "one-sec", "opal", "refocus", "screenzen"]) {
			const target = `/blog/respite-vs-${slug}/`;
			assert.equal(sources.get(`/blog/${old}-vs-${slug}`), target);
			assert.equal(sources.get(`/blog/${old}-vs-${slug}/`), target);
		}
	}
	for (const p of ["/resources/", "/comparisons/", "/privacy-chrome/", "/privacy-policy-chrome/", "/confirm-deletion/", "/guides/screen-time-reduction/"])
		assert.ok(sources.has(p), p);
	assert.ok(!sources.has("/privacy-policy-chrome.html/"));
});
