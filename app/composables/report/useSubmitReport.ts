import type { CreateReportRequest, CreateReportResponse } from '#shared/types/api'
import type { ReportValidationErrors } from '#shared/domain/report/entities/report'
import { extractApiErrorMessage, extractApiErrors } from '~/services/api/extract-api-errors'
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
      fieldErrors.value = extractApiErrors<ReportValidationErrors>(err)
      error.value = extractApiErrorMessage(err)
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
