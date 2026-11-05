/**
 * Pure aggregation helpers for the Flow Studio & Insights screens.
 * Everything is computed from the stored focus sessions so the numbers
 * always match the timeline.
 */

const MINUTE = 60 * 1000;

export function pad(value) {
  return String(value).padStart(2, '0');
}

export function dateKey(ts) {
  const date = new Date(ts);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function startOfDay(ts) {
  const date = new Date(ts);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

export function addDays(ts, days) {
  const date = new Date(ts);
  date.setDate(date.getDate() + days);
  return date.getTime();
}

function focusSessions(sessions) {
  return (Array.isArray(sessions) ? sessions : []).filter(
    (item) => item && item.mode === 'focus' && Number(item.durationMs) > 0,
  );
}

export function summarize(sessions, now, options = {}) {
  const list = focusSessions(sessions)
    .filter((item) => Number.isFinite(item.endedAt) && item.endedAt <= now + 60 * 1000)
    .sort((a, b) => a.endedAt - b.endedAt);

  const todayStart = startOfDay(now);
  const todayEnd = addDays(todayStart, 1);
  const todayKey = dateKey(now);
  const goalMinutes = Math.max(15, Number(options.dailyGoalMinutes) || 120);
  const goalMs = goalMinutes * MINUTE;

  const hourly = new Array(24).fill(0);
  let todayMs = 0;
  let todaySessions = 0;
  let todayCompleted = 0;
  const todayTasks = new Map();

  let morningMs = 0;
  let afternoonMs = 0;
  let eveningMs = 0;
  let nightMs = 0;

  let energySum = 0;
  let energyCount = 0;

  for (const item of list) {
    const dur = Number(item.durationMs) || 0;
    const hr = new Date(item.endedAt).getHours();
    if (hr >= 5 && hr < 12) morningMs += dur;
    else if (hr >= 12 && hr < 18) afternoonMs += dur;
    else if (hr >= 18 && hr < 23) eveningMs += dur;
    else nightMs += dur;

    if (Number.isFinite(item.energy) && item.energy >= 1 && item.energy <= 5) {
      energySum += Number(item.energy);
      energyCount += 1;
    }

    if (item.endedAt < todayStart || item.endedAt >= todayEnd) continue;
    hourly[hr] += dur;
    todayMs += dur;
    todaySessions += 1;
    if (item.completed !== false && !item.partial) todayCompleted += 1;
    if (item.taskId) {
      const entry = todayTasks.get(item.taskId) || { taskId: item.taskId, name: item.taskName || '', ms: 0, sessions: 0 };
      entry.ms += dur;
      entry.sessions += 1;
      todayTasks.set(item.taskId, entry);
    }
  }

  let bestHour = -1;
  for (let hour = 0; hour < 24; hour += 1) {
    if (hourly[hour] > 0 && (bestHour === -1 || hourly[hour] > hourly[bestHour])) bestHour = hour;
  }

  const goalProgress = Math.min(1, todayMs / Math.max(1, goalMs));
  const avgTodayMs = todaySessions ? todayMs / todaySessions : 0;
  const depthFactor = Math.min(1, avgTodayMs / (25 * MINUTE));
  const flowScore = todaySessions === 0
    ? 0
    : Math.min(100, Math.round(goalProgress * 60 + depthFactor * 25 + (todayCompleted / Math.max(1, todaySessions)) * 15));

  const weekStart = startOfDay(addDays(now, -6));
  const week = [];
  let weekMs = 0;
  let weekSessions = 0;
  for (let index = 0; index < 7; index += 1) {
    const dayStart = addDays(weekStart, index);
    const dayEnd = addDays(dayStart, 1);
    let ms = 0;
    let count = 0;
    for (const item of list) {
      if (item.endedAt >= dayStart && item.endedAt < dayEnd) {
        ms += Number(item.durationMs);
        count += 1;
      }
    }
    week.push({
      date: dateKey(dayStart),
      ms,
      sessions: count,
      label: ['日', '一', '二', '三', '四', '五', '六'][new Date(dayStart).getDay()],
    });
    weekMs += ms;
    weekSessions += count;
  }

  const year = Number(options.year) || new Date(now).getFullYear();
  const days = {};
  let yearMs = 0;
  let maxDayMs = 0;
  for (const item of list) {
    const date = new Date(item.endedAt);
    if (date.getFullYear() !== year) continue;
    const key = dateKey(item.endedAt);
    days[key] = (days[key] || 0) + Number(item.durationMs);
    yearMs += Number(item.durationMs);
  }
  for (const ms of Object.values(days)) maxDayMs = Math.max(maxDayMs, ms);

  const activeDays = new Set(list.map((item) => dateKey(item.endedAt)));
  let streakDays = 0;
  let cursor = todayKey;
  if (!activeDays.has(cursor)) cursor = dateKey(addDays(now, -1));
  while (activeDays.has(cursor) && streakDays < 5000) {
    streakDays += 1;
    const [yearPart, monthPart, dayPart] = cursor.split('-').map(Number);
    const previous = new Date(yearPart, monthPart - 1, dayPart);
    previous.setDate(previous.getDate() - 1);
    cursor = dateKey(previous.getTime());
  }

  const taskTotals = new Map();
  for (const item of list) {
    if (item.endedAt < weekStart) continue;
    const id = item.taskId || 'untracked';
    const entry = taskTotals.get(id) || {
      taskId: id,
      name: item.taskName || '未命名任务',
      ms: 0,
      sessions: 0,
    };
    entry.ms += Number(item.durationMs);
    entry.sessions += 1;
    taskTotals.set(id, entry);
  }

  const totalMs = list.reduce((sum, item) => sum + Number(item.durationMs), 0);
  const fullCompleted = list.filter((item) => item.completed !== false && !item.partial).length;

  const periods = [
    { id: 'morning', ms: morningMs },
    { id: 'afternoon', ms: afternoonMs },
    { id: 'evening', ms: eveningMs },
    { id: 'night', ms: nightMs },
  ];
  periods.sort((a, b) => b.ms - a.ms);
  const dominantPeriod = periods[0].ms > 0 ? periods[0].id : 'none';

  return {
    now,
    today: {
      date: todayKey,
      focusMs: todayMs,
      goalMs,
      goalProgress,
      flowScore,
      sessions: todaySessions,
      completed: todayCompleted,
      hourly,
      bestHour,
      bestHourMs: bestHour === -1 ? 0 : hourly[bestHour],
      tasks: [...todayTasks.values()].sort((a, b) => b.ms - a.ms),
    },
    week: {
      days: week,
      focusMs: weekMs,
      sessions: weekSessions,
      dailyAvgMs: Math.round(weekMs / 7),
    },
    year: { year, days, totalMs: yearMs, maxDayMs },
    rhythm: {
      morningMs,
      afternoonMs,
      eveningMs,
      nightMs,
      dominantPeriod,
    },
    totals: {
      focusMs: totalMs,
      sessions: list.length,
      completed: list.filter((item) => item.completed !== false).length,
      fullCompleted,
      completionRate: list.length ? Math.round((fullCompleted / list.length) * 100) : 100,
      avgEnergy: energyCount ? Math.round((energySum / energyCount) * 10) / 10 : null,
      activeDays: activeDays.size,
      streakDays,
      avgSessionMs: list.length ? Math.round(totalMs / list.length) : 0,
      longestSessionMs: list.reduce((max, item) => Math.max(max, Number(item.durationMs)), 0),
    },
    tasks: [...taskTotals.values()].sort((a, b) => b.ms - a.ms).slice(0, 8),
    timeline: list.slice(-40).reverse().map((item) => ({
      id: item.id,
      taskId: item.taskId || null,
      taskName: item.taskName || '',
      startedAt: item.startedAt,
      endedAt: item.endedAt,
      durationMs: Number(item.durationMs),
      direction: item.direction || 'countdown',
      completed: item.completed !== false,
      partial: item.partial === true,
      note: item.note || '',
      energy: item.energy || null,
    })),
  };
}

export function formatDuration(ms, locale = 'zh') {
  const total = Math.max(0, Math.round(Number(ms) || 0));
  const minutes = Math.round(total / MINUTE);
  if (minutes < 1) return locale === 'zh' ? '不到 1 分钟' : '<1 min';
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (!hours) return locale === 'zh' ? `${minutes} 分钟` : `${minutes} min`;
  if (!rest) return locale === 'zh' ? `${hours} 小时` : `${hours}h`;
  return locale === 'zh' ? `${hours} 小时 ${rest} 分` : `${hours}h ${rest}m`;
}
