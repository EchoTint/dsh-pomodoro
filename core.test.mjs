import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

import * as core from './core.js';
import { summarize, dateKey, formatDuration } from './stats.js';
import { createStore, SPECIES } from './store.js';
import { buildPayload, maskBackup } from './backup.js';

const MINUTE = 60 * 1000;
const AT = new Date(2026, 4, 12, 9, 0, 0).getTime();

test('defaults: 25 / 5 / 15, focus idle, countdown', () => {
  const state = core.createState(AT);
  assert.equal(state.config.focus, 25);
  assert.equal(state.config.short, 5);
  assert.equal(state.config.long, 15);
  assert.equal(state.config.longEvery, 4);
  assert.equal(state.config.miniMode, 'card');
  assert.equal(state.mode, 'focus');
  assert.equal(state.status, 'idle');
  assert.equal(state.direction, 'countdown');
  assert.equal(state.remainingMs, 25 * MINUTE);
});

test('focus completion counts a pomodoro and moves to a short break', () => {
  const state = core.start(core.createState(AT), AT);
  const done = core.tick(state, AT + 25 * MINUTE);
  assert.equal(done.completion.mode, 'focus');
  assert.equal(done.completion.durationMs, 25 * MINUTE);
  assert.equal(done.state.mode, 'short');
  assert.equal(done.state.completedToday, 1);
  assert.equal(done.state.round, 1);
  assert.equal(done.state.status, 'running'); // autoStartBreaks is on by default
});

test('fourth focus round lands on a long break', () => {
  let state = core.createState(AT);
  let now = AT;
  for (let index = 0; index < 4; index += 1) {
    state = core.start(state, now);
    const focusMs = core.durationOf(state.config, 'focus');
    state = core.tick(state, now + focusMs).state;
    now += focusMs;
    if (index < 3) {
      state = core.start(state, now);
      const shortMs = core.durationOf(state.config, 'short');
      state = core.tick(state, now + shortMs).state;
      now += shortMs;
    }
  }
  assert.equal(state.mode, 'long');
  assert.equal(state.round, 0);
  assert.equal(state.completedToday, 4);
});

test('pause freezes the remaining time and resume continues it', () => {
  let state = core.start(core.createState(AT), AT);
  state = core.pause(state, AT + 10 * MINUTE);
  assert.equal(state.status, 'paused');
  assert.equal(state.remainingMs, 15 * MINUTE);
  state = core.start(state, AT + 40 * MINUTE);
  assert.equal(core.remainingOf(state, AT + 40 * MINUTE), 15 * MINUTE);
  assert.equal(core.remainingOf(state, AT + 45 * MINUTE), 10 * MINUTE);
});

test('reset restores the configured duration', () => {
  let state = core.updateConfig(core.createState(AT), { focus: 30 }, AT);
  state = core.start(state, AT);
  state = core.reset(state, AT + MINUTE);
  assert.equal(state.status, 'idle');
  assert.equal(state.remainingMs, 30 * MINUTE);
});

test('skip moves on without earning a pomodoro', () => {
  const state = core.skip(core.createState(AT), AT);
  assert.equal(state.mode, 'short');
  assert.equal(state.completedToday, 0);
  assert.equal(state.round, 1);
});

test('countup accumulates elapsed time and finish stores the session', () => {
  let state = core.setDirection(core.createState(AT), 'countup', AT);
  assert.equal(state.direction, 'countup');
  state = core.start(state, AT);
  assert.equal(core.elapsedOf(state, AT + 12 * MINUTE), 12 * MINUTE);
  const done = core.finish(state, AT + 12 * MINUTE);
  assert.equal(done.completion.direction, 'countup');
  assert.equal(done.completion.durationMs, 12 * MINUTE);
  assert.equal(done.state.completedToday, 1);
  assert.equal(done.state.status, 'idle');
});

test('a countdown ended early still records the focused time as partial', () => {
  let state = core.start(core.createState(AT), AT);
  const done = core.finish(state, AT + 10 * MINUTE);
  assert.equal(done.completion.partial, true);
  assert.equal(done.completion.durationMs, 10 * MINUTE);
  assert.equal(done.state.completedToday, 0, 'a partial round is not a finished pomodoro');
  assert.equal(done.state.round, 0);
  assert.equal(done.state.mode, 'focus');
  assert.equal(done.state.lastCompletedPartial, true);
});

