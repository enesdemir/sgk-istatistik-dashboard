import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  // GitHub Pages alt path: https://enesdemir.github.io/sgk-istatistik-dashboard/
  // Yerel dev için dosya `/` köküne servis edilir; build sırasında base'in başına bu prefix eklenir.
  base: '/sgk-istatistik-dashboard/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5174,
    open: true,
  },
});
