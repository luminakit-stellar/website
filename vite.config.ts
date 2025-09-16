import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  define: {
    global: 'globalThis',
  },
  resolve: {
    alias: {
      buffer: 'buffer',
      process: 'process/browser',
      stream: 'stream-browserify',
      util: 'util',
    },
  },
  optimizeDeps: {
    include: ['buffer', 'process'],
  },
})