test('a countdown ended early before a minute records nothing', () => {
  const state = core.start(core.createState(AT), AT);
  const done = core.finish(state, AT + 20 * 1000);
  assert.equal(done.completion, null);
  assert.equal(done.state.status, 'idle');
});

test('finish on an idle timer is a no-op', () => {
  const done = core.finish(core.createState(AT), AT);
  assert.equal(done.completion, null);
  assert.equal(done.state.status, 'idle');
});

test('a completed countdown clears the partial flag', () => {
  let state = core.start(core.createState(AT), AT);
  const early = core.finish(state, AT + 10 * MINUTE);
  assert.equal(early.state.lastCompletedPartial, true);
  let again = core.start(early.state, AT + 11 * MINUTE);
  const full = core.tick(again, AT + 11 * MINUTE + 25 * MINUTE);
  assert.equal(full.completion.partial, false);
  assert.equal(full.state.lastCompletedPartial, false);
  assert.equal(full.state.completedToday, 1);
});

test('theme is validated to auto, light or dark', () => {
  assert.equal(core.createState(AT).config.theme, 'auto');
  assert.equal(core.updateConfig(core.createState(AT), { theme: 'light' }, AT).config.theme, 'light');
  assert.equal(core.updateConfig(core.createState(AT), { theme: 'dark' }, AT).config.theme, 'dark');
  assert.equal(core.updateConfig(core.createState(AT), { theme: 'neon' }, AT).config.theme, 'auto');
});

test('the widget view is one of card, ring or bare', () => {
  assert.equal(core.createState(AT).config.miniMode, 'card');
  assert.equal(core.updateConfig(core.createState(AT), { miniMode: 'ring' }, AT).config.miniMode, 'ring');
  assert.equal(core.updateConfig(core.createState(AT), { miniMode: 'bare' }, AT).config.miniMode, 'bare');
  // v3.2 的「迷你」并入了小卡
  assert.equal(core.updateConfig(core.createState(AT), { miniMode: 'mini' }, AT).config.miniMode, 'card');
  assert.equal(core.updateConfig(core.createState(AT), { miniMode: 'giant' }, AT).config.miniMode, 'card');
});

test('opacity stays inside 0.3 and 1', () => {
  assert.equal(core.createState(AT).config.opacity, 1);
  assert.equal(core.updateConfig(core.createState(AT), { opacity: 0.1 }, AT).config.opacity, 0.3);
  assert.equal(core.updateConfig(core.createState(AT), { opacity: 3 }, AT).config.opacity, 1);
  assert.equal(core.updateConfig(core.createState(AT), { opacity: 0.62 }, AT).config.opacity, 0.62);
});

test('autoShow is a boolean flag', () => {
  assert.equal(core.createState(AT).config.autoShow, false);
  assert.equal(core.updateConfig(core.createState(AT), { autoShow: true }, AT).config.autoShow, true);
  assert.equal(core.updateConfig(core.createState(AT), { autoShow: 'nope' }, AT).config.autoShow, false);
});

test('a countup shorter than a minute is discarded', () => {
  let state = core.setDirection(core.createState(AT), 'countup', AT);
  state = core.start(state, AT);
  const done = core.finish(state, AT + 30 * 1000);
  assert.equal(done.completion, null);
  assert.equal(done.state.completedToday, 0);
});

test('setMode keeps the pomodoro counter and switches duration', () => {
  let state = core.start(core.createState(AT), AT);
  state = core.tick(state, AT + 25 * MINUTE).state;
  state = core.setMode(state, 'focus', AT + 26 * MINUTE);
  assert.equal(state.mode, 'focus');
  assert.equal(state.completedToday, 1);
  assert.equal(state.remainingMs, 25 * MINUTE);
});

test('config values are clamped and validated', () => {
  const state = core.updateConfig(
    core.createState(AT),
    { focus: 999, short: 0, long: 2.6, longEvery: 99, miniMode: 'nope' },
    AT,
  );
  assert.equal(state.config.focus, 180);
  assert.equal(state.config.short, 1);
  assert.equal(state.config.long, 3);
  assert.equal(state.config.longEvery, 8);
  assert.equal(state.config.miniMode, 'card');
});

test('the task id can be attached to the running timer', () => {
  const state = core.setTask(core.createState(AT), 'task_1');
  assert.equal(state.taskId, 'task_1');
  assert.equal(core.setTask(state, null).taskId, null);
});

