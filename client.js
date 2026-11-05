window.__ModuleLoader__.load({
  id: '@echotint/dsh-pomodoro',
  factory(require) {
    const React = require('react');
    const h = React.createElement;

    const NS = 'pomodoro';
    const PANEL_ID = 'pomodoro';
    const API = '/pomodoro/api';

    const zh = {
      panel: '番茄钟 · Flow',
      title: '沉浸心流工作台',
      kicker: 'FLOW STUDIO',
      lead: '后台权威计时 · 灵动桌面窗 · 程序化环境白噪音 · 任务与能量复盘',
      tabTimer: '工作台',
      tabStats: '洞察',
      tabForest: '生态林地',
      tabSettings: '偏好与云端',
      focus: '专注',
      short: '短休息',
      long: '长休息',
      countdown: '倒计时',
      countup: '正计时',
      flow: '⚡ 心流模式',
      start: '开始专注',
      pause: '暂停',
      resume: '继续',
      finish: '结束并记录',
      finishHint: '结束当前阶段并同步至专注历史。',
      finishKeep: '已专注 {time}，结束将计入统计与森林。',
      finishDrop: '已专注 {time}（不满 1 分钟，结束不计入统计）。',
      noticeRecorded: '已记录 {time} 的专注时光。',
      noticeFlowRecorded: '心流完成 {time}！建议休息 {breakMin} 分钟充能。',
      noticeShort: '专注不足 1 分钟，本次未计入。',
      reset: '重置本轮',
      skip: '跳过阶段',
      ready: '待命就绪',
      running: '心流进行中',
      paused: '已暂停',
      countupHint: '正计时不设上限，随时点击「结束并记录」保存成果。',
      flowHint: '心流模式正向累积时长，结束时按每 5 分钟专注智能推荐 1 分钟休息。',
      spaceHint: '快捷键：空格 开始/暂停',
      todayLabel: '今日番茄',
      todayCount: '{n} 个番茄',
      todayFocus: '今日专注',
      weekFocus: '近 7 日累计',
      streak: '连续打卡',
      streakValue: '{n} 天',
      flowScore: '心流指数',
      dailyGoal: '每日目标',
      dailyGoalProgress: '{done} / {goal}',
      roundLabel: '本组轮次',
      roundValue: '{n} / {m}',
      presetsLabel: '速设节律',
      presetSprint: '15m 冲刺',
      presetClassic: '25m 经典',
      presetDeep: '50m 深度',
      presetUltralearn: '90m 极客',

      taskDeckTitle: '任务队列与子步骤舱',
      taskLabel: '当前攻克任务',
      taskNone: '自由专注（不绑定任务）',
      taskAdd: '新建任务',
      taskNamePlaceholder: '输入任务名称，如：重构核心状态机…',
      taskNotePlaceholder: '任务备注或目标说明（可选）',
      taskCreate: '加入队列',
      taskCancel: '取消',
      taskHint: '绑定任务后，每轮专注会自动累加该任务的耗时与番茄数。',
      priorityHigh: '高优',
      priorityMedium: '常规',
      priorityLow: '低优',
      estPomos: '预估番茄',
      subtasksTitle: '子步骤清单',
      subtaskPlaceholder: '添加具体执行步骤，回车确认…',
      subtaskAdd: '添加',
      noSubtasks: '暂无子步骤，拆解小目标更容易进入心流。',

      reflectionTitle: '本轮专注复盘',
      reflectionPlaceholder: '记录本轮推进的关键进展或灵感（可选）…',
      energyLabel: '专注能量',
      energy1: '疲惫',
      energy2: '勉强',
      energy3: '平稳',
      energy4: '顺畅',
      energy5: '巅峰心流',

      soundscapeTitle: '环境白噪音混音台',
      soundscapeHint: 'Web Audio 实时程序化合成，零外部音频依赖，多声道自由混音。',
      chRain: '细雨微澜',
      chCampfire: '林间篝火',
      chOcean: '深海潮汐',
      chBinaural: 'Alpha 脑波',
      sceneNone: '静音',
      sceneStudy: '雨夜书房',
      sceneCamp: '篝火营地',
      sceneZen: '海岸冥想',
      sceneBrain: '深度脑波',
      ambientAuto: '随专注自动播放 / 暂停时静音',
      ambientPlaying: '环境音播放中',
      ambientMuted: '环境音已静音',

      durations: '阶段时长与每日目标',
      durationsHint: '各阶段可设 1–180 分钟；每日目标用于衡量今日完成度。',
      focusLen: '专注时长',
      shortLen: '短休息',
      longLen: '长休息',
      goalLen: '每日目标',
      minutes: '分钟',
      rhythm: '节律与提醒',
      longEvery: '长休息间隔',
      longEveryValue: '每 {n} 轮专注后进入长休息',
      autoBreaks: '专注结束后自动开始休息',
      autoFocus: '休息结束后自动开始下一轮专注',
      sound: '阶段完成播放空灵提示音',
      minTree: '植树门槛时长',
      minTreeValue: '单次专注满 {n} 分钟种下一棵树',

      desktop: '桌面灵动悬浮窗',
      desktopHint: '独立于主窗口的置顶透明 HUD，可拖拽至屏幕任意角落，关闭不影响后台计时。',
      desktopRunning: '已在桌面显示',
      desktopStopped: '未显示在桌面',
      openWidget: '弹出桌面灵动窗',
      closeWidget: '收起悬浮窗',
      alwaysOnTop: '始终置顶',
      theme: '外观主题',
      themeHint: '「跟随宿主」会自动感知侧栏深浅色并实时同步至悬浮窗。',
      themeAuto: '跟随宿主',
      themeLight: '浅色晨曦',
      themeDark: '深邃暗夜',
      desktopToggle: '桌面悬浮窗状态',
      widgetSize: '灵动窗形态',
      viewCard: '灵动胶囊',
      viewCardHint: '220×84 · 环控+时间+轮次',
      viewRing: '极光圆盘',
      viewRingHint: '104×104 · 玻璃外环进度',
      viewBare: '极简 HUD',
      viewBareHint: '128×56 · 纯数字+激光底栏',
      opacity: '窗口不透明度',
      opacityHint: '调节悬浮窗整体的通透感（30%–100%）',
      autoShow: '专注时自动弹出',
      autoShowHint: '开始专注时若悬浮窗未打开则自动唤起',
      windowMissing: '未检测到本地 Electron 运行时，当前仅在侧栏面板运行。',
      windowError: '悬浮窗提示：{message}',
      saved: '保存配置',
      loading: '正在同步心流工作台状态…',
      hostDown: '后台番茄钟服务未响应，请重载插件或重启应用。',
      retry: '立即重试',
      testChime: '试听提示音',
      openInBrowser: '在浏览器中预览悬浮窗 (/pomodoro/widget)',
      footer: '所有专注状态、任务与生态数据均安全存储于本机。',

      todayOverview: '今日 24 小时能量节律',
      bestHour: '黄金时段',
      bestHourValue: '{h}:00 – {h2}:00',
      noBestHour: '今日尚无记录，开启第一轮专注点亮节律图。',
      hourlyHint: '柱体高度代表该小时内的专注投入时长。',
      weekTrendTitle: '近 7 日专注趋势',
      weekAvgLabel: '日均 {duration}',
      rhythmPersonaTitle: '专注昼夜画像',
      periodMorning: '清晨破晓 (05–12h)',
      periodAfternoon: '午后深潜 (12–18h)',
      periodEvening: '黄昏心流 (18–23h)',
      periodNight: '夜航造梦 (23–05h)',
      personaMorning: '晨型破晓者',
      personaAfternoon: '午后深潜家',
      personaEvening: '黄昏心流者',
      personaNight: '夜航造梦人',
      personaNone: '探索节律中',
      timelineTitle: '专注时间线与复盘日志',
      timelineEmpty: '暂无专注记录。',
      timelineAll: '最近 40 条记录',
      editNote: '写复盘',
      saveNote: '保存',
      taskUnassigned: '自由专注',
      heatmapTitle: '年度专注足迹热力图',
      heatmapHint: '每一格代表一天，色泽越亮代表当日心流投入越深。',
      heatmapTotal: '本年累计 {duration}',
      heatmapDays: '点亮 {n} 天',
      less: '少',
      more: '多',
      taskBreakdown: '任务时间投入榜（近 7 日）',
      taskEmpty: '近 7 日暂无绑定任务的专注记录。',
      untracked: '自由专注（未绑定）',
      avgSession: '平均单次',
      longestSession: '最长单次',
      totalSessions: '历史总番茄',
      completionRate: '完整达成率',

      forestTitle: '生态微景观 · 专注林地',
      forestLead: '每一段达到门槛的专注都会化作一株植物，在你的专属生态岛上生长。',
      treesPlanted: '森林规模',
      treesValue: '{n} 株植物',
      nextTree: '下一解锁物种',
      nextTreeValue: '再种 {n} 棵解锁「{name}」',
      forestTotal: '累计灌溉 {duration}',
      speciesTitle: '物种图鉴与生态阶梯',
      speciesLocked: '还需 {n} 棵解锁',
      speciesUnlocked: '已解锁',
      forestEmpty: '生态岛尚待开垦。完成一轮 ≥ {n} 分钟的专注，种下第一株新芽吧！',
      treeMinutes: '专注 {n} 分钟',
      plantedAt: '{date}',
      forestAll: '已解锁 {u} / {total} 物种',

      settingsBackup: '云端同步与数据备份',
      backupHint: '支持坚果云等 WebDAV 服务及 S3 兼容对象存储（R2 / MinIO / OSS），一键备份任务、会话历史与整片森林。',
      backupNone: '仅本地',
      backupWebdav: 'WebDAV / 坚果云',
      backupS3: 'S3 对象存储',
      webdavUrl: '服务器地址',
      webdavUrlHint: '示例：https://dav.jianguoyun.com/dav',
      webdavUser: '账号邮箱',
      webdavPassword: '应用密码',
      webdavSecretSaved: '密码已保存，留空则保持不变',
      webdavPath: '远程文件路径',
      s3Endpoint: 'Endpoint 地址',
      s3Region: '区域 (Region)',
      s3Bucket: '存储桶 (Bucket)',
      s3AccessKey: 'Access Key',
      s3SecretKey: 'Secret Key',
      s3Prefix: '对象前缀 (Prefix)',
      autoBackup: '每次完成专注后自动静默备份',
      backupNow: '立即上传备份',
      backupSaved: '云备份配置已保存',
      backupDone: '云端备份成功',
      backupFailed: '备份失败：{message}',
      backupLast: '最近同步：{time}',
      backupNever: '尚未执行过云备份',
      exportData: '导出本地 JSON',
      importData: '从 JSON 恢复数据',
      importDone: '数据恢复成功',
      importFailed: '导入失败：{message}',
      importWarning: '提示：导入备份将覆盖当前本地的任务、专注记录与森林数据。',
      forceBackup: '正在同步…',

      manageTasks: '任务库与归档管理',
      manageHint: '归档后的任务不再显示在工作台快捷队列，但其历史统计数据完整保留。',
      archive: '归档',
      restore: '恢复',
      remove: '彻底删除',
      confirmRemove: '确定彻底删除该任务？已生成的历史专注记录不受影响。',
      noTasks: '任务库为空，去工作台创建第一个任务吧。',
      activeTasksHeader: '进行中任务',
      archivedTasksHeader: '已归档任务',
      completionSound: '阶段完成提示音',
      previewSound: '🔔 试听',
      localSnapshot: '本地数据快照',
      localSnapshotHint: '导出或恢复包含任务、历史会话与森林的完整 JSON',
      filterTasks: '🔍 搜索任务…',
      cyclePriority: '点击切换优先级',
    };

    const en = {
      panel: 'Pomodoro · Flow',
      title: 'Immersive Flow Studio',
      kicker: 'FLOW STUDIO',
      lead: 'Background-hosted timer · Floating HUD · Procedural Soundscape · Tasks & Reflection',
      tabTimer: 'Studio',
      tabStats: 'Insights',
      tabForest: 'Sanctuary',
      tabSettings: 'Preferences',
      focus: 'Focus',
      short: 'Short Break',
      long: 'Long Break',
      countdown: 'Countdown',
      countup: 'Stopwatch',
      flow: '⚡ Flowtime',
      start: 'Start Focus',
      pause: 'Pause',
      resume: 'Resume',
      finish: 'Finish & Save',
      finishHint: 'End this phase and log elapsed focus time.',
      finishKeep: 'Focused {time} so far — ending now saves it to history & sanctuary.',
      finishDrop: 'Focused {time} (< 1 min, ending now will not be recorded).',
      noticeRecorded: 'Logged {time} of deep focus.',
      noticeFlowRecorded: 'Flow session {time} saved! Recommended break: {breakMin} min.',
      noticeShort: 'Under 1 minute — session was not recorded.',
      reset: 'Reset',
      skip: 'Skip Phase',
      ready: 'Ready',
      running: 'In Flow',
      paused: 'Paused',
      countupHint: 'Stopwatch counts up indefinitely — press Finish & Save anytime.',
      flowHint: 'Flowtime counts up and recommends 1 min of break per 5 min of deep focus.',
      spaceHint: 'Shortcut: Space to Start / Pause',
      todayLabel: 'Done Today',
      todayCount: '{n} pomodoros',
      todayFocus: 'Today Focus',
      weekFocus: 'Last 7 Days',
      streak: 'Streak',
      streakValue: '{n} days',
      flowScore: 'Flow Index',
      dailyGoal: 'Daily Goal',
      dailyGoalProgress: '{done} / {goal}',
      roundLabel: 'Cycle',
      roundValue: '{n} / {m}',
      presetsLabel: 'Quick Presets',
      presetSprint: '15m Sprint',
      presetClassic: '25m Classic',
      presetDeep: '50m Deep',
      presetUltralearn: '90m Ultra',

      taskDeckTitle: 'Task Queue & Subtasks',
      taskLabel: 'Active Task',
      taskNone: 'Free Focus (Unassigned)',
      taskAdd: 'New Task',
      taskNamePlaceholder: 'What are you working on?',
      taskNotePlaceholder: 'Optional notes or acceptance criteria…',
      taskCreate: 'Add Task',
      taskCancel: 'Cancel',
      taskHint: 'Every focus session automatically credits time & pomodoros to the active task.',
      priorityHigh: 'High',
      priorityMedium: 'Normal',
      priorityLow: 'Low',
      estPomos: 'Est. Pomos',
      subtasksTitle: 'Subtasks Checklist',
      subtaskPlaceholder: 'Add a step and press Enter…',
      subtaskAdd: 'Add',
      noSubtasks: 'No subtasks yet. Break down your goal to enter flow effortlessly.',

      reflectionTitle: 'Session Reflection',
      reflectionPlaceholder: 'Jot down key takeaways or progress from this round (optional)…',
      energyLabel: 'Energy Level',
      energy1: 'Drained',
      energy2: 'Low',
      energy3: 'Steady',
      energy4: 'Sharp',
      energy5: 'Peak Flow',

      soundscapeTitle: 'Ambient Soundscape Mixer',
      soundscapeHint: 'Real-time procedural Web Audio synthesis. Zero external assets, mix freely.',
      chRain: 'Gentle Rain',
      chCampfire: 'Warm Campfire',
      chOcean: 'Ocean Tide',
      chBinaural: 'Alpha Waves',
      sceneNone: 'Mute',
      sceneStudy: 'Rainy Study',
      sceneCamp: 'Night Camp',
      sceneZen: 'Ocean Zen',
      sceneBrain: 'Deep Alpha',
      ambientAuto: 'Auto-play while focusing / mute on pause',
      ambientPlaying: 'Soundscape Active',
      ambientMuted: 'Soundscape Muted',

      durations: 'Durations & Daily Goal',
      durationsHint: '1–180 min per phase; Daily Goal tracks your daily target progress.',
      focusLen: 'Focus',
      shortLen: 'Short Break',
      longLen: 'Long Break',
      goalLen: 'Daily Goal',
      minutes: 'min',
      rhythm: 'Rhythm & Alerts',
      longEvery: 'Long break interval',
      longEveryValue: 'Every {n} focus rounds',
      autoBreaks: 'Auto-start breaks after focus',
      autoFocus: 'Auto-start next focus after break',
      sound: 'Play harmonic chime on completion',
      minTree: 'Sanctuary threshold',
      minTreeValue: '{n} min of focus plants a tree',

      desktop: 'Desktop Floating HUD',
      desktopHint: 'Frameless always-on-top widget outside DSH. Drag anywhere; closing it never interrupts the timer.',
      desktopRunning: 'Active on desktop',
      desktopStopped: 'Hidden',
      openWidget: 'Launch Desktop HUD',
      closeWidget: 'Close HUD',
      alwaysOnTop: 'Always on top',
      theme: 'Appearance',
      themeHint: 'Follow Host syncs light/dark mode from the DSH sidebar automatically.',
      themeAuto: 'Follow Host',
      themeLight: 'Daylight',
      themeDark: 'Midnight',
      desktopToggle: 'Widget Status',
      widgetSize: 'Widget Form Factor',
      viewCard: 'Dynamic Capsule',
      viewCardHint: '220×84 · Ring + Clock + Dots',
      viewRing: 'Aurora Orb',
      viewRingHint: '104×104 · Glass radial progress',
      viewBare: 'Minimal HUD',
      viewBareHint: '128×56 · Digits + laser bar',
      opacity: 'Window Opacity',
      opacityHint: 'Adjust widget translucency (30%–100%)',
      autoShow: 'Auto-open on focus',
      autoShowHint: 'Automatically show the desktop widget when focus starts',
      windowMissing: 'No local Electron runtime detected; running in sidebar mode.',
      windowError: 'Widget: {message}',
      saved: 'Save Settings',
      loading: 'Synchronizing Flow Studio…',
      hostDown: 'Pomodoro host service is offline. Reload the plugin or restart DSH.',
      retry: 'Retry',
      testChime: 'Preview Chime',
      openInBrowser: 'Preview widget in browser (/pomodoro/widget)',
      footer: 'All timer states, tasks and sanctuary data stay locally on your machine.',

      todayOverview: 'Today’s 24-Hour Energy Rhythm',
      bestHour: 'Peak Hour',
      bestHourValue: '{h}:00 – {h2}:00',
      noBestHour: 'Finish a focus session today to reveal your peak rhythm.',
      hourlyHint: 'Bar height shows focus time invested during each hour.',
      weekTrendTitle: '7-Day Focus Trend',
      weekAvgLabel: 'Daily avg {duration}',
      rhythmPersonaTitle: 'Chronotype & Rhythm',
      periodMorning: 'Dawn (05–12h)',
      periodAfternoon: 'Afternoon (12–18h)',
      periodEvening: 'Twilight (18–23h)',
      periodNight: 'Night Owl (23–05h)',
      personaMorning: 'Early Riser',
      personaAfternoon: 'Afternoon Diver',
      personaEvening: 'Twilight Flow',
      personaNight: 'Night Navigator',
      personaNone: 'Calibrating',
      timelineTitle: 'Focus Timeline & Reflections',
      timelineEmpty: 'No focus sessions recorded yet.',
      timelineAll: 'Latest 40 sessions',
      editNote: 'Add Note',
      saveNote: 'Save',
      taskUnassigned: 'Free Focus',
      heatmapTitle: 'Annual Focus Heatmap',
      heatmapHint: 'Each square is a day — brighter cells mark deeper focus days.',
      heatmapTotal: '{duration} this year',
      heatmapDays: '{n} active days',
      less: 'Less',
      more: 'More',
      taskBreakdown: 'Top Tasks (Last 7 Days)',
      taskEmpty: 'No task-bound sessions in the last 7 days.',
      untracked: 'Free Focus (Unassigned)',
      avgSession: 'Avg Session',
      longestSession: 'Longest Session',
      totalSessions: 'Total Sessions',
      completionRate: 'Completion Rate',

      forestTitle: 'Focus Sanctuary Terrarium',
      forestLead: 'Every qualifying focus session grows a living specimen in your sanctuary.',
      treesPlanted: 'Sanctuary Size',
      treesValue: '{n} trees',
      nextTree: 'Next Discovery',
      nextTreeValue: '{n} more trees to unlock {name}',
      forestTotal: '{duration} total focus',
      speciesTitle: 'Botanical Codex',
      speciesLocked: '{n} more to unlock',
      speciesUnlocked: 'Unlocked',
      forestEmpty: 'Your sanctuary awaits. Complete a focus session of {n}+ min to sprout your first tree.',
      treeMinutes: '{n} min focus',
      plantedAt: '{date}',
      forestAll: '{u} / {total} species unlocked',

      settingsBackup: 'Cloud Sync & Backup',
      backupHint: 'Sync via WebDAV (Nextcloud/Nutstore) or S3-compatible storage (R2/MinIO/AWS). Includes tasks, sessions & sanctuary.',
      backupNone: 'Local Only',
      backupWebdav: 'WebDAV',
      backupS3: 'S3 Storage',
      webdavUrl: 'Server URL',
      webdavUrlHint: 'e.g. https://dav.jianguoyun.com/dav',
      webdavUser: 'Username',
      webdavPassword: 'App Password',
      webdavSecretSaved: 'Saved — leave blank to keep existing',
      webdavPath: 'Remote Path',
      s3Endpoint: 'Endpoint',
      s3Region: 'Region',
      s3Bucket: 'Bucket',
      s3AccessKey: 'Access Key',
      s3SecretKey: 'Secret Key',
      s3Prefix: 'Key Prefix',
      autoBackup: 'Auto-backup after every completed session',
      backupNow: 'Backup Now',
      backupSaved: 'Backup settings saved',
      backupDone: 'Cloud backup complete',
      backupFailed: 'Backup failed: {message}',
      backupLast: 'Last synced: {time}',
      backupNever: 'Never backed up',
      exportData: 'Export JSON',
      importData: 'Import JSON',
      importDone: 'Import complete',
      importFailed: 'Import failed: {message}',
      importWarning: 'Importing a backup replaces local tasks, sessions and sanctuary data.',
      forceBackup: 'Syncing…',

      manageTasks: 'Task Library & Archive',
      manageHint: 'Archived tasks are hidden from the active queue while keeping all historical stats.',
      archive: 'Archive',
      restore: 'Restore',
      remove: 'Delete',
      confirmRemove: 'Delete this task permanently? Past focus sessions will remain intact.',
      noTasks: 'No tasks in library yet.',
      activeTasksHeader: 'Active Tasks',
      archivedTasksHeader: 'Archived Tasks',
      completionSound: 'Play harmonic chime on completion',
      previewSound: 'Preview Chime',
      localSnapshot: 'Local Data Snapshot',
      localSnapshotHint: 'Export or restore full JSON backup',
      filterTasks: '🔍 Filter tasks…',
      cyclePriority: 'Click to cycle priority',
    };

    // Flow Studio's phase accents are artwork; neutral controls use host theme tokens.
    const APPEARANCE = {
      focus: { accent: '#f05a48', accent2: '#ff8566', soft: 'rgba(240, 90, 72, 0.13)', glow: 'rgba(240, 90, 72, 0.25)' },
      flow:  { accent: '#8b5cf6', accent2: '#b18cfe', soft: 'rgba(139, 92, 246, 0.14)', glow: 'rgba(139, 92, 246, 0.28)' },
      short: { accent: '#10b981', accent2: '#34d399', soft: 'rgba(16, 185, 129, 0.13)', glow: 'rgba(16, 185, 129, 0.24)' },
      long:  { accent: '#3b82f6', accent2: '#60a5fa', soft: 'rgba(59, 130, 246, 0.13)', glow: 'rgba(59, 130, 246, 0.24)' },
    };

    function getThemePalette(mode, direction) {
      if (mode === 'focus' && direction === 'flow') return APPEARANCE.flow;
      return APPEARANCE[mode] || APPEARANCE.focus;
    }

    const css = `
.pomo-shell {
  --pomo-radius: 20px;
  --pomo-radius-sm: 13px;
  min-height: 100%;
  background:
    radial-gradient(960px 440px at 32% -120px, var(--pomo-soft, transparent), transparent 72%),
    radial-gradient(680px 380px at 85% 40px, color-mix(in srgb, var(--pomo-soft, transparent) 55%, transparent), transparent 70%);
  color: var(--dsw-alias-label-primary);
  font-family: "Segoe UI Variable Display", "Segoe UI", "PingFang SC", system-ui, sans-serif;
}

.pomo-nav {
  position: sticky; top: 0; z-index: 10;
  display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 14px;
  padding: 11px 28px;
  backdrop-filter: blur(18px);
  background: color-mix(in srgb, var(--dsw-alias-bg-base) 80%, transparent);
  border-bottom: 1px solid var(--dsw-alias-border-l1);
}
.pomo-brand { display: flex; align-items: center; gap: 11px; min-width: 0; }
.pomo-brand-mark {
  width: 32px; height: 32px; border-radius: 10px; flex: none;
  display: inline-flex; align-items: center; justify-content: center;
  color: var(--dsw-alias-bg-base);
  background: linear-gradient(135deg, var(--pomo-accent-2, var(--pomo-accent)), var(--pomo-accent));
  box-shadow: 0 4px 14px var(--pomo-glow, color-mix(in srgb, var(--dsw-alias-border-l2) 45%, transparent));
}
.pomo-brand-meta { display: flex; flex-direction: column; gap: 1px; min-width: 0; }
.pomo-brand-meta b { font-size: 13.5px; font-weight: 650; white-space: nowrap; }
.pomo-brand-meta span { font-size: 11px; color: var(--dsw-alias-label-secondary); white-space: nowrap; }

.pomo-tabs {
  display: inline-flex; gap: 3px; padding: 3.5px; border-radius: 999px;
  background: var(--dsw-alias-bg-layer-1);
  border: 1px solid var(--dsw-alias-border-l1);
}
.pomo-tab {
  appearance: none; border: 0; background: transparent;
  color: var(--dsw-alias-label-secondary);
  font-size: 12.5px; font-weight: 550; padding: 6.5px 15px; border-radius: 999px;
  cursor: pointer; display: inline-flex; align-items: center; gap: 6px;
  transition: all .16s ease;
}
.pomo-tab:hover { color: var(--dsw-alias-label-primary); }
.pomo-tab[data-on="true"] {
  color: var(--dsw-alias-bg-base);
  background: linear-gradient(135deg, var(--pomo-accent-2, var(--pomo-accent)), var(--pomo-accent));
  font-weight: 600;
  box-shadow: 0 2px 10px var(--pomo-glow, color-mix(in srgb, var(--dsw-alias-border-l2) 45%, transparent));
}

.pomo-nav-end { display: flex; align-items: center; justify-content: flex-end; gap: 8px; }
.pomo-pill-btn {
  appearance: none; border: 1px solid var(--dsw-alias-border-l1);
  background: var(--dsw-alias-bg-layer-1); color: var(--dsw-alias-label-secondary);
  font-size: 11.5px; font-weight: 550; padding: 5px 11px; border-radius: 999px;
  cursor: pointer; display: inline-flex; align-items: center; gap: 6px;
  transition: all .15s ease;
}
.pomo-pill-btn:hover { color: var(--dsw-alias-label-primary); border-color: var(--dsw-alias-border-l2); }
.pomo-pill-btn[data-active="true"] {
  border-color: color-mix(in srgb, var(--pomo-accent) 50%, transparent);
  background: var(--pomo-soft);
  color: var(--pomo-accent);
}

.pomo-eq { display: inline-flex; align-items: flex-end; gap: 2px; height: 11px; }
.pomo-eq i { width: 2px; border-radius: 1px; background: currentColor; height: 3px; transition: height .15s; }
.pomo-eq[data-on="true"] i:nth-child(1) { animation: pomo-eq-bar 0.7s ease-in-out infinite; }
.pomo-eq[data-on="true"] i:nth-child(2) { animation: pomo-eq-bar 0.55s ease-in-out 0.15s infinite; }
.pomo-eq[data-on="true"] i:nth-child(3) { animation: pomo-eq-bar 0.8s ease-in-out 0.3s infinite; }
@keyframes pomo-eq-bar { 0%, 100% { height: 3px; } 50% { height: 11px; } }

.pomo-banner-wrap { padding: 14px 28px 0; max-width: 1180px; margin: 0 auto; }
.pomo-page {
  display: flex; flex-direction: column; gap: 18px;
  padding: 24px 28px 48px; max-width: 1180px; margin: 0 auto;
}
.pomo-cockpit {
  display: grid;
  grid-template-columns: minmax(380px, 5fr) minmax(380px, 6.5fr);
  gap: 18px;
  align-items: start;
}
.pomo-bento-stack { display: flex; flex-direction: column; gap: 16px; }

.pomo-stage {
  position: relative;
  display: flex; flex-direction: column; align-items: center; gap: 18px;
  padding: 24px 22px 22px;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 26px;
  background:
    radial-gradient(360px 260px at 50% 36%, var(--pomo-soft), transparent 75%),
    linear-gradient(180deg, color-mix(in srgb, var(--pomo-soft) 45%, var(--dsw-alias-bg-layer-1)), var(--dsw-alias-bg-layer-1) 68%);
  overflow: hidden;
}
.pomo-stage-top {
  width: 100%; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px;
}
.pomo-presets {
  display: flex; flex-wrap: wrap; gap: 6px; justify-content: center;
}
.pomo-preset-chip {
  appearance: none; border: 1px solid var(--dsw-alias-border-l1);
  background: color-mix(in srgb, var(--dsw-alias-bg-base) 70%, transparent);
  color: var(--dsw-alias-label-secondary);
  font-size: 11px; font-weight: 550; padding: 4px 10px; border-radius: 999px;
  cursor: pointer; transition: all .14s;
}
.pomo-preset-chip:hover { color: var(--dsw-alias-label-primary); border-color: var(--dsw-alias-border-l2); }
.pomo-preset-chip[data-on="true"] {
  border-color: var(--pomo-accent);
  color: var(--pomo-accent);
  background: var(--pomo-soft);
  font-weight: 600;
}

.pomo-ring { position: relative; width: min(100%, 306px); aspect-ratio: 1; }
.pomo-ring svg { width: 100%; height: 100%; overflow: visible; }
.pomo-ring circle { fill: none; }
.pomo-ring .aura {
  stroke: var(--pomo-accent); stroke-width: 1.2; opacity: 0.16;
  stroke-dasharray: 4 6;
}
.pomo-ring[data-running="true"] .aura {
  animation: pomo-spin 36s linear infinite;
  transform-origin: 140px 140px;
}
@keyframes pomo-spin { to { transform: rotate(360deg); } }
.pomo-ring .track { stroke: color-mix(in srgb, var(--dsw-alias-label-secondary) 14%, transparent); }
.pomo-ring .bar { stroke: var(--pomo-accent); stroke-linecap: round; transition: stroke-dashoffset .3s linear, stroke .25s; }
.pomo-ring .knob { fill: var(--dsw-alias-bg-base); stroke: var(--pomo-accent); stroke-width: 3.5; }
.pomo-ring .tick { stroke: color-mix(in srgb, var(--dsw-alias-label-secondary) 24%, transparent); stroke-width: 1.4; stroke-linecap: round; }
.pomo-ring .tick[data-major="true"] { stroke-width: 2; stroke: color-mix(in srgb, var(--dsw-alias-label-secondary) 44%, transparent); }
.pomo-ring .tick[data-done="true"] { stroke: var(--pomo-accent); }
.pomo-ring[data-running="true"] .knob { animation: pomo-breathe 2s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
@keyframes pomo-breathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.32); } }

.pomo-ring-inner {
  position: absolute; inset: 0;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 6px; padding: 0 16%; text-align: center;
}
.pomo-dir-tag {
  font-size: 10.5px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase;
  padding: 2.5px 9px; border-radius: 999px;
  background: var(--pomo-soft); color: var(--pomo-accent);
}
.pomo-clock {
  font-family: "Cascadia Mono", "JetBrains Mono", "SF Mono", ui-monospace, monospace;
  font-variant-numeric: tabular-nums;
  font-size: 56px; font-weight: 650; letter-spacing: -.04em; line-height: 1.02;
}
.pomo-phase {
  font-size: 12.5px; font-weight: 550; color: var(--dsw-alias-label-secondary);
  max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.pomo-dots { display: flex; gap: 6px; margin-top: 2px; }
.pomo-dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: color-mix(in srgb, var(--dsw-alias-label-secondary) 25%, transparent);
  transition: all .2s;
}
.pomo-dot[data-on="true"] { background: var(--pomo-accent); transform: scale(1.15); }

.pomo-transport { display: flex; align-items: center; gap: 20px; }
.pomo-play {
  appearance: none; border: 0; width: 70px; height: 70px; border-radius: 50%;
  background: linear-gradient(145deg, var(--pomo-accent-2, var(--pomo-accent)), var(--pomo-accent));
  color: var(--dsw-alias-bg-base);
  box-shadow: 0 8px 24px var(--pomo-glow, color-mix(in srgb, var(--dsw-alias-border-l2) 55%, transparent));
  display: inline-flex; align-items: center; justify-content: center;
  cursor: pointer; transition: transform .14s ease, filter .15s;
}
.pomo-play:hover { filter: brightness(1.08); transform: scale(1.05); }
.pomo-play:active { transform: scale(.95); }
.pomo-round-btn {
  appearance: none; width: 44px; height: 44px; border-radius: 50%;
  border: 1px solid var(--dsw-alias-border-l1);
  background: var(--dsw-alias-bg-base); color: var(--dsw-alias-label-secondary);
  display: inline-flex; align-items: center; justify-content: center;
  cursor: pointer; transition: all .15s;
}
.pomo-round-btn:hover { color: var(--dsw-alias-label-primary); border-color: var(--dsw-alias-border-l2); transform: translateY(-1px); }
.pomo-round-btn[disabled] { opacity: .35; cursor: not-allowed; transform: none; }

.pomo-finish-panel {
  width: 100%; border-radius: 16px; padding: 12px 14px;
  border: 1px solid color-mix(in srgb, var(--pomo-accent) 30%, var(--dsw-alias-border-l1));
  background: color-mix(in srgb, var(--dsw-alias-bg-base) 82%, var(--pomo-soft));
  display: flex; flex-direction: column; gap: 9px;
}
.pomo-energy-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; flex-wrap: wrap; }
.pomo-energy-row > span { font-size: 11.5px; font-weight: 600; color: var(--dsw-alias-label-secondary); }
.pomo-energy-pills { display: flex; gap: 4px; }
.pomo-energy-pill {
  appearance: none; border: 1px solid var(--dsw-alias-border-l1);
  background: var(--dsw-alias-bg-layer-1); color: var(--dsw-alias-label-secondary);
  font-size: 11px; padding: 3px 8px; border-radius: 999px; cursor: pointer;
}
.pomo-energy-pill[data-on="true"] {
  border-color: var(--pomo-accent); background: var(--pomo-soft); color: var(--pomo-accent); font-weight: 600;
}
.pomo-finish-bar { display: flex; gap: 8px; align-items: center; }
.pomo-finish-input {
  flex: 1; min-width: 0; border: 1px solid var(--dsw-alias-border-l1); border-radius: 10px;
  background: var(--dsw-alias-bg-layer-1); color: var(--dsw-alias-label-primary);
  font-size: 12px; padding: 7px 10px;
}
.pomo-finish-input:focus { outline: none; border-color: var(--pomo-accent); }

.pomo-card {
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: var(--pomo-radius);
  background: var(--dsw-alias-bg-layer-1);
  padding: 18px 20px;
  display: flex; flex-direction: column; gap: 13px;
}
.pomo-card-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.pomo-card h3 { margin: 0; font-size: 14px; font-weight: 650; display: flex; align-items: center; gap: 7px; }
.pomo-card p { margin: 0; font-size: 12px; color: var(--dsw-alias-label-secondary); line-height: 1.5; }

.pomo-pulse-grid {
  display: grid; grid-template-columns: auto 1fr; gap: 16px; align-items: center;
}
.pomo-goal-ring {
  position: relative; width: 84px; height: 84px; flex: none;
  display: flex; align-items: center; justify-content: center;
}
.pomo-goal-ring svg { width: 100%; height: 100%; transform: rotate(-90deg); }
.pomo-goal-ring circle { fill: none; stroke-linecap: round; }
.pomo-goal-ring .g-track { stroke: color-mix(in srgb, var(--dsw-alias-label-secondary) 16%, transparent); stroke-width: 8; }
.pomo-goal-ring .g-fill { stroke: var(--pomo-accent); stroke-width: 8; transition: stroke-dashoffset .35s ease; }
.pomo-goal-ring-label {
  position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center;
  text-align: center;
}
.pomo-goal-ring-label b { font-size: 16px; font-weight: 700; font-variant-numeric: tabular-nums; line-height: 1.1; }
.pomo-goal-ring-label span { font-size: 9.5px; color: var(--dsw-alias-label-secondary); }

.pomo-mini-kpis {
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;
}
.pomo-mini-kpi {
  padding: 9px 12px; border-radius: 12px;
  background: var(--dsw-alias-bg-base);
  border: 1px solid var(--dsw-alias-border-l1);
  display: flex; flex-direction: column; gap: 2px;
}
.pomo-mini-kpi span { font-size: 11px; color: var(--dsw-alias-label-secondary); }
.pomo-mini-kpi b { font-size: 16px; font-weight: 650; font-variant-numeric: tabular-nums; }

.pomo-active-task-box {
  padding: 13px 15px; border-radius: 14px;
  border: 1px solid color-mix(in srgb, var(--pomo-accent) 38%, var(--dsw-alias-border-l1));
  background: linear-gradient(135deg, var(--pomo-soft), color-mix(in srgb, var(--dsw-alias-bg-base) 85%, transparent));
  display: flex; flex-direction: column; gap: 10px;
}
.pomo-prio-badge {
  font-size: 10px; font-weight: 650; padding: 2px 7px; border-radius: 999px;
}
.pomo-prio-badge[data-prio="high"] { background: color-mix(in srgb, var(--dsw-alias-state-error-primary) 15%, transparent); color: var(--dsw-alias-state-error-primary); }
.pomo-prio-badge[data-prio="medium"] { background: color-mix(in srgb, var(--dsw-alias-state-warn-primary) 15%, transparent); color: var(--dsw-alias-state-warn-primary); }
.pomo-prio-badge[data-prio="low"] { background: color-mix(in srgb, var(--dsw-alias-state-success-primary) 14%, transparent); color: var(--dsw-alias-state-success-primary); }

.pomo-subtasks { display: flex; flex-direction: column; gap: 5px; }
.pomo-subtask-row {
  display: flex; align-items: center; gap: 8px; padding: 5px 8px; border-radius: 8px;
  background: color-mix(in srgb, var(--dsw-alias-bg-base) 75%, transparent);
  font-size: 12px;
}
.pomo-subtask-check {
  appearance: none; width: 16px; height: 16px; border-radius: 5px;
  border: 1.5px solid var(--dsw-alias-border-l2);
  background: transparent; cursor: pointer; flex: none;
  display: inline-flex; align-items: center; justify-content: center; color: var(--dsw-alias-bg-base);
}
.pomo-subtask-check[data-done="true"] {
  background: var(--pomo-accent); border-color: var(--pomo-accent);
}
.pomo-subtask-title { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.pomo-subtask-title[data-done="true"] { text-decoration: line-through; color: var(--dsw-alias-label-secondary); }

.pomo-task-list { display: flex; flex-direction: column; gap: 6px; max-height: 210px; overflow-y: auto; }
.pomo-task-item {
  display: flex; align-items: center; justify-content: space-between; gap: 10px;
  padding: 8px 11px; border-radius: 11px;
  border: 1px solid var(--dsw-alias-border-l1);
  background: var(--dsw-alias-bg-base);
  cursor: pointer; transition: all .14s;
}
.pomo-task-item:hover { border-color: var(--dsw-alias-border-l2); }
.pomo-task-item[data-on="true"] {
  border-color: var(--pomo-accent);
  background: color-mix(in srgb, var(--pomo-soft) 50%, var(--dsw-alias-bg-base));
}
.pomo-task-item-left { display: flex; align-items: center; gap: 8px; min-width: 0; flex: 1; }
.pomo-task-item-name { font-size: 12.5px; font-weight: 550; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.pomo-task-item-meta { display: flex; align-items: center; gap: 6px; font-size: 11px; color: var(--dsw-alias-label-secondary); flex: none; font-variant-numeric: tabular-nums; }
.pomo-task-quick-actions { display: inline-flex; align-items: center; gap: 3px; margin-left: 2px; }
.pomo-task-quick-btn {
  appearance: none; border: 0; background: transparent;
  color: var(--dsw-alias-label-secondary);
  width: 22px; height: 22px; border-radius: 6px;
  display: inline-flex; align-items: center; justify-content: center;
  cursor: pointer; opacity: 0.65; transition: all .14s ease;
}
.pomo-task-item:hover .pomo-task-quick-btn,
.pomo-active-task-box .pomo-task-quick-btn { opacity: 1; }
.pomo-task-quick-btn:hover {
  background: color-mix(in srgb, var(--dsw-alias-label-secondary) 14%, transparent);
  color: var(--dsw-alias-label-primary);
}
.pomo-task-quick-btn.danger:hover {
  background: color-mix(in srgb, var(--dsw-alias-state-error-primary) 14%, transparent);
  color: var(--dsw-alias-state-error-primary);
}

.pomo-mixer-channels { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
.pomo-channel {
  padding: 10px 12px; border-radius: 12px;
  border: 1px solid var(--dsw-alias-border-l1);
  background: var(--dsw-alias-bg-base);
  display: flex; flex-direction: column; gap: 7px;
}
.pomo-channel[data-active="true"] {
  border-color: color-mix(in srgb, var(--pomo-accent) 45%, var(--dsw-alias-border-l1));
  background: color-mix(in srgb, var(--pomo-soft) 35%, var(--dsw-alias-bg-base));
}
.pomo-channel-top { display: flex; align-items: center; justify-content: space-between; font-size: 12px; font-weight: 600; }
.pomo-channel-val { font-size: 11px; color: var(--dsw-alias-label-secondary); font-variant-numeric: tabular-nums; }

.pomo-seg {
  display: inline-flex; padding: 3px; gap: 2px; border-radius: 999px;
  background: color-mix(in srgb, var(--dsw-alias-label-secondary) 10%, transparent);
}
.pomo-seg button {
  appearance: none; border: 0; background: transparent;
  color: var(--dsw-alias-label-secondary);
  font-size: 12px; font-weight: 550; padding: 5.5px 13px; border-radius: 999px; cursor: pointer;
  white-space: nowrap;
  transition: all .14s;
}
.pomo-seg button[data-on="true"] {
  background: var(--dsw-alias-bg-base); color: var(--pomo-accent);
  font-weight: 650; box-shadow: 0 1px 3px color-mix(in srgb, var(--dsw-alias-border-l2) 40%, transparent);
}
.pomo-actions { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
.pomo-btn {
  appearance: none; border: 1px solid var(--dsw-alias-border-l1);
  background: var(--dsw-alias-bg-base); color: var(--dsw-alias-label-primary);
  border-radius: 999px; font-size: 12.5px; font-weight: 550; padding: 8px 15px;
  cursor: pointer; display: inline-flex; align-items: center; gap: 6px;
  white-space: nowrap; flex-shrink: 0; text-decoration: none;
  transition: all .14s;
}
.pomo-btn:hover { border-color: var(--dsw-alias-border-l2); }
.pomo-btn[disabled] { opacity: .45; cursor: not-allowed; }
.pomo-btn.primary {
  background: linear-gradient(135deg, var(--pomo-accent-2, var(--pomo-accent)), var(--pomo-accent));
  border-color: transparent; color: var(--dsw-alias-bg-base); font-weight: 600;
}
.pomo-btn.ghost { border-color: transparent; background: transparent; color: var(--dsw-alias-label-secondary); }
.pomo-btn.small { padding: 5.5px 12px; font-size: 11.5px; }

.pomo-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px; }
.pomo-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.pomo-row-label { display: flex; flex-direction: column; gap: 2px; }
.pomo-row-label b { font-size: 12.5px; font-weight: 550; }
.pomo-row-label span { font-size: 11px; color: var(--dsw-alias-label-secondary); }
.pomo-fields { display: grid; grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); gap: 10px; }
.pomo-field { display: flex; flex-direction: column; gap: 5px; }
.pomo-field label { font-size: 11px; color: var(--dsw-alias-label-secondary); }
.pomo-field .pomo-input { display: flex; align-items: center; gap: 6px; }
.pomo-input input, .pomo-input select {
  width: 100%; border: 1px solid var(--dsw-alias-border-l1); border-radius: 9px;
  background: var(--dsw-alias-bg-base); color: var(--dsw-alias-label-primary);
  font-size: 12.5px; padding: 6.5px 9px; font-variant-numeric: tabular-nums;
}
.pomo-input input:focus, .pomo-input select:focus { outline: 2px solid var(--pomo-soft); border-color: var(--pomo-accent); }
.pomo-input em { font-style: normal; font-size: 11px; color: var(--dsw-alias-label-secondary); white-space: nowrap; }

.pomo-switch {
  position: relative; width: 38px; height: 21px; border-radius: 999px; border: 0;
  background: var(--dsw-alias-border-l2); cursor: pointer; padding: 0; flex: none;
  transition: background .16s ease;
}
.pomo-switch::after {
  content: ''; position: absolute; top: 2px; left: 2px; width: 17px; height: 17px;
  border-radius: 50%; background: var(--dsw-alias-bg-base); transition: transform .16s ease;
  box-shadow: 0 1px 2px color-mix(in srgb, var(--dsw-alias-border-l2) 60%, transparent);
}
.pomo-switch[aria-checked="true"] { background: var(--pomo-accent); }
.pomo-switch[aria-checked="true"]::after { transform: translateX(17px); }

.pomo-range {
  -webkit-appearance: none; appearance: none; width: 100%; height: 4px; border-radius: 999px;
  background: color-mix(in srgb, var(--dsw-alias-label-secondary) 24%, transparent); outline: none;
}
.pomo-range::-webkit-slider-thumb {
  -webkit-appearance: none; width: 14px; height: 14px; border-radius: 50%;
  background: var(--pomo-accent); border: 2px solid var(--dsw-alias-bg-base); cursor: pointer;
}
.pomo-range-value { font-size: 11px; color: var(--dsw-alias-label-secondary); font-variant-numeric: tabular-nums; min-width: 34px; text-align: right; }

.pomo-badge {
  display: inline-flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 550;
  padding: 3px 9px; border-radius: 999px;
  background: var(--dsw-alias-bg-layer-2); color: var(--dsw-alias-label-secondary);
}
.pomo-pulse { width: 7px; height: 7px; border-radius: 50%; background: var(--dsw-alias-label-secondary); }
.pomo-pulse[data-on="true"] { background: var(--dsw-alias-state-success-primary); box-shadow: 0 0 0 3px color-mix(in srgb, var(--dsw-alias-state-success-primary) 18%, transparent); }

.pomo-banner {
  display: flex; gap: 8px; align-items: center; justify-content: space-between;
  font-size: 12.5px; border-radius: 12px; padding: 10px 14px;
  background: var(--pomo-soft); color: var(--pomo-accent); font-weight: 550;
}
.pomo-banner.error { background: color-mix(in srgb, var(--dsw-alias-state-error-primary) 12%, transparent); color: var(--dsw-alias-state-error-primary); }

.pomo-tiles { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px; }
.pomo-tile {
  border: 1px solid var(--dsw-alias-border-l1); border-radius: 16px;
  background: var(--dsw-alias-bg-layer-1); padding: 14px 16px;
  display: flex; flex-direction: column; gap: 3px;
}
.pomo-tile b { font-size: 22px; font-weight: 700; font-variant-numeric: tabular-nums; }
.pomo-tile span { font-size: 11.5px; color: var(--dsw-alias-label-secondary); }
.pomo-tile em { font-style: normal; font-size: 11px; color: var(--pomo-accent); font-weight: 550; }

.pomo-bars { display: flex; align-items: flex-end; gap: 4px; height: 112px; padding-top: 8px; }
.pomo-bars .col { flex: 1; display: flex; flex-direction: column; justify-content: flex-end; align-items: center; gap: 4px; height: 100%; }
.pomo-bars .fill {
  width: 100%; border-radius: 4px 4px 2px 2px;
  background: color-mix(in srgb, var(--pomo-accent) 45%, transparent);
  min-height: 2px; transition: height .22s ease;
}
.pomo-bars .col[data-best="true"] .fill { background: var(--pomo-accent); }
.pomo-bars .col[data-has="false"] .fill { background: color-mix(in srgb, var(--dsw-alias-label-secondary) 14%, transparent); }
.pomo-axis { display: flex; justify-content: space-between; font-size: 10px; color: var(--dsw-alias-label-secondary); font-variant-numeric: tabular-nums; }

.pomo-log { display: flex; flex-direction: column; max-height: 340px; overflow-y: auto; }
.pomo-log-row {
  display: flex; flex-direction: column; gap: 5px;
  padding: 9px 2px; border-bottom: 1px solid var(--dsw-alias-border-l1); font-size: 12px;
}
.pomo-log-row:last-child { border-bottom: 0; }
.pomo-log-main { display: grid; grid-template-columns: 96px 1fr auto; gap: 8px; align-items: center; }
.pomo-log-time { color: var(--dsw-alias-label-secondary); font-variant-numeric: tabular-nums; font-size: 11px; }
.pomo-log-task { display: flex; align-items: center; gap: 6px; min-width: 0; font-weight: 550; }
.pomo-log-task span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.pomo-log-dur { font-variant-numeric: tabular-nums; font-weight: 650; }
.pomo-log-note { font-size: 11px; color: var(--dsw-alias-label-secondary); padding-left: 104px; display: flex; align-items: center; gap: 8px; }

.pomo-heat { display: flex; gap: 4px; overflow-x: auto; padding-bottom: 4px; }
.pomo-heat .weeks { display: flex; gap: 3px; }
.pomo-heat .week { display: flex; flex-direction: column; gap: 3px; }
.pomo-heat .cell { width: 10.5px; height: 10.5px; border-radius: 2.5px; background: color-mix(in srgb, var(--dsw-alias-label-secondary) 14%, transparent); }
.pomo-heat .cell[data-level="1"] { background: color-mix(in srgb, var(--pomo-accent) 28%, transparent); }
.pomo-heat .cell[data-level="2"] { background: color-mix(in srgb, var(--pomo-accent) 52%, transparent); }
.pomo-heat .cell[data-level="3"] { background: color-mix(in srgb, var(--pomo-accent) 76%, transparent); }
.pomo-heat .cell[data-level="4"] { background: var(--pomo-accent); }
.pomo-heat-foot { display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: var(--dsw-alias-label-secondary); gap: 10px; flex-wrap: wrap; }
.pomo-legend { display: flex; align-items: center; gap: 3px; }

.pomo-taskbars { display: flex; flex-direction: column; gap: 9px; }
.pomo-taskbar { display: grid; grid-template-columns: minmax(90px, 170px) 1fr auto; gap: 10px; align-items: center; font-size: 12px; }
.pomo-taskbar .name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--dsw-alias-label-secondary); }
.pomo-taskbar .track { height: 8px; border-radius: 999px; background: var(--dsw-alias-bg-layer-2); overflow: hidden; }
.pomo-taskbar .fill { height: 100%; border-radius: 999px; background: linear-gradient(90deg, var(--pomo-accent), var(--pomo-accent-2, var(--pomo-accent))); }
.pomo-taskbar b { font-variant-numeric: tabular-nums; font-size: 11.5px; font-weight: 600; }

.pomo-terrarium {
  position: relative; border-radius: 22px; overflow: hidden;
  border: 1px solid color-mix(in srgb, #10b981 30%, var(--dsw-alias-border-l1));
  background:
    radial-gradient(520px 220px at 50% 0%, rgba(16, 185, 129, 0.18), transparent 75%),
    linear-gradient(180deg, color-mix(in srgb, #064e3b 18%, var(--dsw-alias-bg-layer-1)), var(--dsw-alias-bg-layer-1));
  padding: 22px;
  display: flex; flex-direction: column; gap: 16px;
}
.pomo-island-stage {
  display: flex; flex-wrap: wrap; gap: 12px; align-items: flex-end; justify-content: center;
  min-height: 128px; padding: 18px 16px 14px;
  border-radius: 16px;
  background: linear-gradient(180deg, transparent 55%, rgba(16, 185, 129, 0.09) 100%);
  border-bottom: 2px solid rgba(16, 185, 129, 0.28);
}
.pomo-specimen {
  display: flex; flex-direction: column; align-items: center; gap: 3px;
  transition: transform .18s ease; cursor: default;
}
.pomo-specimen:hover { transform: translateY(-4px) scale(1.08); }

.pomo-species { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 10px; }
.pomo-specie {
  border: 1px solid var(--dsw-alias-border-l1); border-radius: 14px; padding: 12px;
  display: flex; flex-direction: column; align-items: center; text-align: center; gap: 5px;
  background: var(--dsw-alias-bg-base);
}
.pomo-specie[data-locked="true"] { opacity: .45; filter: grayscale(0.85); }
.pomo-specie b { font-size: 12.5px; font-weight: 650; }
.pomo-specie span { font-size: 10.5px; color: var(--dsw-alias-label-secondary); }

.pomo-forest { display: grid; grid-template-columns: repeat(auto-fill, minmax(145px, 1fr)); gap: 10px; }
.pomo-tree {
  border: 1px solid var(--dsw-alias-border-l1); border-radius: 14px;
  background: var(--dsw-alias-bg-base);
  padding: 12px; display: flex; align-items: center; gap: 10px;
}
.pomo-tree-info { display: flex; flex-direction: column; gap: 2px; min-width: 0; flex: 1; }
.pomo-tree-info b { font-size: 12px; font-weight: 650; }
.pomo-tree-info span { font-size: 10.5px; color: var(--dsw-alias-label-secondary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.pomo-bento-prefs {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
  align-items: stretch;
}
.pomo-bento-prefs > .pomo-card {
  justify-content: flex-start;
}
.pomo-subgrid-2 {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}
.pomo-subbox {
  padding: 10px 12px;
  border-radius: 12px;
  background: var(--dsw-alias-bg-base);
  border: 1px solid var(--dsw-alias-border-l1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.pomo-hud-stage {
  position: relative; border-radius: 16px; overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--pomo-accent) 28%, var(--dsw-alias-border-l1));
  background:
    radial-gradient(420px 150px at 30% 20%, var(--pomo-soft), transparent 70%),
    linear-gradient(135deg, var(--dsw-alias-bg-base), var(--dsw-alias-bg-layer-1));
  padding: 14px 16px; min-height: 136px;
  display: flex; flex-direction: column; justify-content: space-between; gap: 10px;
}
.pomo-hud-stage-top { display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; z-index: 1; }
.pomo-hud-stage-title { display: flex; align-items: center; gap: 7px; color: var(--dsw-alias-label-primary); font-size: 12px; font-weight: 600; }
.pomo-hud-stage-center { display: flex; align-items: center; justify-content: center; padding: 4px 0; z-index: 1; }

/* Artwork previews represent the explicitly selected desktop HUD theme. */
.pomo-mockup-card {
  width: 220px; height: 84px; border-radius: 28px;
  background: linear-gradient(145deg, #222530, #171920 70%);
  border: 1px solid rgba(255,255,255,0.14);
  display: flex; align-items: center; gap: 13px; padding: 0 16px;
  color: #f5f6f8; transition: all .2s ease;
}
.pomo-hud-stage[data-stage-theme="light"] .pomo-mockup-card {
  background: linear-gradient(145deg, #ffffff, #f3f1ec 70%);
  border-color: rgba(20,20,26,0.12); color: #17181c;
}
.pomo-mockup-play {
  position: relative; width: 48px; height: 48px; flex: none;
  color: var(--pomo-accent);
  display: inline-flex; align-items: center; justify-content: center;
}
.pomo-mockup-ring {
  position: relative; width: 108px; height: 108px; flex: none;
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px;
  color: #f5f6f8; transition: all .2s ease;
}
.pomo-hud-stage[data-stage-theme="light"] .pomo-mockup-ring {
  color: #17181c;
}
.pomo-mockup-ring svg {
  position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none;
}
.pomo-mockup-bare {
  width: 128px; height: 56px;
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 5px;
  transition: all .2s ease;
}

.pomo-preset-cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
.pomo-preset-card {
  border: 1px solid var(--dsw-alias-border-l1); border-radius: 14px;
  background: var(--dsw-alias-bg-base); padding: 12px;
  display: flex; flex-direction: column; gap: 4px; cursor: pointer; text-align: left; color: inherit;
  transition: all .15s;
}
.pomo-preset-card:hover { border-color: var(--dsw-alias-border-l2); }
.pomo-preset-card[data-on="true"] {
  border-color: var(--pomo-accent);
  background: color-mix(in srgb, var(--pomo-soft) 45%, var(--dsw-alias-bg-base));
  box-shadow: 0 0 0 1px var(--pomo-accent) inset;
}
.pomo-preset-card b { font-size: 12.5px; font-weight: 650; }
.pomo-preset-card span { font-size: 11px; color: var(--dsw-alias-label-secondary); font-variant-numeric: tabular-nums; }

.pomo-stepper-list { display: flex; flex-direction: column; gap: 10px; }
.pomo-stepper-row {
  display: flex; align-items: center; justify-content: space-between; gap: 10px;
  padding: 8px 12px; border-radius: 12px;
  background: var(--dsw-alias-bg-base); border: 1px solid var(--dsw-alias-border-l1);
}
.pomo-stepper-row .pomo-row-label b { white-space: nowrap; }
.pomo-stepper-ctrl {
  display: inline-flex; align-items: center; height: 30px; padding: 2px; gap: 2px;
  border-radius: 9px; border: 1px solid var(--dsw-alias-border-l1);
  background: var(--dsw-alias-bg-layer-1); flex: none;
}
.pomo-stepper-ctrl:focus-within {
  border-color: var(--pomo-accent);
  box-shadow: 0 0 0 2px var(--pomo-soft);
}
.pomo-step-btn {
  appearance: none; width: 24px; height: 24px; border-radius: 6px;
  border: 0; background: transparent; color: var(--dsw-alias-label-secondary);
  font-size: 14px; font-weight: 600; line-height: 1; cursor: pointer;
  display: inline-flex; align-items: center; justify-content: center;
  transition: all .14s ease;
}
.pomo-step-btn:hover {
  background: var(--pomo-soft);
  color: var(--pomo-accent);
}
.pomo-step-val {
  display: inline-flex; align-items: baseline; justify-content: center;
  min-width: 52px; padding: 0 4px; gap: 1px;
}
.pomo-step-input {
  width: 34px; border: 0; background: transparent;
  color: var(--dsw-alias-label-primary);
  font-size: 13px; font-weight: 650; text-align: right;
  font-variant-numeric: tabular-nums; padding: 0; outline: none;
  -moz-appearance: textfield;
}
.pomo-step-input::-webkit-outer-spin-button,
.pomo-step-input::-webkit-inner-spin-button {
  -webkit-appearance: none; margin: 0;
}
.pomo-step-unit {
  font-size: 11px; font-weight: 550; color: var(--dsw-alias-label-secondary);
  user-select: none;
}

.pomo-action-card {
  border: 1px solid var(--dsw-alias-border-l1); border-radius: 14px;
  background: var(--dsw-alias-bg-base); padding: 14px 16px;
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
}

.pomo-views { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.pomo-view {
  border: 1px solid var(--dsw-alias-border-l1); border-radius: 14px;
  background: var(--dsw-alias-bg-base); padding: 12px;
  display: flex; flex-direction: column; gap: 6px; cursor: pointer; text-align: left; color: inherit;
  transition: all .15s;
}
.pomo-view[data-on="true"] { border-color: var(--pomo-accent); box-shadow: 0 0 0 1px var(--pomo-accent) inset; background: color-mix(in srgb, var(--pomo-soft) 35%, var(--dsw-alias-bg-base)); }
.pomo-view b { font-size: 12.5px; }
.pomo-view span { font-size: 10.5px; color: var(--dsw-alias-label-secondary); }
.pomo-view .preview {
  height: 42px; border-radius: 9px;
  background: color-mix(in srgb, var(--dsw-alias-label-secondary) 8%, transparent);
  display: flex; align-items: center; justify-content: center;
  font-family: "Cascadia Mono", ui-monospace, monospace; font-size: 11px; font-weight: 600;
}
.pomo-view .preview[data-preview="card"] {
  width: 88px; height: 34px; margin: 0 auto; border-radius: 99px;
  border: 1px solid var(--dsw-alias-border-l2); background: var(--dsw-alias-bg-layer-1); gap: 5px;
}
.pomo-view .preview[data-preview="ring"] {
  position: relative; width: 42px; height: 42px; margin: 0 auto;
  background: transparent; border: 0; font-size: 9px;
}
.pomo-view .preview[data-preview="bare"] {
  background: none; font-size: 16px; color: var(--pomo-accent);
  border-bottom: 2px solid var(--pomo-accent); border-radius: 0; width: 64px; margin: 0 auto;
}

.pomo-empty {
  border: 1px dashed var(--dsw-alias-border-l2); border-radius: 14px;
  padding: 22px 18px; text-align: center; color: var(--dsw-alias-label-secondary); font-size: 12px; line-height: 1.6;
}
.pomo-foot { display: flex; justify-content: space-between; gap: 12px; flex-wrap: wrap; font-size: 11.5px; color: var(--dsw-alias-label-secondary); }
.pomo-link { color: var(--pomo-accent); text-decoration: none; }
.pomo-link:hover { text-decoration: underline; }
.pomo-loading { padding: 60px 20px; text-align: center; color: var(--dsw-alias-label-secondary); font-size: 13px; }

@media (max-width: 880px) {
  .pomo-cockpit, .pomo-bento-prefs, .pomo-subgrid-2 { grid-template-columns: 1fr; }
  .pomo-preset-cards { grid-template-columns: repeat(2, 1fr); }
  .pomo-page { padding: 18px 16px 32px; }
  .pomo-nav { grid-template-columns: auto 1fr; padding: 10px 14px; }
  .pomo-brand-meta, .pomo-nav-end, .pomo-tab span { display: none; }
  .pomo-tabs { justify-self: end; }
  .pomo-views, .pomo-mixer-channels { grid-template-columns: 1fr; }
}
`;

    const Soundscape = {
      ctx: null,
      nodes: {},
      volumes: { rain: 0, campfire: 0, ocean: 0, binaural: 0 },
      muted: false,

      ensureCtx() {
        const AudioCtor = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtor) return null;
        if (!this.ctx) this.ctx = new AudioCtor();
        if (this.ctx.state === 'suspended') void this.ctx.resume();
        return this.ctx;
      },

      createNoiseBuffer(ctx, kind) {
        const length = ctx.sampleRate * 3;
        const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        if (kind === 'pink') {
          let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
          for (let i = 0; i < length; i++) {
            const white = Math.random() * 2 - 1;
            b0 = 0.99886 * b0 + white * 0.0555179;
            b1 = 0.99332 * b1 + white * 0.0750759;
            b2 = 0.96900 * b2 + white * 0.1538520;
            b3 = 0.86650 * b3 + white * 0.3104856;
            b4 = 0.55000 * b4 + white * 0.5329522;
            b5 = -0.7616 * b5 - white * 0.0168980;
            data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
            b6 = white * 0.115926;
          }
        } else {
          let last = 0;
          for (let i = 0; i < length; i++) {
            const white = Math.random() * 2 - 1;
            last = (last + 0.02 * white) / 1.02;
            const crackle = kind === 'campfire' && Math.random() < 0.0018 ? (Math.random() * 1.4 - 0.7) : 0;
            data[i] = last * 1.8 + crackle;
          }
        }
        return buffer;
      },

      ensureChannel(id) {
        const ctx = this.ensureCtx();
        if (!ctx) return null;
        if (this.nodes[id]) return this.nodes[id];

        const master = ctx.createGain();
        master.gain.value = 0;
        master.connect(ctx.destination);

        if (id === 'rain') {
          const src = ctx.createBufferSource();
          src.buffer = this.createNoiseBuffer(ctx, 'pink');
          src.loop = true;
          const filter = ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.value = 1350;
          src.connect(filter).connect(master);
          src.start();
          this.nodes[id] = { master, stop: () => src.stop() };
        } else if (id === 'campfire') {
          const src = ctx.createBufferSource();
          src.buffer = this.createNoiseBuffer(ctx, 'campfire');
          src.loop = true;
          const filter = ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.value = 620;
          src.connect(filter).connect(master);
          src.start();
          this.nodes[id] = { master, stop: () => src.stop() };
        } else if (id === 'ocean') {
          const src = ctx.createBufferSource();
          src.buffer = this.createNoiseBuffer(ctx, 'brown');
          src.loop = true;
          const filter = ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.value = 380;
          const lfo = ctx.createOscillator();
          const lfoGain = ctx.createGain();
          lfo.frequency.value = 0.12;
          lfoGain.gain.value = 260;
          lfo.connect(lfoGain).connect(filter.frequency);
          src.connect(filter).connect(master);
          src.start();
          lfo.start();
          this.nodes[id] = { master, stop: () => { src.stop(); lfo.stop(); } };
        } else if (id === 'binaural') {
          const oscL = ctx.createOscillator();
          const oscR = ctx.createOscillator();
          oscL.type = 'sine';
          oscR.type = 'sine';
          oscL.frequency.value = 200;
          oscR.frequency.value = 210;
          const merger = ctx.createChannelMerger(2);
          oscL.connect(merger, 0, 0);
          oscR.connect(merger, 0, 1);
          const subGain = ctx.createGain();
          subGain.gain.value = 0.25;
          merger.connect(subGain).connect(master);
          oscL.start();
          oscR.start();
          this.nodes[id] = { master, stop: () => { oscL.stop(); oscR.stop(); } };
        }
        return this.nodes[id];
      },

      setChannelVolume(id, value) {
        const clamped = Math.min(1, Math.max(0, Number(value) || 0));
        this.volumes[id] = clamped;
        this.syncGains();
      },

      setScene(scene) {
        const presets = {
          none:  { rain: 0, campfire: 0, ocean: 0, binaural: 0 },
          study: { rain: 0.65, campfire: 0.25, ocean: 0, binaural: 0 },
          camp:  { rain: 0, campfire: 0.75, ocean: 0.15, binaural: 0 },
          zen:   { rain: 0, campfire: 0, ocean: 0.7, binaural: 0.25 },
          brain: { rain: 0.25, campfire: 0, ocean: 0, binaural: 0.6 },
        };
        const target = presets[scene] || presets.none;
        Object.keys(target).forEach((k) => { this.volumes[k] = target[k]; });
        this.muted = false;
        this.syncGains();
      },

      setMuted(flag) {
        this.muted = Boolean(flag);
        this.syncGains();
      },

      isActive() {
        return !this.muted && Object.values(this.volumes).some((v) => v > 0.01);
      },

      hasAnyVolume() {
        return Object.values(this.volumes).some((v) => v > 0.01);
      },

      syncGains() {
        Object.keys(this.volumes).forEach((id) => {
          const vol = this.muted ? 0 : this.volumes[id];
          if (vol > 0.005) {
            const node = this.ensureChannel(id);
            if (node && this.ctx) {
              node.master.gain.setTargetAtTime(vol * 0.45, this.ctx.currentTime, 0.08);
            }
          } else if (this.nodes[id] && this.ctx) {
            this.nodes[id].master.gain.setTargetAtTime(0.0001, this.ctx.currentTime, 0.08);
          }
        });
      },
    };

    function TreeArt(props) {
      const size = props.size || 36;
      const species = props.species || 'sprout';
      const shapes = {
        sprout: [
          ['path', { d: 'M16 28V16', stroke: '#10b981', strokeWidth: 2.5, strokeLinecap: 'round' }],
          ['path', { d: 'M16 18C16 13 10 10 7 13C7 17 11 19 16 18Z', fill: '#34d399' }],
          ['path', { d: 'M16 15C16 10 22 7 25 10C25 14 21 16 16 15Z', fill: '#10b981' }],
        ],
        maple: [
          ['path', { d: 'M16 29V18', stroke: '#78350f', strokeWidth: 2.6, strokeLinecap: 'round' }],
          ['circle', { cx: 16, cy: 13, r: 8.5, fill: '#ef4444' }],
          ['circle', { cx: 11.5, cy: 15.5, r: 5.5, fill: '#f97316' }],
          ['circle', { cx: 20.5, cy: 15.5, r: 5.5, fill: '#dc2626' }],
        ],
        pine: [
          ['path', { d: 'M16 29V22', stroke: '#78350f', strokeWidth: 2.6, strokeLinecap: 'round' }],
          ['polygon', { points: '16,5 8,15 24,15', fill: '#059669' }],
          ['polygon', { points: '16,10 6,21 26,21', fill: '#047857' }],
          ['polygon', { points: '16,15 5,25 27,25', fill: '#065f46' }],
        ],
        oak: [
          ['path', { d: 'M16 29V17', stroke: '#713f12', strokeWidth: 3.2, strokeLinecap: 'round' }],
          ['circle', { cx: 16, cy: 12, r: 8, fill: '#16a34a' }],
          ['circle', { cx: 10.5, cy: 15.5, r: 6, fill: '#22c55e' }],
          ['circle', { cx: 21.5, cy: 15.5, r: 6, fill: '#15803d' }],
        ],
        cherry: [
          ['path', { d: 'M16 29V17', stroke: '#57534e', strokeWidth: 2.6, strokeLinecap: 'round' }],
          ['circle', { cx: 16, cy: 12, r: 8, fill: '#f472b6' }],
          ['circle', { cx: 11, cy: 15, r: 6, fill: '#f9a8d4' }],
          ['circle', { cx: 21, cy: 15, r: 6, fill: '#ec4899' }],
        ],
        bamboo: [
          ['path', { d: 'M12 28V7M20 28V9', stroke: '#10b981', strokeWidth: 2.8, strokeLinecap: 'round' }],
          ['path', { d: 'M10 13h4M10 20h4M18 15h4M18 22h4', stroke: '#047857', strokeWidth: 1.5 }],
          ['path', { d: 'M12 9c-4-2-6 0-7 2 3 1 5 0 7-2ZM20 11c4-2 6 0 7 2-3 1-5 0-7-2Z', fill: '#34d399' }],
        ],
        ginkgo: [
          ['path', { d: 'M16 29V18', stroke: '#78350f', strokeWidth: 2.6, strokeLinecap: 'round' }],
          ['circle', { cx: 16, cy: 12, r: 8.2, fill: '#eab308' }],
          ['circle', { cx: 11, cy: 15, r: 5.8, fill: '#facc15' }],
          ['circle', { cx: 21, cy: 15, r: 5.8, fill: '#ca8a04' }],
        ],
        cactus: [
          ['path', { d: 'M16 28V9', stroke: '#16a34a', strokeWidth: 5, strokeLinecap: 'round' }],
          ['path', { d: 'M16 19H10v-5', stroke: '#22c55e', strokeWidth: 3.5, strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' }],
          ['path', { d: 'M16 16h6v-5', stroke: '#15803d', strokeWidth: 3.5, strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' }],
          ['circle', { cx: 16, cy: 6.5, r: 2.2, fill: '#f43f5e' }],
        ],
      };
      const items = shapes[species] || shapes.sprout;
      return h('svg', { viewBox: '0 0 32 32', width: size, height: size, 'aria-hidden': true },
        items.map((el, i) => h(el[0], Object.assign({ key: i }, el[1]))));
    }

    const pad = (value) => String(value).padStart(2, '0');

    function fill(text, vars) {
      if (!vars) return text;
      return String(text).replace(/\{(\w+)\}/g, (match, key) => (key in vars ? String(vars[key]) : match));
    }

    function formatDuration(ms, locale) {
      const total = Math.max(0, Math.round(Number(ms) || 0));
      const minutes = Math.round(total / 60000);
      if (minutes < 1) return locale === 'zh' ? '不到 1 分钟' : '<1 min';
      const hours = Math.floor(minutes / 60);
      const rest = minutes % 60;
      if (!hours) return locale === 'zh' ? `${minutes} 分钟` : `${minutes} min`;
      if (!rest) return locale === 'zh' ? `${hours} 小时` : `${hours}h`;
      return locale === 'zh' ? `${hours} 小时 ${rest} 分` : `${hours}h ${rest}m`;
    }

    function clock(ms) {
      const total = Math.max(0, Math.round(Number(ms) / 1000));
      const hours = Math.floor(total / 3600);
      const minutes = Math.floor((total % 3600) / 60);
      const seconds = total % 60;
      return hours ? `${hours}:${pad(minutes)}:${pad(seconds)}` : `${pad(minutes)}:${pad(seconds)}`;
    }

    function dayLabel(ts, locale) {
      const date = new Date(ts);
      const today = new Date();
      const sameDay = date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth() && date.getDate() === today.getDate();
      const prefix = sameDay ? (locale === 'zh' ? '今天 ' : 'Today ') : `${date.getMonth() + 1}/${date.getDate()} `;
      return prefix + `${pad(date.getHours())}:${pad(date.getMinutes())}`;
    }

    async function request(path, init) {
      const response = await fetch(path, Object.assign({ cache: 'no-store' }, init));
      let payload = null;
      try {
        payload = await response.json();
      } catch (error) {
        payload = null;
      }
      if (!response.ok || (payload && payload.ok === false)) {
        const message = payload && payload.error ? payload.error : `HTTP ${response.status}`;
        throw new Error(message);
      }
      return payload;
    }

    function useInterval(callback, delay, active) {
      const saved = React.useRef(callback);
      saved.current = callback;
      React.useEffect(() => {
        if (!active || !delay) return undefined;
        const timer = setInterval(() => saved.current(), delay);
        return () => clearInterval(timer);
      }, [delay, active]);
    }

    function useTimer(paused) {
      const [snapshot, setSnapshot] = React.useState(null);
      const [error, setError] = React.useState(null);

      const refresh = React.useCallback(async () => {
        try {
          const payload = await request(`${API}/state`);
          setSnapshot(payload);
          setError(null);
          return payload;
        } catch (err) {
          setError(err instanceof Error ? err.message : String(err));
          return null;
        }
      }, []);

      React.useEffect(() => {
        let alive = true;
        (async () => {
          const payload = await refresh();
          if (!alive) return;
          if (!payload) setError((prev) => prev || 'offline');
        })();
        return () => { alive = false; };
      }, [refresh]);

      useInterval(() => { void refresh(); }, 1000, !paused);
      React.useEffect(() => {
        const onFocus = () => { void refresh(); };
        const onVisible = () => { if (document.visibilityState === 'visible') void refresh(); };
        window.addEventListener('focus', onFocus);
        document.addEventListener('visibilitychange', onVisible);
        return () => {
          window.removeEventListener('focus', onFocus);
          document.removeEventListener('visibilitychange', onVisible);
        };
      }, [refresh]);

      const send = React.useCallback(async (action) => {
        try {
          const payload = await request(`${API}/action`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(action),
          });
          if (payload && payload.timer) setSnapshot(payload);
          setError(null);
          return payload;
        } catch (err) {
          setError(err instanceof Error ? err.message : String(err));
          return null;
        }
      }, []);

      return { snapshot, error, refresh, send };
    }

    function useStats(year) {
      const [stats, setStats] = React.useState(null);
      const [error, setError] = React.useState(null);

      const refresh = React.useCallback(async () => {
        try {
          const payload = await request(`${API}/stats?year=${year}`);
          setStats(payload);
          setError(null);
          return payload;
        } catch (err) {
          setError(err instanceof Error ? err.message : String(err));
          return null;
        }
      }, [year]);

      React.useEffect(() => { void refresh(); }, [refresh]);
      useInterval(() => { void refresh(); }, 15000, true);
      return { stats, error, refresh };
    }

    function useNow(delay) {
      const [now, setNow] = React.useState(() => Date.now());
      React.useEffect(() => {
        const timer = setInterval(() => setNow(Date.now()), delay);
        return () => clearInterval(timer);
      }, [delay]);
      return now;
    }

    function Icon(props) {
      const size = props.size || 16;
      const paths = {
        timer: [['circle', { cx: 12, cy: 13, r: 8 }], ['path', { d: 'M12 9v4l2.5 2M9.5 2.5h5' }]],
        chart: [['path', { d: 'M4 20V10M10 20V4M16 20v-7M22 20H2' }]],
        leaf: [['path', { d: 'M5 19c0-8 5-14 15-14 0 10-6 15-14 15M5 19c2-4 5-7 9-9' }]],
        gear: [['circle', { cx: 12, cy: 12, r: 3 }], ['path', { d: 'M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1' }]],
        play: [['path', { d: 'M8 5.5v13l11-6.5z', fill: 'currentColor' }]],
        pause: [['path', { d: 'M8 5v14M16 5v14', strokeWidth: 3.2 }]],
        reset: [['path', { d: 'M4 12a8 8 0 1 0 2.6-5.9M4 4v4.5h4.5' }]],
        skip: [['path', { d: 'M6 5.5v13l9-6.5zM19 5v14' }]],
        check: [['path', { d: 'm5 12.5 4.5 4.5L19 7.5' }]],
        plus: [['path', { d: 'M12 5v14M5 12h14' }]],
        window: [['rect', { x: 3, y: 5, width: 18, height: 14, rx: 3 }], ['path', { d: 'M3 9h18' }]],
        wave: [['path', { d: 'M2 12h2M6 8v8M10 5v14M14 9v6M18 7v10M22 12h-2' }]],
        spark: [['path', { d: 'M13 2 4 14h7l-1 8 9-12h-7l1-8z' }]],
        trash: [['path', { d: 'M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13' }]],
      };
      return h('svg', {
        viewBox: '0 0 24 24', width: size, height: size, fill: 'none',
        stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round',
        'aria-hidden': true, className: 'pomo-icon',
      }, (paths[props.name] || []).map((item, index) => h(item[0], Object.assign({ key: index }, item[1]))));
    }

    function Ring(props) {
      const radius = 108;
      const circumference = 2 * Math.PI * radius;
      const progress = Math.min(1, Math.max(0, Number(props.progress) || 0));
      const angle = progress * 2 * Math.PI;
      const ticks = Array.from({ length: 60 }, (_, index) => {
        const a = (index / 60) * 2 * Math.PI;
        const major = index % 5 === 0;
        const r1 = 129;
        const r2 = major ? 120 : 124;
        return h('line', {
          key: index,
          className: 'tick',
          'data-major': major ? 'true' : 'false',
          'data-done': index / 60 <= progress && progress > 0 ? 'true' : 'false',
          x1: 140 + Math.sin(a) * r1, y1: 140 - Math.cos(a) * r1,
          x2: 140 + Math.sin(a) * r2, y2: 140 - Math.cos(a) * r2,
        });
      });
      return h('div', { className: 'pomo-ring', 'data-running': props.running ? 'true' : 'false' },
        h('svg', { viewBox: '0 0 280 280', 'aria-hidden': true },
          h('circle', { className: 'aura', cx: 140, cy: 140, r: 95 }),
          h('g', { className: 'ticks' }, ticks),
          h('g', { transform: 'rotate(-90 140 140)' },
            h('circle', { className: 'track', cx: 140, cy: 140, r: radius, strokeWidth: 10 }),
            h('circle', {
              className: 'bar',
              cx: 140,
              cy: 140,
              r: radius,
              strokeWidth: 10,
              strokeDasharray: circumference,
              strokeDashoffset: circumference * (1 - progress),
            })),
          progress > 0 ? h('circle', {
            className: 'knob',
            cx: 140 + Math.sin(angle) * radius,
            cy: 140 - Math.cos(angle) * radius,
            r: 6.5,
          }) : null),
        h('div', { className: 'pomo-ring-inner' }, props.children));
    }

    function Switch(props) {
      return h('button', {
        type: 'button',
        className: 'pomo-switch',
        role: 'switch',
        'aria-checked': props.checked ? 'true' : 'false',
        'aria-label': props.label,
        onClick: () => props.onChange(!props.checked),
      });
    }

    function Row(props) {
      return h('div', { className: 'pomo-row' },
        h('div', { className: 'pomo-row-label' },
          h('b', null, props.title),
          props.detail ? h('span', null, props.detail) : null),
        props.children);
    }

    function NumberField(props) {
      const [draft, setDraft] = React.useState(String(props.value));
      React.useEffect(() => { setDraft(String(props.value)); }, [props.value]);
      const commit = () => {
        const number = Math.round(Number(draft));
        if (!Number.isFinite(number)) {
          setDraft(String(props.value));
          return;
        }
        const clamped = Math.min(props.max || 180, Math.max(props.min || 1, number));
        setDraft(String(clamped));
        if (clamped !== props.value) props.onChange(clamped);
      };
      return h('div', { className: 'pomo-field' },
        h('label', null, props.label),
        h('div', { className: 'pomo-input' },
          h('input', {
            type: 'number',
            min: props.min || 1,
            max: props.max || 180,
            value: draft,
            onChange: (event) => setDraft(event.target.value),
            onBlur: commit,
            onKeyDown: (event) => {
              if (event.key === 'Enter') { event.preventDefault(); commit(); event.currentTarget.blur(); }
              if (event.key === 'Escape') { setDraft(String(props.value)); event.currentTarget.blur(); }
            },
          }),
          h('em', null, props.unit || '')),
      );
    }

    function Segmented(props) {
      return h('div', { className: 'pomo-seg', role: 'tablist' },
        props.options.map((option) => h('button', {
          key: option.value,
          type: 'button',
          role: 'tab',
          'data-on': props.value === option.value ? 'true' : 'false',
          onClick: () => props.onChange(option.value),
        }, option.label)));
    }

    function chime() {
      try {
        const AudioCtor = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtor) return;
        if (!chime.ctx) chime.ctx = new AudioCtor();
        const ctx = chime.ctx;
        if (ctx.state === 'suspended') void ctx.resume();
        [587.33, 880, 1174.66].forEach((freq, index) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.value = freq;
          const at = ctx.currentTime + index * 0.16;
          gain.gain.setValueAtTime(0.0001, at);
          gain.gain.exponentialRampToValueAtTime(0.16, at + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.85);
          osc.connect(gain).connect(ctx.destination);
          osc.start(at);
          osc.stop(at + 0.9);
        });
      } catch (error) { /* audio is optional */ }
    }

    function TimerTab(props) {
      const { timer, snapshot, send, t, locale, stats, refreshStats, soundRevision, bumpSound } = props;
      const config = timer.config;
      const mode = timer.mode;
      const palette = getThemePalette(mode, timer.direction);
      const style = {
        '--pomo-accent': palette.accent,
        '--pomo-accent-2': palette.accent2,
        '--pomo-soft': palette.soft,
        '--pomo-glow': palette.glow,
      };

      const now = useNow(250);
      const skew = Math.max(0, now - (snapshot.now || now));
      const serverNow = (snapshot.now || now) + skew;
      const running = timer.status === 'running';
      const total = config[mode] * 60000;

      let display;
      let progress;
      let focused = 0;
      if (timer.direction === 'countdown') {
        const remain = running && typeof timer.deadline === 'number'
          ? Math.max(0, timer.deadline - serverNow)
          : Math.max(0, timer.remainingMs);
        display = clock(remain);
        progress = total ? 1 - remain / total : 0;
        focused = Math.max(0, total - remain);
      } else {
        const elapsed = running && typeof timer.startedAt === 'number'
          ? timer.elapsedMs + Math.max(0, serverNow - timer.startedAt)
          : timer.elapsedMs;
        display = clock(elapsed);
        focused = elapsed;
        progress = Math.min(1, elapsed / (config.focus * 60000));
      }

      const primaryLabel = running ? t('pause') : timer.status === 'paused' ? t('resume') : t('start');
      const tasks = snapshot.tasks || [];
      const activeTask = tasks.find((item) => item.id === timer.taskId) || null;
      const taskName = activeTask ? activeTask.name : (snapshot.taskName || '');
      const nextSubtask = activeTask && Array.isArray(activeTask.subtasks)
        ? activeTask.subtasks.find((s) => !s.done)
        : null;

      const tooShort = mode === 'focus' && focused < 60000;
      const timeText = clock(focused);
      const finishTip = mode !== 'focus'
        ? t('finishHint')
        : fill(t(tooShort ? 'finishDrop' : 'finishKeep'), { time: timeText });

      const [addingTask, setAddingTask] = React.useState(false);
      const [taskDraft, setTaskDraft] = React.useState('');
      const [taskPrio, setTaskPrio] = React.useState('medium');
      const [taskEst, setTaskEst] = React.useState(2);

      const [subtaskDraft, setSubtaskDraft] = React.useState('');

      const [sessionNote, setSessionNote] = React.useState('');
      const [sessionEnergy, setSessionEnergy] = React.useState(4);

      const handleCreateTask = async () => {
        const name = taskDraft.trim();
        if (!name) return;
        await send({
          type: 'task-add',
          name,
          priority: taskPrio,
          estimatedPomodoros: taskEst,
        });
        setTaskDraft('');
        setAddingTask(false);
        void refreshStats();
      };

      const handleAddSubtask = async () => {
        if (!activeTask) return;
        const title = subtaskDraft.trim();
        if (!title) return;
        await send({ type: 'subtask-add', taskId: activeTask.id, title });
        setSubtaskDraft('');
      };

      const handleFinishSession = async () => {
        const note = sessionNote.trim();
        await send({
          type: 'finish',
          note: note || undefined,
          energy: mode === 'focus' ? sessionEnergy : undefined,
        });
        setSessionNote('');
        void refreshStats();
      };

      const onToggle = () => send({ type: 'toggle' }).then((payload) => {
        if (payload && payload.timer && payload.timer.lastCompletedAt !== timer.lastCompletedAt) refreshStats();
      });

      const statsData = stats && stats.stats ? stats.stats : null;
      const todayFocus = statsData ? statsData.today.focusMs : 0;
      const goalMs = (config.dailyGoalMinutes || 120) * 60000;
      const goalPct = Math.min(100, Math.round((todayFocus / Math.max(1, goalMs)) * 100));
      const streak = statsData ? statsData.totals.streakDays : 0;
      const weekMs = statsData ? statsData.week.focusMs : 0;
      const flowScore = statsData ? (statsData.today.flowScore || 0) : 0;

      const presetOptions = [
        { id: 'sprint', label: t('presetSprint'), focus: 15 },
        { id: 'classic', label: t('presetClassic'), focus: 25 },
        { id: 'deep', label: t('presetDeep'), focus: 50 },
        { id: 'ultralearn', label: t('presetUltralearn'), focus: 90 },
      ];

      const chronoStage = h('section', { className: 'pomo-stage', 'data-running': running ? 'true' : 'false' },
        h('div', { className: 'pomo-stage-top' },
          h(Segmented, {
            value: mode,
            options: [
              { value: 'focus', label: t('focus') },
              { value: 'short', label: t('short') },
              { value: 'long', label: t('long') },
            ],
            onChange: (value) => send({ type: 'mode', mode: value }),
          }),
          h(Segmented, {
            value: timer.direction,
            options: [
              { value: 'countdown', label: t('countdown') },
              { value: 'countup', label: t('countup') },
              { value: 'flow', label: t('flow') },
            ],
            onChange: (value) => send({ type: 'direction', direction: value }),
          })),

        h('div', { className: 'pomo-presets' },
          presetOptions.map((item) => h('button', {
            key: item.id,
            type: 'button',
            className: 'pomo-preset-chip',
            'data-on': config.focus === item.focus ? 'true' : 'false',
            onClick: () => send({ type: 'preset', preset: item.id }),
          }, item.label))),

        h(Ring, { progress, running },
          h('span', { className: 'pomo-dir-tag' },
            timer.direction === 'flow' ? t('flow') : timer.direction === 'countup' ? t('countup') : t(mode)),
          h('div', { className: 'pomo-clock' }, display),
          h('div', { className: 'pomo-phase' },
            taskName
              ? (nextSubtask ? `${taskName} · ${nextSubtask.title}` : taskName)
              : t('taskNone')),
          h('div', { className: 'pomo-dots', title: `${t('roundLabel')} ${timer.round}/${config.longEvery}` },
            Array.from({ length: config.longEvery }, (_, index) => h('i', {
              key: index,
              className: 'pomo-dot',
              'data-on': index < timer.round ? 'true' : 'false',
            })))),

        h('div', { className: 'pomo-transport' },
          h('button', {
            type: 'button', className: 'pomo-round-btn',
            title: t('reset'), 'aria-label': t('reset'),
            onClick: () => send({ type: 'reset' }),
          }, h(Icon, { name: 'reset', size: 18 })),
          h('button', {
            type: 'button', className: 'pomo-play',
            title: primaryLabel, 'aria-label': primaryLabel,
            onClick: onToggle,
          }, h(Icon, { name: running ? 'pause' : 'play', size: 28 })),
          h('button', {
            type: 'button', className: 'pomo-round-btn',
            title: t('skip'), 'aria-label': t('skip'),
            disabled: timer.direction !== 'countdown',
            onClick: () => send({ type: 'skip' }),
          }, h(Icon, { name: 'skip', size: 18 }))),

        timer.status !== 'idle' ? h('div', { className: 'pomo-finish-panel' },
          mode === 'focus' ? h('div', { className: 'pomo-energy-row' },
            h('span', null, t('energyLabel')),
            h('div', { className: 'pomo-energy-pills' },
              [1, 2, 3, 4, 5].map((lv) => h('button', {
                key: lv,
                type: 'button',
                className: 'pomo-energy-pill',
                'data-on': sessionEnergy === lv ? 'true' : 'false',
                onClick: () => setSessionEnergy(lv),
              }, `${'⚡'.repeat(lv > 3 ? 2 : 1)} ${t('energy' + lv)}`)))) : null,
          h('div', { className: 'pomo-finish-bar' },
            mode === 'focus' ? h('input', {
              type: 'text',
              className: 'pomo-finish-input',
              placeholder: t('reflectionPlaceholder'),
              value: sessionNote,
              onChange: (e) => setSessionNote(e.target.value),
              onKeyDown: (e) => { if (e.key === 'Enter') void handleFinishSession(); },
            }) : null,
            h('button', {
              type: 'button',
              className: 'pomo-btn primary small',
              title: finishTip,
              onClick: () => void handleFinishSession(),
            }, h(Icon, { name: 'check', size: 14 }), t('finish'))),
          h('span', { style: { fontSize: '11px', color: 'var(--dsw-alias-label-secondary)' } }, finishTip)) : null,

        h('div', { style: { fontSize: '11.5px', color: 'var(--dsw-alias-label-secondary)', textAlign: 'center' } },
          timer.direction === 'flow' ? t('flowHint') : timer.direction === 'countup' ? t('countupHint') : t('spaceHint')));

      const goalR = 34;
      const goalCirc = 2 * Math.PI * goalR;
      const pulseCard = h('section', { className: 'pomo-card' },
        h('div', { className: 'pomo-card-head' },
          h('h3', null, h(Icon, { name: 'spark', size: 15 }), t('dailyGoal')),
          h('span', { className: 'pomo-badge' },
            fill(t('dailyGoalProgress'), {
              done: formatDuration(todayFocus, locale),
              goal: formatDuration(goalMs, locale),
            }))),
        h('div', { className: 'pomo-pulse-grid' },
          h('div', { className: 'pomo-goal-ring' },
            h('svg', { viewBox: '0 0 84 84', 'aria-hidden': true },
              h('circle', { className: 'g-track', cx: 42, cy: 42, r: goalR }),
              h('circle', {
                className: 'g-fill', cx: 42, cy: 42, r: goalR,
                strokeDasharray: goalCirc,
                strokeDashoffset: goalCirc * (1 - goalPct / 100),
              })),
            h('div', { className: 'pomo-goal-ring-label' },
              h('b', null, `${goalPct}%`),
              h('span', null, t('dailyGoal')))),
          h('div', { className: 'pomo-mini-kpis' },
            h('div', { className: 'pomo-mini-kpi' },
              h('span', null, t('todayLabel')),
              h('b', null, `${timer.completedToday} 🍅`)),
            h('div', { className: 'pomo-mini-kpi' },
              h('span', null, t('flowScore')),
              h('b', null, `${flowScore} pt`)),
            h('div', { className: 'pomo-mini-kpi' },
              h('span', null, t('weekFocus')),
              h('b', null, formatDuration(weekMs, locale))),
            h('div', { className: 'pomo-mini-kpi' },
              h('span', null, t('streak')),
              h('b', null, `🔥 ${fill(t('streakValue'), { n: streak })}`)))));

      const taskDeckCard = h('section', { className: 'pomo-card' },
        h('div', { className: 'pomo-card-head' },
          h('h3', null, t('taskDeckTitle')),
          h('button', {
            type: 'button',
            className: 'pomo-btn small',
            onClick: () => setAddingTask((v) => !v),
          }, h(Icon, { name: 'plus', size: 13 }), addingTask ? t('taskCancel') : t('taskAdd'))),

        addingTask ? h('div', {
          style: {
            display: 'flex', flexDirection: 'column', gap: '8px',
            padding: '12px', borderRadius: '12px',
            background: 'var(--dsw-alias-bg-base)', border: '1px solid var(--dsw-alias-border-l1)',
          },
        },
          h('input', {
            type: 'text',
            className: 'pomo-finish-input',
            placeholder: t('taskNamePlaceholder'),
            value: taskDraft,
            autoFocus: true,
            onChange: (e) => setTaskDraft(e.target.value),
            onKeyDown: (e) => { if (e.key === 'Enter') void handleCreateTask(); },
          }),
          h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' } },
            h('div', { style: { display: 'flex', alignItems: 'center', gap: '6px' } },
              ['high', 'medium', 'low'].map((p) => h('button', {
                key: p,
                type: 'button',
                className: 'pomo-energy-pill',
                'data-on': taskPrio === p ? 'true' : 'false',
                onClick: () => setTaskPrio(p),
              }, t(p === 'high' ? 'priorityHigh' : p === 'low' ? 'priorityLow' : 'priorityMedium')))),
            h('div', { style: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px' } },
              h('span', { style: { color: 'var(--dsw-alias-label-secondary)' } }, `${t('estPomos')}:`),
              [1, 2, 4, 6].map((n) => h('button', {
                key: n,
                type: 'button',
                className: 'pomo-energy-pill',
                'data-on': taskEst === n ? 'true' : 'false',
                onClick: () => setTaskEst(n),
              }, `${n}🍅`))),
            h('button', { type: 'button', className: 'pomo-btn primary small', onClick: () => void handleCreateTask() }, t('taskCreate')))) : null,

        activeTask ? h('div', { className: 'pomo-active-task-box' },
          h('div', { className: 'pomo-row' },
            h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 } },
              h('span', { className: 'pomo-prio-badge', 'data-prio': activeTask.priority || 'medium' },
                t(activeTask.priority === 'high' ? 'priorityHigh' : activeTask.priority === 'low' ? 'priorityLow' : 'priorityMedium')),
              h('b', { style: { fontSize: '13.5px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, activeTask.name)),
            h('div', { style: { display: 'flex', alignItems: 'center', gap: '6px', flex: 'none' } },
              h('span', { className: 'pomo-badge' },
                `🍅 ${activeTask.completedPomodoros || 0} / ${activeTask.estimatedPomodoros || 1} · ${formatDuration(activeTask.totalFocusMs || 0, locale)}`),
              h('button', {
                type: 'button',
                className: 'pomo-task-quick-btn',
                title: t('archive'),
                onClick: () => send({ type: 'task-archive', id: activeTask.id, archived: true }),
              }, h(Icon, { name: 'check', size: 13 })),
              h('button', {
                type: 'button',
                className: 'pomo-task-quick-btn danger',
                title: t('remove'),
                onClick: () => send({ type: 'task-delete', id: activeTask.id }),
              }, h(Icon, { name: 'trash', size: 13 })))),

          h('div', { className: 'pomo-subtasks' },
            (activeTask.subtasks || []).length
              ? activeTask.subtasks.map((sub) => h('div', { key: sub.id, className: 'pomo-subtask-row' },
                  h('button', {
                    type: 'button',
                    className: 'pomo-subtask-check',
                    'data-done': sub.done ? 'true' : 'false',
                    onClick: () => send({ type: 'subtask-toggle', taskId: activeTask.id, subtaskId: sub.id }),
                  }, sub.done ? '✓' : ''),
                  h('span', { className: 'pomo-subtask-title', 'data-done': sub.done ? 'true' : 'false' }, sub.title),
                  h('button', {
                    type: 'button',
                    className: 'pomo-btn ghost small',
                    style: { padding: '1px 6px', fontSize: '11px' },
                    onClick: () => send({ type: 'subtask-delete', taskId: activeTask.id, subtaskId: sub.id }),
                  }, '×')))
              : h('span', { style: { fontSize: '11px', color: 'var(--dsw-alias-label-secondary)' } }, t('noSubtasks')),
            h('div', { style: { display: 'flex', gap: '6px', marginTop: '4px' } },
              h('input', {
                type: 'text',
                className: 'pomo-finish-input',
                placeholder: t('subtaskPlaceholder'),
                value: subtaskDraft,
                onChange: (e) => setSubtaskDraft(e.target.value),
                onKeyDown: (e) => { if (e.key === 'Enter') void handleAddSubtask(); },
              }),
              h('button', { type: 'button', className: 'pomo-btn small', onClick: () => void handleAddSubtask() }, t('subtaskAdd'))))) : null,

        h('div', { className: 'pomo-task-list' },
          h('div', {
            className: 'pomo-task-item',
            'data-on': !timer.taskId ? 'true' : 'false',
            onClick: () => send({ type: 'task', taskId: null }),
          },
            h('div', { className: 'pomo-task-item-left' },
              h('span', { className: 'pomo-task-item-name' }, t('taskNone'))),
            h('span', { className: 'pomo-task-item-meta' }, '⚡')),
          tasks.map((item) => {
            const doneSubs = (item.subtasks || []).filter((s) => s.done).length;
            const totalSubs = (item.subtasks || []).length;
            return h('div', {
              key: item.id,
              className: 'pomo-task-item',
              'data-on': timer.taskId === item.id ? 'true' : 'false',
              onClick: () => send({ type: 'task', taskId: item.id }),
            },
              h('div', { className: 'pomo-task-item-left' },
                h('span', { className: 'pomo-prio-badge', 'data-prio': item.priority || 'medium' },
                  t(item.priority === 'high' ? 'priorityHigh' : item.priority === 'low' ? 'priorityLow' : 'priorityMedium')),
                h('span', { className: 'pomo-task-item-name' }, item.name)),
              h('div', { className: 'pomo-task-item-meta' },
                totalSubs > 0 ? h('span', null, `☑ ${doneSubs}/${totalSubs}`) : null,
                h('span', null, `🍅 ${item.completedPomodoros || 0}/${item.estimatedPomodoros || 1}`),
                h('span', { className: 'pomo-task-quick-actions' },
                  h('button', {
                    type: 'button',
                    className: 'pomo-task-quick-btn',
                    title: t('archive'),
                    onClick: (e) => {
                      e.stopPropagation();
                      void send({ type: 'task-archive', id: item.id, archived: true });
                    },
                  }, h(Icon, { name: 'check', size: 13 })),
                  h('button', {
                    type: 'button',
                    className: 'pomo-task-quick-btn danger',
                    title: t('remove'),
                    onClick: (e) => {
                      e.stopPropagation();
                      void send({ type: 'task-delete', id: item.id });
                    },
                  }, h(Icon, { name: 'trash', size: 13 })))));
          })));

      const channels = [
        { id: 'rain', label: `🌧️ ${t('chRain')}` },
        { id: 'campfire', label: `🔥 ${t('chCampfire')}` },
        { id: 'ocean', label: `🌊 ${t('chOcean')}` },
        { id: 'binaural', label: `🧠 ${t('chBinaural')}` },
      ];
      const scenes = [
        { id: 'none', label: t('sceneNone') },
        { id: 'study', label: t('sceneStudy') },
        { id: 'camp', label: t('sceneCamp') },
        { id: 'zen', label: t('sceneZen') },
        { id: 'brain', label: t('sceneBrain') },
      ];

      const soundscapeCard = h('section', { className: 'pomo-card', 'data-sound-rev': soundRevision },
        h('div', { className: 'pomo-card-head' },
          h('h3', null, h(Icon, { name: 'wave', size: 15 }), t('soundscapeTitle')),
          h('div', { className: 'pomo-presets' },
            scenes.map((sc) => h('button', {
              key: sc.id,
              type: 'button',
              className: 'pomo-preset-chip',
              onClick: () => { Soundscape.setScene(sc.id); bumpSound(); },
            }, sc.label)))),
        h('div', { className: 'pomo-mixer-channels' },
          channels.map((ch) => {
            const vol = Soundscape.volumes[ch.id] || 0;
            return h('div', {
              key: ch.id,
              className: 'pomo-channel',
              'data-active': vol > 0.01 && !Soundscape.muted ? 'true' : 'false',
            },
              h('div', { className: 'pomo-channel-top' },
                h('span', null, ch.label),
                h('span', { className: 'pomo-channel-val' }, `${Math.round(vol * 100)}%`)),
              h('input', {
                type: 'range',
                className: 'pomo-range',
                min: 0, max: 1, step: 0.05,
                value: vol,
                onChange: (e) => {
                  Soundscape.muted = false;
                  Soundscape.setChannelVolume(ch.id, Number(e.target.value));
                  bumpSound();
                },
              }));
          })),
        h(Row, { title: t('ambientAuto') },
          h(Switch, {
            checked: config.ambientAuto !== false,
            label: t('ambientAuto'),
            onChange: (value) => send({ type: 'config', patch: { ambientAuto: value } }),
          })));

      return h('div', { className: 'pomo-page', style, 'data-mode': mode },
        h('div', { className: 'pomo-cockpit' },
          chronoStage,
          h('div', { className: 'pomo-bento-stack' },
            pulseCard,
            taskDeckCard,
            soundscapeCard)));
    }

    function Heatmap(props) {
      const { year, days, maxDayMs, locale } = props;
      const start = new Date(year, 0, 1);
      const cells = [];
      for (let offset = 0; offset < start.getDay(); offset += 1) cells.push(null);
      const cursor = new Date(start);
      while (cursor.getFullYear() === year) {
        cells.push(cursor.getTime());
        cursor.setDate(cursor.getDate() + 1);
      }
      while (cells.length % 7 !== 0) cells.push(null);
      const weeks = [];
      for (let index = 0; index < cells.length; index += 7) weeks.push(cells.slice(index, index + 7));
      const keyOf = (ts) => {
        const date = new Date(ts);
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
      };
      const levelOf = (ms) => {
        if (!ms || !maxDayMs) return 0;
        const ratio = ms / maxDayMs;
        if (ratio < 0.25) return 1;
        if (ratio < 0.5) return 2;
        if (ratio < 0.8) return 3;
        return 4;
      };
      return h('div', null,
        h('div', { className: 'pomo-heat' },
          h('div', { className: 'weeks' },
            weeks.map((week, weekIndex) => h('div', { key: weekIndex, className: 'week' },
              week.map((ts, dayIndex) => {
                if (!ts) return h('i', { key: dayIndex, className: 'cell', 'data-level': '0' });
                const key = keyOf(ts);
                const ms = days[key] || 0;
                const date = new Date(ts);
                return h('i', {
                  key: dayIndex,
                  className: 'cell',
                  'data-level': String(levelOf(ms)),
                  title: `${key} · ${formatDuration(ms, locale)}`,
                  style: date > new Date() ? { opacity: 0.35 } : undefined,
                });
              }))))));
    }

    function StatsTab(props) {
      const { statsPayload, year, setYear, t, locale, send, refreshStats } = props;
      const stats = statsPayload && statsPayload.stats ? statsPayload.stats : null;
      const now = new Date();
      const style = {
        '--pomo-accent': APPEARANCE.focus.accent,
        '--pomo-accent-2': APPEARANCE.focus.accent2,
        '--pomo-soft': APPEARANCE.focus.soft,
      };
      const [editingId, setEditingId] = React.useState(null);
      const [noteDraft, setNoteDraft] = React.useState('');

      if (!stats) {
        return h('div', { className: 'pomo-page', style }, h('div', { className: 'pomo-loading' }, t('loading')));
      }

      const hourly = stats.today.hourly;
      const maxHour = Math.max(1, ...hourly);
      const weekDays = (stats.week && stats.week.days) || [];
      const maxWeekDay = Math.max(1, ...weekDays.map((d) => d.ms));
      const legend = [0, 1, 2, 3, 4];
      const years = [];
      for (let value = now.getFullYear(); value >= now.getFullYear() - 4; value -= 1) years.push(value);

      const rhythm = stats.rhythm || { morningMs: 0, afternoonMs: 0, eveningMs: 0, nightMs: 0, dominantPeriod: 'none' };
      const maxPeriodMs = Math.max(1, rhythm.morningMs, rhythm.afternoonMs, rhythm.eveningMs, rhythm.nightMs);
      const personaKey = rhythm.dominantPeriod === 'morning'
        ? 'personaMorning'
        : rhythm.dominantPeriod === 'afternoon'
          ? 'personaAfternoon'
          : rhythm.dominantPeriod === 'evening'
            ? 'personaEvening'
            : rhythm.dominantPeriod === 'night'
              ? 'personaNight'
              : 'personaNone';

      const saveSessionNote = async (id) => {
        await send({ type: 'session-note', id, note: noteDraft });
        setEditingId(null);
        void refreshStats();
      };

      return h('div', { className: 'pomo-page', style },
        h('div', { className: 'pomo-tiles' },
          h('div', { className: 'pomo-tile' },
            h('span', null, t('todayFocus')),
            h('b', null, formatDuration(stats.today.focusMs, locale)),
            h('em', null, `${t('flowScore')} ${stats.today.flowScore || 0} pt`)),
          h('div', { className: 'pomo-tile' },
            h('span', null, t('weekFocus')),
            h('b', null, formatDuration(stats.week.focusMs, locale)),
            h('em', null, fill(t('weekAvgLabel'), { duration: formatDuration(stats.week.dailyAvgMs || 0, locale) }))),
          h('div', { className: 'pomo-tile' },
            h('span', null, t('streak')),
            h('b', null, `🔥 ${fill(t('streakValue'), { n: stats.totals.streakDays })}`),
            h('em', null, `${t('completionRate')} ${stats.totals.completionRate ?? 100}%`)),
          h('div', { className: 'pomo-tile' },
            h('span', null, t('totalSessions')),
            h('b', null, formatDuration(stats.totals.focusMs, locale)),
            h('em', null, `${stats.totals.sessions} 🍅 · ${t('avgSession')} ${formatDuration(stats.totals.avgSessionMs, locale)}`))),

        h('div', { className: 'pomo-grid' },
          h('section', { className: 'pomo-card' },
            h('div', { className: 'pomo-row' },
              h('h3', null, t('todayOverview')),
              h('span', { className: 'pomo-badge' },
                stats.today.bestHour >= 0
                  ? `${t('bestHour')} ${fill(t('bestHourValue'), { h: pad(stats.today.bestHour), h2: pad((stats.today.bestHour + 1) % 24) })}`
                  : t('noBestHour'))),
            h('div', { className: 'pomo-bars' },
              hourly.map((ms, hour) => h('div', {
                key: hour,
                className: 'col',
                'data-best': stats.today.bestHour === hour && ms > 0 ? 'true' : 'false',
                'data-has': ms > 0 ? 'true' : 'false',
                title: `${pad(hour)}:00 · ${formatDuration(ms, locale)}`,
              }, h('i', { className: 'fill', style: { height: `${Math.max(ms > 0 ? 6 : 2, Math.round((ms / maxHour) * 94))}px` } })))),
            h('div', { className: 'pomo-axis' },
              [0, 4, 8, 12, 16, 20].map((hour) => h('span', { key: hour }, `${pad(hour)}:00`))),
            h('p', null, t('hourlyHint'))),

          h('section', { className: 'pomo-card' },
            h('div', { className: 'pomo-row' },
              h('h3', null, t('weekTrendTitle')),
              h('span', { className: 'pomo-badge' }, `🧭 ${t(personaKey)}`)),
            h('div', { className: 'pomo-bars', style: { height: '84px' } },
              weekDays.map((d) => h('div', {
                key: d.date,
                className: 'col',
                'data-best': d.ms === maxWeekDay && d.ms > 0 ? 'true' : 'false',
                'data-has': d.ms > 0 ? 'true' : 'false',
                title: `${d.date} · ${formatDuration(d.ms, locale)}`,
              }, h('i', { className: 'fill', style: { height: `${Math.max(d.ms > 0 ? 6 : 2, Math.round((d.ms / maxWeekDay) * 68))}px` } })))),
            h('div', { className: 'pomo-axis' },
              weekDays.map((d) => h('span', { key: d.date }, d.label))),
            h('div', { className: 'pomo-taskbars', style: { marginTop: '4px' } },
              [
                { id: 'morning', label: t('periodMorning'), ms: rhythm.morningMs },
                { id: 'afternoon', label: t('periodAfternoon'), ms: rhythm.afternoonMs },
                { id: 'evening', label: t('periodEvening'), ms: rhythm.eveningMs },
                { id: 'night', label: t('periodNight'), ms: rhythm.nightMs },
              ].map((p) => h('div', { key: p.id, className: 'pomo-taskbar' },
                h('span', { className: 'name' }, p.label),
                h('div', { className: 'track' }, h('div', { className: 'fill', style: { width: `${Math.max(2, Math.round((p.ms / maxPeriodMs) * 100))}%` } })),
                h('b', null, formatDuration(p.ms, locale))))))),

        h('div', { className: 'pomo-grid' },
          h('section', { className: 'pomo-card' },
            h('div', { className: 'pomo-row' },
              h('h3', null, t('timelineTitle')),
              h('span', { className: 'pomo-badge' }, t('timelineAll'))),
            stats.timeline.length
              ? h('div', { className: 'pomo-log' }, stats.timeline.map((item) => h('div', { key: item.id, className: 'pomo-log-row' },
                  h('div', { className: 'pomo-log-main' },
                    h('span', { className: 'pomo-log-time' }, dayLabel(item.endedAt, locale)),
                    h('span', { className: 'pomo-log-task' },
                      h('span', null, item.taskName || t('taskUnassigned')),
                      item.direction === 'flow' ? h('span', { className: 'pomo-badge' }, t('flow')) : null,
                      item.direction === 'countup' ? h('span', { className: 'pomo-badge' }, t('countup')) : null,
                      item.energy ? h('span', { className: 'pomo-badge' }, `⚡${item.energy}`) : null),
                    h('div', { style: { display: 'flex', alignItems: 'center', gap: '6px' } },
                      h('b', { className: 'pomo-log-dur' }, formatDuration(item.durationMs, locale)),
                      h('button', {
                        type: 'button',
                        className: 'pomo-btn ghost small',
                        style: { padding: '2px 7px', fontSize: '10.5px' },
                        onClick: () => {
                          setEditingId(editingId === item.id ? null : item.id);
                          setNoteDraft(item.note || '');
                        },
                      }, t('editNote')))),
                  editingId === item.id
                    ? h('div', { style: { display: 'flex', gap: '6px', paddingLeft: '96px' } },
                        h('input', {
                          type: 'text',
                          className: 'pomo-finish-input',
                          value: noteDraft,
                          placeholder: t('reflectionPlaceholder'),
                          onChange: (e) => setNoteDraft(e.target.value),
                          onKeyDown: (e) => { if (e.key === 'Enter') void saveSessionNote(item.id); },
                        }),
                        h('button', { type: 'button', className: 'pomo-btn primary small', onClick: () => void saveSessionNote(item.id) }, t('saveNote')))
                    : item.note
                      ? h('div', { className: 'pomo-log-note' }, `📝 ${item.note}`)
                      : null)))
              : h('div', { className: 'pomo-empty' }, t('timelineEmpty'))),

          h('section', { className: 'pomo-card' },
            h('h3', null, t('taskBreakdown')),
            stats.tasks.length
              ? h('div', { className: 'pomo-taskbars' }, stats.tasks.map((item) => h('div', { key: item.taskId, className: 'pomo-taskbar' },
                  h('span', { className: 'name' }, item.taskId === 'untracked' ? t('untracked') : (item.name || t('taskUnassigned'))),
                  h('div', { className: 'track' }, h('div', { className: 'fill', style: { width: `${Math.max(4, Math.round((item.ms / Math.max(1, stats.tasks[0].ms)) * 100))}%` } })),
                  h('b', null, `${formatDuration(item.ms, locale)} (${item.sessions})`))))
              : h('div', { className: 'pomo-empty' }, t('taskEmpty')))),

        h('section', { className: 'pomo-card' },
          h('div', { className: 'pomo-row' },
            h('h3', null, t('heatmapTitle')),
            h('div', { className: 'pomo-input', style: { width: '104px' } },
              h('select', { value: String(year), onChange: (event) => setYear(Number(event.target.value)) },
                years.map((value) => h('option', { key: value, value: String(value) }, String(value)))))),
          h('p', null, t('heatmapHint')),
          h(Heatmap, { year: stats.year.year, days: stats.year.days, maxDayMs: stats.year.maxDayMs, locale }),
          h('div', { className: 'pomo-heat-foot' },
            h('span', null, fill(t('heatmapTotal'), { duration: formatDuration(stats.year.totalMs, locale) }) + ' · ' + fill(t('heatmapDays'), { n: Object.keys(stats.year.days).length })),
            h('span', { className: 'pomo-legend' },
              h('span', null, t('less')),
              legend.map((level) => h('i', { key: level, 'data-level': String(level), className: 'cell', style: { width: '10px', height: '10px', display: 'inline-block', borderRadius: '2px' } })),
              h('span', null, t('more'))))));
    }

    function ForestTab(props) {
      const { statsPayload, t, locale } = props;
      const stats = statsPayload && statsPayload.stats ? statsPayload.stats : null;
      const garden = statsPayload && statsPayload.garden ? statsPayload.garden : null;
      const style = {
        '--pomo-accent': APPEARANCE.short.accent,
        '--pomo-accent-2': APPEARANCE.short.accent2,
        '--pomo-soft': APPEARANCE.short.soft,
      };
      if (!stats || !garden) {
        return h('div', { className: 'pomo-page', style }, h('div', { className: 'pomo-loading' }, t('loading')));
      }
      const species = garden.species || [];
      const trees = (garden.trees || []).slice().reverse();
      const planted = garden.count || 0;
      const unlockedCount = species.filter((item) => planted >= item.at).length;
      const next = species.find((item) => planted < item.at) || species[species.length - 1];
      const remaining = Math.max(0, next.at - planted);
      const treeMinutes = 10;
      const totalFocus = stats.totals.focusMs;
      const counts = new Map();
      for (const tree of trees) counts.set(tree.species, (counts.get(tree.species) || 0) + 1);

      return h('div', { className: 'pomo-page', style },
        h('div', { className: 'pomo-tiles' },
          h('div', { className: 'pomo-tile' },
            h('span', null, t('treesPlanted')),
            h('b', null, fill(t('treesValue'), { n: planted })),
            h('em', null, fill(t('forestTotal'), { duration: formatDuration(totalFocus, locale) }))),
          h('div', { className: 'pomo-tile' },
            h('span', null, t('nextTree')),
            h('b', null, locale === 'zh' ? next.name : (next.nameEn || next.name)),
            h('em', null, remaining ? fill(t('nextTreeValue'), { n: remaining, name: locale === 'zh' ? next.name : (next.nameEn || next.name) }) : t('speciesUnlocked'))),
          h('div', { className: 'pomo-tile' },
            h('span', null, t('speciesTitle')),
            h('b', null, `${unlockedCount} / ${species.length}`),
            h('em', null, fill(t('forestAll'), { u: unlockedCount, total: species.length })))),

        h('section', { className: 'pomo-terrarium' },
          h('div', { className: 'pomo-row' },
            h('div', { className: 'pomo-row-label' },
              h('h3', { style: { margin: 0, fontSize: '15px' } }, t('forestTitle')),
              h('span', null, t('forestLead'))),
            h('span', { className: 'pomo-badge' }, fill(t('treesValue'), { n: planted }))),
          trees.length
            ? h('div', { className: 'pomo-island-stage' },
                trees.slice(0, 36).map((tree) => {
                  const sp = species.find((s) => s.id === tree.species) || species[0] || {};
                  const label = locale === 'zh' ? sp.name : (sp.nameEn || sp.name);
                  return h('div', {
                    key: tree.id,
                    className: 'pomo-specimen',
                    title: `${label} · ${tree.taskName || t('taskUnassigned')} · ${Math.max(1, Math.round(tree.durationMs / 60000))}m`,
                  }, h(TreeArt, { species: tree.species, size: 38 }));
                }))
            : h('div', { className: 'pomo-empty' }, fill(t('forestEmpty'), { n: treeMinutes }))),

        h('section', { className: 'pomo-card' },
          h('h3', null, t('speciesTitle')),
          h('div', { className: 'pomo-species' }, species.map((item) => {
            const unlocked = planted >= item.at;
            const displayName = locale === 'zh' ? item.name : (item.nameEn || item.name);
            const desc = locale === 'zh' ? item.descZh : item.descEn;
            return h('div', { key: item.id, className: 'pomo-specie', 'data-locked': unlocked ? 'false' : 'true' },
              h(TreeArt, { species: item.id, size: 42 }),
              h('b', null, displayName),
              desc ? h('span', { style: { fontSize: '10px', opacity: 0.82 } }, desc) : null,
              h('span', { style: { color: unlocked ? 'var(--pomo-accent)' : undefined, fontWeight: 600 } },
                unlocked ? `${t('speciesUnlocked')} × ${counts.get(item.id) || 0}` : fill(t('speciesLocked'), { n: item.at - planted })));
          }))),

        trees.length ? h('section', { className: 'pomo-card' },
          h('h3', null, fill(t('treesValue'), { n: planted })),
          h('div', { className: 'pomo-forest' }, trees.slice(0, 120).map((tree) => {
            const sp = species.find((item) => item.id === tree.species) || {};
            const displayName = locale === 'zh' ? sp.name : (sp.nameEn || sp.name || tree.species);
            return h('div', { key: tree.id, className: 'pomo-tree' },
              h(TreeArt, { species: tree.species, size: 34 }),
              h('div', { className: 'pomo-tree-info' },
                h('b', null, displayName),
                h('span', null, tree.taskName || t('taskUnassigned')),
                h('span', null, fill(t('treeMinutes'), { n: Math.max(1, Math.round(tree.durationMs / 60000)) }) + ' · ' + new Date(tree.plantedAt).toLocaleDateString())));
          }))) : null);
    }

    function TextField(props) {
      return h('div', { className: 'pomo-field' },
        h('label', null, props.label),
        h('div', { className: 'pomo-input' },
          h('input', {
            type: props.type || 'text',
            value: props.value,
            placeholder: props.placeholder || '',
            onChange: (event) => props.onChange(event.target.value),
          })),
        props.hint ? h('span', { style: { fontSize: '10.5px', color: 'var(--dsw-alias-label-secondary)' } }, props.hint) : null);
    }

    function StepperRow(props) {
      const { label, detail, value, min, max, step, unit, onChange } = props;
      const clamp = (v) => Math.min(max || 180, Math.max(min || 1, Math.round(Number(v) || min || 1)));
      return h('div', { className: 'pomo-stepper-row' },
        h('div', { className: 'pomo-row-label' },
          h('b', null, label),
          detail ? h('span', null, detail) : null),
        h('div', { className: 'pomo-stepper-ctrl' },
          h('button', {
            type: 'button',
            className: 'pomo-step-btn',
            onClick: () => onChange(clamp(value - (step || 5))),
          }, '−'),
          h('div', { className: 'pomo-step-val' },
            h('input', {
              type: 'number',
              className: 'pomo-step-input',
              min: min || 1,
              max: max || 180,
              value: String(value),
              onChange: (e) => {
                const raw = Number(e.target.value);
                if (Number.isFinite(raw) && raw > 0) onChange(clamp(raw));
              },
            }),
            unit ? h('span', { className: 'pomo-step-unit' }, unit) : null),
          h('button', {
            type: 'button',
            className: 'pomo-step-btn',
            onClick: () => onChange(clamp(value + (step || 5))),
          }, '+')));
    }

    function SettingsTab(props) {
      const { timer, snapshot, send, t, locale } = props;
      const config = timer.config;
      const style = {
        '--pomo-accent': APPEARANCE.focus.accent,
        '--pomo-accent-2': APPEARANCE.focus.accent2,
        '--pomo-soft': APPEARANCE.focus.soft,
        '--pomo-glow': APPEARANCE.focus.glow,
      };
      const [backup, setBackup] = React.useState(null);
      const [draft, setDraft] = React.useState(null);
      const [busy, setBusy] = React.useState(false);
      const [message, setMessage] = React.useState(null);
      const [importing, setImporting] = React.useState(false);
      const [taskFilter, setTaskFilter] = React.useState('active');
      const [taskQuery, setTaskQuery] = React.useState('');
      const [newTaskName, setNewTaskName] = React.useState('');
      const fileRef = React.useRef(null);

      const loadBackup = React.useCallback(async () => {
        try {
          const payload = await request(`${API}/backup`);
          setBackup(payload.backup);
          setDraft({
            provider: payload.backup.provider,
            auto: payload.backup.auto,
            url: payload.backup.webdav.url,
            username: payload.backup.webdav.username,
            password: '',
            path: payload.backup.webdav.path,
            endpoint: payload.backup.s3.endpoint,
            region: payload.backup.s3.region,
            bucket: payload.backup.s3.bucket,
            accessKey: payload.backup.s3.accessKey,
            secretKey: '',
            prefix: payload.backup.s3.prefix,
          });
        } catch (error) {
          setMessage({ kind: 'error', text: String(error.message || error) });
        }
      }, []);

      React.useEffect(() => { void loadBackup(); }, [loadBackup]);

      const patch = (key, value) => setDraft((prev) => (prev ? { ...prev, [key]: value } : prev));

      const saveBackup = async (extra) => {
        if (!draft) return null;
        const payload = await send({
          type: 'backup-save',
          patch: {
            provider: draft.provider,
            auto: draft.auto,
            webdav: { url: draft.url, username: draft.username, password: draft.password || undefined, path: draft.path },
            s3: { endpoint: draft.endpoint, region: draft.region, bucket: draft.bucket, accessKey: draft.accessKey, secretKey: draft.secretKey || undefined, prefix: draft.prefix },
          },
        });
        if (payload && payload.backup) {
          setBackup(payload.backup);
          setDraft((prev) => (prev ? { ...prev, password: '', secretKey: '' } : prev));
        }
        if (extra) setMessage({ kind: 'ok', text: extra });
        return payload;
      };

      const runBackup = async () => {
        setBusy(true);
        setMessage(null);
        await saveBackup(null);
        const payload = await send({ type: 'backup-now' });
        setBusy(false);
        if (payload && payload.ok === false) setMessage({ kind: 'error', text: fill(t('backupFailed'), { message: payload.error || '' }) });
        else setMessage({ kind: 'ok', text: t('backupDone') });
        if (payload && payload.backup) setBackup(payload.backup);
      };

      const importFile = async (file) => {
        if (!file) return;
        setImporting(true);
        try {
          const text = await file.text();
          const data = JSON.parse(text);
          const payload = await send({ type: 'import-data', data });
          if (payload && payload.ok === false) throw new Error(payload.error || 'import failed');
          setMessage({ kind: 'ok', text: t('importDone') });
          await loadBackup();
        } catch (error) {
          setMessage({ kind: 'error', text: fill(t('importFailed'), { message: error instanceof Error ? error.message : String(error) }) });
        } finally {
          setImporting(false);
        }
      };

      const windowInfo = snapshot.window || { open: false, available: false };
      const activeList = snapshot.tasks || [];
      const archivedList = snapshot.archivedTasks || [];
      const resolvedStageTheme = config.theme === 'light' ? 'light' : config.theme === 'dark' ? 'dark' : (snapshot.theme || 'dark');
      const viewLabels = { card: t('viewCard'), ring: t('viewRing'), bare: t('viewBare') };

      const discFill = resolvedStageTheme === 'light' ? '#fcfbf9' : '#16171d';
      const discStroke = resolvedStageTheme === 'light' ? 'rgba(20,20,26,0.16)' : 'rgba(255,255,255,0.20)';
      const liveMockup = config.miniMode === 'ring'
        ? h('div', { className: 'pomo-mockup-ring', style: { opacity: config.opacity } },
            h('svg', { viewBox: '0 0 108 108', 'aria-hidden': true },
              h('circle', { cx: 54, cy: 54, r: 46, fill: discFill, stroke: discStroke, strokeWidth: 1 }),
              h('circle', { cx: 54, cy: 54, r: 42, fill: 'none', stroke: 'var(--pomo-accent)', strokeWidth: 5.5, strokeLinecap: 'round' })),
            h('span', { style: { position: 'relative', zIndex: 1, fontFamily: 'ui-monospace, monospace', fontSize: '20px', fontWeight: 650, lineHeight: 1 } }, `${pad(config.focus)}:00`),
            h('span', { style: { position: 'relative', zIndex: 1, display: 'inline-flex', gap: '3px', margin: '1px 0' } },
              Array.from({ length: Math.min(6, config.longEvery) }, (_, i) => h('i', {
                key: i,
                style: {
                  width: '4.5px', height: '4.5px', borderRadius: '50%', clipPath: 'circle(50% at 50% 50%)',
                  background: i === 0 ? 'var(--pomo-accent)' : 'rgba(128,128,140,0.35)',
                },
              }))),
            h('span', { style: { position: 'relative', zIndex: 1, fontSize: '9.5px', opacity: 0.72 } }, t('focus')))
        : config.miniMode === 'bare'
          ? h('div', { className: 'pomo-mockup-bare', style: { opacity: config.opacity } },
              h('span', { style: { fontFamily: 'ui-monospace, monospace', fontSize: '30px', fontWeight: 650, color: 'var(--pomo-accent)' } }, `${pad(config.focus)}:00`),
              h('div', { style: { width: '88px', height: '2.5px', borderRadius: '99px', background: 'var(--pomo-accent)' } }))
          : h('div', { className: 'pomo-mockup-card', style: { opacity: config.opacity } },
              h('div', { className: 'pomo-mockup-play' },
                h('svg', { viewBox: '0 0 48 48', width: 48, height: 48, style: { position: 'absolute', inset: 0 }, 'aria-hidden': true },
                  h('circle', { cx: 24, cy: 24, r: 21, fill: 'rgba(240,90,72,0.16)', stroke: 'var(--pomo-accent)', strokeWidth: 3.5 })),
                h('span', { style: { position: 'relative', zIndex: 1, display: 'inline-flex' } }, h(Icon, { name: 'play', size: 16 }))),
              h('div', { style: { display: 'flex', flexDirection: 'column', gap: '3px' } },
                h('div', { style: { display: 'flex', alignItems: 'baseline', gap: '6px' } },
                  h('span', { style: { fontFamily: 'ui-monospace, monospace', fontSize: '24px', fontWeight: 650, lineHeight: 1 } }, `${pad(config.focus)}:00`),
                  h('span', { style: { display: 'inline-flex', gap: '3px' } },
                    Array.from({ length: Math.min(6, config.longEvery) }, (_, i) => h('i', {
                      key: i,
                      style: {
                        width: '4.5px', height: '4.5px', borderRadius: '50%', clipPath: 'circle(50% at 50% 50%)',
                        background: i === 0 ? 'var(--pomo-accent)' : 'rgba(128,128,140,0.35)',
                      },
                    })))),
                h('span', { style: { fontSize: '11px', opacity: 0.72 } }, `● ${t('focus')} · Flow Studio`)));

      const hudCard = h('section', { className: 'pomo-card' },
        h('div', { className: 'pomo-card-head' },
          h('h3', null, h(Icon, { name: 'window', size: 15 }), t('desktop')),
          h('div', { style: { display: 'flex', alignItems: 'center', gap: '6px' } },
            h('a', { className: 'pomo-btn small', href: '/pomodoro/widget', target: '_blank', rel: 'noreferrer' }, '🌐 Web HUD'),
            h('button', {
              type: 'button',
              className: 'pomo-btn primary small',
              disabled: !windowInfo.open && !windowInfo.available,
              onClick: () => send({ type: windowInfo.open ? 'window-close' : 'window-open' }),
            }, windowInfo.open ? t('closeWidget') : t('openWidget')))),

        h('div', { className: 'pomo-hud-stage', 'data-stage-theme': resolvedStageTheme },
          h('div', { className: 'pomo-hud-stage-top' },
            h('div', { className: 'pomo-hud-stage-title' },
              h('span', { className: 'pomo-pulse', 'data-on': windowInfo.open ? 'true' : 'false' }),
              h('span', null, windowInfo.open ? t('desktopRunning') : t('desktopStopped'))),
            h('span', { className: 'pomo-badge' }, `${viewLabels[config.miniMode]} · ${Math.round(config.opacity * 100)}%`)),
          h('div', { className: 'pomo-hud-stage-center' }, liveMockup),
          !windowInfo.available ? h('div', { className: 'pomo-banner' }, h('span', null, t('windowMissing'))) : null,
          windowInfo.error ? h('div', { className: 'pomo-banner error' }, h('span', null, fill(t('windowError'), { message: windowInfo.error }))) : null),

        h('div', { className: 'pomo-views' },
          [
            { id: 'card', label: t('viewCard'), hint: t('viewCardHint'), preview: `${pad(config.focus)}:00` },
            { id: 'ring', label: t('viewRing'), hint: t('viewRingHint'), preview: `${pad(config.focus)}:00` },
            { id: 'bare', label: t('viewBare'), hint: t('viewBareHint'), preview: `${pad(config.focus)}:00` },
          ].map((view) => h('button', {
            key: view.id,
            type: 'button',
            className: 'pomo-view',
            'data-on': config.miniMode === view.id ? 'true' : 'false',
            onClick: () => send({ type: 'config', patch: { miniMode: view.id } }),
          },
            h('div', { className: 'preview', 'data-preview': view.id },
              view.id === 'card' ? h('svg', { width: 8, height: 8, viewBox: '0 0 11 11', 'aria-hidden': true }, h('path', { d: 'M3 2.2l6 3.3-6 3.3z', fill: 'currentColor' })) : null,
              view.id === 'ring' ? h('svg', { viewBox: '0 0 42 42', width: 42, height: 42, style: { position: 'absolute', inset: 0 }, 'aria-hidden': true },
                h('circle', { cx: 21, cy: 21, r: 18, fill: 'var(--dsw-alias-bg-layer-1)', stroke: 'var(--pomo-accent)', strokeWidth: 2.5 })) : null,
              h('span', { style: { position: 'relative', zIndex: 1 } }, view.preview)),
            h('b', null, view.label),
            h('span', null, view.hint)))),

        h('div', { className: 'pomo-subbox' },
          h('span', { style: { fontSize: '12px', fontWeight: 550, whiteSpace: 'nowrap' } }, t('theme')),
          h(Segmented, {
            value: config.theme,
            options: [
              { value: 'auto', label: t('themeAuto') },
              { value: 'light', label: t('themeLight') },
              { value: 'dark', label: t('themeDark') },
            ],
            onChange: (value) => send({ type: 'config', patch: { theme: value } }),
          })),

        h('div', { className: 'pomo-subgrid-2' },
          h('div', { className: 'pomo-subbox' },
            h('span', { style: { fontSize: '12px', fontWeight: 550, whiteSpace: 'nowrap' } }, t('opacity')),
            h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px', flex: 1, maxWidth: '140px' } },
              h('input', {
                type: 'range',
                className: 'pomo-range',
                min: 0.3, max: 1, step: 0.05,
                value: config.opacity,
                onChange: (event) => send({ type: 'config', patch: { opacity: Number(event.target.value) } }),
              }),
              h('span', { className: 'pomo-range-value' }, Math.round(config.opacity * 100) + '%'))),
          h('div', { className: 'pomo-subbox' },
            h('span', { style: { fontSize: '12px', fontWeight: 550, whiteSpace: 'nowrap' } }, t('autoShow')),
            h(Switch, { checked: config.autoShow, label: t('autoShow'), onChange: (value) => send({ type: 'config', patch: { autoShow: value } }) })),
          h('div', { className: 'pomo-subbox', style: { gridColumn: '1 / -1' } },
            h('span', { style: { fontSize: '12px', fontWeight: 550, whiteSpace: 'nowrap' } }, t('alwaysOnTop')),
            h(Switch, { checked: config.alwaysOnTop, label: t('alwaysOnTop'), onChange: (value) => send({ type: 'config', patch: { alwaysOnTop: value } }) }))));

      const presetCards = [
        { id: 'sprint', icon: '⚡', title: t('presetSprint'), desc: '15 / 3 / 10m', focus: 15 },
        { id: 'classic', icon: '🍅', title: t('presetClassic'), desc: '25 / 5 / 15m', focus: 25 },
        { id: 'deep', icon: '🌊', title: t('presetDeep'), desc: '50 / 10 / 20m', focus: 50 },
        { id: 'ultralearn', icon: '🚀', title: t('presetUltralearn'), desc: '90 / 20 / 30m', focus: 90 },
      ];

      const rhythmCard = h('section', { className: 'pomo-card' },
        h('div', { className: 'pomo-card-head' },
          h('h3', null, h(Icon, { name: 'timer', size: 15 }), t('rhythm')),
          h('span', { className: 'pomo-badge' }, `${config.focus}m · ${config.short}m · ${config.long}m`)),

        h('div', { className: 'pomo-preset-cards' },
          presetCards.map((p) => h('button', {
            key: p.id,
            type: 'button',
            className: 'pomo-preset-card',
            'data-on': config.focus === p.focus ? 'true' : 'false',
            onClick: () => send({ type: 'preset', preset: p.id }),
          },
            h('b', null, `${p.icon} ${p.title}`),
            h('span', null, p.desc)))),

        h('div', { className: 'pomo-subgrid-2' },
          h(StepperRow, {
            label: t('focusLen'),
            value: config.focus, min: 1, max: 180, step: 5, unit: 'm',
            onChange: (value) => send({ type: 'config', patch: { focus: value } }),
          }),
          h(StepperRow, {
            label: t('shortLen'),
            value: config.short, min: 1, max: 180, step: 1, unit: 'm',
            onChange: (value) => send({ type: 'config', patch: { short: value } }),
          }),
          h(StepperRow, {
            label: t('longLen'),
            value: config.long, min: 1, max: 180, step: 5, unit: 'm',
            onChange: (value) => send({ type: 'config', patch: { long: value } }),
          }),
          h(StepperRow, {
            label: t('goalLen'),
            value: config.dailyGoalMinutes || 120, min: 15, max: 720, step: 15, unit: 'm',
            onChange: (value) => send({ type: 'config', patch: { dailyGoalMinutes: value } }),
          })),

        h('div', { className: 'pomo-subgrid-2' },
          h('div', { className: 'pomo-subbox' },
            h('span', { style: { fontSize: '12px', fontWeight: 550, whiteSpace: 'nowrap' } }, t('longEvery')),
            h('div', { className: 'pomo-energy-pills', style: { gap: '4px' } },
              [2, 3, 4, 6].map((n) => h('button', {
                key: n,
                type: 'button',
                className: 'pomo-energy-pill',
                style: { padding: '3.5px 8px', fontSize: '11.5px' },
                'data-on': config.longEvery === n ? 'true' : 'false',
                onClick: () => send({ type: 'config', patch: { longEvery: n } }),
              }, `${n}`)))),
          h('div', { className: 'pomo-subbox' },
            h('span', { style: { fontSize: '12px', fontWeight: 550, whiteSpace: 'nowrap' } }, t('minTree')),
            h('div', { className: 'pomo-energy-pills', style: { gap: '4px' } },
              [5, 10, 25, 45].map((n) => h('button', {
                key: n,
                type: 'button',
                className: 'pomo-energy-pill',
                style: { padding: '3.5px 7px', fontSize: '11.5px' },
                'data-on': config.minTreeMinutes === n ? 'true' : 'false',
                onClick: () => send({ type: 'config', patch: { minTreeMinutes: n } }),
              }, `${n}m`)))),
          h('div', { className: 'pomo-subbox' },
            h('span', { style: { fontSize: '12px', fontWeight: 550, whiteSpace: 'nowrap' } }, t('autoBreaks')),
            h(Switch, { checked: config.autoStartBreaks, label: t('autoBreaks'), onChange: (value) => send({ type: 'config', patch: { autoStartBreaks: value } }) })),
          h('div', { className: 'pomo-subbox' },
            h('span', { style: { fontSize: '12px', fontWeight: 550, whiteSpace: 'nowrap' } }, t('autoFocus')),
            h(Switch, { checked: config.autoStartFocus, label: t('autoFocus'), onChange: (value) => send({ type: 'config', patch: { autoStartFocus: value } }) })),
          h('div', { className: 'pomo-subbox' },
            h('span', { style: { fontSize: '12px', fontWeight: 550, whiteSpace: 'nowrap' } }, t('ambientAuto')),
            h(Switch, { checked: config.ambientAuto !== false, label: t('ambientAuto'), onChange: (value) => send({ type: 'config', patch: { ambientAuto: value } }) })),
          h('div', { className: 'pomo-subbox' },
            h('span', { style: { fontSize: '12px', fontWeight: 550, whiteSpace: 'nowrap' } }, t('completionSound')),
            h('div', { style: { display: 'flex', alignItems: 'center', gap: '6px', flex: 'none' } },
              h('button', { type: 'button', className: 'pomo-btn ghost small', style: { padding: '3px 8px' }, onClick: chime }, t('previewSound')),
              h(Switch, { checked: config.sound, label: t('sound'), onChange: (value) => send({ type: 'config', patch: { sound: value } }) })))));

      const cloudCard = h('section', { className: 'pomo-card' },
        h('div', { className: 'pomo-card-head' },
          h('h3', null, h(Icon, { name: 'spark', size: 15 }), t('settingsBackup')),
          backup && backup.lastAt
            ? h('span', { className: 'pomo-badge' }, fill(t('backupLast'), { time: new Date(backup.lastAt).toLocaleString() }))
            : h('span', { className: 'pomo-badge' }, t('backupNever'))),
        h('p', null, t('backupHint')),
        draft ? h('div', { style: { display: 'flex', flexDirection: 'column', gap: '12px' } },
          h('div', { className: 'pomo-row', style: { flexWrap: 'wrap' } },
            h(Segmented, {
              value: draft.provider,
              options: [
                { value: 'none', label: t('backupNone') },
                { value: 'webdav', label: t('backupWebdav') },
                { value: 's3', label: t('backupS3') },
              ],
              onChange: (value) => {
                patch('provider', value);
                if (value === 'none' && backup && backup.provider !== 'none') {
                  void send({ type: 'backup-save', patch: { provider: 'none' } });
                }
              },
            }),
            draft.provider !== 'none' ? h('div', { className: 'pomo-actions' },
              h('button', { type: 'button', className: 'pomo-btn primary small', onClick: () => saveBackup(t('backupSaved')) }, t('saved')),
              h('button', { type: 'button', className: 'pomo-btn small', disabled: busy, onClick: () => void runBackup() }, busy ? t('forceBackup') : t('backupNow'))) : null),
          draft.provider === 'webdav' ? h('div', { className: 'pomo-subgrid-2' },
            h(TextField, { label: t('webdavUrl'), value: draft.url, hint: t('webdavUrlHint'), onChange: (value) => patch('url', value) }),
            h(TextField, { label: t('webdavPath'), value: draft.path, onChange: (value) => patch('path', value) }),
            h(TextField, { label: t('webdavUser'), value: draft.username, onChange: (value) => patch('username', value) }),
            h(TextField, { label: t('webdavPassword'), value: draft.password, type: 'password', placeholder: backup && backup.webdav.hasPassword ? t('webdavSecretSaved') : '', onChange: (value) => patch('password', value) })) : null,
          draft.provider === 's3' ? h('div', { className: 'pomo-subgrid-2' },
            h(TextField, { label: t('s3Endpoint'), value: draft.endpoint, placeholder: 'https://s3.example.com', onChange: (value) => patch('endpoint', value) }),
            h(TextField, { label: t('s3Region'), value: draft.region, onChange: (value) => patch('region', value) }),
            h(TextField, { label: t('s3Bucket'), value: draft.bucket, onChange: (value) => patch('bucket', value) }),
            h(TextField, { label: t('s3Prefix'), value: draft.prefix, onChange: (value) => patch('prefix', value) }),
            h(TextField, { label: t('s3AccessKey'), value: draft.accessKey, onChange: (value) => patch('accessKey', value) }),
            h(TextField, { label: t('s3SecretKey'), value: draft.secretKey, type: 'password', placeholder: backup && backup.s3.hasSecret ? t('webdavSecretSaved') : '', onChange: (value) => patch('secretKey', value) })) : null,
          draft.provider !== 'none' ? h('div', { className: 'pomo-subbox' },
            h('span', { style: { fontSize: '12px', fontWeight: 550 } }, t('autoBackup')),
            h(Switch, { checked: draft.auto, label: t('autoBackup'), onChange: (value) => patch('auto', value) })) : null,
          draft.provider === 'none' ? h('div', { className: 'pomo-subbox', style: { flexWrap: 'wrap' } },
            h('div', { className: 'pomo-row-label' },
              h('b', null, t('localSnapshot')),
              h('span', null, t('localSnapshotHint'))),
            h('div', { className: 'pomo-actions' },
              h('a', { className: 'pomo-btn small', href: `${API}/export`, download: '' }, `📤 ${t('exportData')}`),
              h('button', { type: 'button', className: 'pomo-btn small', disabled: importing, onClick: () => fileRef.current?.click() }, `📥 ${t('importData')}`),
              h('input', {
                ref: fileRef,
                type: 'file',
                accept: 'application/json',
                style: { display: 'none' },
                onChange: (event) => {
                  const file = event.target.files && event.target.files[0];
                  event.target.value = '';
                  void importFile(file);
                },
              }))) : null,
          backup && backup.lastError ? h('div', { className: 'pomo-banner error' }, h('span', null, fill(t('backupFailed'), { message: backup.lastError }))) : null) : h('div', { className: 'pomo-loading' }, t('loading')));

      const combinedTasks = taskFilter === 'active'
        ? activeList.map((item) => ({ ...item, _archived: false }))
        : archivedList.map((item) => ({ ...item, _archived: true }));
      const filteredTasks = combinedTasks.filter((item) =>
        !taskQuery.trim() || item.name.toLowerCase().includes(taskQuery.trim().toLowerCase())
      );

      const handleQuickAddTask = async () => {
        const clean = newTaskName.trim();
        if (!clean) return;
        await send({ type: 'task-add', name: clean, priority: 'medium', estimatedPomodoros: 2 });
        setNewTaskName('');
      };

      const cyclePriority = (current) => (current === 'high' ? 'medium' : current === 'medium' ? 'low' : 'high');

      const tasksCard = h('section', { className: 'pomo-card' },
        h('div', { className: 'pomo-card-head' },
          h('h3', null, h(Icon, { name: 'check', size: 15 }), t('manageTasks')),
          h(Segmented, {
            value: taskFilter,
            options: [
              { value: 'active', label: `${t('activeTasksHeader')} (${activeList.length})` },
              { value: 'archived', label: `${t('archivedTasksHeader')} (${archivedList.length})` },
            ],
            onChange: setTaskFilter,
          })),

        h('div', { style: { display: 'flex', gap: '8px', flexWrap: 'wrap' } },
          h('input', {
            type: 'text',
            className: 'pomo-finish-input',
            placeholder: t('filterTasks'),
            value: taskQuery,
            onChange: (e) => setTaskQuery(e.target.value),
          }),
          h('input', {
            type: 'text',
            className: 'pomo-finish-input',
            placeholder: t('taskNamePlaceholder'),
            value: newTaskName,
            onChange: (e) => setNewTaskName(e.target.value),
            onKeyDown: (e) => { if (e.key === 'Enter') void handleQuickAddTask(); },
          }),
          h('button', { type: 'button', className: 'pomo-btn primary small', onClick: () => void handleQuickAddTask() },
            h(Icon, { name: 'plus', size: 13 }), t('taskCreate'))),

        filteredTasks.length
          ? h('div', { className: 'pomo-stepper-list', style: { maxHeight: '220px', overflowY: 'auto' } },
              filteredTasks.map((item) => h('div', {
                key: item.id,
                className: 'pomo-stepper-row',
                style: item._archived ? { opacity: 0.68 } : undefined,
              },
                h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 } },
                  h('button', {
                    type: 'button',
                    className: 'pomo-prio-badge',
                    'data-prio': item.priority || 'medium',
                    title: t('cyclePriority'),
                    style: { border: 0, cursor: 'pointer' },
                    onClick: () => send({ type: 'task-update', id: item.id, patch: { priority: cyclePriority(item.priority || 'medium') } }),
                  }, t(item.priority === 'high' ? 'priorityHigh' : item.priority === 'low' ? 'priorityLow' : 'priorityMedium')),
                  h('div', { style: { display: 'flex', flexDirection: 'column', minWidth: 0 } },
                    h('b', { style: { fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, item.name),
                    h('span', { style: { fontSize: '10.5px', color: 'var(--dsw-alias-label-secondary)' } },
                      `${formatDuration(item.totalFocusMs || 0, locale)} · ${(item.subtasks || []).filter((s) => s.done).length}/${(item.subtasks || []).length}`))),
                h('div', { style: { display: 'flex', alignItems: 'center', gap: '6px', flex: 'none' } },
                  h('div', { className: 'pomo-stepper-ctrl' },
                    h('button', {
                      type: 'button',
                      className: 'pomo-step-btn',
                      onClick: () => send({ type: 'task-update', id: item.id, patch: { estimatedPomodoros: Math.max(1, (item.estimatedPomodoros || 1) - 1) } }),
                    }, '−'),
                    h('span', { style: { fontSize: '11px', fontWeight: 600, minWidth: '46px', textAlign: 'center', fontVariantNumeric: 'tabular-nums' } },
                      `🍅 ${item.completedPomodoros || 0}/${item.estimatedPomodoros || 1}`),
                    h('button', {
                      type: 'button',
                      className: 'pomo-step-btn',
                      onClick: () => send({ type: 'task-update', id: item.id, patch: { estimatedPomodoros: Math.min(24, (item.estimatedPomodoros || 1) + 1) } }),
                    }, '+')),
                  h('button', {
                    type: 'button',
                    className: 'pomo-btn ghost small',
                    style: { padding: '4px 8px' },
                    onClick: () => send({ type: 'task-archive', id: item.id, archived: !item._archived }),
                  }, item._archived ? t('restore') : t('archive')),
                  h('button', {
                    type: 'button',
                    className: 'pomo-btn ghost small',
                    style: { padding: '4px 8px' },
                    onClick: () => { if (window.confirm(t('confirmRemove'))) send({ type: 'task-delete', id: item.id }); },
                  }, t('remove'))))))
          : h('div', { className: 'pomo-empty' }, t('noTasks')));

      return h('div', { className: 'pomo-page', style },
        message ? h('div', { className: message.kind === 'error' ? 'pomo-banner error' : 'pomo-banner' }, h('span', null, message.text)) : null,
        h('div', { className: 'pomo-bento-prefs' },
          hudCard,
          rhythmCard,
          cloudCard,
          tasksCard));
    }

    function detectTheme() {
      try {
        const probe = getComputedStyle(document.documentElement).getPropertyValue('--dsw-alias-bg-base').trim();
        let rgb = null;
        if (probe) {
          const hex = probe.match(/^#([0-9a-f]{6})$/i);
          const nums = probe.match(/(\d+(?:\.\d+)?)/g);
          if (hex) {
            const value = parseInt(hex[1], 16);
            rgb = [(value >> 16) & 255, (value >> 8) & 255, value & 255];
          } else if (nums && nums.length >= 3) {
            rgb = nums.slice(0, 3).map(Number);
          }
        }
        if (rgb && rgb.every((channel) => Number.isFinite(channel))) {
          const luminance = (0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]) / 255;
          return luminance > 0.55 ? 'light' : 'dark';
        }
      } catch (error) { /* fall through */ }
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }

    function App(props) {
      const t = props.t;
      const ctx = props.ctx;
      const [tab, setTab] = React.useState('timer');
      const [year, setYear] = React.useState(() => new Date().getFullYear());
      const { snapshot, error, refresh, send } = useTimer(false);
      const statsState = useStats(year);
      const [lastCompleted, setLastCompleted] = React.useState(null);
      const [notice, setNotice] = React.useState(null);
      const [soundRevision, setSoundRevision] = React.useState(0);
      const bumpSound = React.useCallback(() => setSoundRevision((v) => v + 1), []);
      const seenFinish = React.useRef(null);
      const finishInfo = snapshot && snapshot.timer ? snapshot.timer.lastFinish : null;
      const finishAt = finishInfo ? finishInfo.at : 0;

      React.useEffect(() => {
        const onKey = (event) => {
          if (event.code !== 'Space') return;
          const tag = (event.target && event.target.tagName) || '';
          if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || tag === 'BUTTON') return;
          event.preventDefault();
          void send({ type: 'toggle' });
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
      }, [send]);

      const timerStatus = snapshot && snapshot.timer ? snapshot.timer.status : 'idle';
      const timerMode = snapshot && snapshot.timer ? snapshot.timer.mode : 'focus';
      const ambientAuto = snapshot && snapshot.timer && snapshot.timer.config ? snapshot.timer.config.ambientAuto : true;

      React.useEffect(() => {
        if (!ambientAuto || !Soundscape.hasAnyVolume()) return;
        const shouldPlay = timerStatus === 'running' && timerMode === 'focus';
        Soundscape.setMuted(!shouldPlay);
        bumpSound();
      }, [timerStatus, timerMode, ambientAuto, bumpSound]);

      React.useEffect(() => {
        if (!snapshot || !snapshot.timer) return;
        if (seenFinish.current === null) { seenFinish.current = finishAt; return; }
        if (finishAt === seenFinish.current) return;
        seenFinish.current = finishAt;
        if (!finishInfo || finishInfo.kind === 'break') return;
        if (finishInfo.kind === 'recorded') {
          setNotice(finishInfo.flowBreakMinutes
            ? fill(t('noticeFlowRecorded'), { time: clock(finishInfo.durationMs), breakMin: finishInfo.flowBreakMinutes })
            : fill(t('noticeRecorded'), { time: clock(finishInfo.durationMs) }));
        } else {
          setNotice(t('noticeShort'));
        }
      }, [finishAt, snapshot]);

      React.useEffect(() => {
        if (!notice) return undefined;
        const timeout = setTimeout(() => setNotice(null), 5000);
        return () => clearTimeout(timeout);
      }, [notice]);

      const localeSnapshot = React.useSyncExternalStore(
        React.useCallback((listener) => ctx.locale.subscribe(listener), [ctx]),
        React.useCallback(() => ctx.locale.getSnapshot(), [ctx]),
      );
      const locale = /^zh(?:-|$)/i.test(localeSnapshot.active) ? 'zh' : 'en';

      React.useEffect(() => {
        if (!snapshot || !snapshot.timer) return;
        if (lastCompleted === null) {
          setLastCompleted(snapshot.timer.lastCompletedAt || 0);
          return;
        }
        if (snapshot.timer.lastCompletedAt && snapshot.timer.lastCompletedAt !== lastCompleted) {
          setLastCompleted(snapshot.timer.lastCompletedAt);
          if (snapshot.timer.config.sound) chime();
          void statsState.refresh();
        }
      }, [snapshot, lastCompleted, statsState]);

      const timer = snapshot ? snapshot.timer : null;
      const palette = timer ? getThemePalette(timer.mode, timer.direction) : APPEARANCE.focus;

      React.useEffect(() => {
        if (tab === 'stats' || tab === 'forest') void statsState.refresh();
      }, [tab, statsState.refresh]);

      const themeMode = timer ? timer.config.theme : null;

      React.useEffect(() => {
        if (themeMode !== 'auto') return undefined;
        let reported = null;
        const push = () => {
          const value = detectTheme();
          if (value === reported) return;
          reported = value;
          void send({ type: 'theme', value });
        };
        push();
        let observer = null;
        if (typeof MutationObserver === 'function') {
          observer = new MutationObserver(push);
          observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'style', 'data-theme', 'data-color-scheme'] });
        }
        const media = window.matchMedia ? window.matchMedia('(prefers-color-scheme: light)') : null;
        if (media && media.addEventListener) media.addEventListener('change', push);
        const ticker = setInterval(push, 4000);
        return () => {
          if (observer) observer.disconnect();
          if (media && media.removeEventListener) media.removeEventListener('change', push);
          clearInterval(ticker);
        };
      }, [themeMode, send]);

      const siteStyle = {
        '--pomo-accent': palette.accent,
        '--pomo-accent-2': palette.accent2,
        '--pomo-soft': palette.soft,
        '--pomo-glow': palette.glow,
      };

      const content = !timer
        ? h('div', { className: 'pomo-page', style: siteStyle },
            h('div', { className: 'pomo-loading' }, error ? t('hostDown') : t('loading')),
            error ? h('div', { className: 'pomo-actions', style: { justifyContent: 'center' } },
              h('button', { type: 'button', className: 'pomo-btn primary', onClick: () => refresh() }, t('retry'))) : null)
        : tab === 'timer'
          ? h(TimerTab, { timer, snapshot, send, t, locale, stats: statsState.stats, refreshStats: statsState.refresh, soundRevision, bumpSound })
          : tab === 'stats'
            ? h(StatsTab, { statsPayload: statsState.stats, year, setYear, t, locale, send, refreshStats: statsState.refresh })
            : tab === 'forest'
              ? h(ForestTab, { statsPayload: statsState.stats, t, locale })
              : h(SettingsTab, { timer, snapshot, send, t, locale });

      const windowInfo = snapshot && snapshot.window ? snapshot.window : { open: false, available: false };
      const soundPlaying = Soundscape.isActive();

      return h('div', { style: siteStyle, className: 'pomo-shell' },
        h('nav', { className: 'pomo-nav' },
          h('div', { className: 'pomo-brand' },
            h('span', { className: 'pomo-brand-mark' }, h(PanelIcon, { size: 17 })),
            h('div', { className: 'pomo-brand-meta' },
              h('b', null, t('panel')),
              timer ? h('span', null,
                t(timer.status === 'running' ? 'running' : timer.status === 'paused' ? 'paused' : 'ready') +
                ` · 🍅 ${timer.completedToday}`) : null)),

          h('div', { className: 'pomo-tabs', role: 'tablist' },
            [
              { id: 'timer', label: t('tabTimer'), icon: 'timer' },
              { id: 'stats', label: t('tabStats'), icon: 'chart' },
              { id: 'forest', label: t('tabForest'), icon: 'leaf' },
              { id: 'settings', label: t('tabSettings'), icon: 'gear' },
            ].map((item) => h('button', {
              key: item.id,
              type: 'button',
              role: 'tab',
              className: 'pomo-tab',
              'aria-selected': tab === item.id ? 'true' : 'false',
              'data-on': tab === item.id ? 'true' : 'false',
              onClick: () => setTab(item.id),
            }, h(Icon, { name: item.icon, size: 15 }), h('span', null, item.label)))),

          h('div', { className: 'pomo-nav-end' },
            h('button', {
              type: 'button',
              className: 'pomo-pill-btn',
              'data-active': soundPlaying ? 'true' : 'false',
              title: soundPlaying ? t('ambientPlaying') : t('ambientMuted'),
              onClick: () => {
                if (!Soundscape.hasAnyVolume()) {
                  Soundscape.setScene('study');
                } else {
                  Soundscape.setMuted(!Soundscape.muted);
                }
                bumpSound();
              },
            },
              h('span', { className: 'pomo-eq', 'data-on': soundPlaying ? 'true' : 'false' },
                h('i'), h('i'), h('i')),
              h('span', null, soundPlaying ? t('chRain') : t('sceneNone'))),

            windowInfo.available ? h('button', {
              type: 'button',
              className: 'pomo-pill-btn',
              'data-active': windowInfo.open ? 'true' : 'false',
              onClick: () => send({ type: windowInfo.open ? 'window-close' : 'window-open' }),
            },
              h('i', { className: 'pomo-pulse', 'data-on': windowInfo.open ? 'true' : 'false' }),
              h('span', null, windowInfo.open ? t('closeWidget') : t('openWidget'))) : null)),

        error && timer ? h('div', { className: 'pomo-banner-wrap' }, h('div', { className: 'pomo-banner error' }, h('span', null, error))) : null,
        notice ? h('div', { className: 'pomo-banner-wrap', role: 'status' }, h('div', { className: 'pomo-banner' }, h('span', null, notice))) : null,
        content);
    }

    function createPage(t, ctx) {
      function PomodoroPage() {
        return h(App, { t, ctx });
      }
      return PomodoroPage;
    }

    function PanelIcon(props) {
      const size = props.size || 16;
      return h('svg', {
        viewBox: '0 0 24 24', width: size, height: size, fill: 'none',
        stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round',
        'aria-hidden': true,
      },
        h('circle', { cx: 12, cy: 13, r: 8 }),
        h('path', { d: 'M12 9v4l2.8 1.8' }),
        h('path', { d: 'M9 3c1.5 1.2 4.5 1.2 6 0' }));
    }

    return {
      inject: ['slots', 'locale'],
      apply(ctx) {
        ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'pomodoro: dictionaries');
        const t = ctx.locale.bind(NS);

        ctx.effect(() => {
          let alive = true;
          let lastLocale = null;
          let pending = Promise.resolve();
          const syncLocale = () => {
            const value = ctx.locale.getSnapshot().active;
            if (value === lastLocale) return;
            lastLocale = value;
            pending = pending.then(() => {
              if (!alive) return;
              return request(`${API}/action`, {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ type: 'locale', value }),
              });
            }).catch(() => {
              if (lastLocale === value) lastLocale = null;
            });
          };
          const unsubscribe = ctx.locale.subscribe(syncLocale);
          syncLocale();
          return () => { alive = false; unsubscribe(); };
        }, 'pomodoro: widget locale');

        ctx.effect(() => {
          const layer = document.createElement('style');
          layer.setAttribute('data-dsh-pomodoro', '');
          layer.textContent = css;
          document.head.append(layer);
          return () => layer.remove();
        }, 'pomodoro: styles');

        ctx.slots.inject('main', () => ctx.slots.register({
          name: 'main',
          key: PANEL_ID,
          locale: NS,
        }, createPage(t, ctx)));

        ctx.slots.inject('sidebar.panellist', () => ctx.slots.register({
          name: 'sidebar.panellist',
          id: PANEL_ID,
          order: 13,
          locale: NS,
          label: () => t('panel'),
        }, PanelIcon));
      },
    };
  },
});
