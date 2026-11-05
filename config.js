import Schema from '@deepseek-ai/schemastery';
import { DEFAULTS, normalizeConfig } from './core.js';
import { publicBackup } from './store.js';

export function backupSettings(raw = {}) {
  const { provider, auto, webdav, s3 } = publicBackup(raw);
  return { provider, auto, webdav, s3 };
}

const integer = (min, max, value) => Schema.number().min(min).max(max).step(1).default(value);
const choice = (values, value) => Schema.union(values.map(item => Schema.const(item))).default(value);

/** Standard Loader Config. Secrets and business history are deliberately excluded. */
export const Config = Schema.object({
  configVersion: integer(0, 1, 0).description('Settings migration version / 设置迁移版本'),
  focus: integer(1, 180, DEFAULTS.focus).description('Focus minutes / 专注分钟'),
  short: integer(1, 180, DEFAULTS.short).description('Short break minutes / 短休息分钟'),
  long: integer(1, 180, DEFAULTS.long).description('Long break minutes / 长休息分钟'),
  longEvery: integer(2, 8, DEFAULTS.longEvery).description('Rounds per long break / 长休息间隔'),
  dailyGoalMinutes: integer(15, 720, DEFAULTS.dailyGoalMinutes).description('Daily focus goal / 每日专注目标'),
  autoStartBreaks: Schema.boolean().default(DEFAULTS.autoStartBreaks),
  autoStartFocus: Schema.boolean().default(DEFAULTS.autoStartFocus),
  sound: Schema.boolean().default(DEFAULTS.sound),
  ambientPreset: choice(['none', 'rain', 'campfire', 'ocean', 'binaural', 'custom'], DEFAULTS.ambientPreset),
  ambientAuto: Schema.boolean().default(DEFAULTS.ambientAuto),
  desktopEnabled: Schema.boolean().default(DEFAULTS.desktopEnabled),
  alwaysOnTop: Schema.boolean().default(DEFAULTS.alwaysOnTop),
  miniMode: choice(['card', 'ring', 'bare'], DEFAULTS.miniMode),
  theme: choice(['auto', 'light', 'dark'], DEFAULTS.theme),
  opacity: Schema.number().min(0.3).max(1).step(0.01).default(DEFAULTS.opacity),
  autoShow: Schema.boolean().default(DEFAULTS.autoShow),
  minTreeMinutes: integer(1, 180, DEFAULTS.minTreeMinutes),
  backupConfigVersion: integer(0, 1, 0).description('Backup settings migration version / 备份设置迁移版本'),
  backup: Schema.object({
    provider: choice(['none', 'webdav', 's3'], 'none'),
    auto: Schema.boolean().default(false),
    webdav: Schema.object({
      url: Schema.string().default(''), username: Schema.string().default(''),
      path: Schema.string().default('dsh-pomodoro/pomodoro-backup.json'),
    }),
    s3: Schema.object({
      endpoint: Schema.string().default(''), region: Schema.string().default('us-east-1'),
      bucket: Schema.string().default(''), accessKey: Schema.string().default(''),
      prefix: Schema.string().default('dsh-pomodoro'),
    }),
  }).description('Backup destination metadata; secrets belong in Credentials / 备份目标，密码保存在凭据服务'),
});

export const SETTING_KEYS = Object.keys(DEFAULTS);

/** Merge only known tunables; never copy arbitrary client values into profile config. */
export function settingsPatch(current, patch) {
  const allowed = Object.fromEntries(SETTING_KEYS.filter(key => Object.hasOwn(patch || {}, key)).map(key => [key, patch[key]]));
  const result = { ...current, ...normalizeConfig({ ...current, ...allowed }), configVersion: 1 };
  if (current.backup || patch?.backup) {
    const before = current.backup || {};
    const next = patch?.backup || {};
    result.backup = backupSettings({ ...before, ...next,
      webdav: { ...before.webdav, ...next.webdav }, s3: { ...before.s3, ...next.s3 } });
    result.backupConfigVersion = 1;
  }
  return result;
}

/** Legacy values seed the first migration; explicit profile values take precedence. */
export function migratedSettings(legacy, current, inherited = {}) {
  return settingsPatch({ ...normalizeConfig(legacy), ...inherited, ...current }, {});
}
