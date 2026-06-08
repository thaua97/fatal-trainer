import type { CreateReportRequest, CreateReportResponse } from '#shared/types/api'
import type { ReportValidationErrors } from '#shared/domain/report/entities/report'
import { parseApiError } from '~/services/api/extract-api-errors'
import { reportsService } from '~/services/report/reports.service'

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
      const response = await reportsService.create(payload)
      lastResponse.value = response
      submitted.value = true
      return true
    } catch (err: unknown) {
      const parsed = parseApiError(err, 'report.errors.submitFailed')
      fieldErrors.value = parsed.fieldErrors as ReportValidationErrors
      error.value = parsed.message
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
