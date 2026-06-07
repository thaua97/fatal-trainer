import { computed, ref } from 'vue'
import { vi } from 'vitest'
import type { ListQuery } from '../../shared/domain/catalog/value-objects/list-query'
import { DEFAULT_LIST_QUERY } from '../../shared/domain/catalog/value-objects/list-query'

export const mockTrainerFiltersState = ref<ListQuery>({ ...DEFAULT_LIST_QUERY })

export const mockUpdateTrainerFilters = vi.fn((partial: Partial<ListQuery>) => {
  mockTrainerFiltersState.value = {
    ...mockTrainerFiltersState.value,
    ...partial,
    page: partial.page ?? 1,
  }
})

export function resetMockTrainerFilters() {
  mockTrainerFiltersState.value = { ...DEFAULT_LIST_QUERY }
  mockUpdateTrainerFilters.mockClear()
}

export function mockUseTrainerFilters() {
  return {
    filters: computed(() => mockTrainerFiltersState.value),
    updateFilters: mockUpdateTrainerFilters,
    defaultQuery: DEFAULT_LIST_QUERY,
  }
}
