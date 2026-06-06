import { describe, expect, it } from 'vitest'
import { validateLogin } from '../../../shared/domain/auth/services/validate-login'

describe('validateLogin', () => {
  it('returns valid for complete payload', () => {
    const result = validateLogin({
      email: 'user@example.com',
      password: '123456',
    })

    expect(result.valid).toBe(true)
    expect(result.errors).toEqual({})
  })

  it('requires email and password', () => {
    const result = validateLogin({
      email: '',
      password: '',
    })

    expect(result.valid).toBe(false)
    expect(result.errors).toEqual({
      email: 'required',
      password: 'required',
    })
  })

  it('rejects invalid email', () => {
    const result = validateLogin({
      email: 'not-an-email',
      password: '123456',
    })

    expect(result.valid).toBe(false)
    expect(result.errors.email).toBe('invalid')
  })

  it('rejects short password', () => {
    const result = validateLogin({
      email: 'user@example.com',
      password: '123',
    })

    expect(result.valid).toBe(false)
    expect(result.errors.password).toBe('tooShort')
  })
})
