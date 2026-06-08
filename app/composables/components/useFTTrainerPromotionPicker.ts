import type { PersonalTrainer } from '#shared/domain/catalog/entities/personal-trainer'
import type { PromotionTemplateListItem } from '#shared/types/admin'
import { computePromoPrice } from '#shared/domain/catalog/services/trainer-pricing'
import { validateTrainerPromotionActivation } from '#shared/domain/catalog/services/validate-trainer-profile'
import { formatPromotionPeriod } from '#shared/utils/promotion-template-status'
import type { UpdateTrainerProfileRequest } from '#shared/types/api'
import { promotionTemplatesService } from '~/services/dashboard/promotion-templates.service'
import { applyApiError } from '~/composables/core/applyApiError'
import { parseApiError } from '~/services/api/extract-api-errors'
import { useFieldErrorTranslator } from '~/composables/core/useFieldErrorTranslator'

export function useFTTrainerPromotionPicker(trainer: Ref<PersonalTrainer | null>) {
  const { t } = useI18n()
  const toast = useFTToast()
  const { update, pending, error: apiError, fieldErrors: apiFieldErrors, resetStatus } = useUpdateTrainerProfile()
  const { setTrainer } = useMyTrainerProfile()
  const errorMessage = useFieldErrorTranslator('dashboard.promotion.errors')

  const templates = ref<PromotionTemplateListItem[]>([])
  const templatesPending = ref(false)
  const selectedTemplateId = ref<string | null>(null)
  const errors = ref<Record<string, string>>({})

  async function loadTemplates() {
    templatesPending.value = true
    try {
      const response = await promotionTemplatesService.listPromotionTemplates()
      templates.value = response.items
    } catch (err) {
      const parsed = parseApiError(err, 'error.network')
      toast.error(t(parsed.message))
      templates.value = []
    } finally {
      templatesPending.value = false
    }
  }

  watch(trainer, (value) => {
    selectedTemplateId.value = value?.promotion?.templateId ?? null
  }, { immediate: true })

  onMounted(() => {
    loadTemplates()
  })

  const selectedTemplate = computed(() =>
    templates.value.find(template => template.id === selectedTemplateId.value) ?? null,
  )

  const previewServicePrice = computed(() => trainer.value?.servicePrice ?? 0)

  const previewPromoPrice = computed(() => {
    if (!selectedTemplate.value) return previewServicePrice.value
    return computePromoPrice(previewServicePrice.value, selectedTemplate.value.discountPercent)
  })

  const previewDiscountPercent = computed(() => selectedTemplate.value?.discountPercent ?? null)

  const redemptionSummary = computed(() => {
    const count = trainer.value?.promotion?.redemptionCount ?? 0
    const max = selectedTemplate.value?.maxRedemptions

    if (max == null) {
      return t('dashboard.promotion.redemptionsUnlimited', { count })
    }

    return t('dashboard.promotion.redemptionsLimited', { count, max })
  })

  async function activateTemplate(templateId: string) {
    selectedTemplateId.value = templateId
    await handleSubmit()
  }

  async function deactivatePromotion() {
    selectedTemplateId.value = null
    await handleSubmit()
  }

  async function handleSubmit() {
    resetStatus()
    errors.value = {}

    const payload = {
      templateId: selectedTemplateId.value,
    }

    const validation = validateTrainerPromotionActivation(
      payload,
      trainer.value?.servicePrice ?? 0,
    )

    if (!validation.valid) {
      errors.value = validation.errors
      return
    }

    const request: UpdateTrainerProfileRequest = {
      section: 'promotion',
      promotion: payload,
    }

    const updated = await update(request)
    if (updated) {
      setTrainer(updated)
      toast.success(t('dashboard.promotion.success'))
      return
    }

    applyApiError({
      parsed: {
        message: apiError.value ?? 'dashboard.promotion.errors.submitFailed',
        fieldErrors: apiFieldErrors.value,
      },
      errors,
      toast,
      translate: key => t(key),
      translator: (field, code) => errorMessage(field, code),
    })
  }

  return {
    templates,
    templatesPending,
    selectedTemplateId,
    selectedTemplate,
    pending,
    errors,
    errorMessage,
    previewServicePrice,
    previewPromoPrice,
    previewDiscountPercent,
    redemptionSummary,
    formatPromotionPeriod,
    activateTemplate,
    deactivatePromotion,
    refreshTemplates: loadTemplates,
  }
}
