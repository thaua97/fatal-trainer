import { Time } from '@internationalized/date'
import type { TimeRangeValue } from '#shared/domain/catalog/services/availability-format'

export const FT_TIME_HOURS = Array.from({ length: 24 }, (_, hour) => hour)

export function formatTimeLabel(time: Time | null | undefined): string {
  if (!time) {
    return ''
  }

  return `${String(time.hour).padStart(2, '0')}:${String(time.minute).padStart(2, '0')}`
}

export function formatHourChip(hour: number): string {
  return `${String(hour).padStart(2, '0')}:00`
}

export function timeFromHour(hour: number): Time {
  return new Time(hour, 0)
}

export function isTimeRangeValue(value: unknown): value is TimeRangeValue {
  return typeof value === 'object'
    && value !== null
    && 'start' in value
    && 'end' in value
}

export function useFTTimePicker(model: Ref<TimeRangeValue | null | undefined>) {
  const startTime = ref<Time | null>(null)
  const endTime = ref<Time | null>(null)

  function hydrateFromModel(value: TimeRangeValue | null | undefined) {
    if (isTimeRangeValue(value)) {
      startTime.value = value.start
      endTime.value = value.end
      return
    }

    startTime.value = null
    endTime.value = null
  }

  watch(() => model.value, hydrateFromModel, { immediate: true, deep: true })

  function syncRangeModel() {
    if (startTime.value && endTime.value) {
      const nextValue: TimeRangeValue = {
        start: startTime.value,
        end: endTime.value,
      }

      const current = model.value
      if (
        isTimeRangeValue(current)
        && current.start.compare(nextValue.start) === 0
        && current.end.compare(nextValue.end) === 0
      ) {
        return
      }

      model.value = nextValue
      return
    }

    if (model.value !== null && model.value !== undefined) {
      model.value = null
    }
  }

  watch([startTime, endTime], syncRangeModel, { deep: true })

  function isEndHourDisabled(hour: number): boolean {
    if (!startTime.value) {
      return false
    }

    return hour <= startTime.value.hour
  }

  function clearEndIfInvalid() {
    if (endTime.value && startTime.value && endTime.value.hour <= startTime.value.hour) {
      endTime.value = null
    }
  }

  function selectStart(hour: number) {
    startTime.value = timeFromHour(hour)
    clearEndIfInvalid()
  }

  function selectEnd(hour: number) {
    if (isEndHourDisabled(hour)) {
      return
    }

    endTime.value = timeFromHour(hour)
  }

  function isStartSelected(hour: number): boolean {
    return startTime.value?.hour === hour
  }

  function isEndSelected(hour: number): boolean {
    return endTime.value?.hour === hour
  }

  return {
    startTime,
    endTime,
    selectStart,
    selectEnd,
    isStartSelected,
    isEndSelected,
    isEndHourDisabled,
  }
}
