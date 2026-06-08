import { describe, expect, it } from 'vitest'
import { resolveAuthRedirect, resolvePostAuthDestination } from '#shared/domain/auth/services/resolve-auth-redirect'

describe('resolveAuthRedirect', () => {
  it('accepts internal paths', () => {
    expect(resolveAuthRedirect('/personal-trainers/abc')).toBe('/personal-trainers/abc')
  })

  it('decodes encoded internal paths', () => {
    expect(resolveAuthRedirect('%2Fpersonal-trainers%2Fabc')).toBe('/personal-trainers/abc')
  })

  it('rejects external and unsafe redirects', () => {
    expect(resolveAuthRedirect('https://evil.com')).toBeNull()
    expect(resolveAuthRedirect('//evil.com')).toBeNull()
    expect(resolveAuthRedirect(null)).toBeNull()
  })
})

describe('resolvePostAuthDestination', () => {
  it('returns redirect when valid', () => {
    expect(resolvePostAuthDestination('/personal-trainers/abc')).toBe('/personal-trainers/abc')
  })

  it('falls back to welcome home', () => {
    expect(resolvePostAuthDestination(undefined)).toBe('/?welcome=1')
  })
})
