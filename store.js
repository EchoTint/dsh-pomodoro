/**
 * Local JSON store: tasks (with estimates, priority & subtasks), focus sessions
 * (with energy rating & reflection notes), the forest sanctuary, and backup settings.
 * The timer itself lives in state.json (Host runtime state); this file is the
 * long-lived history that must survive every reopen.
 */

import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

export const DATA_VERSION = 1;
export const MAX_SESSIONS = 20000;

export const SPECIES = [
  { id: 'sprout', name: '幼苗', nameEn: 'Sprout', at: 0, tier: 'common', descZh: '破土而出的第一抹新绿', descEn: 'The first spark of focus breaking through soil' },
  { id: 'maple', name: '枫树', nameEn: 'Maple', at: 1, tier: 'common', descZh: '秋日里炽热的专注印记', descEn: 'Crimson leaves kindled by steady concentration' },
  { id: 'pine', name: '松树', nameEn: 'Pine', at: 3, tier: 'uncommon', descZh: '四季常青的沉稳节律', descEn: 'Evergreen resilience through deep work' },
  { id: 'oak', name: '橡树', nameEn: 'Oak', at: 6, tier: 'uncommon', descZh: '深根固本的知识树冠', descEn: 'Deep-rooted strength and towering canopy' },
  { id: 'cherry', name: '樱花', nameEn: 'Cherry', at: 10, tier: 'rare', descZh: '心流盛放时的绯色微风', descEn: 'Blossoms carried on a gentle breeze of flow' },
  { id: 'bamboo', name: '竹子', nameEn: 'Bamboo', at: 15, tier: 'rare', descZh: '虚怀若谷，节节攀升', descEn: 'Hollow mind, ascending segment by segment' },
  { id: 'ginkgo', name: '银杏', nameEn: 'Ginkgo', at: 21, tier: 'epic', descZh: '跨越时光的金色静谧', descEn: 'Timeless golden leaves of tranquil mastery' },
  { id: 'cactus', name: '仙人掌', nameEn: 'Cactus', at: 28, tier: 'legendary', descZh: '荒漠中亦能盛开的坚韧', descEn: 'Unwavering endurance that blooms in the desert' },
];

const PRIORITIES = ['high', 'medium', 'low'];

