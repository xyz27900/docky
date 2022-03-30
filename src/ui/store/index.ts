import { createStore } from 'vuex';
import { LogsModule } from '@ui/store/logs.module';

const store = createStore({});
export const logsModule = new LogsModule({ store, name: 'logs' });
