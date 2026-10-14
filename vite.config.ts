import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load environment variables (including non-VITE_ ones) into process.env for the server proxy
  const env = loadEnv(mode, process.cwd(), '');
  for (const [key, val] of Object.entries(env)) {
    process.env[key] = val;
  }

  return {
    plugins: [react()],
    server: {
      port: 5173,
      open: false,
      proxy: {
        '/api': {
          target: 'http://localhost:5001',
          changeOrigin: true
        }
      }
    }
  };
});
