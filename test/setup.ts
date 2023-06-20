import { configure, render } from '@testing-library/vue'
import { createTestingPinia } from '@pinia/testing'
import { createRouter, createWebHistory, type Router } from 'vue-router'
import { routes } from '../src/router'
import '@testing-library/jest-dom'

configure({
  testIdAttribute: 'data-test-id'
})

let router: Router

beforeEach(async () => {
  router = createRouter({
    history: createWebHistory(),
    routes
  })

  await router.push('/')
  await router.isReady()
})

export const renderWithSetup = (TestComponent) => {
  return {
    ...render(TestComponent, {
      global: {
        plugins: [
          createTestingPinia({ stubActions: false }),
          router
        ],
        config: {
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          errorHandler: () => { }
        }
      }
    }),
    router
  }
}

// HACK: Для корректного ожидания завершения замоканных запросов при рендере
export function flushPromises() {
  return new Promise(resolve => window.setTimeout(resolve, 100))
}
