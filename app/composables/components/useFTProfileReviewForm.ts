import type { ReviewField, ReviewPayload, ReviewValidationErrors } from '#shared/domain/review/entities/trainer-review'
import { validateReview } from '#shared/domain/review/services/validate-review'
import type { PersonalTrainer } from '#shared/domain/catalog/entities/personal-trainer'
import type { TrainerReviewItem, UpsertReviewRequest } from '#shared/types/api'
import { reviewsService } from '~/services/reviews/reviews.service'
import { extractApiErrors } from '~/services/api/extract-api-errors'

function emptyForm(): ReviewPayload {
  return {
    rating: 0,
    comment: '',
  }
}

export function useFTProfileReviewForm(trainer: Ref<PersonalTrainer>) {
  const { t } = useI18n()
  const route = useRoute()
  const { isAuthenticated, user, initialized } = useAuth()

  const form = reactive<ReviewPayload>(emptyForm())
  const errors = ref<ReviewValidationErrors>({})
  const pending = ref(false)
  const loadingMine = ref(false)
  const submitted = ref(false)
  const submitError = ref<string | null>(null)
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
  const loginPath = computed(() => {
    const redirect = encodeURIComponent(route.fullPath)
    return `/login?redirect=${redirect}`
  })

  function errorMessage(field: ReviewField, code?: string): string | undefined {
    if (!code) {
      return undefined
    }

    const key = `reviewForm.errors.${field}.${code}`
    const translated = t(key)
    return translated === key ? code : translated
  }

  const fieldErrors = computed(() => ({
    rating: errorMessage('rating', errors.value.rating),
    comment: errorMessage('comment', errors.value.comment),
  }))

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
      submitError.value = null
      errors.value = {}

      if (showForm.value) {
        loadMine()
      }
    },
    { immediate: true },
  )

  async function handleSubmit(): Promise<boolean> {
    errors.value = {}
    submitError.value = null

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
      return true
    } catch (err: unknown) {
      const apiErrors = extractApiErrors<ReviewValidationErrors>(err)
      if (Object.keys(apiErrors).length > 0) {
        errors.value = apiErrors
      } else {
        submitError.value = t('reviewForm.errors.submitFailed')
      }
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
    submitError.value = null
    errors.value = {}
  }

  function cancelEditing() {
    Object.assign(form, emptyForm())
    isEditing.value = false
    submitted.value = false
    submitError.value = null
    errors.value = {}
  }

  return {
    form,
    fieldErrors,
    pending,
    loadingMine,
    submitted,
    submitError,
    hasExistingReview,
    isEditing,
    mineReviewId,
    isOwnProfile,
    showForm,
    showFormFields,
    showGuestCta,
    loginPath,
    submitLabel,
    handleSubmit,
    resetSubmitted,
    startEditing,
    cancelEditing,
  }
}
