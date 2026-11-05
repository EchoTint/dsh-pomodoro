import assert from 'node:assert/strict';
import { cpSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { requiredFiles, verifyPackage } from './scripts/runtime-check.mjs';

const root = dirname(fileURLToPath(import.meta.url));
test('distribution declares host peers and includes runtime resources and import closure', () => {
  const result = verifyPackage(root, { syntax: false });
  assert.equal(result.version, '0.1.0');
  assert(result.hostImports.some(item => item.file === 'config.js' && item.specifier === '@deepseek-ai/schemastery' && item.version === '3.19.0'));
  assert(result.hostImports.some(item => item.file === 'credentials.js' && item.specifier === '@deepseek-ai/dsh-credentials' && item.version === '0.2.2-rc.1'));
});
test('clean distribution check detects a missing helper preload', () => {
  const staging = mkdtempSync(join(tmpdir(), 'pomodoro-packaging-test-'));
  try {
    for (const path of requiredFiles) cpSync(join(root, path), join(staging, path), { recursive: true });
    const missing = resolve(staging, 'runtime/electron-helper/preload.js');
    assert(missing.startsWith(`${resolve(staging)}${process.platform === 'win32' ? '\\' : '/'}`));
    rmSync(missing);
    assert.throws(() => verifyPackage(staging, { syntax: false, clean: true }), /Missing packaged file: runtime\/electron-helper\/preload\.js/);
  } finally {
    // staging is the exact fresh temporary directory returned above.
    rmSync(staging, { recursive: true, force: true });
  }
});
