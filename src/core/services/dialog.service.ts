import { BrowserWindow, dialog } from 'electron';
import { ipcMain } from 'electron-better-ipc';
import { DIALOG_ERROR, DIALOG_PATH } from '@common/constants/channels';
import { BaseService } from '@core/services/base.service';

export class DialogService extends BaseService {

  public static create(browserWindow: BrowserWindow): DialogService {
    return new DialogService(browserWindow);
  }

  private async showError(message: string): Promise<void> {
    await dialog.showMessageBox(this.browserWindow, { message, type: 'error' });
  }

  private async selectPath(): Promise<string | null> {
    const result = await dialog.showOpenDialog(
      this.browserWindow,
      {
        properties: ['openDirectory'],
        buttonLabel: 'Select',
      },
    );
    return !result.canceled
      ? result.filePaths[0]
      : null;
  }

  public init(): void {
    ipcMain.answerRenderer(DIALOG_ERROR, this.showError.bind(this));
    ipcMain.answerRenderer(DIALOG_PATH, this.selectPath.bind(this));
  }
}
