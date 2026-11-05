/**
 * Pomodoro & Flow Studio Host half.
 *
 * - owns the authoritative timer (state.json) and the long-lived history
 *   (data.json: tasks, focus sessions, forest sanctuary, backup settings)
 * - serves the panel API and the standalone widget page on loopback only
 * - runs the always-on-top desktop widget as an Electron helper process
 */

import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, renameSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import * as core from './core.js';
import { summarize } from './stats.js';
import { createStore, hydrateData, publicBackup, SPECIES } from './store.js';
import { buildPayload, uploadBackup } from './backup.js';
import { backupCredentials } from './credentials.js';
import { Config, backupSettings, migratedSettings, settingsPatch } from './config.js';
export { Config };

export const name = 'pomodoro';
export const inject = ['webServer', 'credentials', 'configEditor'];

const HERE = dirname(fileURLToPath(import.meta.url));
const ROUTE = '/pomodoro';
const WIDGET_HTML = join(HERE, 'widget.html');
const HELPER_MAIN = join(HERE, 'runtime', 'electron-helper', 'main.js');

// Window sizes per widget form. widget.html mirrors them (SIZES) and re-requests its size on load.
const VIEW_SIZES = {
  card: { width: 220, height: 84 },
  ring: { width: 108, height: 108 },
  bare: { width: 128, height: 56 },
};

function dshHome() {
  const fromEnv = process.env.DSH_HOME;
  if (fromEnv) return fromEnv;
  const home = process.env.USERPROFILE || process.env.HOME;
  return home ? join(home, '.dsh') : HERE;
}

function isLoopback(req) {
  const address = req.socket && req.socket.remoteAddress;
  return address === '127.0.0.1' || address === '::1' || address === '::ffff:127.0.0.1';
}

function readJson(file, fallback) {
  try {
    return JSON.parse(readFileSync(file, 'utf8'));
  } catch (error) {
    return fallback;
  }
}

