import { describe, test } from 'vitest'
import { screen, fireEvent, waitFor, within } from '@testing-library/vue'
import { rest } from 'msw'
import dayjs from 'dayjs'
import { flushPromises, renderWithSetup } from '../../../../test/setup'
import { useUserStore } from '../../../stores/user'
import CurrentSprint from '../CurrentSprint.vue'
import * as mocks from './__mocks__'
import { server, SUPABASE_URL } from './__setup__'

describe('when click task add button', () => {
  test('task form displayed', async () => {
    renderWithSetup(CurrentSprint)

    await fireEvent.click(screen.getByTestId('current-sprint-task-add-button'))

    await waitFor(() => {
      expect(screen.getByTestId('task-form')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Название')).toBeRequired()
      expect(screen.getByPlaceholderText('Описание')).not.toBeRequired()
      expect(screen.getByTestId('task-form-planned-at-field')).not.toBeRequired()
      expect(screen.getByTestId('task-form-cancel-button')).toBeInTheDocument()
      expect(screen.getByTestId('task-form-submit-button')).toBeInTheDocument()
    })
  })
})

describe('when submit blank form', () => {
  test('task form not sent', async () => {
    renderWithSetup(CurrentSprint)

    await fireEvent.click(screen.getByTestId('current-sprint-task-add-button'))
    await fireEvent.click(screen.getByTestId('task-form-submit-button'))

    expect(screen.getByTestId('task-form')).toBeInTheDocument()
  })
})

describe('when submit filled form', () => {
  describe('when form is successfully sent', () => {
    test('task created and added to the top of the list', async () => {
      const expectedNewTask = {
        ...mocks.newTask,
        planned_at: null
      }

      server.use(rest.post(`${SUPABASE_URL}/rest/v1/tasks`, (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json([expectedNewTask])
        )
      }))

      renderWithSetup(CurrentSprint)

      const userStore = useUserStore()
      userStore.$patch({ user: { id: '123' } })

      await flushPromises()

      await fireEvent.click(screen.getByTestId('current-sprint-task-add-button'))
      await fireEvent.update(screen.getByPlaceholderText('Название'), expectedNewTask.name)
      await fireEvent.update(screen.getByPlaceholderText('Описание'), expectedNewTask.description)
      await fireEvent.submit(screen.getByTestId('task-form'))

      await waitFor(() => {
        const currentSprintTasks = screen.getAllByTestId('current-sprint-task')
        expect(screen.queryByTestId('task-form')).not.toBeInTheDocument()
        expect(currentSprintTasks).toHaveLength(mocks.tasks.length + 1)

        const receivedNewTask = within(currentSprintTasks[0])
        expect(receivedNewTask.getByTestId('task-name')).toHaveTextContent(expectedNewTask.name)
        expect(receivedNewTask.getByTestId('task-description')).toHaveTextContent(expectedNewTask.description)
      })
    })

    test('task created and added to the list sorted by planned at', async () => {
      const expectedNewTaskIndex = 3
      const expectedNewTask = mocks.newTask

      server.use(rest.post(`${SUPABASE_URL}/rest/v1/tasks`, (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json([expectedNewTask])
        )
      }))

      renderWithSetup(CurrentSprint)

      const userStore = useUserStore()
      userStore.$patch({ user: { id: '123' } })

      await flushPromises()

      await fireEvent.click(screen.getByTestId('current-sprint-task-add-button'))
      await fireEvent.update(screen.getByPlaceholderText('Название'), expectedNewTask.name)
      await fireEvent.update(screen.getByPlaceholderText('Описание'), expectedNewTask.description)
      await fireEvent.submit(screen.getByTestId('task-form'))

      await waitFor(() => {
        const currentSprintTasks = screen.getAllByTestId('current-sprint-task')

        expect(screen.queryByTestId('task-form')).not.toBeInTheDocument()
        expect(currentSprintTasks).toHaveLength(mocks.tasks.length + 1)

        const receivedNewTaskIndex = currentSprintTasks.findIndex((task) => task.textContent?.includes(expectedNewTask.name))
        const receivedNewTask = within(currentSprintTasks[receivedNewTaskIndex])
        expect(receivedNewTaskIndex).toBe(expectedNewTaskIndex)
        expect(receivedNewTask.getByTestId('task-name')).toHaveTextContent(expectedNewTask.name)
        expect(receivedNewTask.getByTestId('task-description')).toHaveTextContent(expectedNewTask.description)
        expect(receivedNewTask.getByTestId('task-planned-at')).toHaveTextContent(dayjs(expectedNewTask.planned_at).format('ddd, D MMMM'))
      })
    })
  })

  describe('when form is failed sent', () => {
    test('task not created', async () => {
      const expectedNewTask = mocks.newTask

      server.use(rest.post(`${SUPABASE_URL}/rest/v1/tasks`, (req, res, ctx) => {
        return res(
          ctx.status(500),
          ctx.json({
            error: { message: 'Server error' }
          })
        )
      }))

      renderWithSetup(CurrentSprint)

      const userStore = useUserStore()
      userStore.$patch({ user: { id: '123' } })

      await flushPromises()

      await fireEvent.click(screen.getByTestId('current-sprint-task-add-button'))
      await fireEvent.update(screen.getByPlaceholderText('Название'), expectedNewTask.name)
      await fireEvent.update(screen.getByPlaceholderText('Описание'), expectedNewTask.description)
      await fireEvent.submit(screen.getByTestId('task-form'))

      await waitFor(() => {
        const currentSprintTasks = screen.getAllByTestId('current-sprint-task')

        expect(screen.queryByTestId('task-form')).not.toBeInTheDocument()
        expect(currentSprintTasks).toHaveLength(mocks.tasks.length)

        const receivedNewTask = currentSprintTasks.find((task) => task.textContent?.includes(expectedNewTask.name))
        expect(receivedNewTask).toBeUndefined()
      })
    })

    test.todo('error displayed')
  })
})
