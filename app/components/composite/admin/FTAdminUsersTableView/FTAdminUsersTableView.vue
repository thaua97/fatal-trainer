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
  delete: [AdminUserListItem]
  toggleActive: [AdminUserListItem]
  toggleFeatured: [AdminUserListItem]
  hoverUser: [AdminUserListItem | null, MouseEvent?]
}>()

function onUserCellMove(user: AdminUserListItem, event: MouseEvent) {
  emit('hoverUser', user, event)
}
</script>

<template>
  <div
    class="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm backdrop-blur-sm"
    data-testid="admin-users-table-view"
  >
    <div class="max-h-[calc(100vh-18rem)] overflow-y-auto">
      <table class="w-full text-left text-sm">
        <thead class="sticky top-0 z-10 border-b border-slate-100 bg-slate-50/95 backdrop-blur-sm">
        <tr>
          <th class="px-4 py-3 font-semibold text-slate-600">
            Usuário
          </th>
          <th class="hidden px-4 py-3 font-semibold text-slate-600 lg:table-cell">
            Cidade
          </th>
          <th class="hidden px-4 py-3 font-semibold text-slate-600 md:table-cell">
            E-mail
          </th>
          <th class="px-4 py-3 font-semibold text-slate-600">
            Papel
          </th>
          <th class="px-4 py-3 font-semibold text-slate-600">
            Ativo
          </th>
          <th class="px-4 py-3 font-semibold text-slate-600">
            Destaque
          </th>
          <th class="px-4 py-3 text-center font-semibold text-slate-600">
            Ações
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="user in items"
          :key="user.id"
          class="border-b border-slate-50"
        >
          <td
            class="px-4 py-3 transition-colors hover:bg-violet-50/40"
            @mouseenter="emit('hoverUser', user, $event)"
            @mousemove="onUserCellMove(user, $event)"
            @mouseleave="emit('hoverUser', null)"
          >
            <div class="flex items-center gap-3">
              <UAvatar
                :src="user.avatarUrl"
                :alt="user.name"
                size="sm"
              />
              <div>
                <p class="font-semibold text-slate-900">
                  {{ user.name }}
                </p>
                <p
                  v-if="formatAdminPhone(user.phoneNumber)"
                  class="text-xs text-slate-500"
                >
                  {{ formatAdminPhone(user.phoneNumber) }}
                </p>
                <p class="text-xs text-slate-400 md:hidden">
                  {{ user.email }}
                </p>
              </div>
            </div>
          </td>
          <td class="hidden px-4 py-3 text-slate-600 lg:table-cell">
            {{ formatAdminLocation(user) ?? '—' }}
          </td>
          <td class="hidden px-4 py-3 text-slate-600 md:table-cell">
            {{ user.email }}
          </td>
          <td class="px-4 py-3">
            <FTAdminRoleBadge
              :role="user.role"
              :label="roleLabel[user.role]"
            />
          </td>
          <td class="px-4 py-3">
            <USwitch
              :model-value="user.isActive"
              :disabled="actionPending"
              aria-label="Ativo"
              @update:model-value="emit('toggleActive', user)"
            />
          </td>
          <td class="px-4 py-3">
            <USwitch
              v-if="user.role === 'personal-trainer'"
              :model-value="user.featured"
              :disabled="actionPending"
              aria-label="Destaque"
              @update:model-value="emit('toggleFeatured', user)"
            />
            <span
              v-else
              class="text-slate-300"
            >—</span>
          </td>
          <td class="px-4 py-3 align-middle text-center">
            <FTAdminUserRowActions
              :user="user"
              :action-pending="actionPending"
              @edit="emit('edit', $event)"
              @impersonate="emit('impersonate', $event)"
              @delete="emit('delete', $event)"
            />
          </td>
        </tr>
      </tbody>
    </table>
    </div>
  </div>
</template>
