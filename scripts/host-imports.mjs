// Optional test harness for the Desktop's actual bundled peer packages.
// Use Electron in ELECTRON_RUN_AS_NODE=1 mode so its normal ASAR filesystem works.
import { registerHooks, createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { join } from 'node:path';
import { readFileSync } from 'node:fs';
const root = process.env.DSH_TEST_RUNTIME_ROOT;
if (!root) throw new Error('Set DSH_TEST_RUNTIME_ROOT to the installed DSH runtime root');
const requireHost = createRequire(join(root, 'package.json'));
registerHooks({
  resolve(specifier, context, nextResolve) {
    try { return nextResolve(specifier, context); }
    catch (error) {
      if (!specifier.startsWith('@deepseek-ai/')) throw error;
      return { url: pathToFileURL(requireHost.resolve(specifier)).href, shortCircuit: true };
    }
  },
  load(url, context, nextLoad) {
    if (url.startsWith('file:') && url.includes('app.asar/')) {
      const format = url.endsWith('.cjs') ? 'commonjs' : url.endsWith('.json') ? 'json' : 'module';
      return { format, source: readFileSync(new URL(url), 'utf8'), shortCircuit: true };
    }
    return nextLoad(url, context);
  },
});
