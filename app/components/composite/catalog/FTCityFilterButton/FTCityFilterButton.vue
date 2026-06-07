<script setup lang="ts">
const props = defineProps<{
  label?: string
  placeholder?: string
  testId?: string
}>()

const { t } = useI18n()
const { city, state } = useFTCitySelector()
const { openModal } = useCatalogCityGate()
const { cities } = useFTBrazilianCities()

const fieldLabel = computed(() => props.label ?? t('cityFilter.label'))
const fieldPlaceholder = computed(
  () => props.placeholder ?? t('cityFilter.placeholder'),
)

const displayValue = computed(() => {
  if (!city.value) {
    return ''
  }

  const normalizedState = state.value.trim().toUpperCase()
  const match = cities.value.find(
    item => item.city === city.value && (!normalizedState || item.state === normalizedState),
  )

  if (match) {
    return `${match.city}, ${match.state}`
  }

  return normalizedState ? `${city.value}, ${normalizedState}` : city.value
})

const triggerIcon = computed(() =>
  displayValue.value ? 'i-lucide-map-pin' : 'i-lucide-search',
)
</script>

<template>
  <div class="w-full space-y-1.5">
    <p class="text-sm font-medium text-slate-700">
      {{ fieldLabel }}
    </p>

    <button
      type="button"
      class="group flex w-full items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-medium shadow-sm transition-all hover:border-violet-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/25"
      :data-testid="testId ?? 'city-filter-button'"
      :aria-label="t('cityFilter.openModal')"
      @click="openModal()"
    >
      <span class="flex min-w-0 flex-1 items-center gap-3 text-left">
        <span
          class="flex size-9 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600 transition-colors group-hover:bg-violet-100"
        >
          <UIcon
            :name="triggerIcon"
            class="size-4"
          />
        </span>
        <span
          class="truncate"
          :class="displayValue ? 'text-slate-900' : 'text-slate-400'"
        >
          {{ displayValue || fieldPlaceholder }}
        </span>
      </span>

      <span
        class="flex size-8 shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors group-hover:bg-violet-50 group-hover:text-violet-600"
        aria-hidden="true"
      >
        <UIcon
          name="i-lucide-locate-fixed"
          class="size-4"
        />
      </span>
    </button>
  </div>
</template>
