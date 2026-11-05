/**
 * Cloud backup: WebDAV (jianguoyun / Nextcloud) and S3-compatible object
 * storage (AWS, MinIO, Cloudflare R2, Aliyun OSS via S3 gateway).
 *
 * Both upload the same JSON payload with a single PUT, so restoring is just
 * downloading the object and importing it from the settings screen.
 */

import { createHash, createHmac } from 'node:crypto';

const FILE_NAME = 'pomodoro-backup.json';

export function buildPayload(data) {
  return JSON.stringify(
    {
      app: 'dsh-pomodoro',
      version: 1,
      exportedAt: Date.now(),
      tasks: data.tasks || [],
      sessions: data.sessions || [],
      garden: data.garden || { trees: [] },
      settings: data.settings || undefined,
    },
    null,
    2,
  );
}

function joinUrl(base, path) {
  const left = String(base || '').replace(/\/+$/, '');
  const right = String(path || '').replace(/^\/+/, '');
  return right ? `${left}/${right}` : left;
}

async function request(url, init) {
  const response = await fetch(url, init);
  const text = await response.text().catch(() => '');
  return { ok: response.ok, status: response.status, text: text.slice(0, 400) };
}

export async function uploadWebdav(webdav, body) {
  const url = joinUrl(webdav.url, webdav.path || FILE_NAME);
  if (!/^https?:\/\//i.test(url)) throw new Error('WebDAV 地址需要以 http(s):// 开头');
  const headers = {
    'content-type': 'application/json; charset=utf-8',
    'content-length': String(Buffer.byteLength(body)),
  };
  if (webdav.username || webdav.password) {
    headers.authorization = 'Basic ' + Buffer.from(`${webdav.username || ''}:${webdav.password || ''}`).toString('base64');
  }
  const result = await request(url, { method: 'PUT', headers, body });
  if (!result.ok) throw new Error(`WebDAV 上传失败 (${result.status}) ${result.text}`);
  return { target: url, status: result.status };
}

const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const hmac = (key, value) => createHmac('sha256', key).update(value).digest();

function amzDate(date) {
  const iso = date.toISOString().replace(/[:-]|\.\d{3}/g, '');
  return { long: iso, short: iso.slice(0, 8) };
}

function s3Key(prefix) {
  const clean = String(prefix || '').replace(/^\/+|\/+$/g, '');
  return clean ? `${clean}/${FILE_NAME}` : FILE_NAME;
}

export function signS3({ method = 'PUT', url, region, accessKey, secretKey, payload, headers = {}, date = new Date() }) {
  const target = new URL(url);
  const { long, short } = amzDate(date);
  const payloadHash = sha256(payload);
  const host = target.host;
  const canonicalUri = target.pathname
    .split('/')
    .map((segment) => encodeURIComponent(decodeURIComponent(segment)))
    .join('/');

  const canonicalHeaders = {
    host,
    'x-amz-content-sha256': payloadHash,
    'x-amz-date': long,
    ...headers,
  };
  const sortedKeys = Object.keys(canonicalHeaders)
    .map((key) => key.toLowerCase())
    .sort();
  const normalized = {};
  for (const [key, value] of Object.entries(canonicalHeaders)) normalized[key.toLowerCase()] = String(value).trim();
  const signedHeaders = sortedKeys.join(';');
  const canonicalRequest = [
    method,
    canonicalUri || '/',
    target.search ? target.search.slice(1) : '',
    sortedKeys.map((key) => `${key}:${normalized[key]}\n`).join(''),
    signedHeaders,
    payloadHash,
  ].join('\n');

  const scope = `${short}/${region}/s3/aws4_request`;
  const stringToSign = ['AWS4-HMAC-SHA256', long, scope, sha256(canonicalRequest)].join('\n');
  const kDate = hmac(`AWS4${secretKey}`, short);
  const kRegion = hmac(kDate, region);
  const kService = hmac(kRegion, 's3');
  const kSigning = hmac(kService, 'aws4_request');
  const signature = createHmac('sha256', kSigning).update(stringToSign).digest('hex');

  return {
    ...normalized,
    authorization: `AWS4-HMAC-SHA256 Credential=${accessKey}/${scope}, SignedHeaders=${signedHeaders}, Signature=${signature}`,
  };
}

export async function uploadS3(s3, body) {
  if (!s3.endpoint || !s3.bucket || !s3.accessKey || !s3.secretKey) {
    throw new Error('S3 需要 endpoint、bucket、accessKey、secretKey');
  }
  const base = String(s3.endpoint).replace(/\/+$/, '');
  const url = `${base}/${encodeURIComponent(s3.bucket)}/${s3Key(s3.prefix).split('/').map(encodeURIComponent).join('/')}`;
  const region = s3.region || 'us-east-1';
  const headers = signS3({
    method: 'PUT',
    url,
    region,
    accessKey: s3.accessKey,
    secretKey: s3.secretKey,
    payload: body,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
  const result = await request(url, { method: 'PUT', headers: { ...headers, 'content-length': String(Buffer.byteLength(body)) }, body });
  if (!result.ok) throw new Error(`S3 上传失败 (${result.status}) ${result.text}`);
  return { target: url, status: result.status };
}

/** Strip secrets before the settings ever leave the Host process. */
export function maskBackup(backup) {
  const webdav = backup.webdav || {};
  const s3 = backup.s3 || {};
  return {
    provider: backup.provider,
    auto: backup.auto,
    webdav: {
      url: webdav.url || '',
      username: webdav.username || '',
      path: webdav.path || '',
      hasPassword: Boolean(webdav.password),
    },
    s3: {
      endpoint: s3.endpoint || '',
      region: s3.region || '',
      bucket: s3.bucket || '',
      prefix: s3.prefix || '',
      accessKey: s3.accessKey || '',
      hasSecret: Boolean(s3.secretKey),
    },
    lastAt: backup.lastAt ?? null,
    lastError: backup.lastError ?? null,
    lastTarget: backup.lastTarget ?? null,
  };
}

export async function uploadBackup(settings, data) {
  const body = buildPayload(data);
  if (settings.provider === 'webdav') {
    return { ...(await uploadWebdav(settings.webdav || {}, body)), bytes: body.length };
  }
  if (settings.provider === 's3') {
    return { ...(await uploadS3(settings.s3 || {}, body)), bytes: body.length };
  }
  throw new Error('未配置云备份方式');
}
