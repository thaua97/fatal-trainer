<script setup lang="ts">
import type { BrazilianCity } from '#shared/data/brazilian-cities'

const city = defineModel<string>('city', { required: true })
const state = defineModel<string>('state', { required: true })

defineProps<{
  error?: string
  testId?: string
}>()

const { t } = useI18n()
const { fieldUi } = useFTProfileEditFieldUi()
const { searchTerm, filteredItems, loading, cities } = useFTBrazilianCities()

const selectedValue = ref<string | undefined>()

function formatSelectedCityLabel(item: BrazilianCity): string {
  return `${item.city}, ${item.state}`
}

const inputIcon = computed(() =>
  selectedValue.value ? 'i-lucide-map-pin' : 'i-lucide-search',
)

function findCityItem(nextCity: string, nextState: string): BrazilianCity | undefined {
  const normalizedState = nextState.trim().toUpperCase()
  return cities.value.find(item =>
    item.city === nextCity && item.state === normalizedState,
  )
}

watch([city, state, cities], ([nextCity, nextState]) => {
  if (!nextCity || !nextState) {
    selectedValue.value = undefined
    return
  }

  const item = findCityItem(nextCity, nextState)
  if (item) {
    selectedValue.value = item.value
    searchTerm.value = formatSelectedCityLabel(item)
  }
}, { immediate: true })

function onSelect(value: string | undefined) {
  if (!value) {
    city.value = ''
    state.value = ''
    return
  }

  const item = cities.value.find(cityItem => cityItem.value === value)
  if (!item) {
    return
  }

  city.value = item.city
  state.value = item.state
  searchTerm.value = formatSelectedCityLabel(item)
}

watch(searchTerm, (value) => {
  if (!value.trim()) {
    selectedValue.value = undefined
    city.value = ''
    state.value = ''
    return
  }

  if (!selectedValue.value) {
    return
  }

  const item = cities.value.find(cityItem => cityItem.value === selectedValue.value)
  if (item && formatSelectedCityLabel(item) !== value) {
    selectedValue.value = undefined
    city.value = ''
    state.value = ''
  }
})
</script>

<template>
  <UFormField
    class="w-full"
    :label="t('dashboard.info.fields.city')"
    :error="error"
    data-testid="city-picker"
  >
    <UInputMenu
      v-model="selectedValue"
      v-model:search-term="searchTerm"
      class="w-full"
      :items="filteredItems"
      value-key="value"
      label-key="label"
      ignore-filter
      virtualize
      open-on-focus
      :reset-search-term-on-select="false"
      :reset-search-term-on-blur="false"
      :loading="loading"
      :placeholder="t('dashboard.info.placeholders.citySearch')"
      :icon="inputIcon"
      :trailing="false"
      autocomplete="off"
      :data-testid="testId ?? 'trainer-info-city'"
      :ui="fieldUi"
      @update:model-value="onSelect"
    >
      <template #item-label="{ item }">
        <span class="flex min-w-0 items-center gap-1.5">
          <span class="truncate">{{ (item as BrazilianCity).city }}</span>
          <span class="shrink-0 text-muted">- {{ (item as BrazilianCity).state }}</span>
        </span>
      </template>
    </UInputMenu>
  </UFormField>
</template>
