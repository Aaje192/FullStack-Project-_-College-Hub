import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react({
    jsxRuntime: 'classic' // Add this line
  })],
  build: {
    commonjsOptions: {
      include: [/node_modules/],
    }
  },
  server: {
    host: true, // Needed for GitHub Codespaces
    port: 5173,
    strictPort: true,
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  }
});