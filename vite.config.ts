import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
      jsxImportSource: 'react',
    }),
  ],
  optimizeDeps: {
    exclude: ['pdfjs-dist'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    hmr: {
      overlay: true,
    },
  },
  build: {
    outDir: 'landing',
    emptyOutDir: true,
    assetsDir: 'assets',
    rollupOptions: {
      external: [
        // Ignore everything in src/notes
        /^src\/notes\/.+/,
        // ignore firebase cli config files
        'firebase.json',
        '.firebaserc',
        'firebase-debug.log',
        'storage.rules',
        'cors.json',
      ],
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
          if (id.includes('src/pages/views')) {
            return 'views';
          }
        },
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
  },
  base: './',
});
