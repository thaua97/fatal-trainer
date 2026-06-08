import { REPORT_TYPE_OPTIONS } from '#shared/domain/report/constants/report-options'
import type { ReportPayload, ReportValidationErrors } from '#shared/domain/report/entities/report'
import { validateReport } from '#shared/domain/report/services/validate-report'
import type { CreateReportRequest } from '#shared/types/api'
import { applyApiError } from '~/composables/core/applyApiError'
import { useFieldErrorTranslator } from '~/composables/core/useFieldErrorTranslator'

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
  const toast = useFTToast()
  const route = useRoute()
  const { submit, pending, submitted, error: apiError, fieldErrors: apiFieldErrors, reset: resetSubmit } = useSubmitReport()
  const errorMessage = useFieldErrorTranslator('report.errors')

  const form = reactive<ReportPayload>(emptyForm())
  const errors = ref<ReportValidationErrors>({})

  const typeItems = computed(() =>
    REPORT_TYPE_OPTIONS.map(option => ({
      label: t(option.labelKey),
      value: option.value,
    })),
  )

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
      applyApiError({
        parsed: {
          message: apiError.value ?? 'report.errors.submitFailed',
          fieldErrors: apiFieldErrors.value,
        },
        errors,
        toast,
        translate: t,
        translator: (field, code) => errorMessage(field, code),
        fallbackKey: 'report.errors.submitFailed',
      })
      return
    }

    toast.success(t('report.success.title'), t('report.success.description'))
    Object.assign(form, emptyForm())
    resetSubmit()
  }

  return {
    form,
    errors,
    errorMessage,
    typeItems,
    pending,
    submitted,
    handleSubmit,
    resetForm,
  }
}
