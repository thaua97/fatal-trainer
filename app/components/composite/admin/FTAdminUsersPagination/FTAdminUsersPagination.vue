<script setup lang="ts">
const PAGE_SIZE_OPTIONS = [5, 10, 15, 20, 50] as const

const page = defineModel<number>('page', { required: true })
const pageSize = defineModel<number>('pageSize', { default: 20 })

const props = defineProps<{
  total: number
  disabled?: boolean
}>()

const { t } = useI18n()

const pageSizeItems = computed(() =>
  PAGE_SIZE_OPTIONS.map(size => ({ label: String(size), value: size })),
)

const rangeStart = computed(() => {
  if (props.total === 0) return 0
  return (page.value - 1) * pageSize.value + 1
})

const rangeEnd = computed(() => Math.min(page.value * pageSize.value, props.total))

const pageCount = computed(() => Math.max(1, Math.ceil(props.total / pageSize.value)))

const summaryLabel = computed(() => {
  if (props.total === 0) return 'Nenhum usuário'
  if (props.total === 1) return '1 usuário'
  return `Mostrando ${rangeStart.value}–${rangeEnd.value} de ${props.total} usuários`
})
</script>

<template>
  <nav
    class="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-3 shadow-sm backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between"
    aria-label="Paginação de usuários"
    data-testid="admin-users-pagination"
  >
    <p class="text-sm text-slate-500">
      <span class="font-medium text-slate-700 tabular-nums">{{ summaryLabel }}</span>
    </p>

    <div class="flex flex-wrap items-center justify-center gap-3 sm:justify-end">
      <div class="flex items-center gap-2">
        <label
          for="admin-users-page-size"
          class="text-sm text-slate-500"
        >
          {{ t('admin.users.pagination.perPage') }}
        </label>
        <USelect
          id="admin-users-page-size"
          v-model="pageSize"
          :items="pageSizeItems"
          :disabled="disabled"
          size="sm"
          class="w-20"
          data-testid="admin-users-page-size"
        />
      </div>

      <UPagination
        v-if="pageCount > 1"
        v-model:page="page"
        :total="total"
        :items-per-page="pageSize"
        :disabled="disabled"
        show-edges
        size="sm"
        color="neutral"
        variant="outline"
        active-color="primary"
        active-variant="solid"
        :ui="{
          root: 'justify-center sm:justify-end',
          list: 'gap-1',
        }"
      />
    </div>
  </nav>
</template>
