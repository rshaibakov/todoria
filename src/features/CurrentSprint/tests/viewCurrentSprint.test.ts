import { test } from 'vitest'
import { screen, waitFor } from '@testing-library/vue'
import dayjs from 'dayjs'
import { rest } from 'msw'
import { renderWithSetup } from '../../../../test/setup'
import CurrentSprint from '../CurrentSprint.vue'
import * as mocks from './__mocks__'
import { server, SUPABASE_URL } from './__setup__'

test('title displayed', async () => {
  renderWithSetup(CurrentSprint)

  await waitFor(() => {
    expect(screen.getByTestId('current-sprint-title'))
      .toHaveTextContent(`Спринт #${mocks.sprints[0].number} [${mocks.startAt.format('ddd, D MMMM')} - ${mocks.finishAt.format('ddd, D MMMM')}]`)
  })
})

test('task form not displayed', async () => {
  renderWithSetup(CurrentSprint)

  await waitFor(() => {
    expect(screen.queryByTestId('current-sprint-task-form')).not.toBeInTheDocument()
  })
})

test('tasks displayed', async () => {
  renderWithSetup(CurrentSprint)

  await waitFor(() => {
    const currentSprintTasks = screen.getAllByTestId('current-sprint-task')
    expect(currentSprintTasks).toHaveLength(mocks.tasks.length)
    expect(currentSprintTasks[0]).toContainHTML(mocks.tasks[0].name)
    expect(currentSprintTasks[0]).toContainHTML(mocks.tasks[0].description)
    expect(currentSprintTasks[0]).toContainHTML(dayjs(mocks.tasks[0].planned_at).format('ddd, D MMMM'))
  })
})

describe('when there are no tasks', () => {
  test('tasks not displayed', async () => {
    server.use(rest.get(`${SUPABASE_URL}/rest/v1/sprints`, (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json([])
      )
    }))

    renderWithSetup(CurrentSprint)

    await waitFor(() => {
      const currentSprintTasks = screen.queryAllByTestId('current-sprint-task')
      expect(currentSprintTasks).toHaveLength(0)
    })
  })
})
