import { defineConfig } from 'vite';
import nodeExternals from 'rollup-plugin-node-externals';

export default defineConfig({
  plugins: [
    {
      ...nodeExternals(),
      enforce: 'pre',
      apply: 'build',
    },
  ],
  build: {
    lib: {
      entry: 'src/app.ts',
      formats: [ 'cjs' ],
      fileName: 'app'
    },
  },
  resolve: {
    mainFields: [ 'module', 'jsnext:main', 'jsnext' ],
    conditions: [ 'node' ],
  }
});
