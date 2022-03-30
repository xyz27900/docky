import { resolve } from 'path';
import { app as electronApp, BrowserWindow, OpenDevToolsOptions, Menu } from 'electron';

type TypeOrFunction<T extends string | number | boolean> = T | (() => T);

type AppMode = 'path' | 'url';

type AppOptions = {
  width?: number;
  height?: number;
  resizable?: boolean;
  path: string;
  mode?: AppMode;
  devTools?: OpenDevToolsOptions;
  onCreate?: (window: BrowserWindow) => void;
}

const getValue = <T extends string | number | boolean>(value?: TypeOrFunction<T>): T | undefined => {
  return typeof value === 'function' ? value() : value;
};

export class App {
  private static PRELOADER_PATH = resolve(__dirname, 'preloader.js');
  private readonly width?: number;
  private readonly height?: number;
  private readonly resizable?: boolean;
  private readonly path: string;
  private readonly mode: AppMode;
  private readonly devTools?: OpenDevToolsOptions;
  private readonly onCreate?: (window: BrowserWindow) => void;

  constructor(options: AppOptions) {
    const { width, height, resizable, path, mode, devTools, onCreate } = options;
    this.width = width;
    this.height = height;
    this.resizable = resizable;
    this.path = path;
    this.mode = mode ?? 'url';
    this.devTools = devTools;
    this.onCreate = onCreate;
  }

  private async createWindow(): Promise<BrowserWindow> {
    const window = new BrowserWindow({
      width: getValue(this.width),
      height: getValue(this.height),
      resizable: getValue(this.resizable),
      webPreferences: {
        preload: App.PRELOADER_PATH,
        contextIsolation: false,
        devTools: !!this.devTools,
      },
    });

    if (this.mode === 'url') {
      await window.loadURL(this.path);
    } else if (this.mode === 'path') {
      await window.loadFile(this.path);
    }

    if (this.devTools) {
      window.webContents.openDevTools(this.devTools);
    } else {
      window.setMenu(null);
    }

    if (this.onCreate) {
      this.onCreate(window);
    }

    Menu.setApplicationMenu(Menu.buildFromTemplate([]));

    return window;
  }

  public async start(): Promise<BrowserWindow> {
    await electronApp.whenReady();
    const window = await this.createWindow();
    electronApp.on('window-all-closed', electronApp.quit);
    return window;
  }
}
