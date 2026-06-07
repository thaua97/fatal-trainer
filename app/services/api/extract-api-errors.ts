export function extractApiErrors<T extends Record<string, string | undefined>>(err: unknown): T {
  if (err && typeof err === 'object' && 'data' in err) {
    const data = (err as { data?: { errors?: T } }).data
    if (data?.errors) {
      return data.errors
    }
  }
  return {} as T
}

export function extractApiErrorMessage(err: unknown, fallback = 'submitFailed'): string {
  if (err && typeof err === 'object' && 'data' in err) {
    const data = (err as { data?: { message?: string } }).data
    if (data?.message) {
      return data.message
    }
  }
  return fallback
}
