import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/nw_music_and_entertainment_website/',
  plugins: [react()],
})
