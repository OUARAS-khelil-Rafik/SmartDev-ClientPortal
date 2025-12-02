import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
        plugins: [
          react(),
          // Dev-only middleware to add some security headers for local testing
          {
            name: 'dev-security-headers',
            configureServer(server) {
              server.middlewares.use((req, res, next) => {
                try {
                  res.setHeader('X-Content-Type-Options', 'nosniff');
                  // Note: We do NOT enable 'unsafe-eval' here. If you need to test
                  // with a CSP that allows eval during dev, add it intentionally below.
                
                  // Example to allow eval during dev (not recommended):
                  // res.setHeader("Content-Security-Policy", "script-src 'self' 'unsafe-eval' 'unsafe-inline'");
                } catch (e) {
                  // ignore
                }
                next();
              });
            }
          }
        ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