test('hydrate repairs bad data and keeps a live deadline', () => {
  const seed = core.createState(AT);
  const broken = core.hydrate({ mode: 'nope', status: 'weird', remainingMs: -5, round: 99 }, AT);
  assert.equal(broken.mode, 'focus');
  assert.equal(broken.status, 'idle');
  assert.equal(broken.remainingMs, seed.remainingMs);

  const live = core.hydrate({ ...seed, status: 'running', mode: 'focus', deadline: AT + 5 * MINUTE }, AT);
  assert.equal(live.status, 'running');
  assert.equal(core.remainingOf(live, AT), 5 * MINUTE);
});

test('hydrate demotes a running timer without a deadline to paused', () => {
  const state = core.hydrate({ ...core.createState(AT), status: 'running', deadline: null }, AT);
  assert.equal(state.status, 'paused');
});

test('the daily counter rolls over at midnight', () => {
  const late = new Date(2026, 4, 12, 23, 0, 0).getTime();
  let state = core.start(core.createState(late), late);
  state = core.tick(state, late + 25 * MINUTE).state;
  assert.equal(state.completedToday, 1);
  const nextDay = core.ensureDay(state, late + 24 * 60 * MINUTE);
  assert.equal(nextDay.completedToday, 0);
});

test('progress stays inside 0..1', () => {
  const state = core.start(core.createState(AT), AT);
  assert.equal(core.progressOf(state, AT), 0);
  assert.equal(core.progressOf(state, AT + 25 * MINUTE), 1);
  assert.equal(core.progressOf(state, AT + 40 * MINUTE), 1);
});

test('applyAction routes every action type', () => {
  const start = core.applyAction(core.createState(AT), { type: 'toggle' }, AT);
  assert.equal(start.state.status, 'running');
  const paused = core.applyAction(start.state, { type: 'toggle' }, AT + MINUTE);
  assert.equal(paused.state.status, 'paused');
  const configured = core.applyAction(paused.state, { type: 'config', patch: { focus: 40 } }, AT);
  assert.equal(configured.state.config.focus, 40);
  const unknown = core.applyAction(configured.state, { type: 'nope' }, AT);
  assert.equal(unknown.state, configured.state);
});

test('summarize builds today, week and year aggregates', () => {
  const sessions = [
    { id: 'a', mode: 'focus', endedAt: new Date(2026, 4, 12, 9, 30).getTime(), durationMs: 25 * MINUTE, taskId: 't1', taskName: '写代码' },
    { id: 'b', mode: 'focus', endedAt: new Date(2026, 4, 12, 10, 30).getTime(), durationMs: 50 * MINUTE, taskId: 't1', taskName: '写代码' },
    { id: 'c', mode: 'focus', endedAt: new Date(2026, 4, 11, 20, 0).getTime(), durationMs: 25 * MINUTE, taskId: 't2', taskName: '读书' },
    { id: 'd', mode: 'short', endedAt: new Date(2026, 4, 12, 11, 0).getTime(), durationMs: 5 * MINUTE },
  ];
  const stats = summarize(sessions, new Date(2026, 4, 12, 12, 0).getTime(), { year: 2026 });

  assert.equal(stats.today.sessions, 2);
  assert.equal(stats.today.focusMs, 75 * MINUTE);
  assert.equal(stats.today.hourly[9], 25 * MINUTE);
  assert.equal(stats.today.hourly[10], 50 * MINUTE);
  assert.equal(stats.today.bestHour, 10);
  assert.equal(stats.today.tasks[0].taskId, 't1');
  assert.equal(stats.totals.sessions, 3);
  assert.equal(stats.totals.focusMs, 100 * MINUTE);
  assert.equal(stats.year.days['2026-05-12'], 75 * MINUTE);
  assert.equal(stats.timeline[0].id, 'b'); // newest first
  assert.equal(stats.week.days.length, 7);
});

test('summarize tolerates an empty history', () => {
  const stats = summarize([], AT, { year: 2026 });
  assert.equal(stats.today.focusMs, 0);
  assert.equal(stats.totals.sessions, 0);
  assert.equal(stats.totals.streakDays, 0);
  assert.deepEqual(stats.timeline, []);
});

test('formatDuration renders minutes and hours', () => {
  assert.equal(formatDuration(0, 'zh'), '不到 1 分钟');
  assert.equal(formatDuration(25 * MINUTE, 'zh'), '25 分钟');
  assert.equal(formatDuration(90 * MINUTE, 'zh'), '1 小时 30 分');
  assert.equal(formatDuration(25 * MINUTE, 'en'), '25 min');
});

