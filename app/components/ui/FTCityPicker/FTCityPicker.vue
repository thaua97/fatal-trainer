<script setup lang="ts">
import type { BrazilianCity } from '#shared/data/brazilian-cities'

const city = defineModel<string>('city', { required: true })
const state = defineModel<string>('state', { required: true })

const props = withDefaults(defineProps<{
  error?: string
  testId?: string
  label?: string
  placeholder?: string
  ariaLabel?: string
  withGeolocation?: boolean
  detecting?: boolean
  geoError?: string
  disabled?: boolean
}>(), {
  testId: 'city-picker',
  disabled: false,
})

const emit = defineEmits<{
  detect: []
}>()

const { t } = useI18n()

const fieldLabel = computed(() => props.label ?? t('cityPicker.label'))
const fieldPlaceholder = computed(
  () => props.placeholder ?? t('cityPicker.placeholder'),
)
const fieldError = computed(() => props.error || props.geoError)
const { searchTerm, filteredItems, loading, cities } = useFTBrazilianCities()

const disabledRef = toRef(props, 'disabled')
const isEditing = ref(false)

const {
  selectedValue,
  displayValue,
  triggerIcon,
  syncSearchTermFromSelection,
  onSelect,
} = useFTCityPickerSelection({
  city,
  state,
  cities,
  searchTerm,
  isEditing,
})

const {
  menuOpen,
  inputMenuRef,
  startEditing,
  stopEditing,
  onMenuOpenChange,
} = useFTCityPickerMenu({
  disabled: disabledRef,
  isEditing,
  syncSearchTermFromSelection,
})

function onDetectClick(event: Event) {
  event.stopPropagation()
  emit('detect')
}

const triggerClass = [
  'group flex w-full items-center gap-2 rounded-2xl border border-slate-200 bg-white',
  'px-4 py-3.5 text-sm font-medium shadow-sm transition-all',
  'hover:border-violet-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/25',
  'has-disabled:cursor-not-allowed has-disabled:opacity-60',
].join(' ')

const triggerMainClass = [
  'flex min-w-0 flex-1 items-center gap-3 border-0 bg-transparent p-0 text-left shadow-none outline-none',
  'focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-60',
].join(' ')

const iconBoxClass = [
  'flex size-9 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600 transition-colors',
  'group-hover:bg-violet-100',
].join(' ')

const editingTriggerClass = [
  'group flex w-full items-center gap-2 rounded-2xl border border-slate-200 bg-white',
  'px-4 py-3.5 text-sm font-medium shadow-sm transition-all',
  'hover:border-violet-300 focus-within:border-violet-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-violet-500/25',
  'has-disabled:cursor-not-allowed has-disabled:opacity-60',
].join(' ')

const inputMenuUi = {
  root: 'w-full min-w-0 flex-1',
  base: editingTriggerClass,
  leading: 'static flex shrink-0 items-center',
  trailing: 'static flex shrink-0 items-center',
  content: 'max-h-64 rounded-2xl border border-slate-200 bg-white shadow-lg ring-0 overflow-hidden',
  item: [
    'rounded-xl text-sm text-slate-700',
    'data-highlighted:not-data-disabled:text-violet-700',
    'data-highlighted:not-data-disabled:before:bg-violet-50',
  ].join(' '),
  empty: 'px-3 py-2 text-sm text-slate-400',
}

const geoButtonClass = [
  'flex size-8 shrink-0 items-center justify-center rounded-full',
  'text-slate-400 transition-colors',
  'hover:bg-violet-50 hover:text-violet-600',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/25',
  'disabled:cursor-not-allowed disabled:opacity-60',
].join(' ')
</script>

<template>
  <div class="w-full space-y-1.5">
    <p class="text-sm font-medium text-slate-700">
      {{ fieldLabel }}
    </p>

    <div
      v-if="!isEditing"
      :class="[triggerClass, disabled && 'pointer-events-none opacity-60']"
      :data-testid="testId"
    >
      <button
        type="button"
        :class="triggerMainClass"
        :disabled="disabled"
        :aria-label="ariaLabel ?? t('cityPicker.ariaLabel')"
        @click="startEditing"
      >
        <span :class="iconBoxClass">
          <UIcon
            v-if="loading"
            name="i-lucide-loader-circle"
            class="size-4 animate-spin"
          />
          <UIcon
            v-else
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
      </button>

      <button
        v-if="withGeolocation"
        type="button"
        :class="geoButtonClass"
        :disabled="disabled || detecting"
        :aria-label="t('cityPicker.detect')"
        :data-testid="`${testId}-detect`"
        @click="onDetectClick"
      >
        <UIcon
          v-if="detecting"
          name="i-lucide-loader-circle"
          class="size-4 animate-spin"
        />
        <UIcon
          v-else
          name="i-lucide-locate-fixed"
          class="size-4"
        />
      </button>
    </div>

    <UInputMenu
      v-else
      ref="inputMenuRef"
      v-model="selectedValue"
      v-model:open="menuOpen"
      v-model:search-term="searchTerm"
      class="w-full min-w-0"
      :items="filteredItems"
      value-key="value"
      label-key="label"
      ignore-filter
      virtualize
      open-on-focus
      autofocus
      variant="none"
      leading
      :trailing="withGeolocation"
      :reset-search-term-on-select="false"
      :reset-search-term-on-blur="false"
      :loading="false"
      :placeholder="fieldPlaceholder"
      :disabled="disabled"
      autocomplete="off"
      :aria-label="ariaLabel ?? t('cityPicker.ariaLabel')"
      :data-testid="testId"
      :ui="inputMenuUi"
      @update:model-value="onSelect($event, stopEditing)"
      @update:open="onMenuOpenChange"
    >
        <template #leading>
          <span :class="iconBoxClass">
            <UIcon
              v-if="loading"
              name="i-lucide-loader-circle"
              class="size-4 animate-spin"
            />
            <UIcon
              v-else
              :name="triggerIcon"
              class="size-4"
            />
          </span>
        </template>

        <template #item-label="{ item }">
          <span class="flex min-w-0 items-center gap-1.5">
            <span class="truncate">{{ (item as BrazilianCity).city }}</span>
            <span class="shrink-0 text-slate-400">- {{ (item as BrazilianCity).state }}</span>
          </span>
        </template>

        <template
          v-if="withGeolocation"
          #trailing
        >
          <button
            type="button"
            :class="geoButtonClass"
            :disabled="disabled || detecting"
            :aria-label="t('cityPicker.detect')"
            :data-testid="`${testId}-detect`"
            @click="onDetectClick"
          >
            <UIcon
              v-if="detecting"
              name="i-lucide-loader-circle"
              class="size-4 animate-spin"
            />
            <UIcon
              v-else
              name="i-lucide-locate-fixed"
              class="size-4"
            />
          </button>
        </template>
    </UInputMenu>

    <p
      v-if="fieldError"
      class="text-xs text-red-500"
      role="alert"
    >
      {{ fieldError }}
    </p>
  </div>
</template>
