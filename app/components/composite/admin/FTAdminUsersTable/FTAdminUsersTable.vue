<script setup lang="ts">
import type { AdminUserListItem } from '#shared/types/admin'

const {
  pending,
  query,
  modalOpen,
  editingUser,
  actionPending,
  filterOpen,
  viewMode,
  sortBy,
  sortOrder,
  form,
  roleLabel,
  sortedItems,
  pagination,
  activeFilterCount,
  clearFilters,
  openCreate,
  openEdit,
  handleSave,
  handleToggleActive,
  handleToggleFeatured,
  handleImpersonate,
  handleDelete,
  confirmOpen,
  pendingAction,
  confirmAction,
} = useFTAdminUsersTable()

const hoveredUser = ref<AdminUserListItem | null>(null)
const previewPosition = ref({ x: 0, y: 0 })

function onHoverUser(user: AdminUserListItem | null, event?: MouseEvent) {
  hoveredUser.value = user
  if (user && event) {
    previewPosition.value = { x: event.clientX, y: event.clientY }
  }
}
</script>

<template>
  <div data-testid="admin-users-table">
    <FTAdminUsersToolbar
      v-model:view-mode="viewMode"
      v-model:sort-by="sortBy"
      v-model:sort-order="sortOrder"
      v-model:filter-open="filterOpen"
      v-model:query="query"
      :active-filter-count="activeFilterCount"
      @clear-filters="clearFilters"
      @open-create="openCreate"
    />

    <div
      v-if="pending"
      class="rounded-2xl border border-slate-200/80 bg-white/90 p-8 text-center text-slate-500"
    >
      <UIcon
        name="i-lucide-loader-circle"
        class="size-6 animate-spin"
      />
    </div>

    <FTEmptyState
      v-else-if="!sortedItems.length && pagination.total === 0"
      title="Nenhum usuário encontrado"
      variant="search"
    />

    <template v-else>
      <FTAdminUsersTableView
        v-if="viewMode === 'table'"
        :items="sortedItems"
        :role-label="roleLabel"
        :action-pending="actionPending"
        @edit="openEdit"
        @impersonate="handleImpersonate"
        @delete="handleDelete"
        @toggle-active="handleToggleActive"
        @toggle-featured="handleToggleFeatured"
        @hover-user="onHoverUser"
      />

      <FTAdminUsersListView
        v-else
        :items="sortedItems"
        :role-label="roleLabel"
        :action-pending="actionPending"
        @edit="openEdit"
        @impersonate="handleImpersonate"
        @delete="handleDelete"
        @toggle-active="handleToggleActive"
        @toggle-featured="handleToggleFeatured"
        @hover-user="onHoverUser"
      />

      <FTAdminUsersPagination
        v-if="pagination.total > 0"
        v-model:page="query.page"
        :total="pagination.total"
        :page-size="pagination.pageSize"
        :disabled="pending"
        class="mt-4"
      />
    </template>

    <FTAdminUserPreviewCard
      v-if="hoveredUser"
      :user="hoveredUser"
      :role-label="roleLabel[hoveredUser.role]"
      :x="previewPosition.x"
      :y="previewPosition.y"
    />

    <FTAdminUserFormModal
      v-model:open="modalOpen"
      v-model:form="form"
      :editing="!!editingUser"
      :pending="actionPending"
      @save="handleSave"
    />

    <FTAdminUserActionConfirmModal
      v-model:open="confirmOpen"
      :action="pendingAction?.action"
      :user-name="pendingAction?.user.name"
      :pending="actionPending"
      @confirm="confirmAction"
    />
  </div>
</template>
