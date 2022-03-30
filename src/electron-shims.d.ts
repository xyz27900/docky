import { RendererProcessIpc } from 'electron-better-ipc';

declare global {
  interface Window {
    ipcRenderer: RendererProcessIpc
  }
}
