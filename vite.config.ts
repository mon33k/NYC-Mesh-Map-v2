import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/panoramas': {
        target: 'https://node-db.netlify.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/panoramas/, '/panoramas'),
      },
      '/api': 'http://localhost:3001'
    },
  }
})
