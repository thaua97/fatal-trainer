import { CalendarDate, type DateValue } from '@internationalized/date'

export function isoToCalendarDate(iso: string): CalendarDate | undefined {
  if (!iso) {
    return undefined
  }

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
  if (!match) {
    return undefined
  }

  return new CalendarDate(Number(match[1]), Number(match[2]), Number(match[3]))
}

export function calendarDateToIso(date: DateValue): string {
  return `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`
}

export function formatDisplayDate(iso: string, localeCode: string): string {
  const parsed = isoToCalendarDate(iso)
  if (!parsed) {
    return ''
  }

  return new Intl.DateTimeFormat(localeCode, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(parsed.year, parsed.month - 1, parsed.day))
}
