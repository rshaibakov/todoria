import { configure } from '@testing-library/vue'
import '@testing-library/jest-dom'

configure({
  testIdAttribute: 'data-test-id'
})