test('store persists tasks, sessions and the forest', () => {
  const dir = mkdtempSync(join(tmpdir(), 'pomodoro-store-'));
  try {
    const store = createStore(dir);
    const task = store.addTask('  写周报  ');
    assert.equal(task.name, '写周报');
    store.renameTask(task.id, '写月报');
    assert.equal(store.data.tasks[0].name, '写月报');

    store.addSession({
      id: 's1',
      mode: 'focus',
      endedAt: AT,
      startedAt: AT - 25 * MINUTE,
      durationMs: 25 * MINUTE,
      taskId: task.id,
      taskName: '写月报',
    });
    assert.equal(store.data.sessions.length, 1);

    const tree = store.plantTree({ durationMs: 25 * MINUTE, taskName: '写月报' });
    assert.equal(store.data.garden.trees.length, 1);
    assert.equal(tree.species, 'sprout');
    assert.equal(store.nextSpecies().id, 'pine');

    store.setBackup({ provider: 'webdav', webdav: { url: 'https://dav.example.com/dav' } });
    assert.equal(store.data.backup.provider, 'webdav');

    const reopened = createStore(dir);
    assert.equal(reopened.data.tasks[0].name, '写月报');
    assert.equal(reopened.data.sessions.length, 1);
    assert.equal(reopened.data.garden.trees.length, 1);
    assert.equal(reopened.data.backup.webdav.url, 'https://dav.example.com/dav');

    store.archiveTask(task.id, true);
    assert.equal(store.data.tasks[0].archivedAt > 0, true);
    store.deleteTask(task.id);
    assert.equal(store.data.tasks.length, 0);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('species unlock with the number of planted trees', () => {
  const dir = mkdtempSync(join(tmpdir(), 'pomodoro-garden-'));
  try {
    const store = createStore(dir);
    for (let index = 0; index < 6; index += 1) store.plantTree({ durationMs: 25 * MINUTE });
    const unlocked = store.unlockSpecies().map((item) => item.id);
    assert.deepEqual(unlocked, ['sprout', 'maple', 'pine', 'oak']);
    assert.equal(store.nextSpecies().id, 'cherry');
    assert.equal(SPECIES.length, 8);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('backup payload carries the whole history and masks secrets', () => {
  const payload = JSON.parse(buildPayload({
    version: 1,
    tasks: [{ id: 't', name: 'x' }],
    sessions: [{ id: 's' }],
    garden: { trees: [] },
    backup: { provider: 's3', s3: { secretKey: 'top-secret', accessKey: 'ak' } },
  }));
  assert.equal(payload.app, 'dsh-pomodoro');
  assert.equal(payload.tasks.length, 1);
  assert.equal(payload.sessions.length, 1);
  assert.equal(typeof payload.exportedAt, 'number');

  const masked = maskBackup({
    provider: 's3',
    s3: { accessKey: 'ak', secretKey: 'top-secret' },
    webdav: { password: 'pw' },
  });
  assert.equal(masked.s3.hasSecret, true);
  assert.equal(masked.webdav.hasPassword, true);
  assert.equal(masked.s3.secretKey, undefined);
  assert.equal(masked.webdav.password, undefined);
  assert.equal(JSON.stringify(masked).includes('top-secret'), false);
});

test('dateKey uses the local calendar day', () => {
  assert.equal(dateKey(new Date(2026, 0, 2, 23, 59).getTime()), '2026-01-02');
});

test('finish reports whether the time was kept: short / recorded / break', () => {
  const started = core.start(core.createState(AT), AT);

  const tooShort = core.finish(started, AT + 59 * 1000);
  assert.equal(tooShort.completion, null);
  assert.equal(tooShort.state.lastFinish.kind, 'short');
  assert.equal(tooShort.state.lastFinish.durationMs, 59 * 1000);
  assert.equal(tooShort.state.completedToday, 0);

  const exactlyOne = core.finish(started, AT + core.MIN_RECORD_MS);
  assert.equal(exactlyOne.state.lastFinish.kind, 'recorded');
  assert.equal(exactlyOne.completion.durationMs, MINUTE);

  const onBreak = core.finish(core.start(core.setMode(core.createState(AT), 'short', AT), AT), AT + 3 * MINUTE);
  assert.equal(onBreak.completion, null);
  assert.equal(onBreak.state.lastFinish.kind, 'break');
});

test('lastFinish survives hydrate and bad values are dropped', () => {
  const done = core.finish(core.start(core.createState(AT), AT), AT + 5 * MINUTE);
  const again = core.hydrate(JSON.parse(JSON.stringify(done.state)), AT + 6 * MINUTE);
  assert.deepEqual(again.lastFinish, done.state.lastFinish);
  const broken = core.hydrate({ ...done.state, lastFinish: { at: 'x', kind: 'nope' } }, AT);
  assert.equal(broken.lastFinish, null);
});


test('flow mode counts up, records a full session, and recommends proportional break minutes', () => {
  let state = core.setDirection(core.createState(AT), 'flow', AT);
  assert.equal(state.direction, 'flow');
  state = core.start(state, AT);
  assert.equal(core.elapsedOf(state, AT + 35 * MINUTE), 35 * MINUTE);
  const done = core.finish(state, AT + 35 * MINUTE, { note: '完成核心模块重构', energy: 5 });
  assert.equal(done.completion.direction, 'flow');
  assert.equal(done.completion.partial, false);
  assert.equal(done.completion.note, '完成核心模块重构');
  assert.equal(done.completion.energy, 5);
  assert.equal(done.state.completedToday, 1);
  assert.equal(done.state.lastFinish.flowBreakMinutes, 7);
});

test('applyPreset updates focus, short and long durations', () => {
  const state = core.applyPreset(core.createState(AT), 'deep', AT);
  assert.equal(state.config.focus, 50);
  assert.equal(state.config.short, 10);
  assert.equal(state.config.long, 20);
  assert.equal(state.remainingMs, 50 * MINUTE);
});

test('store supports task priority, estimatedPomodoros, subtasks and session reflection updates', () => {
  const dir = mkdtempSync(join(tmpdir(), 'pomodoro-flow-'));
  try {
    const store = createStore(dir);
    const task = store.addTask('重构 UI 工作台', { priority: 'high', estimatedPomodoros: 4 });
    assert.equal(task.priority, 'high');
    assert.equal(task.estimatedPomodoros, 4);

    const sub1 = store.addSubtask(task.id, '设计双栏 Bento 布局');
    const sub2 = store.addSubtask(task.id, '编写 Web Audio 合成器');
    assert.equal(store.data.tasks[0].subtasks.length, 2);
    assert.equal(sub1.done, false);

    store.toggleSubtask(task.id, sub1.id);
    assert.equal(store.data.tasks[0].subtasks[0].done, true);

    store.deleteSubtask(task.id, sub2.id);
    assert.equal(store.data.tasks[0].subtasks.length, 1);

    const session = store.addSession({
      id: 's_flow_1',
      mode: 'focus',
      direction: 'flow',
      taskId: task.id,
      taskName: task.name,
      startedAt: AT,
      endedAt: AT + 30 * MINUTE,
      durationMs: 30 * MINUTE,
      completed: true,
      partial: false,
      note: '初版完成',
      energy: 4,
    });
    assert.equal(session.energy, 4);
    assert.equal(store.data.tasks[0].completedPomodoros, 1);
    assert.equal(store.data.tasks[0].totalFocusMs, 30 * MINUTE);

    store.updateSession('s_flow_1', { note: '终版完成并通过测试', energy: 5 });
    assert.equal(store.data.sessions[0].note, '终版完成并通过测试');
    assert.equal(store.data.sessions[0].energy, 5);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('summarize computes flowScore, daily goal progress and chronotype rhythm', () => {
  const sessions = [
    { id: 's1', mode: 'focus', endedAt: new Date(2026, 4, 12, 9, 30).getTime(), durationMs: 50 * MINUTE, energy: 5 },
    { id: 's2', mode: 'focus', endedAt: new Date(2026, 4, 12, 10, 45).getTime(), durationMs: 40 * MINUTE, energy: 4 },
  ];
  const stats = summarize(sessions, new Date(2026, 4, 12, 12, 0).getTime(), { year: 2026, dailyGoalMinutes: 90 });
  assert.equal(stats.today.goalProgress, 1);
  assert.equal(stats.today.flowScore > 80, true);
  assert.equal(stats.rhythm.dominantPeriod, 'morning');
  assert.equal(stats.totals.avgEnergy, 4.5);
});
