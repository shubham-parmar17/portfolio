import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Keep paths portable and build optimized for production performance.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    minify: 'esbuild',
    cssMinify: true,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/portfolio.js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: (asset) => asset.name?.endsWith('.css')
          ? 'assets/styles.css'
          : 'assets/[name][extname]',
      },
    },
  },
});
