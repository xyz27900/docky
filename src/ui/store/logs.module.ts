import { Action, Module, Mutation, VuexModule } from 'vuex-class-modules';
import { CONTAINER_ATTACH, CONTAINER_DETACH, CONTAINER_LOGS } from '@common/constants/channels';
import { Container } from '@common/models/container.model';

@Module
export class LogsModule extends VuexModule {
  public logs: string[] = [];

  @Mutation
  public addRecords(records: string[]): void {
    this.logs.push(...records);
  }

  @Mutation
  public resetLogs(): void {
    this.logs = [];
  }

  @Action
  public async attach(container: Container): Promise<void> {
    await window.ipcRenderer.callMain(CONTAINER_ATTACH, container);
    window.ipcRenderer.addListener(CONTAINER_LOGS, (event, data: string) => {
      const lines = data.split('\n').map(item => item.trim());
      this.addRecords(lines);
    });
  }

  @Action
  public async detach(): Promise<void> {
    await window.ipcRenderer.callMain(CONTAINER_DETACH);
    window.ipcRenderer.removeAllListeners(CONTAINER_LOGS);
    this.resetLogs();
  }
}
