import { useGeoLocation } from '~/composables/core/useGeoLocation'
import { useTrainerFilters } from '~/composables/catalog/useTrainerFilters'

/**
 * Gates catalog trainer fetching until the user selects a city or opts to view all.
 * Shared state keeps the modal, list and toolbar in sync on `/personal-trainers`.
 */
export function useCatalogCityGate() {
  const { filters, updateFilters } = useTrainerFilters()
  const geo = useGeoLocation()

  const fetchEnabled = useState('catalog-fetch-enabled', () => false)
  const modalOpen = useState('catalog-city-modal-open', () => false)
  const initialized = useState('catalog-city-gate-initialized', () => false)

  function enableFetch(): void {
    fetchEnabled.value = true
    modalOpen.value = false
  }

  function resolveWithAll(): void {
    if (filters.value.city) {
      updateFilters({ city: undefined })
    }
    enableFetch()
  }

  function openModal(): void {
    modalOpen.value = true
  }

  function initializeGate(): void {
    if (initialized.value) {
      return
    }

    initialized.value = true

    if (filters.value.city) {
      enableFetch()
      return
    }

    if (geo.selectedLocation.value) {
      modalOpen.value = false
      fetchEnabled.value = false
      return
    }

    modalOpen.value = true
    fetchEnabled.value = false
  }

  watch(
    () => filters.value,
    (value) => {
      if (value.city) {
        enableFetch()
      }
    },
    { deep: true, immediate: true },
  )

  watch(modalOpen, (open) => {
    if (!open && !fetchEnabled.value) {
      resolveWithAll()
    }
  })

  if (import.meta.client) {
    initializeGate()
  }
  else {
    onMounted(initializeGate)
  }

  const isAwaitingCity = computed(() => !fetchEnabled.value)

  return {
    fetchEnabled,
    modalOpen,
    isAwaitingCity,
    resolveWithAll,
    openModal,
  }
}
