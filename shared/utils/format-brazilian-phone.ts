const PHONE_DIGITS_MAX = 11

export function stripPhoneDigits(value: string, max = PHONE_DIGITS_MAX): string {
  return value.replace(/\D/g, '').slice(0, max)
}

export function formatBrazilianPhone(value: string): string {
  const digits = stripPhoneDigits(value)

  if (digits.length === 0) {
    return ''
  }

  if (digits.length <= 2) {
    return `(${digits}`
  }

  if (digits.length <= 6) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  }

  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`
}
