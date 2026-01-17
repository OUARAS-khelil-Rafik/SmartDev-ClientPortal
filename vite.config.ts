import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import type { PreRenderedChunk } from 'rollup';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    const isProduction = mode === 'production';
    const geminiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';
    
    return {
      base: '/',
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
        'process.env.GEMINI_API_KEY': JSON.stringify(geminiKey),
        'process.env.API_KEY': JSON.stringify(geminiKey)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        target: 'es2020',
        outDir: 'dist',
        assetsDir: 'assets',
        cssCodeSplit: true,
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
        },
        minify: 'terser',
        terserOptions: {
          compress: {
            drop_console: false
          },
          mangle: {
            // Don't mangle names for recharts compatibility
            keep_fnames: /recharts|_.*_recharts/i
          }
        }
      }
    };
});
