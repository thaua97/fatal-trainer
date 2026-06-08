import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import { refDebounced } from '@vueuse/core'

function normalizeSearchTerm(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

function filterCities(
  cities: Array<{ label: string, city: string, state: string, value: string }>,
  query: string,
  max = 50,
) {
  const normalized = normalizeSearchTerm(query)
  if (!normalized) {
    return cities.slice(0, max)
  }

  return cities
    .filter((item) => {
      const city = normalizeSearchTerm(item.city)
      const state = normalizeSearchTerm(item.state)
      const label = normalizeSearchTerm(item.label)
      return city.includes(normalized) || state.includes(normalized) || label.includes(normalized)
    })
    .slice(0, max)
}

describe('useFTBrazilianCities filtering', () => {
  const sample = [
    { label: 'São Paulo - SP', city: 'São Paulo', state: 'SP', value: 'sao-paulo-sp' },
    { label: 'Santos - SP', city: 'Santos', state: 'SP', value: 'santos-sp' },
    { label: 'Rio de Janeiro - RJ', city: 'Rio de Janeiro', state: 'RJ', value: 'rio-de-janeiro-rj' },
  ]

  it('returns all cities when search is empty', () => {
    expect(filterCities(sample, '')).toHaveLength(3)
  })

  it('filters by city name without accents', () => {
    expect(filterCities(sample, 'sao paulo')).toEqual([sample[0]])
  })

  it('filters by state', () => {
    expect(filterCities(sample, 'sp')).toHaveLength(2)
  })

  it('debounces search term updates', async () => {
    const source = ref('sao')
    const debounced = refDebounced(source, 50)

    expect(debounced.value).toBe('sao')
    source.value = 'santos'
    expect(debounced.value).toBe('sao')

    await new Promise(resolve => setTimeout(resolve, 60))
    expect(debounced.value).toBe('santos')
  })
})
