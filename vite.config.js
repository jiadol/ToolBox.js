import { defineConfig } from 'vite'
const path = require('path')
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  // base: './',
  alias: {
    path: "path-browserify",
  },
  server: {
    host: 'localhost',
    port: '8000'
  }
})
