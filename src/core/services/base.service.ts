import { BrowserWindow } from 'electron';

export class BaseService {
  protected readonly browserWindow: BrowserWindow;

  constructor(browserWindow: BrowserWindow) {
    this.browserWindow = browserWindow;
  }
}
