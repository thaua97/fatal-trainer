export function resolveAuthRedirect(redirect: unknown): string | null {
  if (typeof redirect !== 'string' || redirect.length === 0) {
    return null
  }

  let value = redirect

  if (!value.startsWith('/')) {
    try {
      value = decodeURIComponent(value)
    } catch {
      return null
    }
  }

  if (!value.startsWith('/') || value.startsWith('//')) {
    return null
  }

  return value
}

export function resolvePostAuthDestination(redirect: unknown): string {
  return resolveAuthRedirect(redirect) ?? '/?welcome=1'
}
