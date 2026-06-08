<script setup lang="ts">
import type { PersonalTrainer } from '#shared/domain/catalog/entities/personal-trainer'

const props = defineProps<{
  trainer: PersonalTrainer
}>()

const emit = defineEmits<{
  submitted: []
  'update:editableReviewId': [id: string | null]
}>()

const trainerRef = toRef(props, 'trainer')
const { t } = useI18n()

const {
  form,
  errors,
  errorMessage,
  pending,
  loadingMine,
  isEditing,
  mineReviewId,
  showForm,
  showFormFields,
  showGuestCta,
  loginPath,
  submitLabel,
  handleSubmit,
  startEditing,
  cancelEditing,
} = useFTProfileReviewForm(trainerRef)

const fieldUi = { base: 'w-full rounded-2xl' }

async function onSubmit() {
  const success = await handleSubmit()
  if (success) {
    emit('submitted')
  }
}

watch(mineReviewId, (id) => {
  emit('update:editableReviewId', id)
}, { immediate: true })

defineExpose({
  startEditing,
})
</script>

<template>
  <div
    v-if="showGuestCta || showFormFields"
    class="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-5"
    data-testid="profile-review-form"
  >
    <div
      v-if="showGuestCta"
      class="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between"
      data-testid="profile-review-guest"
    >
      <div class="flex items-start gap-3">
        <div class="flex size-10 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600">
          <UIcon name="i-lucide-message-square-plus" class="size-5" />
        </div>
        <div>
          <p class="font-semibold text-slate-900">
            {{ t('reviewForm.guestTitle') }}
          </p>
          <p class="mt-1 text-sm text-slate-600">
            {{ t('reviewForm.guestDescription') }}
          </p>
        </div>
      </div>

      <UButton
        :to="loginPath"
        color="primary"
        class="rounded-full px-6"
        data-testid="profile-review-login"
      >
        {{ t('reviewForm.login') }}
      </UButton>
    </div>

    <div
      v-else-if="showFormFields"
      data-testid="profile-review-form-fields"
    >
      <form
        class="flex flex-col gap-5"
        @submit.prevent="onSubmit"
      >
        <UFormField
          :label="t('reviewForm.ratingLabel')"
          :error="errorMessage('rating', errors.rating)"
          required
        >
          <FTRatingInput
            v-model="form.rating"
            data-testid="profile-review-rating"
          />
        </UFormField>

        <UFormField
          class="w-full"
          :label="t('reviewForm.commentLabel')"
          :error="errorMessage('comment', errors.comment)"
          required
        >
          <UTextarea
            v-model="form.comment"
            class="w-full"
            :placeholder="t('reviewForm.commentPlaceholder')"
            :rows="4"
            :disabled="pending || loadingMine"
            data-testid="profile-review-comment"
            :ui="fieldUi"
          />
        </UFormField>

        <div class="flex justify-end gap-3">
          <UButton
            v-if="isEditing"
            type="button"
            variant="ghost"
            color="neutral"
            class="rounded-full px-6"
            :disabled="pending"
            data-testid="profile-review-cancel"
            @click="cancelEditing"
          >
            {{ t('reviewForm.cancel') }}
          </UButton>
          <UButton
            type="submit"
            color="primary"
            class="rounded-full px-8"
            :loading="pending"
            :disabled="loadingMine"
            data-testid="profile-review-submit"
          >
            {{ submitLabel }}
          </UButton>
        </div>
      </form>
    </div>
  </div>
</template>
