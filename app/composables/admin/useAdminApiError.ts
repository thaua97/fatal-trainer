import { parseApiError } from '~/services/api/extract-api-errors'
import { resolveToastMessage } from '~/composables/core/useFTToast'

export function useAdminApiError() {
  const { t } = useI18n()
  const toast = useFTToast()

  function showError(err: unknown, fallbackKey = 'admin.errors.submitFailed') {
    const parsed = parseApiError(err, fallbackKey)
    toast.error(resolveToastMessage(t, parsed.message))
  }

  return { showError }
}
