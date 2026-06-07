import { describe, expect, it } from 'vitest'
import {
  buildWhatsAppUrl,
  formatBrazilianPhoneForWhatsApp,
} from '#shared/utils/whatsapp'

describe('formatBrazilianPhoneForWhatsApp', () => {
  it('prefixes 55 for 11-digit mobile numbers', () => {
    expect(formatBrazilianPhoneForWhatsApp('11999998888')).toBe('5511999998888')
  })

  it('prefixes 55 for 10-digit landline numbers', () => {
    expect(formatBrazilianPhoneForWhatsApp('1133334444')).toBe('551133334444')
  })

  it('strips formatting characters before validating', () => {
    expect(formatBrazilianPhoneForWhatsApp('(11) 99999-8888')).toBe('5511999998888')
  })

  it('accepts numbers already prefixed with 55', () => {
    expect(formatBrazilianPhoneForWhatsApp('5511999998888')).toBe('5511999998888')
  })

  it('returns null for invalid numbers', () => {
    expect(formatBrazilianPhoneForWhatsApp('123')).toBeNull()
    expect(formatBrazilianPhoneForWhatsApp('')).toBeNull()
    expect(formatBrazilianPhoneForWhatsApp('441234567890')).toBeNull()
  })
})

describe('buildWhatsAppUrl', () => {
  it('builds wa.me url with encoded message', () => {
    const url = buildWhatsAppUrl('5511999998888', 'Olá Ana, teste?')

    expect(url).toBe('https://wa.me/5511999998888?text=Ol%C3%A1%20Ana%2C%20teste%3F')
  })
})
