import { describe, it, expect } from 'vitest'
import {
  calendarDateToIso,
  formatDisplayDate,
  isoToCalendarDate,
} from '~/composables/components/useFTDatePicker'
import { CalendarDate } from '@internationalized/date'

describe('useFTDatePicker', () => {
  it('converts ISO strings to calendar dates', () => {
    expect(isoToCalendarDate('2026-06-01')?.toString()).toBe('2026-06-01')
    expect(isoToCalendarDate('')).toBeUndefined()
  })

  it('formats display dates for locale', () => {
    expect(formatDisplayDate('2026-06-01', 'pt-BR')).toMatch(/01/)
    expect(formatDisplayDate('2026-06-01', 'pt-BR')).toMatch(/2026/)
  })

  it('serializes calendar dates to ISO', () => {
    expect(calendarDateToIso(new CalendarDate(2026, 6, 1))).toBe('2026-06-01')
  })
})
