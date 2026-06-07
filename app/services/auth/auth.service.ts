import type { AuthUser } from '#shared/domain/auth/entities/user'
import type { LoginRequest, RegisterRequest } from '#shared/types/api'
import { apiFetch } from '~/services/api/create-api-client'

export async function getMe(): Promise<{ user: AuthUser }> {
  return apiFetch('/auth/me')
}

export async function login(payload: LoginRequest): Promise<{ user: AuthUser }> {
  return apiFetch('/auth/login', {
    method: 'POST',
    body: payload,
  })
}

export async function register(payload: RegisterRequest): Promise<{ user: AuthUser }> {
  return apiFetch('/auth/register', {
    method: 'POST',
    body: payload,
  })
}

export async function logout(): Promise<void> {
  await apiFetch('/auth/logout', { method: 'POST' })
}

export const authService = {
  getMe,
  login,
  register,
  logout,
}
