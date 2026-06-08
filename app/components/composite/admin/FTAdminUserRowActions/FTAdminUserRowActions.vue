<script setup lang="ts">
import type { AdminUserListItem } from '#shared/types/admin'

const props = defineProps<{
  user: AdminUserListItem
  actionPending?: boolean
}>()

const { user: adminUser } = useAdminAuth()
const isSelf = computed(() => adminUser.value?.id === props.user.id)

const emit = defineEmits<{
  edit: [AdminUserListItem]
  impersonate: [AdminUserListItem]
  delete: [AdminUserListItem]
}>()

function viewProfile() {
  navigateTo(`/admin/usuarios/${props.user.id}`)
}

const dropdownItems = computed(() => {
  const items = []

  if (!isSelf.value) {
    items.push({
      label: 'Acessar como',
      icon: 'i-lucide-user-check',
      onSelect: () => emit('impersonate', props.user),
    })
  }

  items.push(
    {
      label: 'Visualizar',
      icon: 'i-lucide-eye',
      onSelect: viewProfile,
    },
    {
      label: 'Editar',
      icon: 'i-lucide-pencil',
      onSelect: () => emit('edit', props.user),
    },
  )

  if (!isSelf.value) {
    items.push({
      label: 'Excluir',
      icon: 'i-lucide-trash-2',
      onSelect: () => emit('delete', props.user),
    })
  }

  return [items]
})
</script>

<template>
  <div
    class="flex w-full items-center justify-center gap-1"
    data-testid="admin-user-row-actions"
  >
    <div class="hidden items-center justify-center gap-2 lg:flex">
      <UButton
        v-if="!isSelf"
        variant="outline"
        color="neutral"
        size="xs"
        icon="i-lucide-user-check"
        class="rounded-full whitespace-nowrap"
        :disabled="actionPending"
        @click="emit('impersonate', user)"
      >
        Acessar como
      </UButton>
      <UButton
        variant="ghost"
        color="neutral"
        size="xs"
        icon="i-lucide-eye"
        aria-label="Visualizar"
        :disabled="actionPending"
        @click="viewProfile"
      />
      <UButton
        variant="ghost"
        color="neutral"
        size="xs"
        icon="i-lucide-pencil"
        aria-label="Editar"
        :disabled="actionPending"
        @click="emit('edit', user)"
      />
      <UButton
        v-if="!isSelf"
        variant="ghost"
        color="error"
        size="xs"
        icon="i-lucide-trash-2"
        aria-label="Excluir usuário"
        :disabled="actionPending"
        @click="emit('delete', user)"
      />
    </div>

    <div class="lg:hidden">
      <UDropdownMenu :items="dropdownItems">
        <UButton
          variant="ghost"
          color="neutral"
          icon="i-lucide-ellipsis"
          size="sm"
          aria-label="Ações"
        />
      </UDropdownMenu>
    </div>
  </div>
</template>
