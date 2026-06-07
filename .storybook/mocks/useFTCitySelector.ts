import { computed, ref } from 'vue'
import { storyFiltersComputed, storyUpdateFilters } from './catalog-filter-state'

export function useFTCitySelector() {
  const city = computed({
    get: () => storyFiltersComputed.value.city ?? '',
    set: (value: string) => storyUpdateFilters({ city: value || undefined }),
  })

  return {
    city,
    state: ref(''),
    detecting: ref(false),
    geoError: ref<string | undefined>(undefined),
    isSupported: ref(true),
    onDetect: () => {},
    onClear: () => {
      storyUpdateFilters({ city: undefined })
    },
  }
}
