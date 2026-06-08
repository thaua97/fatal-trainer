import type { ParsedApiError } from '~/services/api/extract-api-errors'
import type { Ref } from 'vue'
import { resolveToastMessage } from './useFTToast'

type FieldErrorTranslator = (field: string, code: string) => string | undefined

type ApplyApiErrorOptions<T extends Record<string, string | undefined>> = {
  parsed: ParsedApiError
  errors: Ref<T>
  toast: ReturnType<typeof useFTToast>
  translate: (key: string) => string
  translator?: FieldErrorTranslator
  fallbackKey?: string
}

export function applyApiError<T extends Record<string, string | undefined>>({
  parsed,
  errors,
  toast,
  translate,
  translator: _translator,
  fallbackKey = 'toast.errors.generic',
}: ApplyApiErrorOptions<T>) {
  const fieldEntries = Object.entries(parsed.fieldErrors).filter(([, code]) => Boolean(code))

  if (fieldEntries.length > 0) {
    errors.value = parsed.fieldErrors as T
    return
  }

  const messageKey = parsed.message || fallbackKey
  toast.error(resolveToastMessage(translate, messageKey))
}
