import assert from 'node:assert/strict';
import test from 'node:test';
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createStore, publicBackup } from './store.js';
import { backupCredentials } from './credentials.js';
import { Config, migratedSettings, settingsPatch } from './config.js';
import { apply } from './index.js';
import { createServer, get } from 'node:http';
import { mkdirSync } from 'node:fs';
import { createState } from './core.js';

function serviceMock() {
  const records = new Map();
  return {
    records,
    readRecord: async key => records.get(key),
    describeRecord: async key => ({ configured: records.has(key), writable: true }),
    modifyRecord: async (key, mutate) => {
      const next = await mutate(records.get(key));
      if (next !== undefined) records.set(key, next);
      return records.get(key);
    },
    deleteRecord: async key => { records.delete(key); },
  };
}

function legacyStore() {
  const dir = mkdtempSync(join(tmpdir(), 'pomodoro-credentials-'));
  writeFileSync(join(dir, 'data.json'), JSON.stringify({
    tasks: [{ id: 'task1', name: 'Preserved task' }],
    sessions: [{ id: 'session1', endedAt: 12345, durationMs: 60000 }],
    garden: { trees: [{ id: 'tree1', species: 'sprout', plantedAt: 12345 }] },
    backup: { provider: 'webdav', webdav: { password: 'test-webdav-secret' }, s3: { secretKey: 'test-s3-secret' } },
  }));
  return { dir, store: createStore(dir) };
}

