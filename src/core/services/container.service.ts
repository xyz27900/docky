import { BrowserWindow } from 'electron';
import { ipcMain } from 'electron-better-ipc';
import { CONTAINER_ATTACH, CONTAINER_DETACH, CONTAINER_LOGS } from '@common/constants/channels';
import { Container } from '@common/models/container.model';
import { BaseService } from '@core/services/base.service';
import { CommandRunner } from '@core/tools/exec';

export class ContainerService extends BaseService {
  private static readonly dockerBin = '/usr/local/bin/docker';
  private readonly commandRunner: CommandRunner;
  private containerId: string | null;

  constructor(browserWindow: BrowserWindow) {
    super(browserWindow);
    this.commandRunner = new CommandRunner();
    this.containerId = null;
  }

  public static create(browserWindow: BrowserWindow): ContainerService {
    return new ContainerService(browserWindow);
  }

  private executeLogs(): void {
    this.commandRunner.executeCallback(
      `${ContainerService.dockerBin} logs ${this.containerId} -f`,
      (chunk: string) => {
        this.browserWindow.webContents.send(CONTAINER_LOGS, chunk);
      },
      () => {
        this.commandRunner.kill();
      },
    );
  }

  private runContainer(container: Container): void {
    const ports = container.ports.map(item => `-p ${item.host}:${item.container}`).join(' ');
    const volumes = container.volumes.map(item => `-v ${item.host}:${item.container}`).join(' ');
    const variables = container.variables.map(item => `-e ${item.name}=${item.value}`).join(' ');

    this.commandRunner.executeCallback(
      `${ContainerService.dockerBin} run -d ${ports} ${volumes} ${variables} ${container.image}`,
      (chunk: string) => {
        /* Looking for digest */
        if (!this.containerId && /^([a-z]|[0-9]){64}$/.test(chunk)) {
          this.containerId = chunk;
        } else {
          this.browserWindow.webContents.send(CONTAINER_LOGS, chunk);
        }
      },
      () => {
        this.commandRunner.kill();
        if (this.containerId) {
          this.executeLogs();
        }
      },
    );
  }

  private resetContainer(): void {
    this.commandRunner.kill();
    this.containerId = null;
  }

  public init(): void {
    ipcMain.answerRenderer(CONTAINER_ATTACH, this.runContainer.bind(this));
    ipcMain.answerRenderer(CONTAINER_DETACH, this.resetContainer.bind(this));
  }
}
