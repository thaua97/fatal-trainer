import { computed } from 'vue'
import { CATALOG_SPECIALTIES } from '../../shared/domain/catalog/constants/catalog-options'
import { storyFiltersComputed, storyUpdateFilters } from './catalog-filter-state'

export function useFTSpecialtyFilter() {
  const options = CATALOG_SPECIALTIES
  const selected = computed(() => storyFiltersComputed.value.specialties ?? [])

  function isSelected(specialty: string) {
    return selected.value.includes(specialty)
  }

  function toggle(specialty: string) {
    const current = selected.value
    const next = current.includes(specialty)
      ? current.filter((item) => item !== specialty)
      : [...current, specialty]

    storyUpdateFilters({
      specialties: next.length ? next : undefined,
      page: 1,
    })
  }

  return { options, selected, isSelected, toggle }
}
