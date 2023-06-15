import { test } from 'vitest'
import { screen, waitFor, within } from '@testing-library/vue'
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
      .toHaveTextContent(`Спринт #${mocks.sprints[0].number} [${mocks.sprintStartAt.format('ddd, D MMMM')} - ${mocks.sprintFinishAt.format('ddd, D MMMM')}]`)
  })
})

test('task form not displayed', async () => {
  renderWithSetup(CurrentSprint)

  await waitFor(() => {
    expect(screen.queryByTestId('current-sprint-task-form')).not.toBeInTheDocument()
  })
})

test('tasks count corrected', async () => {
  renderWithSetup(CurrentSprint)

  await waitFor(() => {
    const currentSprintTasks = screen.getAllByTestId('current-sprint-task')
    expect(currentSprintTasks).toHaveLength(mocks.tasks.length)
  })
})

test.concurrent.each(mocks.tasks.map((task, index) => [index, task]))('task %# displayed', async (index, expectedTask) => {
  renderWithSetup(CurrentSprint)

  await waitFor(() => {
    const currentSprintTasks = screen.getAllByTestId('current-sprint-task')
    const receivedTask = within(currentSprintTasks[index])
    expect(receivedTask.getByTestId('task-name')).toHaveTextContent(expectedTask.name)

    if (expectedTask.description === '' || expectedTask.description === null) {
      expect(receivedTask.queryByTestId('task-description')).not.toBeInTheDocument()
    } else {
      expect(receivedTask.getByTestId('task-description')).toHaveTextContent(expectedTask.description)
    }

    if (expectedTask.planned_at === null) {
      expect(receivedTask.queryByTestId('task-planned-at')).not.toBeInTheDocument()
    } else {
      expect(receivedTask.getByTestId('task-planned-at')).toHaveTextContent(dayjs(expectedTask.planned_at).format('ddd, D MMMM'))
    }
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
