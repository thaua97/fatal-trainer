import type { PersonalTrainer } from '#shared/domain/catalog/entities/personal-trainer'
import type { TrainerPromotionField, TrainerPromotionPayload, TrainerPromotionValidationErrors } from '#shared/domain/catalog/entities/trainer-profile-payloads'
import { PROMOTION_LABELS } from '#shared/domain/catalog/constants/catalog-options'
import { computePromoPrice, getDiscountPercent } from '#shared/domain/catalog/services/trainer-pricing'
import { validateTrainerPromotion } from '#shared/domain/catalog/services/validate-trainer-profile'
import type { UpdateTrainerProfileRequest } from '#shared/types/api'
import { applyApiError } from '~/composables/core/applyApiError'
import { useFieldErrorTranslator } from '~/composables/core/useFieldErrorTranslator'

function emptyForm(): TrainerPromotionPayload {
  return {
    active: false,
    discountPercent: 15,
    label: '',
    startsAt: '',
    endsAt: '',
    maxRedemptions: null,
  }
}

function trainerToPromotionForm(trainer: PersonalTrainer): TrainerPromotionPayload {
  const promotion = trainer.promotion
  if (!promotion) {
    return emptyForm()
  }

  return {
    active: true,
    discountPercent: promotion.discountPercent ?? getDiscountPercent(trainer) ?? 15,
    label: promotion.label ?? '',
    startsAt: promotion.startsAt ?? '',
    endsAt: promotion.endsAt ?? '',
    maxRedemptions: promotion.maxRedemptions ?? null,
  }
}

export function useFTTrainerPromotionForm(trainer: Ref<PersonalTrainer | null>) {
  const { t } = useI18n()
  const toast = useFTToast()
  const { update, pending, error: apiError, fieldErrors: apiFieldErrors, resetStatus } = useUpdateTrainerProfile()
  const { setTrainer } = useMyTrainerProfile()
  const errorMessage = useFieldErrorTranslator('dashboard.promotion.errors')

  const form = reactive<TrainerPromotionPayload>(emptyForm())
  const errors = ref<TrainerPromotionValidationErrors>({})
  const unlimitedRedemptions = ref(true)

  watch(trainer, (value) => {
    if (value) {
      Object.assign(form, trainerToPromotionForm(value))
      unlimitedRedemptions.value = form.maxRedemptions == null
    }
  }, { immediate: true })

  watch(unlimitedRedemptions, (value) => {
    if (value) {
      form.maxRedemptions = null
    } else if (form.maxRedemptions == null) {
      form.maxRedemptions = 10
    }
  })

  const labelItems = computed(() =>
    PROMOTION_LABELS.map(value => ({ label: value, value })),
  )

  const previewServicePrice = computed(() => trainer.value?.servicePrice ?? 0)

  const previewPromoPrice = computed(() => {
    if (!form.active) {
      return previewServicePrice.value
    }
    return computePromoPrice(previewServicePrice.value, form.discountPercent)
  })

  const previewDiscountPercent = computed(() => {
    if (!form.active) {
      return null
    }
    return form.discountPercent
  })

  const redemptionSummary = computed(() => {
    const count = trainer.value?.promotion?.redemptionCount ?? 0
    const max = trainer.value?.promotion?.maxRedemptions
    if (max == null) {
      return t('dashboard.promotion.redemptionsUnlimited', { count })
    }
    return t('dashboard.promotion.redemptionsLimited', { count, max })
  })

  async function handleSubmit() {
    errors.value = {}
    resetStatus()

    const servicePrice = trainer.value?.servicePrice ?? 0
    const validation = validateTrainerPromotion(form, servicePrice)
    if (!validation.valid) {
      errors.value = validation.errors
      return
    }

    const payload: UpdateTrainerProfileRequest = {
      section: 'promotion',
      promotion: {
        active: form.active,
        discountPercent: form.discountPercent,
        label: form.label.trim(),
        startsAt: form.startsAt,
        endsAt: form.endsAt,
        maxRedemptions: unlimitedRedemptions.value ? null : form.maxRedemptions,
      },
    }

    const updated = await update(payload)
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
      translate: t,
      translator: (field, code) => errorMessage(field, code),
      fallbackKey: 'dashboard.promotion.errors.submitFailed',
    })
  }

  return {
    form,
    errors,
    errorMessage,
    unlimitedRedemptions,
    labelItems,
    pending,
    previewServicePrice,
    previewPromoPrice,
    previewDiscountPercent,
    redemptionSummary,
    handleSubmit,
  }
}
