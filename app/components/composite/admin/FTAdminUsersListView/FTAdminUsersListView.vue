<script setup lang="ts">
import type { AdminUserListItem } from '#shared/types/admin'
import type { UserRole } from '#shared/domain/auth/entities/user'
import { formatAdminLocation, formatAdminPhone } from '#shared/utils/format-admin-user'

defineProps<{
  items: AdminUserListItem[]
  roleLabel: Record<UserRole, string>
  actionPending?: boolean
}>()

const emit = defineEmits<{
  edit: [AdminUserListItem]
  impersonate: [AdminUserListItem]
  toggleActive: [AdminUserListItem]
  toggleFeatured: [AdminUserListItem]
  hoverUser: [AdminUserListItem | null, MouseEvent?]
}>()

function onUserAreaMove(user: AdminUserListItem, event: MouseEvent) {
  emit('hoverUser', user, event)
}
</script>

<template>
  <div
    class="space-y-2"
    data-testid="admin-users-list-view"
  >
    <article
      v-for="user in items"
      :key="user.id"
      class="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-3 shadow-sm"
    >
      <div
        class="-mx-2 flex min-w-0 flex-1 items-center gap-3 rounded-xl px-2 py-1 transition-colors hover:bg-violet-50/40"
        @mouseenter="emit('hoverUser', user, $event)"
        @mousemove="onUserAreaMove(user, $event)"
        @mouseleave="emit('hoverUser', null)"
      >
        <UAvatar
          :src="user.avatarUrl"
          :alt="user.name"
          size="md"
          class="shrink-0"
        />

        <div class="min-w-0 flex-1">
          <div class="flex flex-wrap items-center gap-2">
            <p class="font-semibold text-slate-900">
              {{ user.name }}
            </p>
            <FTAdminRoleBadge
              :role="user.role"
              :label="roleLabel[user.role]"
              size="sm"
            />
          </div>
          <div class="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate-500">
            <span v-if="formatAdminPhone(user.phoneNumber)">
              {{ formatAdminPhone(user.phoneNumber) }}
            </span>
            <span v-if="formatAdminLocation(user)">
              {{ formatAdminLocation(user) }}
            </span>
            <span class="text-slate-400">{{ user.email }}</span>
          </div>
        </div>
      </div>

      <USwitch
        :model-value="user.isActive"
        :disabled="actionPending"
        aria-label="Ativo"
        @update:model-value="emit('toggleActive', user)"
      />

      <div
        v-if="user.role === 'personal-trainer'"
        class="flex items-center gap-2"
      >
        <span class="text-xs text-slate-500">Destaque</span>
        <USwitch
          :model-value="user.featured"
          :disabled="actionPending"
          @update:model-value="emit('toggleFeatured', user)"
        />
      </div>

      <FTAdminUserRowActions
        :user="user"
        :action-pending="actionPending"
        @edit="emit('edit', $event)"
        @impersonate="emit('impersonate', $event)"
      />
    </article>
  </div>
</template>
