<script setup lang="ts">
const {
  form,
  fieldErrors,
  pending,
  submitError,
  showPassword,
  handleSubmit,
  handleForgotPassword,
} = useFTLoginForm()

const { t } = useI18n()

const fieldUi = {
  root: 'w-full',
  base: 'w-full rounded-2xl bg-slate-50/80',
}
</script>

<template>
  <div
    class="w-full"
    data-testid="login-form"
  >
    <UAlert
      v-if="submitError"
      color="error"
      variant="subtle"
      icon="i-lucide-circle-alert"
      :title="submitError"
      class="mb-5 w-full rounded-2xl"
      data-testid="login-error-alert"
    />

    <form
      class="flex w-full flex-col gap-5"
      data-testid="login-form-fields"
      @submit.prevent="handleSubmit"
    >
      <UFormField
        class="w-full"
        :label="t('auth.login.email')"
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
          data-testid="login-email-input"
        />
      </UFormField>

      <UFormField
        class="w-full"
        :label="t('auth.login.password')"
        :error="fieldErrors.password"
        required
      >
        <UInput
          v-model="form.password"
          class="w-full"
          :type="showPassword ? 'text' : 'password'"
          autocomplete="current-password"
          :placeholder="t('auth.placeholders.password')"
          :ui="fieldUi"
          data-testid="login-password-input"
        >
          <template #trailing>
            <UButton
              type="button"
              variant="ghost"
              color="neutral"
              size="xs"
              :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
              :aria-label="showPassword ? 'Hide password' : 'Show password'"
              class="rounded-full"
              @click="showPassword = !showPassword"
            />
          </template>
        </UInput>
      </UFormField>

      <div class="flex w-full justify-end -mt-1">
        <button
          type="button"
          class="text-xs font-medium text-slate-500 transition-colors hover:text-violet-600"
          data-testid="login-forgot-password"
          @click="handleForgotPassword"
        >
          {{ t('auth.login.forgotPassword') }}
        </button>
      </div>

      <UButton
        type="submit"
        color="primary"
        size="lg"
        block
        class="w-full rounded-full font-semibold"
        :loading="pending"
        data-testid="login-submit-button"
      >
        {{ pending ? t('auth.login.submitting') : t('auth.login.submit') }}
      </UButton>
    </form>

    <p
      class="mt-5 w-full rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-3 py-2 text-center text-[11px] leading-relaxed text-slate-400"
      data-testid="login-demo-hint"
    >
      {{ t('auth.login.demoHint') }}
    </p>
  </div>
</template>