export async function apply(ctx, config = {}) {
  const dir = join(dshHome(), 'pomodoro');
  mkdirSync(dir, { recursive: true });
  const stateFile = join(dir, 'state.json');

  const backupOwned = config.backupConfigVersion === 1;
  const store = createStore(dir, { externalBackup: backupOwned });
  const secrets = backupCredentials(ctx.credentials);
  // Fail activation rather than lose a legacy secret if credential persistence fails.
  await secrets.migrate(store);
  if (backupOwned) store.data.backup = { ...store.data.backup, ...backupSettings(config.backup) };
  const persisted = readJson(stateFile, null) || {};
  const settingsOwned = config.configVersion === 1;
  const geometry = persisted.window && typeof persisted.window === 'object' ? persisted.window : {};

  let state = core.hydrate(settingsOwned
    ? { ...(persisted.timer || {}), config: core.normalizeConfig(config) }
    : persisted.timer || null, Date.now());
  if (settingsOwned && state.status === 'idle') state = core.updateConfig(state, config, Date.now());
  let windowGeometry = {
    x: Number.isFinite(geometry.x) ? geometry.x : null,
    y: Number.isFinite(geometry.y) ? geometry.y : null,
    pid: Number.isFinite(geometry.pid) ? geometry.pid : null,
    theme: geometry.theme === 'light' || geometry.theme === 'dark' ? geometry.theme : 'dark',
    locale: typeof geometry.locale === 'string' && geometry.locale.toLowerCase().startsWith('en') ? 'en' : 'zh-CN',
  };

  let windowRequested = geometry.open !== false;
  let widgetHtml = '';
  let widgetMtime = 0;
  function readWidgetHtml() {
    try {
      const stat = statSync(WIDGET_HTML);
      if (stat.mtimeMs !== widgetMtime || !widgetHtml) {
        widgetHtml = readFileSync(WIDGET_HTML, 'utf8');
        widgetMtime = stat.mtimeMs;
      }
    } catch (error) {
      widgetHtml = '<!doctype html><meta charset="utf-8"><body style="font:14px system-ui;padding:24px">缺少 widget.html。</body>';
    }
    return widgetHtml;
  }

  let saveTimer = null;
  let child = null;
  let childStartedAt = 0;
  let sandboxRetry = false;
  let lastError = null;
  let logTail = [];
  let autoOpenTimer = null;
  let autoOpenAttempts = 0;
  let disposed = false;
  let backupBusy = false;

  function flush() {
    clearTimeout(saveTimer);
    saveTimer = null;
    try {
      const temp = `${stateFile}.tmp`;
      const payload = { version: 3, timer: { ...state, config: settingsOwned ? undefined : state.config }, window: { ...windowGeometry, open: windowRequested } };
      writeFileSync(temp, JSON.stringify(payload), 'utf8');
      renameSync(temp, stateFile);
    } catch (error) {
      lastError = '保存番茄钟状态失败：' + (error instanceof Error ? error.message : String(error));
    }
  }

  function persist() {
    if (saveTimer) return;
    saveTimer = setTimeout(() => {
      saveTimer = null;
      flush();
    }, 250);
  }

  function taskName(id) {
    if (!id) return '';
    const task = store.data.tasks.find((item) => item.id === id);
    return task ? task.name : '';
  }

  function activeTasks() {
    return store.data.tasks.filter((item) => !item.archivedAt);
  }

  function archivedTasks() {
    return store.data.tasks.filter((item) => Boolean(item.archivedAt));
  }

  function viewSize() {
    return VIEW_SIZES[state.config.miniMode] || VIEW_SIZES.card;
  }

  function resolvedTheme() {
    if (state.config.theme === 'light' || state.config.theme === 'dark') return state.config.theme;
    return windowGeometry.theme === 'light' ? 'light' : 'dark';
  }

  function snapshot() {
    return {
      ok: true,
      now: Date.now(),
      timer: state,
      theme: resolvedTheme(),
      locale: windowGeometry.locale,
      opacity: state.config.opacity,
      window: windowStatus(),
      tasks: activeTasks(),
      archivedTasks: archivedTasks(),
      taskName: taskName(state.taskId),
      presets: core.TIMER_PRESETS,
      view: state.config.miniMode,
      garden: {
        trees: store.data.garden.trees.length,
        nextSpecies: store.nextSpecies().id,
        species: SPECIES,
      },
    };
  }

  function windowStatus() {
    return {
      open: Boolean(child),
      available: Boolean(electronPath()),
      path: electronPath(),
      error: lastError,
      log: logTail.slice(-6),
      size: viewSize(),
    };
  }

  function pushLog(chunk) {
    const text = String(chunk);
    for (const line of text.split(/\r?\n/)) {
      const clean = line.trim();
      if (!clean) continue;
      logTail.push(clean.slice(0, 400));
    }
    if (logTail.length > 40) logTail = logTail.slice(-40);
  }

  function electronCandidates() {
    const list = [];
    if (process.env.DSH_POMODORO_ELECTRON) list.push(process.env.DSH_POMODORO_ELECTRON);
    const home = dshHome();
    if (process.platform === 'win32') list.push(join(home, 'electron', 'electron.exe'));
    else if (process.platform === 'darwin') list.push(join(home, 'electron', 'Electron.app', 'Contents', 'MacOS', 'Electron'));
    else list.push(join(home, 'electron', 'electron'));
    return list;
  }

  function electronPath() {
    return electronCandidates().find((candidate) => existsSync(candidate)) || null;
  }

  function stopChild() {
    if (!child) return;
    const proc = child;
    child = null;
    windowGeometry.pid = null;
    persist();
    try {
      proc.kill();
    } catch (error) { /* already gone */ }
    const pid = proc.pid;
    if (pid && process.platform === 'win32') {
      const timer = setTimeout(() => {
        try {
          spawn('taskkill', ['/pid', String(pid), '/T', '/F'], { stdio: 'ignore', windowsHide: true });
        } catch (error) { /* best effort */ }
      }, 1200);
      timer.unref?.();
    }
  }

  function killStaleHelper() {
    const pid = windowGeometry.pid;
    windowGeometry.pid = null;
    if (!pid || process.platform !== 'win32') return;
    try {
      spawn('powershell', ['-NoProfile', '-Command',
        `Get-CimInstance Win32_Process -Filter "ProcessId=${pid}" | ` +
        "Where-Object { $_.CommandLine -like '*pomodoro-plugin*' } | " +
        'ForEach-Object { Stop-Process -Id $_.ProcessId -Force }',
      ], { stdio: 'ignore', windowsHide: true });
    } catch (error) { /* best effort */ }
  }

  function launch(useNoSandbox) {
    if (disposed) return;
    const exe = electronPath();
    if (!exe) {
      lastError = '未找到 Electron 运行时（' + electronCandidates().join(' 或 ') + '）。可在环境变量 DSH_POMODORO_ELECTRON 中指定。';
      return;
    }
    const base = origin();
    if (!base) {
      lastError = null;
      scheduleAutoOpen(500);
      return;
    }
    const size = viewSize();

    lastError = null;
    const env = { ...process.env };
    delete env.ELECTRON_RUN_AS_NODE;
    env.POMODORO_URL = base + ROUTE + '/widget?view=' + encodeURIComponent(state.config.miniMode) + '&theme=' + resolvedTheme();
    env.POMODORO_ACTION_URL = base + ROUTE + '/api/action';
    env.POMODORO_VIEW = state.config.miniMode;
    env.POMODORO_WIDTH = String(size.width);
    env.POMODORO_HEIGHT = String(size.height);
    env.POMODORO_ALWAYS_ON_TOP = state.config.alwaysOnTop ? '1' : '0';
    env.POMODORO_THEME = resolvedTheme();
    env.POMODORO_OPACITY = String(state.config.opacity);
    env.POMODORO_DATA_DIR = dir;
    if (typeof windowGeometry.x === 'number') env.POMODORO_X = String(windowGeometry.x);
    if (typeof windowGeometry.y === 'number') env.POMODORO_Y = String(windowGeometry.y);

    const args = useNoSandbox ? ['--no-sandbox', HELPER_MAIN] : [HELPER_MAIN];
    let proc;
    try {
      proc = spawn(exe, args, { cwd: dirname(HELPER_MAIN), env, stdio: ['ignore', 'pipe', 'pipe'], windowsHide: false });
    } catch (error) {
      lastError = '启动桌面悬浮窗失败：' + (error instanceof Error ? error.message : String(error));
      return;
    }

    child = proc;
    childStartedAt = Date.now();
    windowGeometry.pid = proc.pid || null;
    persist();
    proc.stdout?.on('data', pushLog);
    proc.stderr?.on('data', pushLog);
    proc.on('error', (error) => {
      lastError = '桌面悬浮窗进程错误：' + (error instanceof Error ? error.message : String(error));
      if (child === proc) child = null;
    });
    proc.on('exit', (code) => {
      if (child !== proc) return;
      child = null;
      windowGeometry.pid = null;
      persist();
      const lived = Date.now() - childStartedAt;
      if (!disposed && !sandboxRetry && lived < 6000 && state.config.desktopEnabled) {
        sandboxRetry = true;
        lastError = '桌面悬浮窗启动后立即退出（code ' + String(code) + '），正在以兼容模式重试。';
        launch(true);
        return;
      }
      if (!disposed && state.config.desktopEnabled && code !== 0) {
        lastError = '桌面悬浮窗已退出（code ' + String(code) + '）。' + (logTail.slice(-2).join(' ') || '');
      }
    });
  }

  function openWindow() {
    windowRequested = true;
    if (child) return;
    if (!electronPath()) {
      lastError = '未找到 Electron 运行时（' + electronCandidates().join(' 或 ') + '）。';
      return;
    }
    sandboxRetry = false;
    launch(false);
  }

  function closeWindow() {
    windowRequested = false;
    stopChild();
    persist();
  }

  function scheduleAutoOpen(delay) {
    clearTimeout(autoOpenTimer);
    autoOpenTimer = setTimeout(() => {
      autoOpenTimer = null;
      if (disposed || child || !state.config.desktopEnabled) return;
      if (!origin() && autoOpenAttempts < 80) {
        autoOpenAttempts += 1;
        scheduleAutoOpen(500);
        return;
      }
      autoOpenAttempts = 0;
      openWindow();
    }, delay);
    autoOpenTimer.unref?.();
  }

  function origin() {
    try {
      return ctx.webServer.getOrigin();
    } catch (error) {
      return null;
    }
  }

  function recordCompletion(completion) {
    if (!completion || !completion.durationMs) return;
    const now = Date.now();
    const id = `s_${now.toString(36)}${Math.random().toString(36).slice(2, 6)}`;
    const taskId = state.taskId;
    const label = taskName(taskId);
    const session = {
      id,
      mode: 'focus',
      direction: completion.direction,
      taskId: taskId || null,
      taskName: label,
      startedAt: now - completion.durationMs,
      endedAt: now,
      durationMs: completion.durationMs,
      plannedMs: completion.plannedMs || completion.durationMs,
      completed: completion.partial !== true,
      partial: completion.partial === true,
      note: completion.note || '',
      energy: completion.energy || null,
    };
    store.addSession(session);

    const minimum = state.config.minTreeMinutes * core.MINUTE;
    if (completion.durationMs >= minimum) {
      store.plantTree({ durationMs: completion.durationMs, taskName: label });
    }
    void autoBackup('session');
  }

  async function saveBackup(patch) {
    await secrets.save(patch);
    const current = store.data.backup;
    const merged = publicBackup({
      ...current,
      ...patch,
      webdav: { ...current.webdav, ...(patch.webdav || {}) },
      s3: { ...current.s3, ...(patch.s3 || {}) },
    });
    await saveSettings({ backup: backupSettings(merged) });
    return secrets.status(merged);
  }

  async function runBackup() {
    const backup = store.data.backup;
    if (backup.provider === 'none') throw new Error('未选择云备份方式');
    if (backupBusy) throw new Error('已有备份任务在进行中');
    backupBusy = true;
    try {
      const resolved = await secrets.resolve(backup);
      const result = await uploadBackup(resolved, store.data);
      store.data.backup = { ...store.data.backup, lastAt: Date.now(), lastError: null, lastTarget: result.target || null };
      store.save();
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      store.data.backup = { ...store.data.backup, lastError: message };
      store.save();
      throw error;
    } finally {
      backupBusy = false;
    }
  }

  async function autoBackup(reason) {
    const backup = store.data.backup;
    if (!backup.auto || backup.provider === 'none') return;
    try {
      await runBackup();
    } catch (error) {
      ctx.logger?.warn?.('番茄钟自动备份失败（' + reason + '）：' + (error instanceof Error ? error.message : String(error)));
    }
  }

  async function saveSettings(patch) {
    const entry = ctx.fiber?.entry;
    if (!entry) throw new Error('Configuration cannot be saved in this profile');
    // Flush authoritative runtime state before Loader disposes this generation.
    flush();
    await ctx.configEditor.edit(entry, (current, inherited) => {
      const base = settingsOwned ? { ...inherited, ...current } : migratedSettings(state.config, current, inherited);
      if (!backupOwned) base.backup = backupSettings({ ...store.data.backup, ...base.backup,
        webdav: { ...store.data.backup.webdav, ...base.backup?.webdav },
        s3: { ...store.data.backup.s3, ...base.backup?.s3 } });
      return settingsPatch(base, patch);
    });
    // The new generation serves future polls; return the accepted settings to this caller.
    return { ...snapshot(), timer: { ...state, config: core.normalizeConfig({ ...state.config, ...patch }) } };
  }

  async function applyAction(action) {
    const now = Date.now();
    if (action.type === 'config') return saveSettings(action.patch || {});
    if (action.type === 'preset') {
      const preset = core.TIMER_PRESETS.find(item => item.id === action.preset);
      if (!preset) return snapshot();
      return saveSettings({ focus: preset.focus, short: preset.short, long: preset.long });
    }
    switch (action.type) {
      case 'start':
      case 'pause':
      case 'toggle':
      case 'reset':
      case 'skip':
      case 'mode':
      case 'direction':
      case 'task': {
        const before = state;
        const { state: next, completion } = core.applyAction(before, action, now);
        state = next;
        persist();
        if (completion) recordCompletion({ ...completion, taskId: before.taskId });
        if (
          next.config.autoShow &&
          next.config.desktopEnabled &&
          !child &&
          next.status === 'running' &&
          next.mode === 'focus'
        ) {
          openWindow();
        }
        return snapshot();
      }
      case 'finish': {
        const before = state;
        const { state: next, completion } = core.finish(before, now, { note: action.note, energy: action.energy });
        state = next;
        persist();
        if (completion) recordCompletion(completion);
        return snapshot();
      }
      case 'task-add': {
        const task = store.addTask(action.name, {
          priority: action.priority,
          estimatedPomodoros: action.estimatedPomodoros,
          note: action.note,
          subtasks: action.subtasks,
        });
        if (task) {
          state = core.setTask(state, task.id);
          persist();
        }
        return { ...snapshot(), added: task };
      }
      case 'task-rename': {
        store.renameTask(action.id, action.name);
        return snapshot();
      }
      case 'task-update': {
        store.updateTask(action.id, action.patch || {});
        return snapshot();
      }
      case 'subtask-add': {
        store.addSubtask(action.taskId, action.title);
        return snapshot();
      }
      case 'subtask-toggle': {
        store.toggleSubtask(action.taskId, action.subtaskId);
        return snapshot();
      }
      case 'subtask-delete': {
        store.deleteSubtask(action.taskId, action.subtaskId);
        return snapshot();
      }
      case 'session-note': {
        store.updateSession(action.id, { note: action.note, energy: action.energy });
        return snapshot();
      }
      case 'task-archive': {
        store.archiveTask(action.id, action.archived !== false);
        if (action.archived !== false && state.taskId === action.id) {
          state = core.setTask(state, null);
          persist();
        }
        return snapshot();
      }
      case 'task-delete': {
        store.deleteTask(action.id);
        if (state.taskId === action.id) {
          state = core.setTask(state, null);
          persist();
        }
        return snapshot();
      }
      case 'window-open': openWindow(); return snapshot();
      case 'window-close': closeWindow(); return snapshot();
      case 'locale': {
        const value = typeof action.value === 'string' && action.value.toLowerCase().startsWith('en') ? 'en' : 'zh-CN';
        if (windowGeometry.locale !== value) {
          windowGeometry = { ...windowGeometry, locale: value };
          persist();
        }
        return snapshot();
      }
      case 'theme': {
        const value = action.value === 'light' ? 'light' : action.value === 'dark' ? 'dark' : null;
        if (value && windowGeometry.theme !== value) {
          windowGeometry = { ...windowGeometry, theme: value };
          persist();
        }
        return snapshot();
      }
      case 'window-position': {
        const x = Number(action.x);
        const y = Number(action.y);
        if (Number.isFinite(x) && Number.isFinite(y)) {
          windowGeometry = { ...windowGeometry, x: Math.round(x), y: Math.round(y) };
          persist();
        }
        return snapshot();
      }
      case 'backup-save': return { ...snapshot(), backup: await saveBackup(action.patch || {}) };
      case 'backup-now': {
        try {
          await runBackup();
          return { ...snapshot(), backup: await secrets.status(store.data.backup), message: '备份完成' };
        } catch (error) {
          return { ok: false, error: error instanceof Error ? error.message : String(error), backup: await secrets.status(store.data.backup) };
        }
      }
      case 'import-data': {
        const incoming = action.data;
        if (!incoming || typeof incoming !== 'object') throw new Error('导入数据无效');
        const merged = {
          ...store.data,
          tasks: Array.isArray(incoming.tasks) ? incoming.tasks : store.data.tasks,
          sessions: Array.isArray(incoming.sessions) ? incoming.sessions : store.data.sessions,
          garden: incoming.garden && Array.isArray(incoming.garden.trees) ? incoming.garden : store.data.garden,
        };
        store.data = hydrateData(merged);
        store.save();
        return { ...snapshot(), imported: true };
      }
      default:
        throw new Error('未知操作：' + String(action.type));
    }
  }

  async function handle(req, res) {
    if (!isLoopback(req)) {
      sendJson(res, 403, { ok: false, error: 'loopback only' });
      return;
    }
    // A loopback socket alone does not prevent browser DNS rebinding or cross-site writes.
    const serverOrigin = origin();
    const allowed = serverOrigin ? new URL(serverOrigin) : null;
    const host = String(req.headers.host || '');
    let requestOrigin;
    try { requestOrigin = new URL('http://' + host); } catch { /* rejected below */ }
    if (!allowed || !requestOrigin || !['localhost', '127.0.0.1', '[::1]'].includes(requestOrigin.hostname)
      || requestOrigin.port !== allowed.port
      || (req.headers.origin && req.headers.origin !== requestOrigin.origin)
      || req.headers['sec-fetch-site'] === 'cross-site') {
      sendJson(res, 403, { ok: false, error: 'same-origin loopback request required' });
      return;
    }
    const url = new URL(req.url || '/', requestOrigin.origin);
    const path = url.pathname.replace(/\/+$/, '') || ROUTE;

    if (path === ROUTE) {
      res.writeHead(302, { location: ROUTE + '/widget', 'cache-control': 'no-store' });
      res.end();
      return;
    }
    if (path === ROUTE + '/widget') {
      if (req.method !== 'GET' && req.method !== 'HEAD') {
        sendJson(res, 405, { ok: false, error: 'method not allowed' });
        return;
      }
      sendHtml(res, readWidgetHtml());
      return;
    }
    if (path === ROUTE + '/api/state') {
      if (req.method !== 'GET') {
        sendJson(res, 405, { ok: false, error: 'method not allowed' });
        return;
      }
      sendJson(res, 200, snapshot());
      return;
    }
    if (path === ROUTE + '/api/stats') {
      if (req.method !== 'GET') {
        sendJson(res, 405, { ok: false, error: 'method not allowed' });
        return;
      }
      const year = Number(url.searchParams.get('year')) || new Date().getFullYear();
      sendJson(res, 200, {
        ok: true,
        now: Date.now(),
        stats: summarize(store.data.sessions, Date.now(), {
          year,
          dailyGoalMinutes: state.config.dailyGoalMinutes,
        }),
        tasks: store.data.tasks,
        garden: {
          trees: store.data.garden.trees.slice(-400),
          count: store.data.garden.trees.length,
          species: SPECIES,
          planted: store.data.garden.trees.length,
        },
      });
      return;
    }
    if (path === ROUTE + '/api/backup') {
      if (req.method !== 'GET') {
        sendJson(res, 405, { ok: false, error: 'method not allowed' });
        return;
      }
      sendJson(res, 200, { ok: true, backup: await secrets.status(store.data.backup) });
      return;
    }
    if (path === ROUTE + '/api/export') {
      const body = buildPayload(store.data);
      res.writeHead(200, {
        'content-type': 'application/json; charset=utf-8',
        'content-disposition': `attachment; filename="pomodoro-backup-${core.dayKey(Date.now())}.json"`,
        'cache-control': 'no-store',
      });
      res.end(body);
      return;
    }
    if (path === ROUTE + '/api/action') {
      if (req.method !== 'POST') {
        sendJson(res, 405, { ok: false, error: 'method not allowed' });
        return;
      }
      const contentType = String(req.headers['content-type'] || '');
      if (!contentType.includes('application/json')) {
        sendJson(res, 415, { ok: false, error: 'application/json required' });
        return;
      }
      const body = await readBody(req);
      let action;
      try {
        action = JSON.parse(body || '{}');
      } catch (error) {
        sendJson(res, 400, { ok: false, error: 'invalid json' });
        return;
      }
      try {
        const result = await applyAction(action);
        sendJson(res, 200, result);
      } catch (error) {
        sendJson(res, 400, { ok: false, error: error instanceof Error ? error.message : String(error) });
      }
      return;
    }
    sendJson(res, 404, { ok: false, error: 'not found' });
  }

  ctx.effect(() => {
    const offRoute = ctx.webServer.register({
      kind: 'prefix',
      path: ROUTE,
      handler: (req, res) => {
        handle(req, res).catch((error) => {
          try {
            sendJson(res, 500, { ok: false, error: error instanceof Error ? error.message : String(error) });
          } catch (nested) { /* response already gone */ }
        });
      },
    });

    const timer = setInterval(() => {
      const now = Date.now();
      const ensure = core.ensureDay(state, now);
      if (ensure !== state) {
        state = ensure;
        persist();
      }
      if (state.status === 'running' && state.direction === 'countdown') {
        const { state: next, completion } = core.tick(state, now);
        if (next !== state) {
          state = next;
          persist();
          if (completion) recordCompletion(completion);
        }
      }
    }, 250);
    timer.unref?.();

    killStaleHelper();
    if (state.config.desktopEnabled && windowRequested) scheduleAutoOpen(900);
    // Defer profile migration until activation has completed: edit reconciles this fiber.
    let migrationTimer;
    let migrationAttempts = 0;
    function migrateSettings() {
      if (disposed) return;
      migrationAttempts += 1;
      void saveSettings({}).catch(() => {
        if (disposed) return;
        // Activation and profile reconciliation may overlap; retry without discarding legacy settings.
        if (migrationAttempts < 3) {
          migrationTimer = setTimeout(migrateSettings, 1500);
          migrationTimer.unref?.();
          return;
        }
        lastError = 'Standard settings migration failed; legacy settings were retained. Retry saving settings.';
        ctx.logger?.warn?.(lastError);
      });
    }
    if (!settingsOwned || !backupOwned) {
      migrationTimer = setTimeout(migrateSettings, 1200);
      migrationTimer.unref?.();
    }
    if (settingsOwned) persist();

    return () => {
      clearTimeout(migrationTimer);
      disposed = true;
      clearInterval(timer);
      clearTimeout(saveTimer);
      clearTimeout(autoOpenTimer);
      flush();
      offRoute();
      stopChild();
      store.save();
    };
  }, 'pomodoro: timer, routes and desktop window');

  ctx.logger?.info?.(
    '番茄钟 Flow Studio 已就绪：心流工作台 + 统计洞察 + 生态林地 + 桌面灵动窗' + (electronPath() ? '' : '（未找到 Electron，仅侧栏可用）'),
  );
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > 4 * 1024 * 1024) {
        reject(new Error('payload too large'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

function sendJson(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
  res.end(body);
}

function sendHtml(res, html) {
  res.writeHead(200, {
    'content-type': 'text/html; charset=utf-8',
    'cache-control': 'no-store',
    'content-security-policy': "default-src 'self'; style-src 'unsafe-inline'; script-src 'unsafe-inline'",
  });
  res.end(html);
}
