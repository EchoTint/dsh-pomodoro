import { credentialKey } from '@deepseek-ai/dsh-credentials';
import { publicBackup } from './store.js';

const KEYS = {
  webdav: credentialKey('pomodoro', 'webdav'),
  s3: credentialKey('pomodoro', 's3'),
};

export function backupCredentials(service) {
  async function write(provider, value, preserveExisting = false) {
    if (typeof value !== 'string' || !value) return;
    await service.modifyRecord(KEYS[provider], async current => {
      if (preserveExisting && current?.kind === 'api-key' && current.key) return undefined;
      return { kind: 'api-key', key: value };
    });
    const stored = await service.readRecord(KEYS[provider]);
    if (stored?.kind !== 'api-key' || !stored.key || (!preserveExisting && stored.key !== value)) {
      throw new Error('Backup credential could not be verified after saving');
    }
  }
  async function value(provider) {
    const record = await service.readRecord(KEYS[provider]);
    return record?.kind === 'api-key' ? record.key || '' : '';
  }
  return {
    /** Commit and verify credentials before removing legacy plaintext. Retry-safe. */
    async migrate(store) {
      const backup = store.data.backup;
      await write('webdav', backup.webdav?.password, true);
      await write('s3', backup.s3?.secretKey, true);
      store.data.backup = publicBackup(backup);
      if (!store.save()) throw new Error('Could not remove legacy backup credentials from local data');
    },
    async save(patch = {}) {
      if (patch.webdav?.clearPassword === true) await service.deleteRecord(KEYS.webdav);
      else await write('webdav', patch.webdav?.password);
      if (patch.s3?.clearSecret === true) await service.deleteRecord(KEYS.s3);
      else await write('s3', patch.s3?.secretKey);
    },
    async status(backup) {
      const [w, s] = await Promise.all([service.describeRecord(KEYS.webdav), service.describeRecord(KEYS.s3)]);
      const result = publicBackup(backup);
      result.webdav.hasPassword = w.configured;
      result.s3.hasSecret = s.configured;
      return result;
    },
    /** Resolve for each operation; secrets live only in the upload call's local object. */
    async resolve(backup) {
      const result = publicBackup(backup);
      result.webdav.password = await value('webdav');
      result.s3.secretKey = await value('s3');
      return result;
    },
  };
}
