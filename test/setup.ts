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

export const renderWithConfig = (TestComponent) => {
  return {
    ...render(TestComponent, {
      global: {
        plugins: [
          createTestingPinia({ stubActions: false }),
          router
        ]
      }
    }),
    router
  }
}
