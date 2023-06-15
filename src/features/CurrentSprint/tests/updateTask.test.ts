import { describe, test } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/vue'
import { renderWithSetup } from '../../../../test/setup'
import CurrentSprint from '../CurrentSprint.vue'
import * as mocks from './__mocks__'
import './__setup__'

describe('when click task', () => {
  test('task form displayed', async () => {
    renderWithSetup(CurrentSprint)

    await fireEvent.click(await screen.findByTestId('current-sprint-task'))

    await waitFor(() => {
      expect(screen.getByTestId('current-sprint-task-form')).toBeInTheDocument()

      const nameField = screen.getByPlaceholderText('Название')
      expect(nameField).toBeInTheDocument()
      expect(nameField).toBeRequired()
      expect(nameField).toHaveValue(mocks.tasks[0].name)

      const descriptionField = screen.getByPlaceholderText('Описание')
      expect(descriptionField).toBeInTheDocument()
      expect(descriptionField).toHaveValue(mocks.tasks[0].description)
      expect(descriptionField).toBeInTheDocument()
      expect(descriptionField).toHaveValue(mocks.tasks[0].description)

      expect(screen.getByTestId('current-sprint-planned-at-field')).toBeInTheDocument()
      expect(screen.getByTestId('current-sprint-cancel-button')).toBeInTheDocument()
      expect(screen.getByTestId('current-sprint-submit-button')).toBeInTheDocument()
    })
  })

  describe('when edit task', () => {
    describe('when form is successfully sent', () => {
      test('task edited', async () => {
        renderWithSetup(CurrentSprint)

        await fireEvent.click(await screen.findByTestId('current-sprint-task'))
        await fireEvent.update(screen.getByPlaceholderText('Название'), mocks.newTask.name)
        await fireEvent.update(screen.getByPlaceholderText('Описание'), mocks.newTask.description)
        await fireEvent.submit(screen.getByTestId('current-sprint-task-form'))

        await waitFor(() => {
          const currentSprintTasks = screen.getAllByTestId('current-sprint-task')
          expect(screen.queryByTestId('current-sprint-task-form')).not.toBeInTheDocument()
          expect(currentSprintTasks[0]).toContainHTML(mocks.newTask.name)
          expect(currentSprintTasks[0]).toContainHTML(mocks.newTask.description)
        })
      })

      test.todo('error not displayed')
    })

    describe('when form is failed sent', () => {
      test.todo('task not edited')
      test.todo('error displayed')
    })
  })
})
