<script setup lang="ts">
const {
  form,
  errors,
  errorMessage,
  pending,
  showPassword,
  handleSubmit,
} = useFTAdminLoginForm()

const { t } = useI18n()
const { authFieldUi, inputSize } = useFTFormFieldUi()
</script>

<template>
  <div
    class="w-full"
    data-testid="admin-login-form"
  >
    <form
      class="flex w-full flex-col gap-5"
      @submit.prevent="handleSubmit"
    >
      <UFormField
        class="w-full"
        :label="t('admin.login.email')"
        :error="errorMessage('email', errors.email)"
        required
      >
        <UInput
          v-model="form.email"
          class="w-full"
          type="email"
          autocomplete="email"
          placeholder="admin@fataltrainer.com"
          :ui="authFieldUi"
          :size="inputSize"
          data-testid="admin-login-email"
        />
      </UFormField>

      <UFormField
        class="w-full"
        :label="t('admin.login.password')"
        :error="errorMessage('password', errors.password)"
        required
      >
        <UInput
          v-model="form.password"
          class="w-full"
          :type="showPassword ? 'text' : 'password'"
          autocomplete="current-password"
          :placeholder="t('admin.login.passwordPlaceholder')"
          :ui="authFieldUi"
          :size="inputSize"
          data-testid="admin-login-password"
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

      <UButton
        type="submit"
        color="primary"
        size="lg"
        block
        class="w-full rounded-full font-semibold"
        :loading="pending"
        data-testid="admin-login-submit"
      >
        {{ t('admin.login.submit') }}
      </UButton>
    </form>
  </div>
</template>
