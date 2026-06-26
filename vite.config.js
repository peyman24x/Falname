// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  // './' یعنی همیشه path نسبی — هر subdirectory یا domain کار می‌کنه
  base: './',

  root: '.',
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      }
    }
  }
});
