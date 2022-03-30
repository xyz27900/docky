// eslint-disable-next-line @typescript-eslint/no-var-requires
const { ipcRenderer } = require('electron-better-ipc');
window.ipcRenderer = ipcRenderer;
