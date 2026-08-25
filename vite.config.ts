import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'

function spaFallbackPages(): Plugin {
  return {
    name: 'spa-fallback-pages',
    closeBundle() {
      const indexHtml = resolve(__dirname, 'dist/index.html')
      const hiddenDir = resolve(__dirname, 'dist/hiddenanalytics')
      mkdirSync(hiddenDir, { recursive: true })
      copyFileSync(indexHtml, resolve(hiddenDir, 'index.html'))
      copyFileSync(indexHtml, resolve(__dirname, 'dist/404.html'))
    },
  }
}

export default defineConfig({
  plugins: [react(), spaFallbackPages()],
})
