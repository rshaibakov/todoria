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

const mockedTasks = [
  {
    id: 'c3fcd82c-4382-451b-85b6-68a3bb2f575f',
    user_id: '27c41dc4-d70f-4efa-9ed0-ded37d5be096',
    sprint_id: 'c3fcd82c-4382-451b-85b6-68a3bb2f575f',
    name: 'Сходить в магазин',
    description: 'Купить продукты, бытовую химию и подарки',
    is_done: false,
    planned_at: '2023-03-28 12:30:32+00',
    created_at: '2023-03-27T11:04:02.366662+00:00'
  },
  {
    id: 'c3fcd82c-4382-451b-85b6-68a3bb2f5423',
    user_id: '27c41dc4-d70f-4efa-9ed0-ded37d5be096',
    sprint_id: 'c3fcd82c-4382-451b-85b6-68a3bb2f575f',
    name: 'Починить кран в ванной',
    description: '',
    is_done: false,
    planned_at: '2023-03-28 12:30:32+00',
    created_at: '2023-03-27T11:04:02.366662+00:00'
  },
  {
    id: 'c3fcd82c-4382-451b-85b6-68a3bb2f5741',
    user_id: '27c41dc4-d70f-4efa-9ed0-ded37d5be096',
    sprint_id: 'c3fcd82c-4382-451b-85b6-68a3bb2f575f',
    name: 'Посетить выставку',
    description: 'Заказать билеты через онлайн кассу',
    is_done: false,
    planned_at: '2023-03-28 12:30:32+00',
    created_at: '2023-03-27T11:04:02.366662+00:00'
  }
]

const server = setupServer(
  rest.get(`${SUPABASE_URL}/rest/v1/sprints`, (req, res, ctx) => {
    return res(ctx.json(mockedSprints))
  }),
  rest.get(`${SUPABASE_URL}/rest/v1/tasks`, (req, res, ctx) => {
    return res(ctx.json(mockedTasks))
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

  test('title displayed', async () => {
    const { getByTestId } = renderWithConfig(CurrentSprint)

    await waitFor(() => {
      const currentSprintTitle = getByTestId('current-sprint-title')
      const expectedTitle = `Спринт #${mockedSprints[0].number} [${startAt.format('ddd, D MMMM')} - ${finishAt.format('ddd, D MMMM')}]`

      expect(currentSprintTitle).toHaveTextContent(expectedTitle)
    })
  })

  test('tasks displayed', async () => {
    const { getAllByTestId } = renderWithConfig(CurrentSprint)

    await waitFor(() => {
      const currentSprintTasks = getAllByTestId('current-sprint-task')

      expect(currentSprintTasks).toHaveLength(mockedTasks.length)
      expect(currentSprintTasks[0]).toContainHTML(mockedTasks[0].name)
      expect(currentSprintTasks[0]).toContainHTML(mockedTasks[0].description)
      expect(currentSprintTasks[0]).toContainHTML(dayjs(mockedTasks[0].planned_at).format('ddd, D MMMM'))
    })
  })
})
