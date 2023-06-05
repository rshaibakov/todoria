import { describe, test, beforeAll, afterEach, afterAll } from 'vitest'
import { fireEvent, waitFor } from '@testing-library/vue'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import dayjs from 'dayjs'
import { customResponse, renderWithConfig } from '../../../test/setup'
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

const mockedNewTask = [
  {
    id: 'c3fcd82c-4382-451b-85b6-68a3342df1',
    user_id: '27c41dc4-d70f-4efa-9ed0-ded37d5be096',
    sprint_id: 'c3fcd82c-4382-451b-85b6-68a3bb2f575f',
    name: 'Сделать домашнее задание',
    description: 'Выполнить упражнения с 5 по 7 в тренажере',
    is_done: false,
    planned_at: '2023-03-28 12:30:32+00',
    created_at: '2023-03-27T11:04:02.366662+00:00'
  }
]

const mockedNewTaskWithoutPlannedAt = [
  {
    ...mockedNewTask,
    planned_at: null
  }
]

const server = setupServer(
  rest.get(`${SUPABASE_URL}/rest/v1/sprints`, (req, res, ctx) => {
    return res(ctx.delay(100), ctx.json(mockedSprints))
  }),
  rest.get(`${SUPABASE_URL}/rest/v1/tasks`, (req, res, ctx) => {
    return res(ctx.delay(100), ctx.json(mockedTasks))
  }),
  rest.post(`${SUPABASE_URL}/rest/v1/tasks`, (req, res, ctx) => {
    if (req.params.planned_at === null) {
      return customResponse(
        ctx.status(200),
        ctx.json(mockedNewTaskWithoutPlannedAt)
      )
    }

    return customResponse(
      ctx.status(200),
      ctx.json(mockedNewTask)
    )
  })
)

// TODO: Доработать тесты при создании задачи
server.events.on('request:start', (req) => {
  console.log(req.method, req.url.href)
})

describe('CurrentSprint', () => {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'bypass' })
  })

  afterEach(() => {
    // window.history.replaceState({}, '', '/')
    server.resetHandlers()
  })

  afterAll(() => {
    server.close()
  })

  test('title displayed', async () => {
    const { getByTestId } = renderWithConfig(CurrentSprint)

    await waitFor(() => {
      const expectedTitle = `Спринт #${mockedSprints[0].number} [${startAt.format('ddd, D MMMM')} - ${finishAt.format('ddd, D MMMM')}]`

      expect(getByTestId('current-sprint-title')).toHaveTextContent(expectedTitle)
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

  test('task form not displayed', () => {
    const { queryByTestId } = renderWithConfig(CurrentSprint)

    expect(queryByTestId('current-sprint-task-form')).not.toBeInTheDocument()
  })

  describe('when click task add button', () => {
    test('task form displayed', async () => {
      const { getByTestId, getByPlaceholderText } = renderWithConfig(CurrentSprint)

      await fireEvent.click(getByTestId('current-sprint-task-add-button'))

      await waitFor(() => {
        expect(getByTestId('current-sprint-task-form')).toBeInTheDocument()
        expect(getByPlaceholderText('Название')).toBeInTheDocument()
        expect(getByPlaceholderText('Название')).toBeRequired()
        expect(getByPlaceholderText('Описание')).toBeInTheDocument()
        expect(getByTestId('current-sprint-planned-at-field')).toBeInTheDocument()
        expect(getByTestId('current-sprint-cancel-button')).toBeInTheDocument()
        expect(getByTestId('current-sprint-submit-button')).toBeInTheDocument()
      })
    })
  })

  describe('when submit blank form', () => {
    test('task form not sent', async () => {
      const { getByTestId, getByPlaceholderText } = renderWithConfig(CurrentSprint)

      await fireEvent.click(getByTestId('current-sprint-task-add-button'))
      await fireEvent.click(getByTestId('current-sprint-submit-button'))

      expect(getByTestId('current-sprint-task-form')).toBeInTheDocument()
      expect(getByPlaceholderText('Название')).toBeRequired()
      expect(getByPlaceholderText('Описание')).not.toBeRequired()
      expect(getByTestId('current-sprint-planned-at-field')).not.toBeRequired()
    })
  })

  describe('when submit filled form', () => {
    describe('when form is successfully sent', () => {
      test.todo('task created', async () => {
        const { getAllByTestId, getByTestId, getByPlaceholderText, queryByTestId } = renderWithConfig(CurrentSprint)

        await fireEvent.click(getByTestId('current-sprint-task-add-button'))
        await fireEvent.update(getByPlaceholderText('Название'), mockedNewTask[0].name)
        await fireEvent.update(getByPlaceholderText('Описание'), `${mockedNewTask[0].description}`)
        await fireEvent.submit(getByTestId('current-sprint-task-form'))

        await waitFor(() => {
          const currentSprintTasks = getAllByTestId('current-sprint-task')

          expect(queryByTestId('current-sprint-task-form')).not.toBeInTheDocument()
          expect(currentSprintTasks).toHaveLength(mockedTasks.length)
          expect(currentSprintTasks[0]).toContainHTML(mockedNewTask[0].name)
          expect(currentSprintTasks[0]).toContainHTML(mockedNewTask[0].description)
        })
      })

      test.todo('error not displayed')
    })

    describe('when form is failed sent', () => {
      test.todo('task not created')
      test.todo('error displayed')
    })
  })
})
