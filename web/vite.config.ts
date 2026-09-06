import path from 'node:path'
import {fileURLToPath} from 'node:url'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import {defineConfig} from 'vite'

const root = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {alias: {'@': path.resolve(root, 'src')}},
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/studio': {target: 'http://127.0.0.1:3333', changeOrigin: true, ws: true},
      '/static': {target: 'http://127.0.0.1:3333', changeOrigin: true},
    },
  },
})
