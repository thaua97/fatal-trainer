export type ParsedApiError = {
  statusCode?: number
  message: string
  fieldErrors: Record<string, string>
}

const DEFAULT_MESSAGE = 'error.internal'

function readErrorData(err: unknown): {
  message?: string
  errors?: Record<string, string>
  statusCode?: number
} | null {
  if (!err || typeof err !== 'object') {
    return null
  }

  const fetchErr = err as {
    data?: { message?: string, errors?: Record<string, string> }
    statusCode?: number
    status?: number
  }

  return {
    message: fetchErr.data?.message,
    errors: fetchErr.data?.errors,
    statusCode: fetchErr.statusCode ?? fetchErr.status,
  }
}

export function parseApiError(err: unknown, fallbackMessage = DEFAULT_MESSAGE): ParsedApiError {
  const data = readErrorData(err)

  if (!data) {
    return {
      message: fallbackMessage,
      fieldErrors: {},
    }
  }

  return {
    statusCode: data.statusCode,
    message: data.message ?? fallbackMessage,
    fieldErrors: data.errors ?? {},
  }
}

export function extractApiErrors<T extends Record<string, string | undefined>>(err: unknown): T {
  return parseApiError(err).fieldErrors as T
}

export function extractApiErrorMessage(err: unknown, fallback = 'toast.errors.submitFailed'): string {
  return parseApiError(err, fallback).message
}
