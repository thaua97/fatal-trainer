import { describe, expect, it } from 'vitest'
import { validateLogin } from '#shared/domain/auth/services/validate-login'

describe('admin login validation', () => {
  it('validates admin credentials format', () => {
    const result = validateLogin({
      email: 'admin@fataltrainer.com',
      password: 'Admin@Fatal2026!',
    })
    expect(result.valid).toBe(true)
  })
})
