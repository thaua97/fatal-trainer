<script setup lang="ts">
import type { DateValue } from '@internationalized/date'
import {
  calendarDateToIso,
  formatDisplayDate,
  isoToCalendarDate,
} from '~/composables/components/useFTDatePicker'

const props = withDefaults(defineProps<{
  placeholder?: string
  testId?: string
  minDate?: string
  maxDate?: string
  ariaLabel?: string
  disabled?: boolean
}>(), {
  testId: 'date-picker',
  placeholder: undefined,
  minDate: undefined,
  maxDate: undefined,
  ariaLabel: undefined,
  disabled: false,
})

const model = defineModel<string>({ default: '' })

const { t, locale } = useI18n()

const open = ref(false)

const placeholderText = computed(() => props.placeholder ?? t('datePicker.placeholder'))

const displayValue = computed(() =>
  model.value ? formatDisplayDate(model.value, locale.value) : '',
)

const calendarValue = computed({
  get: () => isoToCalendarDate(model.value),
  set: (value: DateValue | undefined) => {
    model.value = value ? calendarDateToIso(value) : ''
    if (value) {
      open.value = false
    }
  },
})

const minCalendarDate = computed(() => isoToCalendarDate(props.minDate ?? ''))
const maxCalendarDate = computed(() => isoToCalendarDate(props.maxDate ?? ''))

const triggerClass = [
  'group flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white',
  'px-4 py-3.5 text-sm font-medium shadow-sm transition-all',
  'hover:border-violet-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/25',
  'disabled:cursor-not-allowed disabled:opacity-60',
].join(' ')
</script>

<template>
  <UPopover
    v-model:open="open"
    class="w-full"
  >
    <button
      type="button"
      :class="triggerClass"
      :disabled="disabled"
      :aria-label="ariaLabel ?? t('datePicker.ariaLabel')"
      :data-testid="testId"
    >
      <span
        class="flex size-9 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600 transition-colors group-hover:bg-violet-100"
      >
        <UIcon
          name="i-lucide-calendar"
          class="size-4"
        />
      </span>
      <span
        class="truncate"
        :class="displayValue ? 'text-slate-900' : 'text-slate-400'"
      >
        {{ displayValue || placeholderText }}
      </span>
    </button>

    <template #content>
      <UCalendar
        v-model="calendarValue"
        :locale="locale"
        :min-value="minCalendarDate"
        :max-value="maxCalendarDate"
        class="p-2"
        :data-testid="`${testId}-calendar`"
      />
    </template>
  </UPopover>
</template>
