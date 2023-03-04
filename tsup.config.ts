import { defineConfig } from 'tsup';

export default defineConfig({
  dts: true,
  format: ['cjs', 'esm'],
  clean: true,
  minify: true,
  target: 'node12',
  treeshake: true,
  noExternal: ['cli-color', 'cli-spinners', 'zod'],
  entry: {
    index: 'src/index.ts',
  },
});
