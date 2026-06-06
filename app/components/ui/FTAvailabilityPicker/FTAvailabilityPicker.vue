<script setup lang="ts">
import {
  type TimeRangeValue,
  type WeekdayKey,
  WEEKDAY_LABELS,
  WEEKDAY_ORDER,
  parseAvailability,
  serializeAvailability,
} from '#shared/domain/catalog/services/availability-format'

const model = defineModel<string>({ required: true })

defineProps<{
  error?: string
}>()

const { t } = useI18n()

const weekdays = ref<WeekdayKey[]>([])
const timeRange = shallowRef<TimeRangeValue | null>(null)

const weekdayItems = computed(() =>
  WEEKDAY_ORDER.map(day => ({
    label: WEEKDAY_LABELS[day],
    value: day,
  })),
)

const availabilityDaysUi = {
  fieldset: 'grid w-full grid-cols-4 gap-2 sm:grid-cols-7',
  item: 'min-w-0 w-full justify-center',
}

function hydrateFromModel(value: string) {
  const parsed = parseAvailability(value)
  weekdays.value = parsed.weekdays
  timeRange.value = parsed.startTime && parsed.endTime
    ? { start: parsed.startTime, end: parsed.endTime }
    : null
}

watch(() => model.value, hydrateFromModel, { immediate: true })

watch([weekdays, timeRange], () => {
  const nextValue = serializeAvailability({
    weekdays: weekdays.value,
    startTime: timeRange.value?.start ?? null,
    endTime: timeRange.value?.end ?? null,
  })

  if (nextValue !== model.value) {
    model.value = nextValue
  }
}, { deep: true })

</script>

<template>
  <div
    class="w-full space-y-4"
    data-testid="availability-picker"
  >
    <UFormField
      class="w-full"
      :label="t('dashboard.info.fields.availabilityDays')"
      :error="error"
    >
      <UCheckboxGroup
        v-model="weekdays"
        class="w-full"
        :items="weekdayItems"
        orientation="horizontal"
        variant="card"
        :ui="availabilityDaysUi"
        data-testid="trainer-info-availability-days"
      />
    </UFormField>

    <UFormField
      class="w-full"
      :label="t('dashboard.info.fields.availabilityHours')"
    >
      <FTTimePicker
        v-model="timeRange"
        test-id="trainer-info-availability-hours"
      />
    </UFormField>
  </div>
</template>
