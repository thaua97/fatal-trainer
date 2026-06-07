<script setup lang="ts">
const {
  form,
  fieldErrors,
  pending,
  submitError,
  showPassword,
  handleSubmit,
} = useFTAdminLoginForm()

const fieldUi = {
  root: 'w-full',
  base: 'w-full rounded-2xl bg-slate-50/80',
}
</script>

<template>
  <div
    class="w-full"
    data-testid="admin-login-form"
  >
    <UAlert
      v-if="submitError"
      color="error"
      variant="subtle"
      icon="i-lucide-circle-alert"
      :title="submitError"
      class="mb-5 w-full rounded-2xl"
    />

    <form
      class="flex w-full flex-col gap-5"
      @submit.prevent="handleSubmit"
    >
      <UFormField
        class="w-full"
        label="E-mail"
        :error="fieldErrors.email"
        required
      >
        <UInput
          v-model="form.email"
          class="w-full"
          type="email"
          autocomplete="email"
          placeholder="admin@fataltrainer.com"
          :ui="fieldUi"
          data-testid="admin-login-email"
        />
      </UFormField>

      <UFormField
        class="w-full"
        label="Senha"
        :error="fieldErrors.password"
        required
      >
        <UInput
          v-model="form.password"
          class="w-full"
          :type="showPassword ? 'text' : 'password'"
          autocomplete="current-password"
          placeholder="••••••••"
          :ui="fieldUi"
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
        Entrar no painel
      </UButton>
    </form>
  </div>
</template>
