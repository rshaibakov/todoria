import { rest } from 'msw'
import { setupServer } from 'msw/node'
import * as mocks from './__mocks__'

// @ts-expect-error import.meta не может быть валидно прочитана TS в среде NodeJS
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL

export const handlers = [
  rest.get(`${SUPABASE_URL}/rest/v1/sprints`, (req, res, ctx) => {
    return res(ctx.json(mocks.sprints))
  }),
  rest.get(`${SUPABASE_URL}/rest/v1/tasks`, (req, res, ctx) => {
    return res(ctx.json(mocks.tasks))
  }),
  rest.post(`${SUPABASE_URL}/rest/v1/tasks`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([mocks.newTask])
    )
  })
]

export const server = setupServer(...handlers)

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'bypass' })
})

afterEach(() => {
  server.resetHandlers()
})

afterAll(() => {
  server.close()
  vi.restoreAllMocks()
})
