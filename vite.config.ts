import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'
import checker from 'vite-plugin-checker'

export default defineConfig({
  plugins: [
    vue(),
    svgLoader(),
    process.env.VITEST === undefined
      ? checker({
        typescript: true,
        vueTsc: true,
        eslint: {
          lintCommand: 'eslint --ext .ts,tsx,vue --ignore-path .gitignore .'
        },
        stylelint: {
          lintCommand: 'stylelint src/**/*.{css,vue}'
        }
      })
      : undefined
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
