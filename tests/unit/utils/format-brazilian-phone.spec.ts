import { describe, expect, it } from 'vitest'
import { formatBrazilianPhone, stripPhoneDigits } from '../../../shared/utils/format-brazilian-phone'

describe('formatBrazilianPhone', () => {
  it('formats 11-digit mobile numbers', () => {
    expect(formatBrazilianPhone('11999998888')).toBe('(11) 99999-8888')
  })

  it('formats 10-digit landline numbers', () => {
    expect(formatBrazilianPhone('1133334444')).toBe('(11) 3333-4444')
  })

  it('formats progressively while typing', () => {
    expect(formatBrazilianPhone('11')).toBe('(11')
    expect(formatBrazilianPhone('119')).toBe('(11) 9')
    expect(formatBrazilianPhone('1199999')).toBe('(11) 9999-9')
  })

  it('strips non-digit characters before formatting', () => {
    expect(formatBrazilianPhone('(11) 98765-4321')).toBe('(11) 98765-4321')
  })

  it('limits to 11 digits', () => {
    expect(stripPhoneDigits('119999988881234')).toBe('11999998888')
  })
})
