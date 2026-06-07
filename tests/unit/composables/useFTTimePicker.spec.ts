import { describe, it, expect } from 'vitest'
import { Time } from '@internationalized/date'
import { ref, nextTick } from 'vue'
import {
  formatHourChip,
  formatTimeLabel,
  isTimeRangeValue,
  timeFromHour,
  useFTTimePicker,
} from '~/composables/components/useFTTimePicker'

describe('useFTTimePicker', () => {
  it('formats time labels', () => {
    expect(formatTimeLabel(new Time(7, 0))).toBe('07:00')
    expect(formatHourChip(20)).toBe('20:00')
  })

  it('syncs range model both ways', async () => {
    const model = ref<{ start: Time, end: Time } | null>({
      start: new Time(8, 0),
      end: new Time(18, 0),
    })

    const { startTime, endTime, selectStart, selectEnd } = useFTTimePicker(model)

    expect(startTime.value?.hour).toBe(8)
    expect(endTime.value?.hour).toBe(18)

    selectStart(9)
    selectEnd(21)
    await nextTick()

    expect(isTimeRangeValue(model.value)).toBe(true)
    if (isTimeRangeValue(model.value)) {
      expect(model.value.start.hour).toBe(9)
      expect(model.value.end.hour).toBe(21)
    }
  })

  it('creates time from hour with zero minutes', () => {
    expect(timeFromHour(15).hour).toBe(15)
    expect(timeFromHour(15).minute).toBe(0)
  })
})
