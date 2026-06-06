import type { UserRole } from './user'

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
  confirmPassword: string
  role: UserRole | ''
  termsAccepted: boolean
}

export type LoginField = keyof LoginPayload
export type RegisterField = keyof RegisterPayload

export interface LoginValidationErrors {
  email?: string
  password?: string
}

export interface RegisterValidationErrors {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
  role?: string
  termsAccepted?: string
}

export interface AuthValidationResult<T extends Record<string, string | undefined>> {
  valid: boolean
  errors: T
}
