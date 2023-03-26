import { AuthError } from '@supabase/supabase-js'
import { fireEvent, waitFor } from '@testing-library/vue'
import { describe, test, vi } from 'vitest'
import { renderWithConfig } from '../../test/setup'
import { supabase } from '../db'
import Auth from './Auth.vue'

describe('Auth', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  test('text field is empty', async () => {
    const { getByTestId } = renderWithConfig(Auth)

    expect(getByTestId('auth-email-text-field')).toHaveValue('')
  })

  test('submit button displayed', async () => {
    const { getByTestId } = renderWithConfig(Auth)

    expect(getByTestId('auth-submit')).toHaveTextContent('Получить ссылку')
  })

  test('message hidden', async () => {
    const { queryByTestId } = renderWithConfig(Auth)

    expect(queryByTestId('auth-message')).not.toBeInTheDocument()
  })

  describe('when submit form', () => {
    describe('when email field filled', () => {
      beforeAll(() => {
        vi.spyOn(supabase.auth, 'signInWithOtp').mockResolvedValue({
          data: {
            user: null,
            session: null
          },
          error: null
        })
      })

      test('submit button displayed', async () => {
        const { getByTestId } = renderWithConfig(Auth)

        expect(getByTestId('auth-submit')).toHaveTextContent('Получить ссылку')
      })

      test('message displayed', async () => {
        const { getByTestId } = renderWithConfig(Auth)

        await fireEvent.update(getByTestId('auth-email-text-field'), 'rshaibakov@gmail.com')
        await fireEvent.submit(getByTestId('auth-form'))

        await waitFor(async () => {
          expect(getByTestId('auth-message')).toHaveTextContent('Ссылка для входа отправлена на почту')
        })
      })

      // TODO: Добавить проверку на валидность поля
    })

    describe('when email field is not valid', () => {
      beforeAll(() => {
        vi.spyOn(supabase.auth, 'signInWithOtp').mockResolvedValue({
          data: {
            user: null,
            session: null
          },
          error: null
        })
      })

      test('submit button displayed', async () => {
        const { getByTestId } = renderWithConfig(Auth)

        expect(getByTestId('auth-submit')).toHaveTextContent('Получить ссылку')
      })

      // TODO: Добавить проверку на валидность поля
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      test.skip('error displayed', async () => { })
    })

    describe('when response from server with error', () => {
      beforeAll(() => {
        vi.spyOn(supabase.auth, 'signInWithOtp').mockResolvedValue({
          data: {
            user: null,
            session: null
          },
          error: new AuthError('This is error')
        })
      })

      test('error displayed', async () => {
        const { getByTestId } = renderWithConfig(Auth)

        await fireEvent.update(getByTestId('auth-email-text-field'), 'rshaibakov@gmail.com')
        await fireEvent.submit(getByTestId('auth-form'))

        await waitFor(async () => {
          expect(getByTestId('auth-message')).toHaveTextContent('Произошла ошибка при отправлении ссылки. Попробуйте снова')
        })
      })
    })
  })
})
