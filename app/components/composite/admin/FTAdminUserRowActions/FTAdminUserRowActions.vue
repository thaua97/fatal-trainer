<script setup lang="ts">
import type { AdminUserListItem } from '#shared/types/admin'

const props = defineProps<{
  user: AdminUserListItem
  actionPending?: boolean
}>()

const emit = defineEmits<{
  edit: [AdminUserListItem]
  impersonate: [AdminUserListItem]
}>()

const dropdownItems = computed(() => [[
  {
    label: 'Editar',
    icon: 'i-lucide-pencil',
    onSelect: () => emit('edit', props.user),
  },
  {
    label: 'Acessar como',
    icon: 'i-lucide-user-check',
    onSelect: () => emit('impersonate', props.user),
  },
]])
</script>

<template>
  <div
    class="flex items-center justify-end gap-1"
    data-testid="admin-user-row-actions"
  >
    <div class="hidden items-center gap-2 lg:flex">
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
