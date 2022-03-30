import * as childProcess from 'child_process';

export class CommandRunner {
  private childProcess: childProcess.ChildProcess | null;

  constructor() {
    this.childProcess = null;
  }

  public executeCallback(command: string, onData: (chunk: string) => void, onEnd: () => void): void {
    this.childProcess = childProcess.exec(command);

    this.childProcess.stdout?.on('data', (chunk: string) => {
      onData(chunk.trim());
    });

    this.childProcess.stderr?.on('data', (chunk: string) => {
      onData(chunk.trim());
    });

    this.childProcess.stdout?.on('end', () => {
      onEnd();
    });
  }

  public kill(): void {
    this.childProcess?.kill();
    this.childProcess = null;
  }
}
