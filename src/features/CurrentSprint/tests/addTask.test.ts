import { describe, test } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/vue'
import { rest } from 'msw'
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
      expect(screen.getByTestId('current-sprint-task-form')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Название')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Название')).toBeRequired()
      expect(screen.getByPlaceholderText('Описание')).toBeInTheDocument()
      expect(screen.getByTestId('current-sprint-planned-at-field')).toBeInTheDocument()
      expect(screen.getByTestId('current-sprint-cancel-button')).toBeInTheDocument()
      expect(screen.getByTestId('current-sprint-submit-button')).toBeInTheDocument()
    })
  })
})

describe('when submit blank form', () => {
  test('task form not sent', async () => {
    renderWithSetup(CurrentSprint)

    await fireEvent.click(screen.getByTestId('current-sprint-task-add-button'))
    await fireEvent.click(screen.getByTestId('current-sprint-submit-button'))

    expect(screen.getByTestId('current-sprint-task-form')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Название')).toBeRequired()
    expect(screen.getByPlaceholderText('Описание')).not.toBeRequired()
    expect(screen.getByTestId('current-sprint-planned-at-field')).not.toBeRequired()
  })
})

describe('when submit filled form', () => {
  describe('when form is successfully sent', () => {
    test('task created', async () => {
      server.use(rest.post(`${SUPABASE_URL}/rest/v1/tasks`, (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json([{
            ...mocks.newTask,
            planned_at: null
          }])
        )
      }))

      renderWithSetup(CurrentSprint)

      const userStore = useUserStore()
      userStore.$patch({ user: { id: '123' } })

      await flushPromises()

      await fireEvent.click(screen.getByTestId('current-sprint-task-add-button'))
      await fireEvent.update(screen.getByPlaceholderText('Название'), mocks.newTask.name)
      await fireEvent.update(screen.getByPlaceholderText('Описание'), mocks.newTask.description)
      await fireEvent.submit(screen.getByTestId('current-sprint-task-form'))

      await waitFor(() => {
        const currentSprintTasks = screen.getAllByTestId('current-sprint-task')

        expect(screen.queryByTestId('current-sprint-task-form')).not.toBeInTheDocument()
        expect(currentSprintTasks).toHaveLength(mocks.tasks.length + 1)
        expect(currentSprintTasks[0]).toContainHTML(mocks.newTask.name)
        expect(currentSprintTasks[0]).toContainHTML(mocks.newTask.description)
      })
    })

    test.todo('error not displayed')
  })

  describe('when form is failed sent', () => {
    test.todo('task not created')
    test.todo('error displayed')
  })
})
