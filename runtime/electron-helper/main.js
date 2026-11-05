/**
 * Desktop half of the Pomodoro plugin: one frameless, always-on-top Electron
 * window that renders the Host-served widget page. The Host starts this with
 * its cached Electron runtime; the window is only a view, all timer state
 * stays in the Host process.
 *
 * Keep this file CommonJS: Electron treats the folder as the app directory.
 */
'use strict';

const path = require('node:path');
const { app, BrowserWindow, ipcMain, screen } = require('electron');

const url = process.env.POMODORO_URL || '';
const actionUrl = process.env.POMODORO_ACTION_URL || '';
const width = clamp(Number(process.env.POMODORO_WIDTH), 60, 620, 132);
const height = clamp(Number(process.env.POMODORO_HEIGHT), 36, 520, 56);
const opacity = clampFloat(Number(process.env.POMODORO_OPACITY), 0.3, 1, 1);
const alwaysOnTop = process.env.POMODORO_ALWAYS_ON_TOP !== '0';
const recoveryDir = process.env.POMODORO_DATA_DIR || app.getPath('userData');

function clamp(value, min, max, fallback) {
  if (!Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, Math.round(value)));
}

function clampFloat(value, min, max, fallback) {
  if (!Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, value));
}

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.setPath('userData', path.join(recoveryDir, 'electron-profile'));
  app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');
  app.commandLine.appendSwitch('lang', 'zh-CN');

  let win = null;
  let movedTimer = 0;
  let reloadTimer = 0;

  function defaultBounds() {
    const area = screen.getPrimaryDisplay().workArea;
    return {
      x: area.x + area.width - width - 28,
      y: area.y + 64,
    };
  }

  function reportPosition() {
    if (!win || !actionUrl) return;
    const [x, y] = win.getPosition();
    const body = JSON.stringify({ type: 'window-position', x, y });
    fetch(actionUrl, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body,
    }).catch(() => {});
  }

  function createWindow() {
    const savedX = Number(process.env.POMODORO_X);
    const savedY = Number(process.env.POMODORO_Y);
    const fallback = defaultBounds();
    const x = Number.isFinite(savedX) && savedX > -10000 ? savedX : fallback.x;
    const y = Number.isFinite(savedY) && savedY > -10000 ? savedY : fallback.y;

    win = new BrowserWindow({
      width,
      height,
      x,
      y,
      show: false,
      frame: false,
      transparent: true,
      backgroundColor: '#00000000',
      resizable: false,
      maximizable: false,
      minimizable: false,
      fullscreenable: false,
      skipTaskbar: true,
      alwaysOnTop,
      // Keep both the native window and the page shadow-free, including the
      // transparent area surrounding the round widget.
      hasShadow: false,
      roundedCorners: false,
      title: '番茄钟',
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: true,
        backgroundThrottling: false,
      },
    });

    if (alwaysOnTop) win.setAlwaysOnTop(true, 'screen-saver');
    win.setSkipTaskbar(true);
    if (opacity < 1) win.setOpacity(opacity);

    // The page drives these three: it is the only place that knows the user's
    // opacity setting and the mini-mode size it is currently rendering.
    ipcMain.removeAllListeners('pomodoro:opacity');
    ipcMain.on('pomodoro:opacity', (event, value) => {
      if (!win || event.sender !== win.webContents) return;
      const next = clampFloat(Number(value), 0.3, 1, 1);
      if (win.isDestroyed()) return;
      win.setOpacity(next);
    });
    ipcMain.removeAllListeners('pomodoro:resize');
    ipcMain.on('pomodoro:resize', (event, w, h) => {
      if (!win || event.sender !== win.webContents || win.isDestroyed()) return;
      const nextWidth = clamp(Number(w), 60, 620, width);
      const nextHeight = clamp(Number(h), 36, 520, height);
      const [cx, cy] = win.getPosition();
      // Keep the grown window fully on the display it is on.
      const area = screen.getDisplayMatching({ x: cx, y: cy, width: nextWidth, height: nextHeight }).workArea;
      const x = Math.min(Math.max(cx, area.x), area.x + area.width - nextWidth);
      const y = Math.min(Math.max(cy, area.y), area.y + area.height - nextHeight);
      win.setBounds({ x, y, width: nextWidth, height: nextHeight });
    });
    ipcMain.removeAllListeners('pomodoro:always-on-top');
    ipcMain.on('pomodoro:always-on-top', (event, value) => {
      if (!win || event.sender !== win.webContents || win.isDestroyed()) return;
      win.setAlwaysOnTop(Boolean(value), 'screen-saver');
    });
    ipcMain.removeAllListeners('pomodoro:move-by');
    ipcMain.on('pomodoro:move-by', (event, dx, dy) => {
      if (!win || event.sender !== win.webContents || win.isDestroyed()) return;
      const stepX = clamp(Number(dx), -4000, 4000, 0);
      const stepY = clamp(Number(dy), -4000, 4000, 0);
      if (!stepX && !stepY) return;
      const [x, y] = win.getPosition();
      win.setPosition(x + stepX, y + stepY);
    });
    ipcMain.removeAllListeners('pomodoro:close');
    ipcMain.on('pomodoro:close', (event) => {
      if (!win || event.sender !== win.webContents) return;
      app.quit();
    });

    win.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
    win.webContents.on('will-navigate', (event, target) => {
      if (!url || !target.startsWith(url.replace(/\/widget.*$/, ''))) event.preventDefault();
    });

    win.once('ready-to-show', () => {
      if (!win) return;
      // `show()` (not showInactive) keeps the window focusable: a window that
      // never takes focus swallows the first click on its buttons on Windows.
      win.show();
    });

    win.on('moved', () => {
      clearTimeout(movedTimer);
      movedTimer = setTimeout(reportPosition, 500);
      movedTimer.unref?.();
    });

    win.on('closed', () => {
      win = null;
      app.quit();
    });

    win.webContents.on('did-fail-load', () => {
      clearTimeout(reloadTimer);
      reloadTimer = setTimeout(() => {
        if (win && url) win.loadURL(url).catch(() => {});
      }, 1500);
      reloadTimer.unref?.();
    });

    if (!url) {
      win.loadURL(
        'data:text/html;charset=utf-8,' +
          encodeURIComponent(
            '<body style="margin:0;background:#1b1b24;color:#f6f3ee;font:13px system-ui;display:grid;place-items:center;height:100vh">' +
              'Pomodoro widget URL is missing.</body>'
          )
      );
      return;
    }

    win.loadURL(url).catch(() => {});
  }

  app.whenReady().then(() => {
    createWindow();
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
      else if (win) win.show();
    });
  });

  app.on('window-all-closed', () => app.quit());
  app.on('second-instance', () => {
    if (win) win.show();
  });
}
