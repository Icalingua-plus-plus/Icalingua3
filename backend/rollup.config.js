/* eslint-disable import/no-extraneous-dependencies */
import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  input: 'src/index.ts',
  output: { file: 'bundle.js', format: 'cjs' },
  plugins: [typescript(), nodeResolve()],
};
