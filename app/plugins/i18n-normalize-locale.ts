const SUPPORTED = new Set(['pt-BR', 'en-US', 'es-ES'])

function normalizeLocale(code: string): string {
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

  return 'pt-BR'
}

export default defineNuxtPlugin({
  name: 'i18n-normalize-locale',
  dependsOn: ['i18n:plugin'],
  enforce: 'post',
  setup(nuxtApp) {
    nuxtApp.hook('app:mounted', async () => {
      const i18n = nuxtApp.$i18n
      const normalized = normalizeLocale(i18n.locale.value)

      if (normalized !== i18n.locale.value) {
        await nuxtApp.runWithContext(() => i18n.setLocale(normalized))
      }
    })
  },
})
