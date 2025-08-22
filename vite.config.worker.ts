import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: 'index',
    },
    outDir: 'dist/worker',
    emptyOutDir: false,
    rollupOptions: {
      external: ['cloudflare:workers'],
    },
    target: 'esnext',
    minify: false,
  },
  esbuild: {
    format: 'esm',
    platform: 'neutral',
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
  },
});