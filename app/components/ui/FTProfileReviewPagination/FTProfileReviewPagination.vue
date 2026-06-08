<script setup lang="ts">
const page = defineModel<number>('page', { required: true })

const props = withDefaults(defineProps<{
  total: number
  pageSize?: number
  disabled?: boolean
}>(), {
  pageSize: 10,
})

const { t } = useI18n()

const rangeStart = computed(() => {
  if (props.total === 0) return 0
  return (page.value - 1) * props.pageSize + 1
})

const rangeEnd = computed(() => Math.min(page.value * props.pageSize, props.total))

const pageCount = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)))

const summaryLabel = computed(() => {
  if (props.total === 0) return t('reviewPagination.empty')
  if (props.total === 1) return t('reviewPagination.single')
  return t('reviewPagination.summary', {
    start: rangeStart.value,
    end: rangeEnd.value,
    total: props.total,
  })
})
</script>

<template>
  <nav
    class="mt-4 flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-3 shadow-sm backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between"
    aria-label="Paginação de avaliações"
    data-testid="profile-review-pagination"
  >
    <p class="text-sm text-slate-500">
      <span class="font-medium text-slate-700 tabular-nums">{{ summaryLabel }}</span>
    </p>

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
  </nav>
</template>
