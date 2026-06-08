import { BRAZILIAN_STATES } from '#shared/domain/catalog/constants/brazilian-states'

const CREF_PATTERN = /^(\d{6})-([A-Z])\/([A-Z]{2})$/

export function stripCrefInput(value: string): string {
  return value.replace(/[^0-9A-Za-z]/g, '').toUpperCase().replace(/^CREF/, '')
}

export function formatCref(value: string): string {
  const chars = stripCrefInput(value)
  const digits = chars.replace(/\D/g, '').slice(0, 6)
  const letters = chars.replace(/\d/g, '').slice(0, 3)

  if (digits.length === 0) {
    return ''
  }

  if (digits.length < 6) {
    return digits
  }

  if (letters.length === 0) {
    return `${digits}-`
  }

  if (letters.length === 1) {
    return `${digits}-${letters[0]}`
  }

  if (letters.length === 2) {
    return `${digits}-${letters[0]}/${letters[1]}`
  }

  return `${digits}-${letters[0]}/${letters.slice(1, 3)}`
}

export function isValidCrefFormat(value: string): boolean {
  const match = value.match(CREF_PATTERN)
  if (!match) {
    return false
  }

  return BRAZILIAN_STATES.has(match[3]!)
}
