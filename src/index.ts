import * as path from 'path';
import { BrowserWindow } from 'electron';
import { ConfigService } from '@core/services/config.service';
import { ContainerService } from '@core/services/container.service';
import { DialogService } from '@core/services/dialog.service';
import { App } from '@core/tools/app';

const app = new App({
  width: 612,
  height: 600,
  path: path.resolve(__dirname, 'ui', 'index.html'),
  mode: 'path',
});

app.start().then((browserWindow: BrowserWindow) => {
  ConfigService.create(browserWindow).init();
  ContainerService.create(browserWindow).init();
  DialogService.create(browserWindow).init();
});

