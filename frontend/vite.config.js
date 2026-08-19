import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    cors: {
      origin: "http:?\/\/(?:.+\.)?localhost(:\d+)?",
    },
    proxy: {
      "/api": {
        target: "http://localhost/",
        changeOrigin: true,
        secure: false
      }
    }
  }
})
