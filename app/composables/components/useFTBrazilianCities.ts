import type { BrazilianCity } from '#shared/data/brazilian-cities'
import { loadBrazilianCities } from '#shared/data/brazilian-cities'
import { refDebounced } from '@vueuse/core'

const MAX_RESULTS = 50

function normalizeSearchTerm(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

export function useFTBrazilianCities() {
  const searchTerm = ref('')
  const searchTermDebounced = refDebounced(searchTerm, 200)
  const cities = ref<BrazilianCity[]>([])
  const loading = ref(false)

  onMounted(async () => {
    loading.value = true
    try {
      cities.value = await loadBrazilianCities()
    }
    finally {
      loading.value = false
    }
  })

  const filteredItems = computed(() => {
    const query = normalizeSearchTerm(searchTermDebounced.value)
    if (!query) {
      return cities.value.slice(0, MAX_RESULTS)
    }

    return cities.value
      .filter((item) => {
        const city = normalizeSearchTerm(item.city)
        const state = normalizeSearchTerm(item.state)
        const label = normalizeSearchTerm(item.label)
        return city.includes(query) || state.includes(query) || label.includes(query)
      })
      .slice(0, MAX_RESULTS)
  })

  return {
    searchTerm,
    filteredItems,
    loading,
    cities,
  }
}
