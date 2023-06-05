import { configure, render } from '@testing-library/vue'
import { createTestingPinia } from '@pinia/testing'
import { context, response, type ResponseTransformer } from 'msw'
import { createRouter, createWebHistory, type Router } from 'vue-router'
import { routes } from '../src/router'
import { hasQueryParam } from '../src/utils'
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

export function customResponse(...transformers: ResponseTransformer[]) {
  if (hasQueryParam('error')) {
    return response(
      context.status(400),
      context.json({ error: 'Oops! Something went terribly wrong.' })
    )
  }

  if (hasQueryParam('empty')) {
    return response(
      context.status(200),
      context.json([])
    )
  }

  return response(...transformers, context.delay())
}
