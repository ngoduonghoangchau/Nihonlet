import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  server: {
    proxy: {
      // Khi gọi tới /api sẽ trỏ về Backend .NET
      '/api': {
        target: 'http://localhost:5024',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})