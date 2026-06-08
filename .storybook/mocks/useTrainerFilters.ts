import { computed } from 'vue'
import { DEFAULT_LIST_QUERY } from '../../shared/domain/catalog/value-objects/list-query'
import { storyFiltersComputed, storyUpdateFilters } from './catalog-filter-state'

export function useTrainerFilters() {
  return {
    filters: storyFiltersComputed,
    updateFilters: storyUpdateFilters,
    defaultQuery: DEFAULT_LIST_QUERY,
  }
}
