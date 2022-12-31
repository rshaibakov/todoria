import { render } from '@testing-library/vue'
import App from './App.vue'

describe('App', () => {
  test('logo displayed', async () => {
    const { getByTestId } = render(App)

    expect(getByTestId('app_logo-link')).toBeInTheDocument()
    expect(getByTestId('app_logo-image')).toBeInTheDocument()
  })
})
