export function useFTCatalogToolbar() {
  const { filters, updateFilters } = useTrainerFilters()
  const { total, pending } = usePersonalTrainers()

  const search = computed({
    get: () => filters.value.search ?? '',
    set: (value: string) => updateFilters({ search: value || undefined, page: 1 }),
  })

  return {
    search,
    filters,
    updateFilters,
    total,
    pending,
  }
}
