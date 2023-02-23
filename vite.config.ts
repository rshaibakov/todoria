import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import checker from 'vite-plugin-checker'

export default defineConfig({
  plugins: [
    vue(),
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
  ]
})
