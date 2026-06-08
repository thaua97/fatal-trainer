export const FT_LOCALE_CODES = ['pt-BR', 'es-ES', 'en-US'] as const

export type FTLocaleCode = typeof FT_LOCALE_CODES[number]
