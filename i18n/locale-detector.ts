const SUPPORTED = new Set(['pt-BR', 'en-US', 'es-ES'])

function normalizeLocale(code: string, fallback: string): string {
  if (SUPPORTED.has(code)) {
    return code
  }

  if (code === 'pt' || code.startsWith('pt-')) {
    return 'pt-BR'
  }

  if (code.startsWith('es')) {
    return 'es-ES'
  }

  if (code.startsWith('en')) {
    return 'en-US'
  }

  return fallback
}

export default defineI18nLocaleDetector((event, config) => {
  const query = tryQueryLocale(event, { lang: '' })
  if (query) {
    return normalizeLocale(query.toString(), config.defaultLocale)
  }

  const cookie = tryCookieLocale(event, { lang: '', name: 'ft_locale' })
  if (cookie) {
    return normalizeLocale(cookie.toString(), config.defaultLocale)
  }

  const header = tryHeaderLocale(event, { lang: '' })
  if (header) {
    return normalizeLocale(header.toString(), config.defaultLocale)
  }

  return config.defaultLocale
})
