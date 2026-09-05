import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },

  server: {
    // AI Studio preview: prevent Vite HMR WebSocket connection errors
    hmr: false,

    // Prevent file-watching/flickering during AI Studio agent edits
    watch: null,
  },
});