const randomId = (prefix) => `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

const clampInt = (value, min, max, fallback) => {
  const num = Number(value);
  if (!Number.isFinite(num)) return fallback;
  return Math.min(max, Math.max(min, Math.round(num)));
};

export function createData() {
  return {
    version: DATA_VERSION,
    meta: { createdAt: Date.now() },
    tasks: [],
    sessions: [],
    garden: { trees: [] },
    backup: {
      provider: 'none',
      auto: false,
      webdav: { url: '', username: '', password: '', path: 'dsh-pomodoro/pomodoro-backup.json' },
      s3: { endpoint: '', region: 'us-east-1', bucket: '', accessKey: '', secretKey: '', prefix: 'dsh-pomodoro' },
      lastAt: null,
      lastError: null,
      lastTarget: null,
    },
  };
}

/** Allowlisted ordinary backup metadata. Never persist passwords or arbitrary client fields. */
export function publicBackup(backup = {}) {
  const w = backup.webdav || {};
  const s = backup.s3 || {};
  return {
    provider: ['none', 'webdav', 's3'].includes(backup.provider) ? backup.provider : 'none',
    auto: backup.auto === true,
    webdav: { url: w.url || '', username: w.username || '', path: w.path || '' },
    s3: { endpoint: s.endpoint || '', region: s.region || 'us-east-1', bucket: s.bucket || '', accessKey: s.accessKey || '', prefix: s.prefix || '' },
    lastAt: backup.lastAt ?? null,
    lastError: backup.lastError ?? null,
    lastTarget: backup.lastTarget ?? null,
  };
}

function normalizeBackup(raw) {
  const base = createData().backup;
  if (!raw || typeof raw !== 'object') return base;
  return {
    ...base,
    provider: ['none', 'webdav', 's3'].includes(raw.provider) ? raw.provider : 'none',
    auto: raw.auto === true,
    webdav: { ...base.webdav, ...(raw.webdav && typeof raw.webdav === 'object' ? raw.webdav : {}) },
    s3: { ...base.s3, ...(raw.s3 && typeof raw.s3 === 'object' ? raw.s3 : {}) },
    lastAt: Number.isFinite(raw.lastAt) ? raw.lastAt : null,
    lastError: typeof raw.lastError === 'string' ? raw.lastError : null,
    lastTarget: typeof raw.lastTarget === 'string' ? raw.lastTarget : null,
  };
}

function normalizeSubtasks(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((sub) => sub && typeof sub.title === 'string' && sub.title.trim())
    .slice(0, 30)
    .map((sub) => ({
      id: typeof sub.id === 'string' && sub.id ? sub.id : randomId('sub'),
      title: String(sub.title).trim().slice(0, 100),
      done: sub.done === true,
    }));
}

export function hydrateData(raw) {
  const seed = createData();
  if (!raw || typeof raw !== 'object') return seed;
  const tasks = Array.isArray(raw.tasks)
    ? raw.tasks
        .filter((item) => item && typeof item.name === 'string' && item.name.trim())
        .slice(0, 500)
        .map((item) => ({
          id: typeof item.id === 'string' && item.id ? item.id : randomId('task'),
          name: String(item.name).slice(0, 80),
          priority: PRIORITIES.includes(item.priority) ? item.priority : 'medium',
          estimatedPomodoros: clampInt(item.estimatedPomodoros, 1, 24, 1),
          completedPomodoros: clampInt(item.completedPomodoros, 0, 100000, 0),
          totalFocusMs: Math.max(0, Math.round(Number(item.totalFocusMs) || 0)),
          note: typeof item.note === 'string' ? item.note.slice(0, 280) : '',
          subtasks: normalizeSubtasks(item.subtasks),
          createdAt: Number.isFinite(item.createdAt) ? item.createdAt : Date.now(),
          archivedAt: Number.isFinite(item.archivedAt) ? item.archivedAt : null,
        }))
    : [];
  const sessions = Array.isArray(raw.sessions)
    ? raw.sessions
        .filter((item) => item && Number.isFinite(item.durationMs) && Number.isFinite(item.endedAt))
        .slice(-MAX_SESSIONS)
        .map((item) => ({
          id: typeof item.id === 'string' && item.id ? item.id : randomId('session'),
          mode: 'focus',
          direction: item.direction === 'countup' || item.direction === 'flow' ? item.direction : 'countdown',
          taskId: typeof item.taskId === 'string' ? item.taskId : null,
          taskName: typeof item.taskName === 'string' ? item.taskName.slice(0, 80) : '',
          startedAt: Number.isFinite(item.startedAt) ? item.startedAt : item.endedAt - item.durationMs,
          endedAt: item.endedAt,
          durationMs: Math.max(0, Math.round(item.durationMs)),
          plannedMs: Number.isFinite(item.plannedMs) ? Math.round(item.plannedMs) : Math.round(item.durationMs),
          completed: item.completed !== false,
          partial: item.partial === true,
          note: typeof item.note === 'string' ? item.note.slice(0, 240) : '',
          energy: Number.isFinite(Number(item.energy)) && Number(item.energy) >= 1 && Number(item.energy) <= 5
            ? Math.round(Number(item.energy))
            : null,
        }))
    : [];
  const trees = raw.garden && Array.isArray(raw.garden.trees)
    ? raw.garden.trees
        .filter((item) => item && SPECIES.some((species) => species.id === item.species))
        .slice(-4000)
        .map((item) => ({
          id: typeof item.id === 'string' && item.id ? item.id : randomId('tree'),
          species: item.species,
          plantedAt: Number.isFinite(item.plantedAt) ? item.plantedAt : Date.now(),
          durationMs: Math.max(0, Math.round(Number(item.durationMs) || 0)),
          taskName: typeof item.taskName === 'string' ? item.taskName.slice(0, 80) : '',
        }))
    : [];
  return {
    version: DATA_VERSION,
    meta: raw.meta && typeof raw.meta === 'object' ? raw.meta : seed.meta,
    tasks,
    sessions,
    garden: { trees },
    backup: normalizeBackup(raw.backup),
  };
}

export function createStore(dir, { externalBackup = false } = {}) {
  mkdirSync(dir, { recursive: true });
  const file = join(dir, 'data.json');
  let data = createData();

  const load = () => {
    try {
      if (!existsSync(file)) return data;
      data = hydrateData(JSON.parse(readFileSync(file, 'utf8')));
      return data;
    } catch (error) {
      return data;
    }
  };

  const save = () => {
    try {
      const temp = `${file}.tmp`;
      const metadata = publicBackup(data.backup);
      const backup = externalBackup
        ? { lastAt: metadata.lastAt, lastError: metadata.lastError, lastTarget: metadata.lastTarget }
        : metadata;
      writeFileSync(temp, JSON.stringify({ ...data, backup }), 'utf8');
      renameSync(temp, file);
      return true;
    } catch (error) {
      return false;
    }
  };

  load();

  return {
    get data() {
      return data;
    },
    set data(next) {
      data = hydrateData(next);
    },
    get file() {
      return file;
    },
    load,
    save,
    addTask(name, options = {}) {
      const clean = String(name || '').trim().slice(0, 80);
      if (!clean) return null;
      const opts = options && typeof options === 'object' ? options : {};
      const task = {
        id: randomId('task'),
        name: clean,
        priority: PRIORITIES.includes(opts.priority) ? opts.priority : 'medium',
        estimatedPomodoros: clampInt(opts.estimatedPomodoros, 1, 24, 1),
        completedPomodoros: 0,
        totalFocusMs: 0,
        note: typeof opts.note === 'string' ? opts.note.trim().slice(0, 280) : '',
        subtasks: normalizeSubtasks(opts.subtasks),
        createdAt: Date.now(),
        archivedAt: null,
      };
      data.tasks.push(task);
      save();
      return task;
    },
    renameTask(id, name) {
      const task = data.tasks.find((item) => item.id === id);
      const clean = String(name || '').trim().slice(0, 80);
      if (!task || !clean) return null;
      task.name = clean;
      save();
      return task;
    },
    updateTask(id, patch = {}) {
      const task = data.tasks.find((item) => item.id === id);
      if (!task || !patch || typeof patch !== 'object') return null;
      if (typeof patch.name === 'string' && patch.name.trim()) {
        task.name = patch.name.trim().slice(0, 80);
      }
      if (PRIORITIES.includes(patch.priority)) {
        task.priority = patch.priority;
      }
      if (patch.estimatedPomodoros !== undefined) {
        task.estimatedPomodoros = clampInt(patch.estimatedPomodoros, 1, 24, task.estimatedPomodoros || 1);
      }
      if (typeof patch.note === 'string') {
        task.note = patch.note.slice(0, 280);
      }
      if (Array.isArray(patch.subtasks)) {
        task.subtasks = normalizeSubtasks(patch.subtasks);
      }
      save();
      return task;
    },
    addSubtask(taskId, title) {
      const task = data.tasks.find((item) => item.id === taskId);
      const clean = String(title || '').trim().slice(0, 100);
      if (!task || !clean) return null;
      if (!Array.isArray(task.subtasks)) task.subtasks = [];
      if (task.subtasks.length >= 30) return null;
      const sub = { id: randomId('sub'), title: clean, done: false };
      task.subtasks.push(sub);
      save();
      return sub;
    },
    toggleSubtask(taskId, subtaskId) {
      const task = data.tasks.find((item) => item.id === taskId);
      if (!task || !Array.isArray(task.subtasks)) return null;
      const sub = task.subtasks.find((item) => item.id === subtaskId);
      if (!sub) return null;
      sub.done = !sub.done;
      save();
      return sub;
    },
    deleteSubtask(taskId, subtaskId) {
      const task = data.tasks.find((item) => item.id === taskId);
      if (!task || !Array.isArray(task.subtasks)) return false;
      const before = task.subtasks.length;
      task.subtasks = task.subtasks.filter((item) => item.id !== subtaskId);
      const changed = task.subtasks.length !== before;
      if (changed) save();
      return changed;
    },
    archiveTask(id, archived) {
      const task = data.tasks.find((item) => item.id === id);
      if (!task) return null;
      task.archivedAt = archived ? Date.now() : null;
      save();
      return task;
    },
    deleteTask(id) {
      const before = data.tasks.length;
      data.tasks = data.tasks.filter((item) => item.id !== id);
      const changed = data.tasks.length !== before;
      if (changed) save();
      return changed;
    },
    addSession(session) {
      const clean = hydrateData({ sessions: [session] }).sessions[0];
      if (!clean) return null;
      data.sessions.push(clean);
      if (data.sessions.length > MAX_SESSIONS) data.sessions = data.sessions.slice(-MAX_SESSIONS);
      if (clean.taskId) {
        const task = data.tasks.find((item) => item.id === clean.taskId);
        if (task) {
          task.totalFocusMs = (Number(task.totalFocusMs) || 0) + clean.durationMs;
          if (!clean.partial && clean.completed !== false) {
            task.completedPomodoros = (Number(task.completedPomodoros) || 0) + 1;
          }
        }
      }
      save();
      return clean;
    },
    updateSession(id, patch = {}) {
      const session = data.sessions.find((item) => item.id === id);
      if (!session || !patch || typeof patch !== 'object') return null;
      if (typeof patch.note === 'string') {
        session.note = patch.note.trim().slice(0, 240);
      }
      if (patch.energy !== undefined) {
        const e = Number(patch.energy);
        session.energy = Number.isFinite(e) && e >= 1 && e <= 5 ? Math.round(e) : null;
      }
      save();
      return session;
    },
    unlockSpecies() {
      const planted = data.garden.trees.length;
      return SPECIES.filter((species) => planted >= species.at);
    },
    nextSpecies() {
      const planted = data.garden.trees.length;
      return SPECIES.find((species) => planted < species.at) || SPECIES[SPECIES.length - 1];
    },
    plantTree({ species, durationMs, taskName }) {
      const planted = data.garden.trees.length;
      const unlocked = SPECIES.filter((item) => planted >= item.at);
      const pick = unlocked.find((item) => item.id === species) || unlocked[unlocked.length - 1] || SPECIES[0];
      const tree = {
        id: randomId('tree'),
        species: pick.id,
        plantedAt: Date.now(),
        durationMs: Math.max(0, Math.round(Number(durationMs) || 0)),
        taskName: String(taskName || '').slice(0, 80),
      };
      data.garden.trees.push(tree);
      save();
      return tree;
    },
    setBackup(patch) {
      data.backup = normalizeBackup({ ...data.backup, ...(patch || {}) });
      save();
      return data.backup;
    },
  };
}
