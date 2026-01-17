import { readdirSync } from 'fs';
import { join } from 'path';

// This config ensures Vercel treats this as a static site and serves index.html for all routes
export const routes = [
  {
    src: '^/(?!.*\\.).*$',
    dest: '/index.html'
  },
  {
    src: '^/api/(.*)',
    dest: '/api/$1'
  }
];
