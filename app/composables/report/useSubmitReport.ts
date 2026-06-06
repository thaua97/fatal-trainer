import type { CreateReportRequest, CreateReportResponse } from '#shared/types/api'
import type { ReportValidationErrors } from '#shared/domain/report/entities/report'

export function useSubmitReport() {
  const pending = ref(false)
  const error = ref<string | null>(null)
  const fieldErrors = ref<ReportValidationErrors>({})
  const submitted = ref(false)
  const lastResponse = ref<CreateReportResponse | null>(null)

  async function submit(payload: CreateReportRequest): Promise<boolean> {
    pending.value = true
    error.value = null
    fieldErrors.value = {}
    submitted.value = false

    try {
      const response = await $fetch<CreateReportResponse>('/api/reports', {
        method: 'POST',
        body: payload,
      })

      lastResponse.value = response
      submitted.value = true
      return true
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'data' in err) {
        const data = (err as {
          data?: { message?: string, errors?: ReportValidationErrors }
        }).data

        if (data?.errors) {
          fieldErrors.value = data.errors
        }

        error.value = data?.message ?? 'submitFailed'
      } else {
        error.value = 'submitFailed'
      }
      return false
    } finally {
      pending.value = false
    }
  }

  function reset() {
    pending.value = false
    error.value = null
    fieldErrors.value = {}
    submitted.value = false
    lastResponse.value = null
  }

  return {
    pending,
    error,
    fieldErrors,
    submitted,
    lastResponse,
    submit,
    reset,
  }
}