test('migration commits credentials then removes plaintext and preserves business history', async () => {
  const { dir, store } = legacyStore();
  try {
    const service = serviceMock();
    const secrets = backupCredentials(service);
    await secrets.migrate(store);
    const disk = readFileSync(store.file, 'utf8');
    assert.ok(!disk.includes('test-webdav-secret') && !disk.includes('test-s3-secret'));
    assert.ok(!Object.hasOwn(JSON.parse(disk).backup.webdav, 'password'));
    const restored = createStore(dir);
    assert.equal(restored.data.tasks[0].id, 'task1');
    assert.equal(restored.data.sessions[0].id, 'session1');
    assert.equal(restored.data.garden.trees[0].id, 'tree1');
    assert.equal((await secrets.resolve(restored.data.backup)).webdav.password, 'test-webdav-secret');
    assert.equal((await secrets.status(restored.data.backup)).s3.hasSecret, true);
    assert.ok(!JSON.stringify(await secrets.status(restored.data.backup)).includes('test-s3-secret'));
    await secrets.migrate(restored);
    assert.equal(service.records.size, 2);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test('credential write failure leaves legacy disk intact; retry preserves newer credentials', async () => {
  const { dir, store } = legacyStore();
  try {
    const original = readFileSync(store.file, 'utf8');
    const service = serviceMock();
    const originalWrite = service.modifyRecord;
    let writes = 0;
    service.modifyRecord = async (...args) => { if (++writes === 2) throw new Error('write failed'); return originalWrite(...args); };
    const secrets = backupCredentials(service);
    await assert.rejects(secrets.migrate(store), /write failed/);
    assert.equal(readFileSync(store.file, 'utf8'), original);
    service.modifyRecord = originalWrite;
    await secrets.save({ webdav: { password: 'newer-secret' } });
    await secrets.migrate(store);
    assert.equal((await secrets.resolve(store.data.backup)).webdav.password, 'newer-secret');
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test('blank save retains credentials; rotation is per-operation; explicit clearing removes records', async () => {
  const secrets = backupCredentials(serviceMock());
  await secrets.save({ webdav: { password: 'first' }, s3: { secretKey: 's3-first' } });
  await secrets.save({ webdav: { password: '' }, s3: { secretKey: '' } });
  assert.equal((await secrets.resolve({})).webdav.password, 'first');
  await secrets.save({ webdav: { password: 'second' } });
  assert.equal((await secrets.resolve({})).webdav.password, 'second');
  await secrets.save({ webdav: { clearPassword: true }, s3: { clearSecret: true } });
  assert.equal((await secrets.status({})).webdav.hasPassword, false);
  assert.equal((await secrets.status({})).s3.hasSecret, false);
});

test('ordinary store rejects secret fields on every write', () => {
  const { dir, store } = legacyStore();
  try {
    store.setBackup({ webdav: { password: 'new-secret', nested: { password: 'nested-secret' } }, unknownSecret: 'other-secret' });
    const disk = readFileSync(store.file, 'utf8');
    for (const secret of ['new-secret', 'nested-secret', 'other-secret', 'test-s3-secret']) assert.ok(!disk.includes(secret));
    assert.deepEqual(Object.keys(publicBackup({}).webdav), ['url', 'username', 'path']);
    const external = createStore(dir, { externalBackup: true });
    external.save();
    assert.deepEqual(Object.keys(JSON.parse(readFileSync(external.file, 'utf8')).backup), ['lastAt', 'lastError', 'lastTarget']);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test('Config validates defaults, enum/range limits and migration preserves explicit profile values', () => {
  const defaults = Config({});
  assert.equal(defaults.focus, 25);
  assert.throws(() => Config({ focus: 181 }));
  assert.throws(() => Config({ miniMode: 'unsupported' }));
  const migrated = migratedSettings({ focus: 41, theme: 'dark', opacity: 0.6 }, { focus: 52 }, { sound: false });
  assert.equal(migrated.focus, 52);
  assert.equal(migrated.theme, 'dark');
  assert.equal(migrated.sound, false);
  assert.equal(migrated.opacity, 0.6);
  assert.equal(migrated.configVersion, 1);
  const patched = settingsPatch(migrated, { opacity: 0.8, password: 'forbidden' });
  assert.equal(patched.opacity, 0.8);
  assert.ok(!Object.hasOwn(patched, 'password'));
});

test('Host migrates through configEditor, preserves a live deadline and rejects foreign browser origins', async () => {
  const home = mkdtempSync(join(tmpdir(), 'pomodoro-host-'));
  const dir = join(home, 'pomodoro');
  mkdirSync(dir);
  const priorHome = process.env.DSH_HOME;
  process.env.DSH_HOME = home;
  const deadline = Date.now() + 600000;
  const legacy = { ...createState(Date.now(), { focus: 41, desktopEnabled: false, theme: 'dark' }), status: 'running', deadline };
  writeFileSync(join(dir, 'state.json'), JSON.stringify({ timer: legacy, window: { open: false } }));
  let handler;
  let dispose;
  let saved;
  let fail = false;
  let initialFailures = 1;
  let migrationResolve;
  const migrated = new Promise(resolve => { migrationResolve = resolve; });
  const server = createServer((req, res) => handler(req, res));
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  const entry = { id: 'test-pomodoro' };
  const ctx = {
    fiber: { entry }, credentials: serviceMock(),
    configEditor: { edit: async (actualEntry, edit) => {
      assert.equal(actualEntry, entry);
      if (initialFailures-- > 0 || fail) throw new Error('simulated config save failure');
      saved = edit(saved || {}, {});
      Config(saved);
      migrationResolve();
    } },
    webServer: { getOrigin: () => base, register: route => { handler = route.handler; return () => {}; } },
    effect: init => { dispose = init(); }, logger: { info() {}, warn() {} },
  };
  try {
    await apply(ctx, Config({}));
    await migrated;
    assert.equal(saved.focus, 41);
    assert.equal(saved.theme, 'dark');
    assert.equal(saved.configVersion, 1);
    assert.equal(saved.backupConfigVersion, 1);
    assert.equal(saved.backup.provider, 'none');
    assert.ok(!Object.hasOwn(saved.backup.webdav, 'password'));
    assert.equal(JSON.parse(readFileSync(join(dir, 'state.json'), 'utf8')).timer.deadline, deadline);
    const request = (body, headers = {}) => fetch(base + '/pomodoro/api/action', {
      method: 'POST', headers: { 'content-type': 'application/json', ...headers }, body: JSON.stringify(body),
    });
    const foreign = await request({ type: 'pause' }, { origin: 'https://foreign.example', 'sec-fetch-site': 'cross-site' });
    assert.equal(foreign.status, 403);
    const reboundStatus = await new Promise((resolve, reject) => {
      get(base + '/pomodoro/api/state', { headers: { host: 'foreign.example:' + server.address().port } }, response => {
        response.resume(); resolve(response.statusCode);
      }).on('error', reject);
    });
    assert.equal(reboundStatus, 403);
    fail = true;
    const rejected = await request({ type: 'config', patch: { sound: false } });
    assert.equal(rejected.status, 400);
    assert.equal(saved.sound, true);
    fail = false;
    const accepted = await request({ type: 'config', patch: { sound: false } });
    assert.equal((await accepted.json()).ok, true);
    assert.equal(saved.sound, false);
    const live = await (await fetch(base + '/pomodoro/api/state')).json();
    assert.equal(live.timer.deadline, deadline);
    assert.equal(live.timer.status, 'running');
  } finally {
    dispose?.();
    await new Promise(resolve => server.close(resolve));
    if (priorHome === undefined) delete process.env.DSH_HOME; else process.env.DSH_HOME = priorHome;
    rmSync(home, { recursive: true, force: true });
  }
});
