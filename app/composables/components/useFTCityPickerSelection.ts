import type { BrazilianCity } from '#shared/data/brazilian-cities'

export function useFTCityPickerSelection(options: {
  city: Ref<string>
  state: Ref<string>
  cities: Ref<BrazilianCity[]>
  searchTerm: Ref<string>
  isEditing: Ref<boolean>
}) {
  const selectedValue = ref<string | undefined>()

  function formatSelectedCityLabel(item: BrazilianCity): string {
    return `${item.city}, ${item.state}`
  }

  function findCityItem(nextCity: string, nextState: string): BrazilianCity | undefined {
    const normalizedState = nextState.trim().toUpperCase()
    return options.cities.value.find(item =>
      item.city === nextCity && item.state === normalizedState,
    )
  }

  const displayValue = computed(() => {
    if (!options.city.value || !options.state.value) {
      return ''
    }

    const item = findCityItem(options.city.value, options.state.value)
    return item
      ? formatSelectedCityLabel(item)
      : `${options.city.value}, ${options.state.value}`
  })

  const triggerIcon = computed(() =>
    displayValue.value ? 'i-lucide-map-pin' : 'i-lucide-search',
  )

  function syncSearchTermFromSelection() {
    if (!options.city.value || !options.state.value) {
      options.searchTerm.value = ''
      selectedValue.value = undefined
      return
    }

    const item = findCityItem(options.city.value, options.state.value)
    if (item) {
      selectedValue.value = item.value
      options.searchTerm.value = formatSelectedCityLabel(item)
    }
  }

  watch([options.city, options.state, options.cities], ([nextCity, nextState]) => {
    if (!nextCity || !nextState) {
      selectedValue.value = undefined
      if (!options.isEditing.value) {
        options.searchTerm.value = ''
      }
      return
    }

    const item = findCityItem(nextCity, nextState)
    if (item) {
      selectedValue.value = item.value
      if (!options.isEditing.value) {
        options.searchTerm.value = formatSelectedCityLabel(item)
      }
    }
  }, { immediate: true })

  function onSelect(value: string | undefined, stopEditing: () => void) {
    if (!value) {
      options.city.value = ''
      options.state.value = ''
      stopEditing()
      return
    }

    const item = options.cities.value.find(cityItem => cityItem.value === value)
    if (!item) {
      return
    }

    options.city.value = item.city
    options.state.value = item.state
    options.searchTerm.value = formatSelectedCityLabel(item)
    stopEditing()
  }

  watch(options.searchTerm, (value) => {
    if (!options.isEditing.value) {
      return
    }

    if (!value.trim()) {
      selectedValue.value = undefined
      options.city.value = ''
      options.state.value = ''
      return
    }

    if (!selectedValue.value) {
      return
    }

    const item = options.cities.value.find(cityItem => cityItem.value === selectedValue.value)
    if (item && formatSelectedCityLabel(item) !== value) {
      selectedValue.value = undefined
      options.city.value = ''
      options.state.value = ''
    }
  })

  return {
    selectedValue,
    displayValue,
    triggerIcon,
    syncSearchTermFromSelection,
    onSelect,
  }
}
