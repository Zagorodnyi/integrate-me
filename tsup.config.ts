import { defineConfig } from 'tsup';

export default defineConfig({
  sourcemap: true,
  dts: true,
  format: ['cjs', 'esm'],
  clean: true,
  minify: true,
  noExternal: ['cli-color', 'cli-spinners', 'zod'],
  entry: {
    index: 'src/index.ts',
  },
});
