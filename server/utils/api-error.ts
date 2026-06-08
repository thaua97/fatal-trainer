import { ERROR_CODES } from './error-codes'

type ApiErrorOptions = {
  statusCode: number
  message: string
  errors?: Record<string, string>
}

export function throwApiError(options: ApiErrorOptions): never {
  throw createError({
    statusCode: options.statusCode,
    statusMessage: options.message,
    data: {
      message: options.message,
      ...(options.errors ? { errors: options.errors } : {}),
    },
  })
}

export function throwValidationError(errors: Record<string, string>): never {
  throwApiError({
    statusCode: 400,
    message: ERROR_CODES.validation,
    errors,
  })
}

export function throwUnauthorized(): never {
  throwApiError({
    statusCode: 401,
    message: ERROR_CODES.unauthorized,
  })
}

export function throwInvalidCredentials(): never {
  throwApiError({
    statusCode: 401,
    message: ERROR_CODES.invalidCredentials,
    errors: { email: 'invalidCredentials' },
  })
}

export function throwForbidden(): never {
  throwApiError({
    statusCode: 403,
    message: ERROR_CODES.forbidden,
  })
}

export function throwNotFound(): never {
  throwApiError({
    statusCode: 404,
    message: ERROR_CODES.notFound,
  })
}

export function throwConflict(errors?: Record<string, string>): never {
  throwApiError({
    statusCode: 409,
    message: ERROR_CODES.conflict,
    errors,
  })
}
