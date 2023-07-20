import { describe, test } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/vue'
import { rest } from 'msw'
import { renderWithSetup } from '../../../../test/setup'
import CurrentSprint from '../CurrentSprint.vue'
import * as mocks from './__mocks__'
import { SUPABASE_URL, server } from './__setup__'

describe('when click task', () => {
  describe('when delete task', () => {
    describe('when form is successfully sent', () => {
      test.todo('task deleted', async () => {
        const expectedDeletedTask = mocks.tasks[0]
        server.use(rest.delete(`${SUPABASE_URL}/rest/v1/tasks`, (req, res, ctx) => {
          return res(ctx.status(204))
        }))

        renderWithSetup(CurrentSprint)

        await fireEvent.click(await screen.findByTestId('current-sprint-task'))
        await fireEvent.click(screen.getByTestId('task-form-delete-button'))
        await fireEvent.submit(screen.getByTestId('dialog-confirm'))

        await waitFor(() => {
          const currentSprintTasks = screen.getAllByTestId('current-sprint-task')
          /* expect(screen.queryByTestId('task-form')).not.toBeInTheDocument()
          expect(currentSprintTasks[0]).not.toContainHTML(expectedDeletedTask.name)
          expect(currentSprintTasks[0]).not.toContainHTML(expectedDeletedTask.description) */
        })
      })

      test.todo('error not displayed')
    })

    describe('when form is failed sent', () => {
      test.todo('task not deleted', async () => {
        const expectedDeletedTask = mocks.tasks[0]
        console.error = vi.fn()

        server.use(rest.delete(`${SUPABASE_URL}/rest/v1/tasks`, (req, res, ctx) => {
          return res(
            ctx.status(500),
            ctx.json({
              message: 'Server error'
            })
          )
        }))

        renderWithSetup(CurrentSprint)

        await fireEvent.click(await screen.findByTestId('current-sprint-task'))
        await fireEvent.click(screen.getByTestId('task-form-delete-button'))
        await fireEvent.submit(screen.getByTestId('dialog-confirm'))

        await waitFor(() => {
          const currentSprintTasks = screen.getAllByTestId('current-sprint-task')
          /* expect(screen.queryByTestId('task-form')).not.toBeInTheDocument()
          expect(currentSprintTasks[0]).toContainHTML(expectedDeletedTask.name)
          expect(currentSprintTasks[0]).toContainHTML(expectedDeletedTask.description)

          expect(console.error).toHaveBeenCalledTimes(1)
          expect(console.error).toHaveBeenCalledWith('Server error') */
        })
      })

      test.todo('error displayed')
    })
  })
})
