import { extractApiErrorMessage } from '~/services/api/extract-api-errors'

export type FTToastColor = 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral'

export interface FTToastOptions {
  title: string
  description?: string
  icon?: string
  duration?: number
}

const DEFAULT_ICONS: Record<FTToastColor, string> = {
  primary: 'i-lucide-bell',
  success: 'i-lucide-circle-check',
  warning: 'i-lucide-triangle-alert',
  error: 'i-lucide-circle-x',
  info: 'i-lucide-info',
  neutral: 'i-lucide-bell',
}

type FieldErrorTranslator = (field: string, code: string) => string | undefined

export function resolveToastMessage(
  translate: (key: string) => string,
  message: string,
): string {
  const translated = translate(message)
  return translated === message ? message : translated
}

interface FTToastDeps {
  add: (options: FTToastOptions & { color: FTToastColor, icon: string }) => void
  t: (key: string) => string
}

export function createFTToast(deps: FTToastDeps) {
  function show(color: FTToastColor, options: FTToastOptions) {
    deps.add({
      title: options.title,
      description: options.description,
      color,
      icon: options.icon ?? DEFAULT_ICONS[color],
      duration: options.duration,
    })
  }

  function success(title: string, description?: string) {
    show('success', { title, description })
  }

  function error(title: string, description?: string) {
    show('error', { title, description })
  }

  function warning(title: string, description?: string) {
    show('warning', { title, description })
  }

  function info(title: string, description?: string) {
    show('info', { title, description })
  }

  function neutral(title: string, description?: string) {
    show('neutral', { title, description })
  }

  function fromApiError(err: unknown, fallbackKey = 'toast.errors.generic') {
    const raw = extractApiErrorMessage(err, fallbackKey)
    const message = resolveToastMessage(deps.t, raw)
    error(message)
  }

  function fromFieldErrors(
    errors: Record<string, string | undefined>,
    translator?: FieldErrorTranslator,
  ) {
    const messages = Object.entries(errors)
      .filter(([, code]) => Boolean(code))
      .map(([field, code]) => {
        const resolvedCode = code as string
        if (translator) {
          return translator(field, resolvedCode) ?? resolvedCode
        }
        return resolvedCode
      })
      .filter(Boolean)

    if (messages.length === 0) {
      return
    }

    if (messages.length === 1) {
      error(messages[0]!)
      return
    }

    error(messages[0]!, messages.slice(1).join('\n'))
  }

  return {
    show,
    success,
    error,
    warning,
    info,
    neutral,
    fromApiError,
    fromFieldErrors,
  }
}

export function useFTToast() {
  const toast = useToast()
  const { t } = useI18n()

  return createFTToast({
    add: options => toast.add(options),
    t,
  })
}
