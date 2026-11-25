// Respite is on iPhone, Android and Chrome (docs/content-guide.md, "Product facts"). These checks catch posts
// that describe Respite with an older platform list, such as "Android, Chrome" or "iOS isn't here yet".
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";

const dir = new URL("../src/content/blog/", import.meta.url);
const posts = readdirSync(dir)
	.filter((f) => f.endsWith(".md"))
	.map((f) => ({ file: f, lines: readFileSync(new URL(f, dir), "utf8").split("\n") }));

const hasAll = (s) => /iphone|\bios\b/i.test(s) && /android/i.test(s) && /chrome/i.test(s);
const cells = (row) => row.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim());

/** Platform text that describes Respite: lines under a Respite heading, and table cells in Respite's row or column. */
export function respitePlatforms(lines) {
	const found = [];
	let header = null; // cells of the current table's header row
	lines.forEach((line, i) => {
		const at = i + 1;
		if (/^#+ .*\bRespite\b/.test(line)) {
			for (let j = i + 1; j <= i + 4 && j < lines.length; j++) {
				if (/^\**Platforms?\**:?\**\s*:?/.test(lines[j]) && /platform/i.test(lines[j])) found.push({ at: j + 1, text: lines[j] });
			}
		}
		if (!line.trim().startsWith("|")) {
			header = null;
			return;
		}
		const row = cells(line);
		if (!header) {
			header = row;
			return;
		}
		if (row.every((c) => /^:?-+:?$/.test(c))) return;
		// A row about Respite: its cells that name a platform.
		if (/^\**Respite\**$/.test(row[0])) {
			for (const c of row.slice(1)) if (/\b(android|chrome)\b/i.test(c) && !/apps\b/i.test(c)) found.push({ at, text: c });
		}
		// A "Platforms" row in a table with a Respite column.
		const col = header.findIndex((h) => /^\**Respite\**$/.test(h));
		if (col > 0 && /^\**Platforms?\**$/i.test(row[0]) && row[col]) found.push({ at, text: row[col] });
	});
	return found;
}

test("every Respite platform list names iPhone, Android and Chrome", () => {
	const bad = [];
	for (const { file, lines } of posts) {
		for (const { at, text } of respitePlatforms(lines)) if (!hasAll(text)) bad.push(`${file}:${at}: ${text.trim()}`);
	}
	assert.deepEqual(bad, []);
});

test("no post says Respite's iPhone app is missing or coming", () => {
	const stale = /(ios|iphone)( support| app| version)? (isn.t|is not) (here|available|out)( yet)?|coming (soon )?to (ios|iphone)|(ios|iphone)( support| app| version)? (is )?coming soon|no (ios|iphone) (app|version) yet/i;
	const bad = [];
	for (const { file, lines } of posts) {
		lines.forEach((line, i) => {
			if (/respite/i.test(line) && stale.test(line)) bad.push(`${file}:${i + 1}`);
		});
	}
	assert.deepEqual(bad, []);
});

test("the checks catch the old wording", () => {
	const old = ["### Respite — The Full Toolkit", "", "**Platform**: Android, Chrome | **Price**: Free"];
	assert.equal(respitePlatforms(old).length, 1);
	assert.equal(hasAll(respitePlatforms(old)[0].text), false);
	const table = ["| | Respite | ClearSpace |", "|---|---|---|", "| Platforms | Android, Chrome | iPhone |"];
	assert.equal(hasAll(respitePlatforms(table)[0].text), false);
	const row = ["| App | Price | Platforms |", "|---|---|---|", "| **Respite** | Free | Android, Chrome |"];
	assert.equal(hasAll(respitePlatforms(row)[0].text), false);
});
