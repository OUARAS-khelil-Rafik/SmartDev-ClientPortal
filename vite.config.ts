import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import type { PreRenderedChunk } from 'rollup';

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
      },
      build: {
        rollupOptions: {
          output: {
            manualChunks(id) {
              if (!id.includes('node_modules')) return;

              // Keep React runtime separate.
              if (/[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) return 'react-vendor';

              // Animation libs can get big.
              if (/[\\/]node_modules[\\/](framer-motion)[\\/]/.test(id)) return 'motion';
              if (/[\\/]node_modules[\\/](gsap)[\\/]/.test(id)) return 'gsap';

              // Charting pulls in a lot of deps.
              if (/[\\/]node_modules[\\/](recharts|d3-.*)[\\/]/.test(id)) return 'charts';

              // Icons are used everywhere; isolate them.
              if (/[\\/]node_modules[\\/](lucide-react)[\\/]/.test(id)) return 'icons';

              return 'vendor';
            }
          }
        }
      },
      // Don't minify recharts chunk due to compatibility issues with Vite 6
      rollupOptions: {
        output: {
          // Disable minification for recharts chunk
          chunkFileNames: (chunkInfo: PreRenderedChunk) => {
            if (chunkInfo.name && chunkInfo.name.includes('charts')) {
              return 'assets/[name]-[hash].js';
            }
            return 'assets/[name]-[hash].js';
          }
        }
      }
    };
});
