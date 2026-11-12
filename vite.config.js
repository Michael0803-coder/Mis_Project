import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Forward /api to Apache/XAMPP so PHP handles it and returns JSON
      '/api': {
        target: 'http://localhost/Mis_Project',
        changeOrigin: true,
      },
    },
  },
  build: {
    minify: false,
    cssMinify: false,
    sourcemap: true,
  },
});