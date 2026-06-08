import { beforeEach, describe, expect, it, vi } from 'vitest'
import { authService } from '~/services/auth/auth.service'

const apiFetch = vi.fn()

vi.mock('~/services/api/create-api-client', () => ({
  apiFetch: (...args: unknown[]) => apiFetch(...args),
}))

describe('authService', () => {
  beforeEach(() => {
    apiFetch.mockReset()
  })

  it('getMe calls GET /auth/me', async () => {
    apiFetch.mockResolvedValue({ user: { id: '1', name: 'Test' } })

    const result = await authService.getMe()

    expect(apiFetch).toHaveBeenCalledWith('/auth/me')
    expect(result.user.id).toBe('1')
  })

  it('login posts credentials', async () => {
    apiFetch.mockResolvedValue({ user: { id: '1' } })

    await authService.login({ email: 'a@b.com', password: '123456' })

    expect(apiFetch).toHaveBeenCalledWith('/auth/login', {
      method: 'POST',
      body: { email: 'a@b.com', password: '123456' },
    })
  })

  it('register posts payload', async () => {
    const payload = {
      name: 'User',
      email: 'a@b.com',
      password: '123456',
      confirmPassword: '123456',
      role: 'student' as const,
      termsAccepted: true,
    }
    apiFetch.mockResolvedValue({ user: { id: '1' } })

    await authService.register(payload)

    expect(apiFetch).toHaveBeenCalledWith('/auth/register', {
      method: 'POST',
      body: payload,
    })
  })

  it('logout posts to /auth/logout', async () => {
    apiFetch.mockResolvedValue(undefined)

    await authService.logout()

    expect(apiFetch).toHaveBeenCalledWith('/auth/logout', { method: 'POST' })
  })
})
