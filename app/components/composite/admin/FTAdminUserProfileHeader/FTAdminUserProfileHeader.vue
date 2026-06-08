<script setup lang="ts">
import type { AdminUserDetail } from '#shared/types/admin'

const props = defineProps<{
  user: AdminUserDetail
  actionPending?: boolean
}>()

const { user: adminUser } = useAdminAuth()
const isSelf = computed(() => adminUser.value?.id === props.user.id)

const emit = defineEmits<{
  edit: []
  impersonate: []
}>()
</script>

<template>
  <header
    class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
    data-testid="admin-user-profile-header"
  >
    <div class="flex items-center gap-3">
      <UButton
        to="/admin/usuarios"
        variant="ghost"
        color="neutral"
        icon="i-lucide-arrow-left"
        aria-label="Voltar"
      />
      <div>
        <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Perfil do usuário
        </p>
        <h1 class="font-display text-2xl font-bold text-slate-900">
          {{ user.name }}
        </h1>
      </div>
    </div>

    <div class="flex flex-wrap items-center gap-2">
      <UButton
        variant="outline"
        color="neutral"
        icon="i-lucide-pencil"
        :disabled="actionPending"
        @click="emit('edit')"
      >
        Editar
      </UButton>
      <UButton
        v-if="!isSelf"
        variant="outline"
        color="neutral"
        icon="i-lucide-user-check"
        :disabled="actionPending"
        @click="emit('impersonate')"
      >
        Acessar como
      </UButton>
      <UButton
        v-if="user.trainerId"
        :to="`/personal-trainers/${user.trainerId}`"
        target="_blank"
        variant="solid"
        color="primary"
        icon="i-lucide-external-link"
      >
        Ver perfil público
      </UButton>
    </div>
  </header>
</template>
