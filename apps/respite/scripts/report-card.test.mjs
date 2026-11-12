// The calculator's report card (src/lib/report-card.ts): share-link numbers, the calculator's math,
// and the drawing. Node strips the TypeScript types itself.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
	cardQuery,
	cardSentence,
	cardStats,
	cardSvg,
	dailyLabel,
	normalize,
	parseCardParams,
	snapHours,
	span,
} from "../src/lib/report-card.ts";

const art = {
	fox: readFileSync(new URL("../src/assets/card/biscuit-read-chart.svg", import.meta.url), "utf8"),
	logo: readFileSync(new URL("../src/assets/card/respite-mark.svg", import.meta.url), "utf8"),
};

test("share-link numbers: plain numbers in range pass through", () => {
	assert.deepEqual(parseCardParams("h=4.5&age=28&first=14"), { h: 4.5, age: 28, first: 14 });
	assert.deepEqual(parseCardParams(new URLSearchParams("first=14&age=28&h=4")), { h: 4, age: 28, first: 14 });
});

test("share-link numbers: a missing or non-numeric value is no result", () => {
	for (const q of ["", "h=4.5&age=28", "h=4.5&first=14", "age=28&first=14", "h=&age=28&first=14", "h=abc&age=28&first=14",
		"h=4.5&age=28&first=1e1", "h=-4&age=28&first=14", "h=4.5&age=28.5.1&first=14", "h=Infinity&age=28&first=14",
		"h=0x10&age=28&first=14", "h=4.5&age=1000&first=14", "h=<b>&age=28&first=14", "h=4.5%20&age=28&first=14x"])
		assert.equal(parseCardParams(q), null, q);
});

test("share-link numbers: clamped to the calculator's ranges", () => {
	assert.deepEqual(parseCardParams("h=0&age=0&first=0"), { h: 1, age: 10, first: 5 });
	assert.deepEqual(parseCardParams("h=99&age=999&first=99"), { h: 14, age: 90, first: 60 });
	// The first phone can't come after today.
	assert.deepEqual(parseCardParams("h=3&age=20&first=40"), { h: 3, age: 20, first: 20 });
	// Ages are whole years.
	assert.deepEqual(parseCardParams("h=3&age=27.6&first=13.2"), { h: 3, age: 28, first: 13 });
});

test("bucket: daily hours snap to the nearest 0.5 h step from 1 to 14", () => {
	const cases = [[0, 1], [0.74, 1], [1, 1], [1.24, 1], [1.26, 1.5], [4.5, 4.5], [4.74, 4.5], [4.76, 5], [13.9, 14], [14, 14], [20, 14]];
	for (const [h, want] of cases) assert.equal(snapHours(h), want, String(h));
	const buckets = new Set(Array.from({ length: 1500 }, (_, i) => snapHours(i / 100)));
	assert.equal(buckets.size, 27, "27 buckets: 1, 1.5, … 14");
});

test("normalize: what the controls can't hold falls back to the calculator's defaults", () => {
	assert.deepEqual(normalize({ h: Number.NaN, age: Number.NaN, first: Number.NaN }), { h: 4, age: 28, first: 14 });
	assert.deepEqual(normalize({ h: 2.25, age: 150, first: 3 }), { h: 2.5, age: 90, first: 5 });
});

test("cardQuery: one canonical spelling, so a result has one URL", () => {
	assert.equal(cardQuery({ h: 4.5, age: 28, first: 14 }), "h=4.5&age=28&first=14");
	assert.equal(cardQuery({ h: 4.4, age: 28.2, first: 99 }), "h=4.5&age=28&first=28");
	assert.equal(cardQuery(parseCardParams("first=014&age=28.0&h=04.50")), "h=4.5&age=28&first=14");
});

test("cardStats: the calculator's own math", () => {
	// 4.5 h × 365 × (28 − 14) = 22,995 h = 2.6 years; 1 h × 365 × (80 − 28) = 18,980 h = 2.2 years.
	const s = cardStats({ h: 4.5, age: 28, first: 14 });
	assert.equal(s.lifetimeHours, 22995);
	assert.deepEqual(s.lifetime, { value: "2.6", unit: "years" });
	assert.equal(s.backHours, 18980);
	assert.deepEqual(s.back, { value: "2.2", unit: "years" });
	// At least one year with a phone, at least one year ahead (as the calculator does).
	assert.equal(cardStats({ h: 2, age: 30, first: 30 }).lifetimeHours, 730);
	assert.equal(cardStats({ h: 2, age: 90, first: 30 }).backHours, 365);
});

test("span: years with one decimal, days under a year", () => {
	assert.deepEqual(span(8760), { value: "1.0", unit: "years" });
	assert.deepEqual(span(434525), { value: "49.6", unit: "years" });
	assert.deepEqual(span(365), { value: "15", unit: "days" });
	assert.deepEqual(span(24), { value: "1", unit: "day" });
});

test("labels and the share sentence", () => {
	assert.equal(dailyLabel(4), "4h");
	assert.equal(dailyLabel(4.5), "4.5h");
	assert.equal(
		cardSentence({ h: 4.5, age: 28, first: 14 }),
		"My screen time: 4.5 hours a day = 2.6 years of my life. Cut 1 hour a day, get 2.2 years back.",
	);
});

test("cardSvg: both sizes, both themes, the numbers on it, ids kept apart", () => {
	const input = { h: 4.5, age: 28, first: 14 };
	for (const [format, w, h] of [["og", 1200, 630], ["post", 1080, 1350]]) {
		for (const theme of ["light", "dark"]) {
			const svg = cardSvg(input, { format, theme, art, idPrefix: "t-" });
			assert.match(svg, new RegExp(`^<svg [^>]*viewBox="0 0 ${w} ${h}"`));
			for (const text of ["My screen time report", "4.5h", "2.6", "2.2", "years of my life", "if I cut 1 hour a day", "respite.liveintently.app"])
				assert.ok(svg.includes(text), `${format}/${theme}: ${text}`);
			const ids = [...svg.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
			assert.ok(ids.length > 0 && ids.every((id) => id.startsWith("t-")), "every id prefixed");
			for (const [, ref] of svg.matchAll(/url\(#([^)]+)\)/g)) assert.ok(ids.includes(ref), `url(#${ref}) resolves`);
		}
	}
});

test("cardSvg: input is normalized before drawing, and embedded fonts go in a <style>", () => {
	const svg = cardSvg({ h: 99, age: 5, first: 1 }, { format: "og", theme: "light", art, fontCss: "@font-face{}" });
	assert.ok(svg.includes(">14h<"));
	assert.ok(svg.includes("<style>@font-face{}</style>"));
});
