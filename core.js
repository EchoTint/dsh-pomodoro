/**
 * Pure Pomodoro & Flow Studio state machine shared by the Host and the tests.
 *
 * The timer supports three directions:
 *  - countdown: classic pomodoro, auto-completes and advances the round
 *  - countup:   stopwatch, never auto-completes, the user ends the session
 *  - flow:      adaptive flowtime, counts up and rewards proportional break time
 *
 * Nothing in here touches Node, React or the network.
 */

export const MODES = ['focus', 'short', 'long'];

// 悬浮窗三种极简灵动形态：灵动胶囊（card）、极光圆环（ring）、极简 HUD（bare）
export const VIEW_MODES = ['card', 'ring', 'bare'];
export const DIRECTIONS = ['countdown', 'countup', 'flow'];

export const TIMER_PRESETS = [
  { id: 'sprint', nameZh: '闪电冲刺', nameEn: 'Sprint', focus: 15, short: 3, long: 10 },
  { id: 'classic', nameZh: '经典番茄', nameEn: 'Classic', focus: 25, short: 5, long: 15 },
  { id: 'deep', nameZh: '深度工作', nameEn: 'Deep Work', focus: 50, short: 10, long: 20 },
  { id: 'ultralearn', nameZh: '极限心流', nameEn: 'Ultralearn', focus: 90, short: 20, long: 30 },
];

export const DEFAULTS = {
  focus: 25,
  short: 5,
  long: 15,
  longEvery: 4,
  dailyGoalMinutes: 120,
  autoStartBreaks: true,
  autoStartFocus: false,
  sound: true,
  ambientPreset: 'none',
  ambientAuto: true,
  desktopEnabled: true,
  alwaysOnTop: true,
  miniMode: 'card',
  theme: 'auto',
  opacity: 1,
  autoShow: false,
  minTreeMinutes: 10,
};

export const MINUTE = 60 * 1000;
/** Shortest focus block that is saved when the user ends a session early. */
export const MIN_RECORD_MS = MINUTE;
export const MIN_MINUTES = 1;
export const MAX_MINUTES = 180;
export const MIN_LONG_EVERY = 2;
export const MAX_LONG_EVERY = 8;
export const MIN_TREE_MINUTES = 1;
export const MAX_TREE_MINUTES = 180;
export const MIN_DAILY_GOAL = 15;
export const MAX_DAILY_GOAL = 720;

const AMBIENT_PRESETS = ['none', 'rain', 'campfire', 'ocean', 'binaural', 'custom'];

const clampInt = (value, min, max, fallback) => {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, Math.round(number)));
};

const clampFloat = (value, min, max, fallback) => {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.round(Math.min(max, Math.max(min, number)) * 100) / 100;
};

const asBool = (value, fallback) => {
  if (typeof value === 'boolean') return value;
  return fallback;
};

function normalizeView(value) {
  if (value === 'mini') return 'card';
  return VIEW_MODES.includes(value) ? value : DEFAULTS.miniMode;
}

export function normalizeConfig(input) {
  const raw = input && typeof input === 'object' ? input : {};
  return {
    focus: clampInt(raw.focus, MIN_MINUTES, MAX_MINUTES, DEFAULTS.focus),
    short: clampInt(raw.short, MIN_MINUTES, MAX_MINUTES, DEFAULTS.short),
    long: clampInt(raw.long, MIN_MINUTES, MAX_MINUTES, DEFAULTS.long),
    longEvery: clampInt(raw.longEvery, MIN_LONG_EVERY, MAX_LONG_EVERY, DEFAULTS.longEvery),
    dailyGoalMinutes: clampInt(raw.dailyGoalMinutes, MIN_DAILY_GOAL, MAX_DAILY_GOAL, DEFAULTS.dailyGoalMinutes),
    autoStartBreaks: asBool(raw.autoStartBreaks, DEFAULTS.autoStartBreaks),
    autoStartFocus: asBool(raw.autoStartFocus, DEFAULTS.autoStartFocus),
    sound: asBool(raw.sound, DEFAULTS.sound),
    ambientPreset: AMBIENT_PRESETS.includes(raw.ambientPreset) ? raw.ambientPreset : DEFAULTS.ambientPreset,
    ambientAuto: asBool(raw.ambientAuto, DEFAULTS.ambientAuto),
    desktopEnabled: asBool(raw.desktopEnabled, DEFAULTS.desktopEnabled),
    alwaysOnTop: asBool(raw.alwaysOnTop, DEFAULTS.alwaysOnTop),
    miniMode: normalizeView(raw.miniMode),
    opacity: clampFloat(raw.opacity, 0.3, 1, DEFAULTS.opacity),
    autoShow: asBool(raw.autoShow, DEFAULTS.autoShow),
    theme: ['auto', 'light', 'dark'].includes(raw.theme) ? raw.theme : DEFAULTS.theme,
    minTreeMinutes: clampInt(raw.minTreeMinutes, MIN_TREE_MINUTES, MAX_TREE_MINUTES, DEFAULTS.minTreeMinutes),
  };
}

