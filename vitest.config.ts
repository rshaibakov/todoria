import { mergeConfig } from 'vite'
import { defineConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(viteConfig, defineConfig({
  test: {
    setupFiles: './test/setup.ts',
    environment: 'happy-dom',
    includeSource: ['src/**/*.{ts,tsx,vue}'],
    globals: true,
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'json', 'html']
    }
  }
}))
