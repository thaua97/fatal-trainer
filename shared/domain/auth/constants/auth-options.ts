export const AUTH_PASSWORD_MIN_LENGTH = 6

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim())
}

export const USER_ROLES = ['student', 'personal-trainer'] as const
