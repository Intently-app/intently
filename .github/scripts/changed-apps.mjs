// Which app workspaces a change touches, for the deploy and CI workflows.
//
//   node .github/scripts/changed-apps.mjs --base <sha> --head <sha>   apps changed between two commits
//   node .github/scripts/changed-apps.mjs --apps respite,hub          exactly these
//   node .github/scripts/changed-apps.mjs --apps all                  every deployable app
//
// Prints a JSON array of {app, worker, workspace, host, hasTest, hasBuild} and, under GitHub Actions, writes it
// to $GITHUB_OUTPUT as `apps` (plus `count`).
//
// An app is changed when a file under apps/<app>/ changes, when a workspace package it depends on
// (packages/<name>, by its @intently/* name) changes, or when something every app's build shares
// changes (root package.json, package-lock.json, .nvmrc). Editing the workflows or this script
// deploys nothing; use Run workflow for that. A base that is missing or all zeros (first push of a
// branch, force push) means every app.
import { execFileSync } from 'node:child_process';
import { appendFileSync, existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

// Never deployed by automation. pawse-site is retired: pawse.liveintently.app belongs to
// intently-redirects now, and deploying pawse-site would claim the domain back (see README).
const EXCLUDED = new Set(['pawse']);

const SHARED = [/^package\.json$/, /^package-lock\.json$/, /^\.nvmrc$/];

const args = process.argv.slice(2);
const arg = (name) => {
	const i = args.indexOf(name);
	return i >= 0 ? args[i + 1] : undefined;
};

const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'));

// Workspace packages: directory -> package name.
const packages = existsSync('packages')
	? readdirSync('packages', { withFileTypes: true })
			.filter((d) => d.isDirectory() && existsSync(join('packages', d.name, 'package.json')))
			.map((d) => ({ dir: `packages/${d.name}/`, name: readJson(join('packages', d.name, 'package.json')).name }))
	: [];

// Apps: one per apps/<dir> with a wrangler.json.
const apps = readdirSync('apps', { withFileTypes: true })
	.filter((d) => d.isDirectory() && existsSync(join('apps', d.name, 'wrangler.json')) && !EXCLUDED.has(d.name))
	.map((d) => {
		const pkg = readJson(join('apps', d.name, 'package.json'));
		const wrangler = readJson(join('apps', d.name, 'wrangler.json'));
		const deps = { ...pkg.dependencies, ...pkg.devDependencies };
		return {
			app: d.name,
			workspace: pkg.name,
			worker: wrangler.name,
			// The first custom domain, for the smoke test after deploying.
			host: (wrangler.routes ?? []).find((r) => r.custom_domain)?.pattern ?? '',
			hasBuild: Boolean(pkg.scripts?.build),
			hasTest: Boolean(pkg.scripts?.test),
			uses: packages.filter((p) => p.name in deps).map((p) => p.dir),
		};
	});

// Policies are imported by path (`@intently/legal/policies/<dir>/privacy.md`), so a policy edit only
// matters to the apps whose source names that folder; anything else in a package matters to every
// app that uses the package.
const POLICY = /^packages\/legal\/policies\/([^/]+)\//;
const sourceCache = new Map();
function appSource(app) {
	if (!sourceCache.has(app)) {
		const dir = join('apps', app, 'src');
		const text = existsSync(dir)
			? readdirSync(dir, { recursive: true })
					.filter((f) => /\.(astro|ts|js|mjs|md|mdx)$/.test(f))
					.map((f) => readFileSync(join(dir, f), 'utf8'))
					.join('\n')
			: '';
		sourceCache.set(app, text);
	}
	return sourceCache.get(app);
}

function touches(a, file) {
	if (file.startsWith(`apps/${a.app}/`)) return true;
	const policy = file.match(POLICY);
	if (policy) return a.uses.includes('packages/legal/') && appSource(a.app).includes(`policies/${policy[1]}/`);
	return a.uses.some((dir) => file.startsWith(dir));
}

function changedFiles(base, head) {
	const out = execFileSync('git', ['diff', '--name-only', `${base}...${head}`], { encoding: 'utf8' });
	return out.split('\n').filter(Boolean);
}

let selected;
const explicit = arg('--apps');
if (explicit) {
	const wanted = explicit.split(/[\s,]+/).filter(Boolean);
	if (wanted.includes('all')) selected = apps;
	else {
		const unknown = wanted.filter((w) => !apps.some((a) => a.app === w));
		if (unknown.length) {
			console.error(`Unknown or excluded app(s): ${unknown.join(', ')}. Deployable: ${apps.map((a) => a.app).join(', ')}`);
			process.exit(1);
		}
		selected = apps.filter((a) => wanted.includes(a.app));
	}
} else {
	const base = arg('--base');
	const head = arg('--head') ?? 'HEAD';
	let files;
	try {
		files = !base || /^0+$/.test(base) ? null : changedFiles(base, head);
	} catch {
		files = null; // base not in this clone (force push): treat as everything changed
	}
	if (files === null || files.some((f) => SHARED.some((re) => re.test(f)))) selected = apps;
	else selected = apps.filter((a) => files.some((f) => touches(a, f)));
	console.error(files === null ? 'No usable base commit: every app.' : `${files.length} changed file(s).`);
}

const result = selected.map(({ uses, ...a }) => a);
console.error(`Apps: ${result.map((a) => a.app).join(', ') || '(none)'}`);
console.log(JSON.stringify(result));
if (process.env.GITHUB_OUTPUT) {
	appendFileSync(process.env.GITHUB_OUTPUT, `apps=${JSON.stringify(result)}\ncount=${result.length}\n`);
}
