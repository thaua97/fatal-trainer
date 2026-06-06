import { describe, expect, it } from 'vitest'
import { Time } from '@internationalized/date'
import {
  parseAvailability,
  serializeAvailability,
} from '#shared/domain/catalog/services/availability-format'

describe('availability-format', () => {
  it('serializes weekdays and time range', () => {
    const value = serializeAvailability({
      weekdays: ['mon', 'tue', 'wed', 'thu', 'fri'],
      startTime: new Time(7, 0),
      endTime: new Time(20, 0),
    })

    expect(value).toBe('Seg–Sex, 7h–20h')
  })

  it('parses legacy availability string', () => {
    const parsed = parseAvailability('Seg–Sex, 7h–20h')

    expect(parsed.weekdays).toEqual(['mon', 'tue', 'wed', 'thu', 'fri'])
    expect(parsed.startTime?.hour).toBe(7)
    expect(parsed.endTime?.hour).toBe(20)
  })

  it('parses tue-thu range', () => {
    const parsed = parseAvailability('Ter–Qui, 8h–18h')

    expect(parsed.weekdays).toEqual(['tue', 'wed', 'thu'])
    expect(parsed.startTime?.hour).toBe(8)
    expect(parsed.endTime?.hour).toBe(18)
  })

  it('round-trips a common value', () => {
    const original = 'Seg–Sáb, 7h–20h'
    const parsed = parseAvailability(original)
    const serialized = serializeAvailability({
      weekdays: parsed.weekdays,
      startTime: parsed.startTime,
      endTime: parsed.endTime,
    })

    expect(serialized).toBe(original)
  })
})
