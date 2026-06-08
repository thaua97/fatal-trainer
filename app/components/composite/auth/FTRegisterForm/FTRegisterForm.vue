<script setup lang="ts">
const {
  form,
  errors,
  errorMessage,
  pending,
  showPassword,
  showConfirmPassword,
  handleSubmit,
} = useFTRegisterForm()

const { t } = useI18n()

const { authFieldUi, inputSize } = useFTFormFieldUi()
</script>

<template>
  <div
    class="w-full"
    data-testid="register-form"
  >
    <form
      class="flex w-full flex-col gap-5"
      data-testid="register-form-fields"
      @submit.prevent="handleSubmit"
    >
      <UFormField
        class="w-full"
        :label="t('auth.roles.label')"
        required
      >
        <FTAuthRoleSelector v-model="form.role" />
      </UFormField>

      <UFormField
        class="w-full"
        :label="t('auth.register.name')"
        :error="errorMessage('name', errors.name)"
        required
      >
        <UInput
          v-model="form.name"
          class="w-full"
          type="text"
          autocomplete="name"
          :placeholder="t('auth.placeholders.name')"
          :ui="authFieldUi"
          :size="inputSize"
          data-testid="register-name-input"
        />
      </UFormField>

      <UFormField
        class="w-full"
        :label="t('auth.register.email')"
        :error="errorMessage('email', errors.email)"
        required
      >
        <UInput
          v-model="form.email"
          class="w-full"
          type="email"
          autocomplete="email"
          :placeholder="t('auth.placeholders.email')"
          :ui="authFieldUi"
          :size="inputSize"
          data-testid="register-email-input"
        />
      </UFormField>

      <UFormField
        class="w-full"
        :label="t('auth.register.password')"
        :error="errorMessage('password', errors.password)"
        required
      >
        <UInput
          v-model="form.password"
          class="w-full"
          :type="showPassword ? 'text' : 'password'"
          autocomplete="new-password"
          :placeholder="t('auth.placeholders.password')"
          :ui="authFieldUi"
          :size="inputSize"
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
        :error="errorMessage('confirmPassword', errors.confirmPassword)"
        required
      >
        <UInput
          v-model="form.confirmPassword"
          class="w-full"
          :type="showConfirmPassword ? 'text' : 'password'"
          autocomplete="new-password"
          :placeholder="t('auth.placeholders.password')"
          :ui="authFieldUi"
          :size="inputSize"
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
        :error="errorMessage('termsAccepted', errors.termsAccepted)"
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
