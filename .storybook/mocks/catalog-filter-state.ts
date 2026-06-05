import { computed, ref } from 'vue'
import type { ListQuery } from '../../shared/domain/catalog/value-objects/list-query'
import { DEFAULT_LIST_QUERY } from '../../shared/domain/catalog/value-objects/list-query'

export const storyFilters = ref<ListQuery>({
  ...DEFAULT_LIST_QUERY,
  specialties: ['Funcional'],
  modalities: ['presencial'],
  onPromotion: true,
})

export function storyUpdateFilters(partial: Partial<ListQuery>) {
  storyFilters.value = {
    ...storyFilters.value,
    ...partial,
    page: partial.page ?? 1,
  }
}

export const storyFiltersComputed = computed(() => storyFilters.value)
