import { describe, test, beforeAll, afterEach, afterAll } from 'vitest'
import { fireEvent, waitFor } from '@testing-library/vue'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import dayjs from 'dayjs'
import * as mocks from './mocks'
import { flushPromises, renderWithConfig } from '../../../test/setup'
import CurrentSprint from './CurrentSprint.vue'
import { useUserStore } from '../../stores/user'

// @ts-expect-error import.meta не может быть валидно прочитана TS в среде NodeJS
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL

const server = setupServer(
  rest.get(`${SUPABASE_URL}/rest/v1/sprints`, (req, res, ctx) => {
    return res(ctx.json(mocks.sprints))
  }),
  rest.get(`${SUPABASE_URL}/rest/v1/tasks`, (req, res, ctx) => {
    return res(ctx.json(mocks.tasks))
  }),
  rest.post(`${SUPABASE_URL}/rest/v1/tasks`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(mocks.newTask)
    )
  })
)

// TODO: Доработать тесты при создании задачи
describe('CurrentSprint', () => {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'bypass' })
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
      const expectedTitle = `Спринт #${mocks.sprints[0].number} [${mocks.startAt.format('ddd, D MMMM')} - ${mocks.finishAt.format('ddd, D MMMM')}]`

      expect(getByTestId('current-sprint-title')).toHaveTextContent(expectedTitle)
    })
  })

  test('tasks displayed', async () => {
    const { getAllByTestId } = renderWithConfig(CurrentSprint)

    await waitFor(() => {
      const currentSprintTasks = getAllByTestId('current-sprint-task')

      expect(currentSprintTasks).toHaveLength(mocks.tasks.length)
      expect(currentSprintTasks[0]).toContainHTML(mocks.tasks[0].name)
      expect(currentSprintTasks[0]).toContainHTML(mocks.tasks[0].description)
      expect(currentSprintTasks[0]).toContainHTML(dayjs(mocks.tasks[0].planned_at).format('ddd, D MMMM'))
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
      test('task created', async () => {
        server.use(rest.post(`${SUPABASE_URL}/rest/v1/tasks`, (req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json(mocks.newTaskWithoutPlannedAt)
          )
        }))

        const { getAllByTestId, getByTestId, getByPlaceholderText, queryByTestId, debug } = renderWithConfig(CurrentSprint)

        const userStore = useUserStore()
        userStore.$patch({
          user: {}
        })

        await flushPromises()

        await fireEvent.click(getByTestId('current-sprint-task-add-button'))
        await fireEvent.update(getByPlaceholderText('Название'), mocks.newTaskWithoutPlannedAt[0].name)
        await fireEvent.update(getByPlaceholderText('Описание'), mocks.newTaskWithoutPlannedAt[0].description)
        await fireEvent.submit(getByTestId('current-sprint-task-form'))

        await waitFor(() => {
          const currentSprintTasks = getAllByTestId('current-sprint-task')

          expect(queryByTestId('current-sprint-task-form')).not.toBeInTheDocument()
          expect(currentSprintTasks).toHaveLength(mocks.tasks.length + 1)
          expect(currentSprintTasks[0]).toContainHTML(mocks.newTaskWithoutPlannedAt[0].name)
          expect(currentSprintTasks[0]).toContainHTML(mocks.newTaskWithoutPlannedAt[0].description)
        })
      })

      test.todo('error not displayed')
    })

    describe('when form is failed sent', () => {
      test.todo('task not created')
      test.todo('error displayed')
    })
  })

  describe('when click task', () => {
    test('task form displayed', async () => {
      const { findByTestId, getByTestId, getByPlaceholderText } = renderWithConfig(CurrentSprint)

      await fireEvent.click(await findByTestId('current-sprint-task'))

      await waitFor(() => {
        expect(getByTestId('current-sprint-task-form')).toBeInTheDocument()

        const nameField = getByPlaceholderText('Название')
        expect(nameField).toBeInTheDocument()
        expect(nameField).toBeRequired()
        expect(nameField).toHaveValue(mocks.tasks[0].name)

        const descriptionField = getByPlaceholderText('Описание')
        expect(descriptionField).toBeInTheDocument()
        expect(descriptionField).toHaveValue(mocks.tasks[0].description)
        expect(descriptionField).toBeInTheDocument()
        expect(descriptionField).toHaveValue(mocks.tasks[0].description)

        expect(getByTestId('current-sprint-planned-at-field')).toBeInTheDocument()
        expect(getByTestId('current-sprint-cancel-button')).toBeInTheDocument()
        expect(getByTestId('current-sprint-submit-button')).toBeInTheDocument()
      })
    })

    describe('when edit task', () => {
      test('task edited', async () => {
        const { findByTestId, getByTestId, getAllByTestId, getByPlaceholderText, queryByTestId } = renderWithConfig(CurrentSprint)

        await fireEvent.click(await findByTestId('current-sprint-task'))
        await fireEvent.update(getByPlaceholderText('Название'), mocks.newTask[0].name)
        await fireEvent.update(getByPlaceholderText('Описание'), mocks.newTask[0].description)
        await fireEvent.submit(getByTestId('current-sprint-task-form'))

        await waitFor(() => {
          const currentSprintTasks = getAllByTestId('current-sprint-task')
          expect(queryByTestId('current-sprint-task-form')).not.toBeInTheDocument()
          expect(currentSprintTasks[0]).toContainHTML(mocks.newTask[0].name)
          expect(currentSprintTasks[0]).toContainHTML(mocks.newTask[0].description)
        })
      })
    })
  })
})
