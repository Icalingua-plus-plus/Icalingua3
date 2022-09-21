import vue from '@vitejs/plugin-vue';
import { setDefaultResultOrder } from 'node:dns';
import { defineConfig } from 'vite';
import WindiCSS from 'vite-plugin-windicss';

setDefaultResultOrder('verbatim');
const target = ['chrome87', 'edge88', 'firefox78', 'safari14'];

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({ template: { compilerOptions: { isCustomElement: (tag) => tag.includes('-') } } }),
    WindiCSS({
      // 这个放在项目根目录是为了让 VSCode 插件能正常使用
      configFiles: ['./windi.config.ts'],
    }),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000/',
      },
      '/socket.io/': {
        target: 'http://localhost:3000/',
        // rewrite: (path) => path.replace('socket.io', 'socket.io/'),
        ws: true,
      },
    },
  },
  build: { target, outDir: '../static', emptyOutDir: true },
  optimizeDeps: { esbuildOptions: { target } },
});
