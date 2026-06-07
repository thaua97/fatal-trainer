<script setup lang="ts">
const {
  form,
  fieldErrors,
  pending,
  submitError,
  showPassword,
  showConfirmPassword,
  handleSubmit,
} = useFTRegisterForm()

const { t } = useI18n()

const fieldUi = {
  root: 'w-full',
  base: 'w-full rounded-2xl bg-slate-50/80',
}
</script>

<template>
  <div
    class="w-full"
    data-testid="register-form"
  >
    <UAlert
      v-if="submitError"
      color="error"
      variant="subtle"
      icon="i-lucide-circle-alert"
      :title="submitError"
      class="mb-5 w-full rounded-2xl"
      data-testid="register-error-alert"
    />

    <form
      class="flex w-full flex-col gap-5"
      data-testid="register-form-fields"
      @submit.prevent="handleSubmit"
    >
      <UFormField
        class="w-full"
        :label="t('auth.roles.label')"
        :error="fieldErrors.role"
        required
      >
        <FTAuthRoleSelector v-model="form.role" />
      </UFormField>

      <UFormField
        class="w-full"
        :label="t('auth.register.name')"
        :error="fieldErrors.name"
        required
      >
        <UInput
          v-model="form.name"
          class="w-full"
          type="text"
          autocomplete="name"
          :placeholder="t('auth.placeholders.name')"
          :ui="fieldUi"
          data-testid="register-name-input"
        />
      </UFormField>

      <UFormField
        class="w-full"
        :label="t('auth.register.email')"
        :error="fieldErrors.email"
        required
      >
        <UInput
          v-model="form.email"
          class="w-full"
          type="email"
          autocomplete="email"
          :placeholder="t('auth.placeholders.email')"
          :ui="fieldUi"
          data-testid="register-email-input"
        />
      </UFormField>

      <UFormField
        class="w-full"
        :label="t('auth.register.password')"
        :error="fieldErrors.password"
        required
      >
        <UInput
          v-model="form.password"
          class="w-full"
          :type="showPassword ? 'text' : 'password'"
          autocomplete="new-password"
          :placeholder="t('auth.placeholders.password')"
          :ui="fieldUi"
          data-testid="register-password-input"
        >
          <template #trailing>
            <UButton
              type="button"
              variant="ghost"
              color="neutral"
              size="xs"
              :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
              class="rounded-full"
              @click="showPassword = !showPassword"
            />
          </template>
        </UInput>
      </UFormField>

      <UFormField
        class="w-full"
        :label="t('auth.register.confirmPassword')"
        :error="fieldErrors.confirmPassword"
        required
      >
        <UInput
          v-model="form.confirmPassword"
          class="w-full"
          :type="showConfirmPassword ? 'text' : 'password'"
          autocomplete="new-password"
          :placeholder="t('auth.placeholders.password')"
          :ui="fieldUi"
          data-testid="register-confirm-password-input"
        >
          <template #trailing>
            <UButton
              type="button"
              variant="ghost"
              color="neutral"
              size="xs"
              :icon="showConfirmPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
              class="rounded-full"
              @click="showConfirmPassword = !showConfirmPassword"
            />
          </template>
        </UInput>
      </UFormField>

      <UFormField
        class="w-full"
        :error="fieldErrors.termsAccepted"
      >
        <UCheckbox
          v-model="form.termsAccepted"
          class="w-full"
          :label="t('auth.register.terms')"
          data-testid="register-terms-checkbox"
        />
      </UFormField>

      <UButton
        type="submit"
        color="primary"
        size="lg"
        block
        class="w-full rounded-full font-semibold"
        :loading="pending"
        data-testid="register-submit-button"
      >
        {{ pending ? t('auth.register.submitting') : t('auth.register.submit') }}
      </UButton>
    </form>
  </div>
</template>
