import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { prerenderHomepage } from './vite/prerenderHomepage'

export default defineConfig({
  plugins: [react(), prerenderHomepage()],
})
