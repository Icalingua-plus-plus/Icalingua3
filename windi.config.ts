import { defineConfig } from 'windicss/helpers';
import typography from 'windicss/plugin/typography';

const config: ReturnType<typeof defineConfig> = defineConfig({
  darkMode: 'class',
  attributify: { prefix: 'w:' },
  extract: {
    include: ['frontend/index.html', 'frontend/**/*.{vue,html,jsx,tsx}'],
    exclude: ['**/node_modules', '.git'],
  },
  theme: {
    extend: {},
  },
  plugins: [typography({ dark: true })],
});

export default config;
