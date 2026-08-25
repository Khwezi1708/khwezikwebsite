import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fetchGigs } from './vite/fetchGigs'
import { prerenderHomepage } from './vite/prerenderHomepage'

export default defineConfig({
  plugins: [fetchGigs(), react(), prerenderHomepage()],
})
