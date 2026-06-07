import { useCatalogCityGate } from '~/composables/catalog/useCatalogCityGate'
import { usePersonalTrainers } from '~/composables/catalog/usePersonalTrainers'
import { useTrainerFilters } from '~/composables/catalog/useTrainerFilters'

export function useFTCatalogToolbar() {
  const { fetchEnabled } = useCatalogCityGate()
  const { filters, updateFilters } = useTrainerFilters()
  const { total, pending } = usePersonalTrainers({}, { enabled: fetchEnabled })

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
