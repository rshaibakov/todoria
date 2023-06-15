import { describe, test } from 'vitest'
import { fireEvent, waitFor } from '@testing-library/vue'
import { renderWithSetup } from '../../../../test/setup'
import CurrentSprint from '../CurrentSprint.vue'
import * as mocks from './__mocks__'
import './__setup__'

describe('when click task', () => {
  test('task form displayed', async () => {
    const { findByTestId, getByTestId, getByPlaceholderText } = renderWithSetup(CurrentSprint)

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
      const { findByTestId, getByTestId, getAllByTestId, getByPlaceholderText, queryByTestId } = renderWithSetup(CurrentSprint)

      await fireEvent.click(await findByTestId('current-sprint-task'))
      await fireEvent.update(getByPlaceholderText('Название'), mocks.newTask.name)
      await fireEvent.update(getByPlaceholderText('Описание'), mocks.newTask.description)
      await fireEvent.submit(getByTestId('current-sprint-task-form'))

      await waitFor(() => {
        const currentSprintTasks = getAllByTestId('current-sprint-task')
        expect(queryByTestId('current-sprint-task-form')).not.toBeInTheDocument()
        expect(currentSprintTasks[0]).toContainHTML(mocks.newTask.name)
        expect(currentSprintTasks[0]).toContainHTML(mocks.newTask.description)
      })
    })
  })
})
