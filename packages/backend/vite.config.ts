import { defineConfig } from 'vite';
import nodeExternals from 'rollup-plugin-node-externals';
import clean from 'vite-plugin-clean';
import cp from 'vite-plugin-cp';

export default defineConfig({
  plugins: [
    {
      ...nodeExternals(),
      enforce: 'pre',
      apply: 'build',
    },
    {
      ...clean({
        targetFiles: [ 'public' ],
      }),
      enforce: 'post',
    },
    cp({
      targets: [
        { src: '../frontend/dist', dest: './public' }
      ],
      enforce: 'post',
    }),
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
