export function createFieldErrorTranslator(
  translate: (key: string) => string,
  namespace: string,
) {
  return (field: string, code?: string): string | undefined => {
    if (!code) {
      return undefined
    }

    const key = `${namespace}.${field}.${code}`
    const translated = translate(key)
    return translated === key ? code : translated
  }
}

export function useFieldErrorTranslator(namespace: string) {
  const { t } = useI18n()
  return createFieldErrorTranslator(t, namespace)
}
