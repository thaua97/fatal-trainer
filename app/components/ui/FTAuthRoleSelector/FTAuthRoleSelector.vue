<script setup lang="ts">
import type { UserRole } from '#shared/domain/auth/entities/user'

const model = defineModel<UserRole | ''>({ required: true })

const { t } = useI18n()

const roles: { value: UserRole, icon: string, labelKey: string }[] = [
  { value: 'student', icon: 'i-lucide-user', labelKey: 'auth.roles.student' },
  { value: 'personal-trainer', icon: 'i-lucide-dumbbell', labelKey: 'auth.roles.personalTrainer' },
]
</script>

<template>
  <div
    class="grid w-full grid-cols-2 gap-2 rounded-2xl border border-slate-100 bg-slate-50/50 p-1"
    role="radiogroup"
    :aria-label="t('auth.roles.label')"
    data-testid="auth-role-selector"
  >
    <button
      v-for="role in roles"
      :key="role.value"
      type="button"
      role="radio"
      :aria-checked="model === role.value"
      class="flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-all"
      :class="model === role.value
        ? 'border border-violet-600 bg-violet-600 text-white shadow-sm'
        : 'border border-transparent text-slate-600 hover:bg-white hover:text-slate-900'"
      :data-testid="`auth-role-${role.value}`"
      @click="model = role.value"
    >
      <UIcon
        :name="role.icon"
        class="size-4 shrink-0"
        aria-hidden="true"
      />
      {{ t(role.labelKey) }}
    </button>
  </div>
</template>
