import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // Forwards all requests that are made by the frontend to the address
  // 'http://localhost:5173/api', to the given `target` (backend) address,
  // i.e. to 'http://localhost:3002' in this case.
  server: {
    proxy: {
      '/api/': {
        target: 'http://localhost:3002',
        changeOrigin: true
      }
    }
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './testSetup.js'
  }
})
