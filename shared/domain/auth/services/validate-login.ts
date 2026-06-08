import { AUTH_PASSWORD_MIN_LENGTH, isValidEmail } from '../constants/auth-options'
import type {
  AuthValidationResult,
  LoginPayload,
  LoginValidationErrors,
} from '../entities/auth-payloads'

export function validateLogin(payload: LoginPayload): AuthValidationResult<LoginValidationErrors> {
  const errors: LoginValidationErrors = {}

  const email = payload.email.trim()
  if (!email) {
    errors.email = 'required'
  } else if (!isValidEmail(email)) {
    errors.email = 'invalid'
  }

  if (!payload.password) {
    errors.password = 'required'
  } else if (payload.password.length < AUTH_PASSWORD_MIN_LENGTH) {
    errors.password = 'tooShort'
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}
