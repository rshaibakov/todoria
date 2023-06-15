import { test } from 'vitest'
import { waitFor } from '@testing-library/vue'
import dayjs from 'dayjs'
import { renderWithSetup } from '../../../../test/setup'
import CurrentSprint from '../CurrentSprint.vue'
import * as mocks from './__mocks__'
import './__setup__'

test('title displayed', async () => {
  const { getByTestId } = renderWithSetup(CurrentSprint)

  await waitFor(() => {
    const expectedTitle = `Спринт #${mocks.sprints[0].number} [${mocks.startAt.format('ddd, D MMMM')} - ${mocks.finishAt.format('ddd, D MMMM')}]`

    expect(getByTestId('current-sprint-title')).toHaveTextContent(expectedTitle)
  })
})

test('task form not displayed', () => {
  const { queryByTestId } = renderWithSetup(CurrentSprint)

  expect(queryByTestId('current-sprint-task-form')).not.toBeInTheDocument()
})

test('tasks displayed', async () => {
  const { getAllByTestId } = renderWithSetup(CurrentSprint)

  await waitFor(() => {
    const currentSprintTasks = getAllByTestId('current-sprint-task')

    expect(currentSprintTasks).toHaveLength(mocks.tasks.length)
    expect(currentSprintTasks[0]).toContainHTML(mocks.tasks[0].name)
    expect(currentSprintTasks[0]).toContainHTML(mocks.tasks[0].description)
    expect(currentSprintTasks[0]).toContainHTML(dayjs(mocks.tasks[0].planned_at).format('ddd, D MMMM'))
  })
})
