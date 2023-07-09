import { describe, test } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/vue'
import { rest } from 'msw'
import { renderWithSetup } from '../../../../test/setup'
import CurrentSprint from '../CurrentSprint.vue'
import * as mocks from './__mocks__'
import { SUPABASE_URL, server } from './__setup__'

describe('when click task', () => {
  test('task form displayed', async () => {
    renderWithSetup(CurrentSprint)

    await fireEvent.click(await screen.findByTestId('current-sprint-task'))

    await waitFor(() => {
      expect(screen.getByTestId('task-form')).toBeInTheDocument()

      const nameField = screen.getByPlaceholderText('Название')
      expect(nameField).toBeInTheDocument()
      expect(nameField).toBeRequired()
      expect(nameField).toHaveValue(mocks.tasks[0].name)

      const descriptionField = screen.getByPlaceholderText('Описание')
      expect(descriptionField).toBeInTheDocument()
      expect(descriptionField).toHaveValue(mocks.tasks[0].description)
      expect(descriptionField).toBeInTheDocument()
      expect(descriptionField).toHaveValue(mocks.tasks[0].description)

      expect(screen.getByTestId('task-form-planned-at-field')).toBeInTheDocument()
      expect(screen.getByTestId('task-form-cancel-button')).toBeInTheDocument()
      expect(screen.getByTestId('task-form-submit-button')).toBeInTheDocument()
    })
  })

  describe('when edit task', () => {
    describe('when form is successfully sent', () => {
      test('task saved', async () => {
        const expectedNewTask = mocks.newTask

        server.use(rest.patch(`${SUPABASE_URL}/rest/v1/tasks`, (req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json([expectedNewTask])
          )
        }))

        renderWithSetup(CurrentSprint)

        await fireEvent.click(await screen.findByTestId('current-sprint-task'))
        await fireEvent.update(screen.getByPlaceholderText('Название'), expectedNewTask.name)
        await fireEvent.update(screen.getByPlaceholderText('Описание'), expectedNewTask.description)
        await fireEvent.submit(screen.getByTestId('task-form'))

        await waitFor(() => {
          const currentSprintTasks = screen.getAllByTestId('current-sprint-task')
          expect(screen.queryByTestId('task-form')).not.toBeInTheDocument()
          expect(currentSprintTasks[0]).toContainHTML(expectedNewTask.name)
          expect(currentSprintTasks[0]).toContainHTML(expectedNewTask.description)
        })
      })

      test.todo('error not displayed')
    })

    describe('when form is failed sent', () => {
      test('task not saved', async () => {
        const expectedNewTask = mocks.newTask
        console.error = vi.fn()

        server.use(rest.patch(`${SUPABASE_URL}/rest/v1/tasks`, (req, res, ctx) => {
          return res(
            ctx.status(500),
            ctx.json({
              message: 'Server error'
            })
          )
        }))

        renderWithSetup(CurrentSprint)

        await fireEvent.click(await screen.findByTestId('current-sprint-task'))
        await fireEvent.update(screen.getByPlaceholderText('Название'), expectedNewTask.name)
        await fireEvent.update(screen.getByPlaceholderText('Описание'), expectedNewTask.description)
        await fireEvent.submit(screen.getByTestId('task-form'))

        await waitFor(() => {
          const currentSprintTasks = screen.getAllByTestId('current-sprint-task')
          expect(screen.queryByTestId('task-form')).not.toBeInTheDocument()
          expect(currentSprintTasks[0]).not.toContainHTML(expectedNewTask.name)
          expect(currentSprintTasks[0]).not.toContainHTML(expectedNewTask.description)

          expect(console.error).toHaveBeenCalledTimes(1)
          expect(console.error).toHaveBeenCalledWith('Server error')
        })
      })

      test.todo('error displayed')
    })
  })
})
