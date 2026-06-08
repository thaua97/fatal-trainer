<script setup lang="ts">
import type { TimeRangeValue } from '#shared/domain/catalog/services/availability-format'
import {
  FT_TIME_HOURS,
  formatHourChip,
  formatTimeLabel,
  useFTTimePicker,
} from '~/composables/components/useFTTimePicker'

const props = withDefaults(defineProps<{
  placeholder?: string
  testId?: string
  disabled?: boolean
}>(), {
  testId: 'time-picker',
  disabled: false,
})

const model = defineModel<TimeRangeValue | null>()

const { t } = useI18n()

const {
  startTime,
  endTime,
  selectStart,
  selectEnd,
  isStartSelected,
  isEndSelected,
} = useFTTimePicker(model)

const startOpen = ref(false)
const endOpen = ref(false)

const placeholderText = computed(() => props.placeholder ?? t('timePicker.placeholder'))

function onSelectStart(hour: number) {
  selectStart(hour)
  startOpen.value = false
}

function onSelectEnd(hour: number) {
  selectEnd(hour)
  endOpen.value = false
}

const triggerClass = [
  'group flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/80',
  'px-3 py-3 text-sm font-medium transition-all',
  'hover:border-violet-300 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/25',
  'disabled:cursor-not-allowed disabled:opacity-60',
].join(' ')

const hourButtonBase = [
  'rounded-xl px-2 py-2 text-sm font-semibold tabular-nums transition-colors',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/30',
].join(' ')
</script>

<template>
  <div
    class="w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
    :data-testid="testId"
  >
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-end">
      <div class="min-w-0 space-y-1.5">
        <p class="text-sm font-medium text-slate-700">
          {{ t('timePicker.start') }}
        </p>

        <UPopover
          v-model:open="startOpen"
          class="w-full"
        >
          <button
            type="button"
            :class="triggerClass"
            :disabled="disabled"
            :aria-label="t('timePicker.ariaLabelStart')"
            :data-testid="`${testId}-start`"
          >
            <span
              class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600 transition-colors group-hover:bg-violet-100"
            >
              <UIcon
                name="i-lucide-clock"
                class="size-4"
              />
            </span>
            <span
              class="truncate"
              :class="startTime ? 'text-slate-900' : 'text-slate-400'"
            >
              {{ startTime ? formatTimeLabel(startTime) : placeholderText }}
            </span>
          </button>

          <template #content>
            <div
              class="w-[min(100vw-2rem,18rem)] p-3"
              role="listbox"
              :aria-label="t('timePicker.ariaLabelStart')"
              :data-testid="`${testId}-start-panel`"
            >
              <div class="grid grid-cols-4 gap-1.5 sm:grid-cols-6">
                <button
                  v-for="hour in FT_TIME_HOURS"
                  :key="`start-${hour}`"
                  type="button"
                  role="option"
                  :aria-selected="isStartSelected(hour)"
                  :aria-label="t('timePicker.selectHour', { hour: formatHourChip(hour) })"
                  :class="[
                    hourButtonBase,
                    isStartSelected(hour)
                      ? 'bg-violet-600 text-white shadow-sm'
                      : 'border border-slate-100 bg-white text-slate-700 hover:border-violet-200 hover:bg-violet-50',
                  ]"
                  @click="onSelectStart(hour)"
                >
                  {{ formatHourChip(hour) }}
                </button>
              </div>
            </div>
          </template>
        </UPopover>
      </div>

      <div
        class="hidden items-center justify-center px-1 pb-3 text-slate-300 sm:flex"
        aria-hidden="true"
      >
        <UIcon
          name="i-lucide-arrow-right"
          class="size-4"
        />
      </div>

      <div class="min-w-0 space-y-1.5">
        <p class="text-sm font-medium text-slate-700">
          {{ t('timePicker.end') }}
        </p>

        <UPopover
          v-model:open="endOpen"
          class="w-full"
        >
          <button
            type="button"
            :class="triggerClass"
            :disabled="disabled"
            :aria-label="t('timePicker.ariaLabelEnd')"
            :data-testid="`${testId}-end`"
          >
            <span
              class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600 transition-colors group-hover:bg-violet-100"
            >
              <UIcon
                name="i-lucide-clock"
                class="size-4"
              />
            </span>
            <span
              class="truncate"
              :class="endTime ? 'text-slate-900' : 'text-slate-400'"
            >
              {{ endTime ? formatTimeLabel(endTime) : placeholderText }}
            </span>
          </button>

          <template #content>
            <div
              class="w-[min(100vw-2rem,18rem)] p-3"
              role="listbox"
              :aria-label="t('timePicker.ariaLabelEnd')"
              :data-testid="`${testId}-end-panel`"
            >
              <div class="grid grid-cols-4 gap-1.5 sm:grid-cols-6">
                <button
                  v-for="hour in FT_TIME_HOURS"
                  :key="`end-${hour}`"
                  type="button"
                  role="option"
                  :aria-selected="isEndSelected(hour)"
                  :aria-label="t('timePicker.selectHour', { hour: formatHourChip(hour) })"
                  :class="[
                    hourButtonBase,
                    isEndSelected(hour)
                      ? 'bg-violet-600 text-white shadow-sm'
                      : 'border border-slate-100 bg-white text-slate-700 hover:border-violet-200 hover:bg-violet-50',
                  ]"
                  @click="onSelectEnd(hour)"
                >
                  {{ formatHourChip(hour) }}
                </button>
              </div>
            </div>
          </template>
        </UPopover>
      </div>
    </div>
  </div>
</template>
