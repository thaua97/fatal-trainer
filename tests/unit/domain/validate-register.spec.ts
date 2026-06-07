import { describe, expect, it } from 'vitest'
import { validateRegister } from '../../../shared/domain/auth/services/validate-register'

describe('validateRegister', () => {
  it('returns valid for complete payload', () => {
    const result = validateRegister({
      name: 'Ana Silva',
      email: 'ana@example.com',
      password: '123456',
      confirmPassword: '123456',
      role: 'student',
      termsAccepted: true,
    })

    expect(result.valid).toBe(true)
    expect(result.errors).toEqual({})
  })

  it('requires all fields including terms', () => {
    const result = validateRegister({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: '',
      termsAccepted: false,
    })

    expect(result.valid).toBe(false)
    expect(result.errors).toMatchObject({
      name: 'required',
      email: 'required',
      password: 'required',
      confirmPassword: 'required',
      role: 'required',
      termsAccepted: 'required',
    })
  })

  it('rejects password mismatch', () => {
    const result = validateRegister({
      name: 'Ana Silva',
      email: 'ana@example.com',
      password: '123456',
      confirmPassword: '654321',
      role: 'personal-trainer',
      termsAccepted: true,
    })

    expect(result.valid).toBe(false)
    expect(result.errors.confirmPassword).toBe('mismatch')
  })

  it('rejects short name', () => {
    const result = validateRegister({
      name: 'A',
      email: 'ana@example.com',
      password: '123456',
      confirmPassword: '123456',
      role: 'student',
      termsAccepted: true,
    })

    expect(result.valid).toBe(false)
    expect(result.errors.name).toBe('tooShort')
  })
})
