<script setup lang="ts">
const {
  pending,
  query,
  modalOpen,
  editingPromotion,
  actionPending,
  filterOpen,
  sortBy,
  sortOrder,
  form,
  sortedItems,
  pagination,
  activeFilterCount,
  clearFilters,
  openCreate,
  openEdit,
  handleSave,
  handleToggleActive,
  handleDelete,
} = useFTAdminPromotionsTable()
</script>

<template>
  <div data-testid="admin-promotions-table">
    <FTAdminPromotionsToolbar
      v-model:sort-by="sortBy"
      v-model:sort-order="sortOrder"
      v-model:filter-open="filterOpen"
      :query="query"
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
      title="Nenhuma promoção encontrada"
      variant="search"
    />

    <template v-else>
      <FTAdminPromotionsTableView
        :items="sortedItems"
        :action-pending="actionPending"
        @edit="openEdit"
        @delete="handleDelete"
        @toggle-active="handleToggleActive"
      />

      <FTAdminPromotionsPagination
        v-if="pagination.total > 0"
        v-model:page="query.page"
        :total="pagination.total"
        :page-size="pagination.pageSize"
        :disabled="pending"
        class="mt-4"
      />
    </template>

    <FTAdminPromotionFormModal
      v-model:open="modalOpen"
      v-model:form="form"
      :editing="!!editingPromotion"
      :pending="actionPending"
      @save="handleSave"
    />
  </div>
</template>
