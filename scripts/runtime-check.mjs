import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdtempSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { builtinModules } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

const sourceRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const requiredFiles = [
  'package.json', 'index.js', 'client.js', 'core.js', 'stats.js', 'store.js', 'backup.js',
  'config.js', 'credentials.js', 'widget.html', 'cordis.patch.yml', 'icon.svg',
  'locale/en.json', 'locale/zh.json', 'runtime/electron-helper/package.json',
  'runtime/electron-helper/main.js', 'runtime/electron-helper/preload.js',
  'scripts/runtime-check.mjs', 'scripts/host-imports.mjs', 'compliance.test.mjs', 'packaging.test.mjs', 'core.test.mjs', 'README.md',
];
function run(command, args, cwd) {
  const result = spawnSync(command, args, { cwd, stdio: 'inherit', env: process.env });
  if (result.error) throw result.error;
  assert.equal(result.status, 0, `${command} failed (${result.status})`);
}
function filesUnder(root, prefix = '') {
  return readdirSync(join(root, prefix), { withFileTypes: true }).flatMap(entry => {
    const path = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.name === 'node_modules' || entry.name === '.git') return [];
    assert(!entry.isSymbolicLink(), `Symlinks not allowed in verification tree: ${path}`);
    return entry.isDirectory() ? filesUnder(root, path) : [path];
  });
}
function localTarget(root, from, specifier) {
  const target = resolve(dirname(join(root, from)), specifier);
  const path = relative(root, target);
  assert(path !== '..' && !path.startsWith(`..${sep}`) && !isAbsolute(path), `Import escapes package: ${from} -> ${specifier}`);
  assert(existsSync(target) && statSync(target).isFile(), `Missing import: ${from} -> ${specifier}`);
}
export function verifyPackage(root, { syntax = true, clean = false } = {}) {
  root = resolve(root);
  const manifest = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
  assert.equal(manifest.engines?.dsh, '0.2.2-rc.1');
  assert.equal(manifest.peerDependencies?.['@deepseek-ai/schemastery'], '3.19.0');
  assert.equal(manifest.peerDependencies?.['@deepseek-ai/dsh-credentials'], '0.2.2-rc.1');
  assert(!manifest.dependencies?.['@deepseek-ai/schemastery'], 'Config schema package must be a host peer');
  if (clean) assert(!existsSync(join(root, 'node_modules')), 'Clean verification must not use node_modules');
  for (const file of requiredFiles) assert(existsSync(join(root, file)), `Missing packaged file: ${file}`);
  for (const target of Object.values(manifest.exports)) {
    if (!target.includes('*')) assert(existsSync(join(root, target)), `Missing export: ${target}`);
  }
  assert.equal(manifest.dsh.bundle.patch, './cordis.patch.yml');
  for (const lang of ['en', 'zh']) {
    const locale = JSON.parse(readFileSync(join(root, `locale/${lang}.json`), 'utf8'));
    assert(locale.meta?.title && locale.meta?.description, `Incomplete locale ${lang}`);
  }
  const icon = readFileSync(join(root, 'icon.svg'), 'utf8');
  assert(icon.includes('<svg') && Buffer.byteLength(icon) <= 256 * 1024, 'Invalid SVG icon or exceeds 256 KiB');
  assert.equal(JSON.parse(readFileSync(join(root, 'runtime/electron-helper/package.json'), 'utf8')).main, 'main.js');
  const files = filesUnder(root);
  const builtins = new Set(builtinModules.map(name => name.replace(/^node:/, '')));
  const hostImports = [];
  for (const file of files.filter(path => /\.(?:js|mjs)$/.test(path))) {
    if (syntax) run(process.execPath, ['--check', join(root, file)], root);
    const text = readFileSync(join(root, file), 'utf8');
    // Static import/export and literal require/import expressions; dynamic expressions need review.
    const staticImports = /^\s*(?:import|export)\s+(?:[^;\n]*?\bfrom\s*)?['"]([^'"\n]+)['"]/gm;
    const literalCalls = /(?<![\w'"-])\b(?:require|import)\s*\(\s*['"]([^'"\n]+)['"]/g;
    const specs = [...text.matchAll(staticImports), ...text.matchAll(literalCalls)].map(match => match[1]);
    for (const spec of specs) {
      if (spec.startsWith('.')) localTarget(root, file, spec);
      else if (spec.startsWith('node:') || builtins.has(spec)) continue;
      else if (spec === 'react' && file === 'client.js') continue; // Client builtin, supplied by DSH.
      else if (spec === 'electron' && file.startsWith('runtime/electron-helper/')) continue;
      else {
        const packageName = spec.startsWith('@') ? spec.split('/').slice(0, 2).join('/') : spec.split('/')[0];
        assert(manifest.peerDependencies?.[packageName] || manifest.dependencies?.[packageName], `Undeclared external import: ${file} -> ${spec}`);
        hostImports.push({ file, specifier: spec, version: manifest.peerDependencies?.[packageName] || manifest.dependencies?.[packageName] });
      }
    }
  }
  return { name: manifest.name, version: manifest.version, files: files.length, clean, syntax, hostImports };
}
function hashes(root, paths) {
  return Object.fromEntries(paths.map(path => [path, createHash('sha256').update(readFileSync(join(root, path))).digest('hex')]));
}
export function packAndVerify(pnpmScript) {
  assert(pnpmScript && existsSync(pnpmScript), 'Pass --pnpm <absolute path to pnpm.mjs> or set DSH_POMODORO_PNPM');
  verifyPackage(sourceRoot);
  const paths = filesUnder(sourceRoot).filter(file => !file.endsWith('.tgz'));
  const before = hashes(sourceRoot, paths);
  const sourceManifest = JSON.parse(readFileSync(join(sourceRoot, 'package.json'), 'utf8'));
  const staging = mkdtempSync(join(tmpdir(), 'pomodoro-package-'));
  // Never install dependencies, run lifecycle hooks, or change a DSH profile.
  run(process.execPath, [resolve(pnpmScript), '--config.ignore-scripts=true', 'pack', '--pack-destination', staging], sourceRoot);
  const archives = readdirSync(staging).filter(file => file.endsWith('.tgz'));
  assert.equal(archives.length, 1, 'Expected one packed tarball');
  const archive = join(staging, archives[0]);
  run('tar', ['-xzf', archive, '-C', staging], sourceRoot);
  const unpacked = join(staging, 'package');
  const result = verifyPackage(unpacked, { clean: true });
  const packedPaths = filesUnder(unpacked);
  for (const path of packedPaths) {
    assert(before[path], `Packed file absent from source snapshot: ${path}`);
    // pnpm moves scripts to the end of package.json; compare its JSON values.
    if (path === 'package.json') assert.deepEqual(JSON.parse(readFileSync(join(unpacked, path), 'utf8')), sourceManifest, 'Packed manifest changed semantically');
    else assert.equal(hashes(unpacked, [path])[path], before[path], `Source changed while packing: ${path}; repack after all writers finish`);
  }
  assert.deepEqual(hashes(sourceRoot, paths), before, 'Source changed during verification; repack after all writers finish');
  // Run package-owned tests in the unpacked tree, with no installed dependencies.
  run(process.execPath, ['--test', 'core.test.mjs', 'packaging.test.mjs'], unpacked);
  const hostTests = Boolean(process.env.DSH_TEST_RUNTIME_ROOT);
  if (hostTests) run(process.execPath, ['--import', './scripts/host-imports.mjs', '--test', 'compliance.test.mjs'], unpacked);
  return { ...result, hostTests, archive, sha256: createHash('sha256').update(readFileSync(archive)).digest('hex'), unpacked };
}
if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  try {
    const args = process.argv.slice(2);
    const pnpmIndex = args.indexOf('--pnpm');
    const dirIndex = args.indexOf('--dir');
    const result = args.includes('--pack')
      ? packAndVerify(pnpmIndex >= 0 ? args[pnpmIndex + 1] : process.env.DSH_POMODORO_PNPM)
      : verifyPackage(dirIndex >= 0 ? args[dirIndex + 1] : sourceRoot, { clean: args.includes('--clean') });
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error(error.stack || error.message);
    process.exitCode = 1;
  }
}