export function durationOf(config, mode) {
  const minutes = config && typeof config === 'object' ? config[mode] : DEFAULTS[mode];
  return (Number.isFinite(minutes) ? minutes : DEFAULTS[mode]) * MINUTE;
}

/** Calculate recommended break minutes for a Flowtime session (~1 min break per 5 min focus). */
export function flowBreakMinutesOf(durationMs) {
  const focusMin = Math.max(0, Math.round(Number(durationMs || 0) / MINUTE));
  return clampInt(Math.round(focusMin / 5), 2, 30, 5);
}

export function createState(now, config) {
  const normalized = normalizeConfig(config);
  return {
    version: 3,
    revision: 0,
    mode: 'focus',
    direction: 'countdown',
    status: 'idle',
    remainingMs: durationOf(normalized, 'focus'),
    elapsedMs: 0,
    deadline: null,
    startedAt: null,
    round: 0,
    taskId: null,
    completedToday: 0,
    day: dayKey(now),
    lastCompletedAt: null,
    lastCompletedMode: null,
    lastCompletedPartial: null,
    lastFinish: null,
    config: normalized,
  };
}

export function dayKey(now) {
  const date = new Date(now);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

export function ensureDay(state, now) {
  const key = dayKey(now);
  if (state.day === key) return state;
  return { ...state, day: key, completedToday: 0 };
}

export function remainingOf(state, now) {
  if (state.direction !== 'countdown') return 0;
  if (state.status === 'running' && typeof state.deadline === 'number') {
    return Math.max(0, state.deadline - now);
  }
  return Math.max(0, state.remainingMs);
}

export function elapsedOf(state, now) {
  if (state.direction === 'countdown') {
    if (state.status === 'running' && typeof state.deadline === 'number') {
      return Math.max(0, durationOf(state.config, state.mode) - Math.max(0, state.deadline - now));
    }
    return Math.max(0, durationOf(state.config, state.mode) - Math.max(0, state.remainingMs));
  }
  if (state.status === 'running' && typeof state.startedAt === 'number') {
    return Math.max(0, state.elapsedMs + (now - state.startedAt));
  }
  return Math.max(0, state.elapsedMs);
}

export function progressOf(state, now) {
  if (state.direction !== 'countdown') {
    // countup / flow has no fixed deadline: one full ring means "at least one configured focus block"
    return Math.min(1, elapsedOf(state, now) / durationOf(state.config, 'focus'));
  }
  const total = durationOf(state.config, state.mode);
  if (!total) return 0;
  return Math.min(1, Math.max(0, 1 - remainingOf(state, now) / total));
}

function started(state, now) {
  const next = { ...state, status: 'running', revision: state.revision + 1 };
  if (state.direction === 'countdown') {
    next.deadline = now + Math.max(1, remainingOf(state, now));
  } else {
    next.startedAt = now;
  }
  return next;
}

export function start(state, now) {
  if (state.status === 'running') return state;
  return started(state, now);
}

export function pause(state, now) {
  if (state.status !== 'running') return state;
  const next = { ...state, status: 'paused', revision: state.revision + 1 };
  if (state.direction === 'countdown') {
    next.remainingMs = remainingOf(state, now);
    next.deadline = null;
  } else {
    next.elapsedMs = elapsedOf(state, now);
    next.startedAt = null;
  }
  return next;
}

export function reset(state, now) {
  const base = ensureDay(state, now);
  return {
    ...base,
    revision: base.revision + 1,
    status: 'idle',
    remainingMs: durationOf(base.config, base.mode),
    elapsedMs: 0,
    deadline: null,
    startedAt: null,
  };
}

export function setMode(state, mode, now) {
  if (!MODES.includes(mode)) return state;
  return reset({ ...state, mode }, now);
}

export function setDirection(state, direction, now) {
  if (!DIRECTIONS.includes(direction)) return state;
  return reset({ ...state, direction }, now);
}

export function setTask(state, taskId) {
  return { ...state, taskId: taskId || null, revision: state.revision + 1 };
}

export function updateConfig(state, patch, now) {
  const config = normalizeConfig({ ...state.config, ...(patch || {}) });
  const next = { ...state, config, revision: state.revision + 1 };
  if (state.status === 'idle' && state.direction === 'countdown') {
    next.remainingMs = durationOf(config, state.mode);
  }
  return ensureDay(next, now);
}

export function applyPreset(state, presetId, now) {
  const found = TIMER_PRESETS.find((item) => item.id === presetId);
  if (!found) return state;
  return updateConfig(state, { focus: found.focus, short: found.short, long: found.long }, now);
}

function nextPhaseAfterFocus(state) {
  const round = (state.round + 1) % state.config.longEvery;
  return { round, mode: round === 0 ? 'long' : 'short' };
}

function advance(state, now, completed) {
  const ensure = ensureDay(state, now);
  if (ensure.mode === 'focus' && completed) {
    const next = nextPhaseAfterFocus(ensure);
    return {
      ...ensure,
      round: next.round,
      mode: next.mode,
      completedToday: ensure.completedToday + 1,
      lastCompletedAt: now,
      lastCompletedMode: 'focus',
    };
  }
  if (ensure.mode === 'focus') {
    const next = nextPhaseAfterFocus(ensure);
    return { ...ensure, round: next.round, mode: next.mode, lastCompletedAt: now, lastCompletedMode: null };
  }
  return { ...ensure, mode: 'focus', lastCompletedAt: now, lastCompletedMode: ensure.mode };
}

/**
 * Advance a countdown timer. Returns `{ state, completion }` where completion
 * is a payload describing the focus session that just ended (or null).
 */
export function tick(state, now) {
  if (state.status !== 'running' || state.direction !== 'countdown') return { state, completion: null };
  if (typeof state.deadline !== 'number' || now < state.deadline) return { state, completion: null };

  const finished = state.mode;
  const plannedMs = durationOf(state.config, finished);
  const completedFocus = finished === 'focus';
  const completion = completedFocus
    ? { mode: finished, direction: 'countdown', durationMs: plannedMs, plannedMs, completed: true, partial: false }
    : null;

  let next = advance(state, now, completedFocus);
  next = {
    ...next,
    status: 'idle',
    remainingMs: durationOf(next.config, next.mode),
    elapsedMs: 0,
    deadline: null,
    startedAt: null,
    lastCompletedPartial: completedFocus ? false : (next.lastCompletedPartial ?? null),
    revision: next.revision + 1,
  };

  const auto = next.mode === 'focus' ? next.config.autoStartFocus : next.config.autoStartBreaks;
  if (auto) next = started(next, now);
  return { state: next, completion };
}

/**
 * End the current session early and hand the elapsed time to the Host.
 *
 * Works for all directions:
 * - stopwatch (`countup`) and adaptive flow (`flow`) sessions are always "complete"
 * - a countdown stopped before its deadline is recorded as a partial focus block
 *   (it adds to the history and the forest, but does not advance the round).
 */
export function finish(state, now, meta = {}) {
  if (state.status === 'idle') return { state, completion: null };
  const durationMs = elapsedOf(state, now);
  const partial = state.direction === 'countdown';
  // Focus time below one minute is discarded (not saved, no tree, no round).
  const counts = state.mode === 'focus' && durationMs >= MIN_RECORD_MS;
  const flowBreakMinutes = state.direction === 'flow' && counts ? flowBreakMinutesOf(durationMs) : null;

  const lastFinish = {
    at: now,
    kind: state.mode !== 'focus' ? 'break' : counts ? 'recorded' : 'short',
    durationMs: Math.max(0, Math.round(durationMs)),
     ...(flowBreakMinutes ? { flowBreakMinutes } : {}),
  };

  const cleanNote = meta && typeof meta.note === 'string' ? meta.note.trim().slice(0, 240) : '';
  const cleanEnergy = meta && Number.isFinite(Number(meta.energy)) && Number(meta.energy) >= 1 && Number(meta.energy) <= 5
    ? Math.round(Number(meta.energy))
    : null;

  const completion = counts
    ? {
        mode: 'focus',
        direction: state.direction,
        durationMs,
        plannedMs: durationOf(state.config, 'focus'),
        completed: true,
        partial,
        ...(cleanNote ? { note: cleanNote } : {}),
        ...(cleanEnergy ? { energy: cleanEnergy } : {}),
      }
    : null;

  const base = reset(state, now);
  const next = {
    ...base,
    lastCompletedAt: counts ? now : state.lastCompletedAt,
    lastCompletedMode: counts ? 'focus' : state.lastCompletedMode,
    lastCompletedPartial: counts ? partial : (state.lastCompletedPartial ?? null),
    completedToday: counts && !partial ? state.completedToday + 1 : state.completedToday,
    round: counts && !partial ? (state.round + 1) % state.config.longEvery : state.round,
    lastFinish,
  };
  return { state: next, completion };
}

/** Skip the current phase without earning a pomodoro. */
export function skip(state, now) {
  const base = ensureDay(state, now);
  const next = advance({ ...base, status: 'idle', deadline: null, startedAt: null }, now, false);
  return {
    ...next,
    status: 'idle',
    remainingMs: durationOf(next.config, next.mode),
    elapsedMs: 0,
    deadline: null,
    startedAt: null,
    revision: next.revision + 1,
  };
}

export function toggle(state, now) {
  return state.status === 'running' ? pause(state, now) : start(state, now);
}

export function applyAction(state, action, now) {
  const type = action && action.type;
  switch (type) {
    case 'start': return { state: start(state, now), completion: null };
    case 'pause': return { state: pause(state, now), completion: null };
    case 'toggle': return { state: toggle(state, now), completion: null };
    case 'reset': return { state: reset(state, now), completion: null };
    case 'skip': return { state: skip(state, now), completion: null };
    case 'finish': return finish(state, now, { note: action.note, energy: action.energy });
    case 'mode': return { state: setMode(state, action.mode, now), completion: null };
    case 'direction': return { state: setDirection(state, action.direction, now), completion: null };
    case 'task': return { state: setTask(state, action.taskId), completion: null };
    case 'config': return { state: updateConfig(state, action.patch, now), completion: null };
    case 'preset': return { state: applyPreset(state, action.preset, now), completion: null };
    default: return { state, completion: null };
  }
}

/** Repair a persisted timer payload (tolerates older versions and bad data). */
export function hydrate(raw, now) {
  const seed = createState(now);
  if (!raw || typeof raw !== 'object') return seed;

  const config = normalizeConfig(raw.config);
  const mode = MODES.includes(raw.mode) ? raw.mode : 'focus';
  const direction = DIRECTIONS.includes(raw.direction) ? raw.direction : 'countdown';
  const status = ['idle', 'running', 'paused'].includes(raw.status) ? raw.status : 'idle';

  let state = {
    ...seed,
    ...raw,
    version: 3,
    config,
    mode,
    direction,
    status,
    round: clampInt(raw.round, 0, config.longEvery - 1, 0),
    taskId: typeof raw.taskId === 'string' && raw.taskId ? raw.taskId : null,
    completedToday: clampInt(raw.completedToday, 0, 100000, 0),
    revision: clampInt(raw.revision, 0, 1e9, 0),
    lastCompletedPartial: typeof raw.lastCompletedPartial === 'boolean' ? raw.lastCompletedPartial : null,
    lastFinish: raw.lastFinish && typeof raw.lastFinish === 'object'
      && Number.isFinite(raw.lastFinish.at)
      && ['recorded', 'short', 'break'].includes(raw.lastFinish.kind)
      ? {
          at: raw.lastFinish.at,
          kind: raw.lastFinish.kind,
          durationMs: Math.max(0, Number(raw.lastFinish.durationMs) || 0),
          ...(Number.isFinite(raw.lastFinish.flowBreakMinutes) ? { flowBreakMinutes: raw.lastFinish.flowBreakMinutes } : {}),
        }
      : null,
  };
  state.deadline = typeof raw.deadline === 'number' ? raw.deadline : null;
  state.startedAt = typeof raw.startedAt === 'number' ? raw.startedAt : null;
  state.remainingMs = Math.max(0, Number.isFinite(raw.remainingMs) ? raw.remainingMs : durationOf(config, mode));
  state.elapsedMs = Math.max(0, Number.isFinite(raw.elapsedMs) ? raw.elapsedMs : 0);
  state = ensureDay(state, now);

  if (state.status === 'running') {
    if (state.direction === 'countdown' && (typeof state.deadline !== 'number' || state.deadline <= 0)) {
      state = { ...state, status: 'paused', deadline: null };
    }
    if (state.direction !== 'countdown' && typeof state.startedAt !== 'number') {
      state = { ...state, status: 'paused', startedAt: null };
    }
  }
  if (state.status === 'idle') {
    state.remainingMs = durationOf(config, mode);
    state.elapsedMs = 0;
    state.deadline = null;
    state.startedAt = null;
  }
  return state;
}
