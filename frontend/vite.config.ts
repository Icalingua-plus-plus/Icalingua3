import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { setDefaultResultOrder } from 'node:dns';
import Unocss from 'unocss/vite';
import { presetWind, presetAttributify, presetWebFonts } from 'unocss';

setDefaultResultOrder('verbatim');
const target = ['chrome87', 'edge88', 'es2020', 'firefox78', 'safari14'];

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Unocss({ presets: [presetWind(), presetAttributify({ prefix: 'w:' }), presetWebFonts()] }),
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
