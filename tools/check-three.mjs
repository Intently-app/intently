// Every site that draws with three.js must use the same version, so shared code (packages/world)
// behaves the same everywhere and the browser can reuse one cached copy. Fails when npm has more
// than one installed.   node tools/check-three.mjs
import { execFileSync } from 'node:child_process';

let tree;
try {
	tree = JSON.parse(execFileSync('npm', ['ls', 'three', '--all', '--json'], { cwd: new URL('..', import.meta.url), encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }));
} catch (e) {
	tree = JSON.parse(e.stdout || '{}');
}
const found = new Map();
(function walk(node, path) {
	for (const [name, dep] of Object.entries(node.dependencies ?? {})) {
		const here = `${path} > ${name}`;
		if (name === 'three' && dep.version) found.set(dep.version, [...(found.get(dep.version) ?? []), here]);
		walk(dep, here);
	}
})(tree, 'root');
if (found.size > 1) {
	console.error('More than one three.js version is installed:');
	for (const [v, paths] of found) console.error(`  ${v}: ${paths.join(', ')}`);
	process.exit(1);
}
console.log(found.size ? `three ${[...found.keys()][0]}` : 'three is not installed');
