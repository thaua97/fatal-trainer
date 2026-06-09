import type { ReviewPayload, ReviewValidationErrors } from '#shared/domain/review/entities/trainer-review'
import { validateReview } from '#shared/domain/review/services/validate-review'
import type { PersonalTrainer } from '#shared/domain/catalog/entities/personal-trainer'
import type { TrainerReviewItem, UpsertReviewRequest } from '#shared/types/api'
import { reviewsService } from '~/services/reviews/reviews.service'
import { parseApiError } from '~/services/api/extract-api-errors'
import { applyApiError } from '~/composables/core/applyApiError'
import { useFieldErrorTranslator } from '~/composables/core/useFieldErrorTranslator'

function emptyForm(): ReviewPayload {
  return {
    rating: 0,
    comment: '',
  }
}

export function useFTProfileReviewForm(trainer: Ref<PersonalTrainer>) {
  const { t } = useI18n()
  const toast = useFTToast()
  const { isAuthenticated, user, initialized } = useAuth()
  const errorMessage = useFieldErrorTranslator('reviewForm.errors')

  const form = reactive<ReviewPayload>(emptyForm())
  const errors = ref<ReviewValidationErrors>({})
  const pending = ref(false)
  const loadingMine = ref(false)
  const submitted = ref(false)
  const hasExistingReview = ref(false)
  const mineReview = ref<TrainerReviewItem | null>(null)
  const isEditing = ref(false)

  const isOwnProfile = computed(() => {
    if (!user.value?.id || !trainer.value.userId) {
      return false
    }
    return user.value.id === trainer.value.userId
  })

  const showForm = computed(() => initialized.value && isAuthenticated.value && !isOwnProfile.value)
  const showFormFields = computed(() => showForm.value && (!hasExistingReview.value || isEditing.value))
  const showGuestCta = computed(() => initialized.value && !isAuthenticated.value)
  const mineReviewId = computed(() => mineReview.value?.id ?? null)
  const { loginRoute } = useAuthRedirect()

  const submitLabel = computed(() =>
    hasExistingReview.value ? t('reviewForm.update') : t('reviewForm.submit'),
  )

  async function loadMine(): Promise<void> {
    if (!isAuthenticated.value || isOwnProfile.value) {
      return
    }

    loadingMine.value = true
    try {
      const response = await reviewsService.getMine(trainer.value.id)
      if (response.review) {
        mineReview.value = response.review
        hasExistingReview.value = true
      }
    } catch {
      // ignore — user may not have a review yet
    } finally {
      loadingMine.value = false
    }
  }

  watch(
    [() => trainer.value.id, isAuthenticated, isOwnProfile, initialized],
    () => {
      if (!initialized.value) {
        return
      }

      Object.assign(form, emptyForm())
      hasExistingReview.value = false
      mineReview.value = null
      isEditing.value = false
      submitted.value = false
      errors.value = {}

      if (showForm.value) {
        loadMine()
      }
    },
    { immediate: true },
  )

  async function handleSubmit(): Promise<boolean> {
    errors.value = {}

    const validation = validateReview(form)
    if (!validation.valid) {
      errors.value = validation.errors
      return false
    }

    const payload: UpsertReviewRequest = {
      rating: form.rating,
      comment: form.comment.trim(),
    }

    pending.value = true
    try {
      const result = await reviewsService.upsert(trainer.value.id, payload)
      mineReview.value = result.review
      hasExistingReview.value = true
      isEditing.value = false
      submitted.value = true
      toast.success(t('reviewForm.successTitle'), t('reviewForm.successDescription'))
      return true
    } catch (err: unknown) {
      applyApiError({
        parsed: parseApiError(err, 'reviewForm.errors.submitFailed'),
        errors,
        toast,
        translate: t,
        translator: (field, code) => errorMessage(field, code),
        fallbackKey: 'reviewForm.errors.submitFailed',
      })
      return false
    } finally {
      pending.value = false
    }
  }

  function resetSubmitted() {
    submitted.value = false
  }

  function startEditing() {
    if (!mineReview.value) {
      return
    }

    form.rating = mineReview.value.rating
    form.comment = mineReview.value.comment
    isEditing.value = true
    submitted.value = false
    errors.value = {}
  }

  function cancelEditing() {
    Object.assign(form, emptyForm())
    isEditing.value = false
    submitted.value = false
    errors.value = {}
  }

  return {
    form,
    errors,
    errorMessage,
    pending,
    loadingMine,
    submitted,
    hasExistingReview,
    isEditing,
    mineReviewId,
    isOwnProfile,
    showForm,
    showFormFields,
    showGuestCta,
    loginRoute,
    submitLabel,
    handleSubmit,
    resetSubmitted,
    startEditing,
    cancelEditing,
  }
}
