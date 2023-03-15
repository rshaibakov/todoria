import { describe, test, vi } from 'vitest'
import { fireEvent, waitFor } from '@testing-library/vue'
import { supabase } from '../db'
import { renderWithConfig } from '../../test/setup'
import Home from './Home.vue'
import { AuthError } from '@supabase/supabase-js'

describe('Home', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  test('sign out button displayed', () => {
    const { getByTestId } = renderWithConfig(Home)

    expect(getByTestId('sign-out-button')).toHaveTextContent('Выйти')
  })

  test('error message hidden', () => {
    const { queryByTestId } = renderWithConfig(Home)

    expect(queryByTestId('sign-out-message')).not.toBeInTheDocument()
  })

  describe('when click sign out button', async () => {
    describe('when successful response from server', () => {
      beforeAll(() => {
        vi.spyOn(supabase.auth, 'signOut').mockResolvedValue({ error: null })
      })

      test('sign out button with loading displayed', async () => {
        const { getByTestId } = renderWithConfig(Home)

        await fireEvent.click(getByTestId('sign-out-button'))

        expect(getByTestId('sign-out-button')).toHaveTextContent('Загрузка')

        await waitFor(() => {
          expect(getByTestId('sign-out-button')).toHaveTextContent('Выйти')
        })
      })

      test('error message hidden', async () => {
        const { getByTestId, queryByTestId } = renderWithConfig(Home)

        await fireEvent.click(getByTestId('sign-out-button'))

        expect(queryByTestId('sign-out-message')).not.toBeInTheDocument()
      })

      test('redirected to auth page', async () => {
        const { getByTestId, router } = renderWithConfig(Home)
        const push = vi.spyOn(router, 'push')

        await fireEvent.click(getByTestId('sign-out-button'))

        await waitFor(() => {
          expect(push).toHaveBeenCalledTimes(1)
          expect(push).toHaveBeenCalledWith({ name: 'Auth' })
        })
      })
    })

    describe('when response from server with error', () => {
      beforeAll(() => {
        vi.spyOn(supabase.auth, 'signOut').mockResolvedValue({ error: new AuthError('This is error') })
      })

      test('sign out button displayed', async () => {
        const { getByTestId } = renderWithConfig(Home)

        await fireEvent.click(getByTestId('sign-out-button'))

        expect(getByTestId('sign-out-button')).toHaveTextContent('Загрузка')

        await waitFor(() => {
          expect(getByTestId('sign-out-button')).toHaveTextContent('Выйти')
        })
      })

      test('error message displayed', async () => {
        const { getByTestId } = renderWithConfig(Home)

        await fireEvent.click(getByTestId('sign-out-button'))

        await waitFor(() => {
          expect(getByTestId('sign-out-message')).toHaveTextContent('This is error')
        })
      })

      test('redirect to auth page did not occur', async () => {
        const { getByTestId, router } = renderWithConfig(Home)
        const push = vi.spyOn(router, 'push')

        await fireEvent.click(getByTestId('sign-out-button'))

        await waitFor(() => {
          expect(push).toHaveBeenCalledTimes(0)
        })
      })
    })
  })
})
