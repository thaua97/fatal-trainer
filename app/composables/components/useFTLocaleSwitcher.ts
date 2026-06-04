import type { FTLocaleCode } from '#shared/types/locale'

export function useFTLocaleSwitcher() {
  const { locale, locales, setLocale } = useI18n()

  const localeItems = computed(() =>
    locales.value.map(entry => ({
      code: entry.code as FTLocaleCode,
      label: entry.name ?? entry.code,
    })),
  )

  const currentLocale = computed(() => locale.value as FTLocaleCode)

  async function switchLocale(code: FTLocaleCode) {
    await setLocale(code)
  }

  return {
    localeItems,
    currentLocale,
    switchLocale,
  }
}
