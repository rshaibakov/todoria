import { describe, test, beforeAll, afterEach, afterAll } from 'vitest'
import { waitFor } from '@testing-library/vue'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import dayjs from 'dayjs'
import { renderWithConfig } from '../../../test/setup'
import CurrentSprint from './CurrentSprint.vue'

// @ts-expect-error import.meta не может быть валидно прочитана TS в среде NodeJS
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL

const startAt = dayjs()
const finishAt = dayjs().add(13, 'day')

const mockedSprints = [
  {
    id: 'c3fcd82c-4382-451b-85b6-68a3bb2f575f',
    user_id: '27c41dc4-d70f-4efa-9ed0-ded37d5be096',
    number: 1,
    start_at: startAt.format('YYYY-MM-DD'),
    finish_at: finishAt.format('YYYY-MM-DD'),
    created_at: '2023-03-27T11:04:02.366662+00:00'
  }
]

const server = setupServer(
  rest.get(`${SUPABASE_URL}/rest/v1/sprints`, (req, res, ctx) => {
    return res(ctx.json(mockedSprints))
  })
)

describe('CurrentSprint', () => {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' })
  })

  afterEach(() => {
    server.resetHandlers()
  })

  afterAll(() => {
    server.close()
  })

  test('days displayed', async () => {
    const { getAllByTestId } = renderWithConfig(CurrentSprint)

    await waitFor(() => {
      const currentSprintDays = getAllByTestId('current-sprint-day')
      expect(currentSprintDays).toHaveLength(14)
      expect(currentSprintDays[0]).toHaveTextContent(startAt.format('MMM D, YYYY'))
      expect(currentSprintDays[currentSprintDays.length - 1]).toHaveTextContent(finishAt.format('MMM D, YYYY'))
    })
  })
})
