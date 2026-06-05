import { CATALOG_SPECIALTIES } from '#shared/domain/catalog/constants/catalog-options'

export function useFTSpecialtyFilter() {
  const { filters, updateFilters } = useTrainerFilters()

  const options = CATALOG_SPECIALTIES

  const selected = computed(() => filters.value.specialties ?? [])

  function isSelected(specialty: string) {
    return selected.value.includes(specialty)
  }

  function toggle(specialty: string) {
    const current = selected.value
    const next = current.includes(specialty)
      ? current.filter((item) => item !== specialty)
      : [...current, specialty]

    updateFilters({
      specialties: next.length ? next : undefined,
      page: 1,
    })
  }

  return {
    options,
    selected,
    isSelected,
    toggle,
  }
}
