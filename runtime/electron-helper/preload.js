/**
 * Bridge between the Host-served widget page and its own Electron window.
 *
 * The page can not resize or fade the window it lives in, so it asks for it
 * through this tiny channel. Everything is fire-and-forget: the page never
 * needs an answer, and the window keeps working when the bridge is missing
 * (e.g. when the page is opened in a normal browser for testing).
 */
'use strict';

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('pomodoroWindow', {
  opacity: (value) => ipcRenderer.send('pomodoro:opacity', value),
  resize: (width, height) => ipcRenderer.send('pomodoro:resize', width, height),
  alwaysOnTop: (value) => ipcRenderer.send('pomodoro:always-on-top', value),
  moveBy: (dx, dy) => ipcRenderer.send('pomodoro:move-by', dx, dy),
  close: () => ipcRenderer.send('pomodoro:close'),
});
