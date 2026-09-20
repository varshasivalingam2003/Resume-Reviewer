import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { zohoProxyMiddleware } from './server/proxyMiddleware.js';

export default defineConfig(({ mode }) => {
  // Load environment variables (including non-VITE_ ones) into process.env for the server proxy
  const env = loadEnv(mode, process.cwd(), '');
  for (const [key, val] of Object.entries(env)) {
    process.env[key] = val;
  }

  return {
    plugins: [
      react(),
      {
        name: 'zoho-backend-proxy',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            zohoProxyMiddleware(req, res, next);
          });
        }
      }
    ],
    server: {
      port: 5173,
      open: false
    }
  };
});
