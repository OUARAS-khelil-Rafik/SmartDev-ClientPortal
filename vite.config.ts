import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  //base:"/Educa/",
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'vendor-react'
          }
          if (id.includes('node_modules/@google')) {
            return 'vendor-google'
          }
          if (id.includes('node_modules/axios')) {
            return 'vendor-http'
          }
          // Component chunks
          if (id.includes('components/Auth')) {
            return 'chunk-auth'
          }
          if (id.includes('components/Dashboard')) {
            return 'chunk-dashboard'
          }
          if (id.includes('components/Booking')) {
            return 'chunk-booking'
          }
          if (id.includes('components/AIConsultant')) {
            return 'chunk-consultation'
          }
        }
      }
    }
  }
})
