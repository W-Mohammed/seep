import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    'import.meta.env.CLIENT_HOST': JSON.stringify(process.env.CLIENT_HOST),
    'import.meta.env.NODE_HOST': JSON.stringify(process.env.NODE_HOST),
    'import.meta.env.GOOGLE_TAG_ID': JSON.stringify(process.env.GOOGLE_TAG_ID),
  },
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
