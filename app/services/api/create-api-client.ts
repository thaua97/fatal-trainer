export function getApiBaseUrl(): string {
  const config = useRuntimeConfig()
  const { apiBaseUrl, useMockApi } = config.public

  if (import.meta.dev && useMockApi) {
    return '/api'
  }

  return apiBaseUrl || '/api'
}

export async function apiFetch<T>(
  path: string,
  options: Parameters<typeof $fetch>[1] = {},
): Promise<T> {
  const fetchOptions = {
    ...options,
    baseURL: getApiBaseUrl(),
    credentials: 'include' as const,
  }

  if (import.meta.server) {
    const requestFetch = useRequestFetch()
    return requestFetch<T>(path, fetchOptions)
  }

  return $fetch<T>(path, fetchOptions)
}
