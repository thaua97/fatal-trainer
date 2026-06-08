import { Time } from '@internationalized/date'

export type WeekdayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'

export const WEEKDAY_ORDER: WeekdayKey[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

export const WEEKDAY_LABELS: Record<WeekdayKey, string> = {
  mon: 'Seg',
  tue: 'Ter',
  wed: 'Qua',
  thu: 'Qui',
  fri: 'Sex',
  sat: 'Sáb',
  sun: 'Dom',
}

const LABEL_TO_KEY = Object.fromEntries(
  Object.entries(WEEKDAY_LABELS).map(([key, label]) => [label, key]),
) as Record<string, WeekdayKey>

export interface AvailabilityParts {
  weekdays: WeekdayKey[]
  startTime: Time | null
  endTime: Time | null
}

export interface TimeRangeValue {
  start: Time
  end: Time
}

function formatHour(time: Time): string {
  return `${time.hour}h`
}

function parseHourToken(token: string): number | null {
  const match = /^(\d{1,2})h$/.exec(token.trim())
  if (!match) {
    return null
  }

  const hour = Number(match[1])
  return hour >= 0 && hour <= 23 ? hour : null
}

function expandDayRange(token: string): WeekdayKey[] {
  const normalized = token.trim()
  if (!normalized) {
    return []
  }

  if (normalized.includes('–') || normalized.includes('-')) {
    const separator = normalized.includes('–') ? '–' : '-'
    const [startLabel, endLabel] = normalized.split(separator).map(part => part.trim())
    const startKey = LABEL_TO_KEY[startLabel]
    const endKey = LABEL_TO_KEY[endLabel]

    if (!startKey || !endKey) {
      return []
    }

    const startIndex = WEEKDAY_ORDER.indexOf(startKey)
    const endIndex = WEEKDAY_ORDER.indexOf(endKey)

    if (startIndex === -1 || endIndex === -1) {
      return []
    }

    if (startIndex <= endIndex) {
      return WEEKDAY_ORDER.slice(startIndex, endIndex + 1)
    }

    return [...WEEKDAY_ORDER.slice(startIndex), ...WEEKDAY_ORDER.slice(0, endIndex + 1)]
  }

  const key = LABEL_TO_KEY[normalized]
  return key ? [key] : []
}

function groupWeekdays(weekdays: WeekdayKey[]): string {
  if (!weekdays.length) {
    return ''
  }

  const indices = [...new Set(weekdays)]
    .map(day => WEEKDAY_ORDER.indexOf(day))
    .filter(index => index >= 0)
    .sort((a, b) => a - b)

  if (!indices.length) {
    return ''
  }

  const groups: Array<{ start: number, end: number }> = []
  let groupStart = indices[0]!
  let groupEnd = indices[0]!

  for (let index = 1; index < indices.length; index += 1) {
    const current = indices[index]!
    if (current === groupEnd + 1) {
      groupEnd = current
      continue
    }

    groups.push({ start: groupStart, end: groupEnd })
    groupStart = current
    groupEnd = current
  }

  groups.push({ start: groupStart, end: groupEnd })

  return groups
    .map(({ start, end }) => {
      const startLabel = WEEKDAY_LABELS[WEEKDAY_ORDER[start]!]
      const endLabel = WEEKDAY_LABELS[WEEKDAY_ORDER[end]!]
      return start === end ? startLabel : `${startLabel}–${endLabel}`
    })
    .join(' | ')
}

export function serializeAvailability(parts: AvailabilityParts): string {
  const daySegment = groupWeekdays(parts.weekdays)
  if (!parts.startTime || !parts.endTime || !daySegment) {
    return ''
  }

  return `${daySegment}, ${formatHour(parts.startTime)}–${formatHour(parts.endTime)}`
}

function addWeekdaysFromText(dayPart: string, weekdays: Set<WeekdayKey>): void {
  for (const token of dayPart.split('|').map(part => part.trim()).filter(Boolean)) {
    for (const day of expandDayRange(token)) {
      weekdays.add(day)
    }
  }
}

function parseTimeRange(timePart: string): { startTime: Time, endTime: Time } | null {
  const [startToken, endToken] = timePart.split(/[–-]/).map(part => part.trim())
  const startHour = parseHourToken(startToken ?? '')
  const endHour = parseHourToken(endToken ?? '')

  if (startHour == null || endHour == null) {
    return null
  }

  return {
    startTime: new Time(startHour, 0),
    endTime: new Time(endHour, 0),
  }
}

function parseAvailabilitySegments(
  trimmed: string,
  weekdays: Set<WeekdayKey>,
): { startTime: Time | null, endTime: Time | null } {
  let startTime: Time | null = null
  let endTime: Time | null = null
  const segments = trimmed.split('|').map(segment => segment.trim()).filter(Boolean)

  for (const segment of segments) {
    const commaIndex = segment.lastIndexOf(',')
    const dayPart = commaIndex >= 0 ? segment.slice(0, commaIndex).trim() : segment
    const timePart = commaIndex >= 0 ? segment.slice(commaIndex + 1).trim() : ''

    addWeekdaysFromText(dayPart, weekdays)

    if (timePart && !startTime) {
      const parsed = parseTimeRange(timePart)
      if (parsed) {
        startTime = parsed.startTime
        endTime = parsed.endTime
      }
    }
  }

  return { startTime, endTime }
}

function parseFallbackAvailability(
  trimmed: string,
  weekdays: Set<WeekdayKey>,
): { startTime: Time | null, endTime: Time | null } {
  let startTime: Time | null = null
  let endTime: Time | null = null

  const timeMatch = /(\d{1,2})h\s*[–-]\s*(\d{1,2})h/.exec(trimmed)
  if (timeMatch) {
    startTime = new Time(Number(timeMatch[1]), 0)
    endTime = new Time(Number(timeMatch[2]), 0)
  }

  if (!weekdays.size) {
    const dayMatch = /(Seg(?:–|-)Sex|Seg(?:–|-)Sáb|Ter(?:–|-)Qui)/.exec(trimmed)
    if (dayMatch) {
      addWeekdaysFromText(dayMatch[1]!, weekdays)
    }
  }

  return { startTime, endTime }
}

export function parseAvailability(value: string): AvailabilityParts {
  const trimmed = value.trim()
  if (!trimmed) {
    return { weekdays: [], startTime: null, endTime: null }
  }

  const weekdays = new Set<WeekdayKey>()
  const parsed = parseAvailabilitySegments(trimmed, weekdays)
  const fallback = parseFallbackAvailability(trimmed, weekdays)

  return {
    weekdays: WEEKDAY_ORDER.filter(day => weekdays.has(day)),
    startTime: parsed.startTime ?? fallback.startTime,
    endTime: parsed.endTime ?? fallback.endTime,
  }
}

export function timeRangeFromParts(parts: AvailabilityParts): TimeRangeValue | null {
  if (!parts.startTime || !parts.endTime) {
    return null
  }

  return {
    start: parts.startTime,
    end: parts.endTime,
  }
}
