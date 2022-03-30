import path from 'path';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import { vitePluginCommonjs } from 'vite-plugin-commonjs';
import WindiCSS from 'vite-plugin-windicss';
import svgLoader from 'vite-svg-loader';

const outDir = path.resolve(__dirname, 'build/ui');

export default defineConfig({
  plugins: [
    vue(),
    vitePluginCommonjs(),
    WindiCSS(),
    svgLoader(),
  ],
  server: {
    port: 8088,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
        secure: false,
        timeout: 3000,
      },
    },
  },
  resolve: {
    alias: [
      {
        find: '@common',
        replacement: path.resolve(__dirname, 'src/common'),
      },
      {
        find: '@core',
        replacement: path.resolve(__dirname, 'src/core'),
      },
      {
        find: '@ui',
        replacement: path.resolve(__dirname, 'src/ui'),
      },
    ],
  },
  build: {
    assetsDir: 'static',
    outDir,
    sourcemap: true,
  },
});
