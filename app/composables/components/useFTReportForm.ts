import { REPORT_TYPE_OPTIONS } from '#shared/domain/report/constants/report-options'
import type { ReportField, ReportPayload, ReportValidationErrors } from '#shared/domain/report/entities/report'
import { validateReport } from '#shared/domain/report/services/validate-report'
import type { CreateReportRequest } from '#shared/types/api'

function emptyForm(): ReportPayload {
  return {
    type: '',
    occurredAt: '',
    trainerId: '',
    description: '',
    contactEmail: '',
  }
}

export function useFTReportForm() {
  const { t } = useI18n()
  const route = useRoute()
  const { submit, pending, submitted, error: submitError, fieldErrors: submitFieldErrors, reset: resetSubmit } = useSubmitReport()

  const form = reactive<ReportPayload>(emptyForm())
  const errors = ref<ReportValidationErrors>({})

  const typeItems = computed(() =>
    REPORT_TYPE_OPTIONS.map((option) => ({
      label: t(option.labelKey),
      value: option.value,
    })),
  )

  function errorMessage(field: ReportField, code?: string): string | undefined {
    if (!code) {
      return undefined
    }

    const key = `report.errors.${field}.${code}`
    const translated = t(key)
    return translated === key ? code : translated
  }

  const fieldErrors = computed(() => ({
    type: errorMessage('type', errors.value.type ?? submitFieldErrors.value.type),
    occurredAt: errorMessage('occurredAt', errors.value.occurredAt ?? submitFieldErrors.value.occurredAt),
    trainerId: errorMessage('trainerId', errors.value.trainerId ?? submitFieldErrors.value.trainerId),
    description: errorMessage('description', errors.value.description ?? submitFieldErrors.value.description),
    contactEmail: errorMessage('contactEmail', errors.value.contactEmail ?? submitFieldErrors.value.contactEmail),
  }))

  onMounted(() => {
    const trainerId = route.query.trainer
    if (typeof trainerId === 'string' && trainerId.trim()) {
      form.trainerId = trainerId.trim()
    }
  })

  function resetForm() {
    Object.assign(form, emptyForm())
    errors.value = {}
    resetSubmit()
  }

  async function handleSubmit() {
    errors.value = {}

    const validation = validateReport(form)
    if (!validation.valid) {
      errors.value = validation.errors
      return
    }

    const payload: CreateReportRequest = {
      type: form.type,
      occurredAt: form.occurredAt,
      trainerId: form.trainerId,
      description: form.description.trim(),
      contactEmail: form.contactEmail.trim(),
    }

    const success = await submit(payload)

    if (!success) {
      return
    }

    Object.assign(form, emptyForm())
  }

  return {
    form,
    typeItems,
    fieldErrors,
    pending,
    submitted,
    submitError,
    handleSubmit,
    resetForm,
  }
}
