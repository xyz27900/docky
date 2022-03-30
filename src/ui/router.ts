import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import ContainerLogs from '@ui/pages/ContainerLogs.vue';
import ContainerRun from '@ui/pages/ContainerRun.vue';

const routes: RouteRecordRaw[] = [
  {
    name: 'container-run',
    path: '/',
    component: ContainerRun,
  },
  {
    name: 'container-logs',
    path: '/logs',
    component: ContainerLogs,
  },
];

export const router = createRouter({
  routes,
  history: createWebHashHistory(),
});
