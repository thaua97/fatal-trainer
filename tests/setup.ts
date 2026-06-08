import { beforeEach, vi } from 'vitest'
import { mockUseTrainerFilters, resetMockTrainerFilters } from './helpers/mock-trainer-filters'

vi.mock('../app/composables/catalog/useTrainerFilters', () => ({
  useTrainerFilters: () => mockUseTrainerFilters(),
}))

beforeEach(() => {
  resetMockTrainerFilters()
})

export { mockTrainer } from './helpers/mock-trainer'
