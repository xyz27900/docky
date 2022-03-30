import fs from 'fs';
import os from 'os';
import { BrowserWindow, dialog } from 'electron';
import { ipcMain } from 'electron-better-ipc';
import { CONFIG_LOAD, CONFIG_SAVE } from '@common/constants/channels';
import { ContainerData } from '@common/models/container.model';
import { BaseService } from '@core/services/base.service';

export class ConfigService extends BaseService {
  public static create(browserWindow: BrowserWindow): ConfigService {
    return new ConfigService(browserWindow);
  }

  private async loadConfig(): Promise<string | null> {
    const result = await dialog.showOpenDialog(
      this.browserWindow,
      {
        properties: ['openFile'],
        filters: [{
          name: 'Docky configuration files',
          extensions: ['.docky'],
        }],
      },
    );

    return !result.canceled
      ? fs.readFileSync(result.filePaths[0], { encoding: 'utf-8' })
      : null;
  }

  private async saveConfig(data: ContainerData): Promise<void> {
    const result = await dialog.showSaveDialog(
      this.browserWindow,
      {
        title: 'Save configuration file',
        defaultPath: `${os.userInfo().homedir}/Documents/${data.image}.docky`,
      },
    );
    if (!result.canceled && !!result.filePath) {
      fs.writeFileSync(result.filePath, JSON.stringify(data), { encoding: 'utf-8' });
    }
  }

  public init(): void {
    ipcMain.answerRenderer(CONFIG_LOAD, this.loadConfig.bind(this));
    ipcMain.answerRenderer(CONFIG_SAVE, this.saveConfig.bind(this));
  }
}
