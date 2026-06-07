export function getAssetsBaseUrl(apiBaseUrl: string, assetsBaseUrl?: string): string {
  if (assetsBaseUrl?.trim()) {
    return assetsBaseUrl.replace(/\/$/, '')
  }

  if (!apiBaseUrl?.trim()) {
    return ''
  }

  return apiBaseUrl.replace(/\/api\/?$/, '')
}

export function resolveMediaUrl(
  url: string | undefined | null,
  options?: { apiBaseUrl?: string; assetsBaseUrl?: string },
): string {
  if (!url) {
    return ''
  }

  if (/^https?:\/\//i.test(url)) {
    return url
  }

  if (url.startsWith('/uploads/')) {
    const base = getAssetsBaseUrl(options?.apiBaseUrl ?? '', options?.assetsBaseUrl)
    return base ? `${base}${url}` : url
  }

  return url
}
