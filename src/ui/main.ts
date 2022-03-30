// eslint-disable-next-line import/no-unresolved
import 'virtual:windi.css';
import '@ui/styles/index.css';
import { createApp } from 'vue';
import App from '@ui/App.vue';
import { router } from '@ui/router';

createApp(App)
  .use(router)
  .mount('#app');
