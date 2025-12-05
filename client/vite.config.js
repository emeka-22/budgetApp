import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Listen on all network interfaces
    port: 5173,
    strictPort: true,
    // Allow access from mobile devices on the same network
    cors: true,
  },
  preview: {
    host: true,
    port: 4173,
  },
})
