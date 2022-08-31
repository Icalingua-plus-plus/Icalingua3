import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { setDefaultResultOrder } from 'node:dns';

setDefaultResultOrder('verbatim');
const target = ['chrome87', 'edge88', 'es2020', 'firefox78', 'safari14'];

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: { proxy: { '/api': { target: 'http://localhost:3000/', ws: true } } },
  build: { target, outDir: '../static', emptyOutDir: true },
  optimizeDeps: { esbuildOptions: { target } },
});
