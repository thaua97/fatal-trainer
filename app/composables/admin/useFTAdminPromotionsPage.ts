import type { AdminPromotionTemplateListItem } from '#shared/types/admin'

export type AdminPromotionsSortBy = 'name' | 'createdAt' | 'startsAt' | 'discountPercent'
export type AdminPromotionsSortOrder = 'asc' | 'desc'

const SORT_BY_KEY = 'ft-admin-promotions-sort-by'
const SORT_ORDER_KEY = 'ft-admin-promotions-sort-order'

function emptyForm() {
  return {
    name: '',
    label: '',
    discountPercent: 15,
    startsAt: '',
    endsAt: '',
    maxRedemptions: null as number | null,
    unlimitedRedemptions: true,
    isActive: true,
  }
}

export function useFTAdminPromotionsPage() {
  const { showError } = useAdminApiError()
  const {
    data,
    pending,
    query,
    refresh,
    createPromotion,
    updatePromotion,
    deletePromotion,
  } = useAdminPromotions()

  const modalOpen = ref(false)
  const editingPromotion = ref<AdminPromotionTemplateListItem | null>(null)
  const actionPending = ref(false)
  const filterOpen = ref(false)

  const sortBy = useLocalStorage<AdminPromotionsSortBy>(SORT_BY_KEY, 'createdAt')
  const sortOrder = useLocalStorage<AdminPromotionsSortOrder>(SORT_ORDER_KEY, 'desc')

  const form = reactive(emptyForm())

  const sortedItems = computed(() => {
    const items = [...(data.value?.items ?? [])]
    const direction = sortOrder.value === 'asc' ? 1 : -1

    items.sort((a, b) => {
      if (sortBy.value === 'name') {
        return a.name.localeCompare(b.name, 'pt-BR') * direction
      }
      if (sortBy.value === 'discountPercent') {
        return (a.discountPercent - b.discountPercent) * direction
      }
      if (sortBy.value === 'startsAt') {
        return (new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()) * direction
      }
      return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * direction
    })

    return items
  })

  const pagination = computed(() => ({
    page: data.value?.page ?? query.page ?? 1,
    pageSize: data.value?.pageSize ?? query.pageSize ?? 10,
    total: data.value?.total ?? 0,
    hasMore: data.value?.hasMore ?? false,
  }))

  const activeFilterCount = computed(() => {
    let count = 0
    if (query.isActive !== undefined) count++
    if (query.status) count++
    return count
  })

  function clearFilters() {
    query.isActive = undefined
    query.status = undefined
  }

  function openCreate() {
    editingPromotion.value = null
    Object.assign(form, emptyForm())
    modalOpen.value = true
  }

  function openEdit(promotion: AdminPromotionTemplateListItem) {
    editingPromotion.value = promotion
    form.name = promotion.name
    form.label = promotion.label
    form.discountPercent = promotion.discountPercent
    form.startsAt = promotion.startsAt
    form.endsAt = promotion.endsAt
    form.maxRedemptions = promotion.maxRedemptions ?? null
    form.unlimitedRedemptions = promotion.maxRedemptions == null
    form.isActive = promotion.isActive
    modalOpen.value = true
  }

  watch(
    () => form.unlimitedRedemptions,
    (value) => {
      if (value) {
        form.maxRedemptions = null
      } else if (form.maxRedemptions == null) {
        form.maxRedemptions = 10
      }
    },
  )

  async function handleSave() {
    actionPending.value = true
    try {
      const payload = {
        name: form.name.trim(),
        label: form.label.trim(),
        discountPercent: form.discountPercent,
        startsAt: form.startsAt,
        endsAt: form.endsAt,
        maxRedemptions: form.unlimitedRedemptions ? null : form.maxRedemptions,
        isActive: form.isActive,
      }

      if (editingPromotion.value) {
        await updatePromotion(editingPromotion.value.id, payload)
      } else {
        await createPromotion(payload)
      }
      modalOpen.value = false
    } catch (err) {
      showError(err)
    } finally {
      actionPending.value = false
    }
  }

  async function handleToggleActive(promotion: AdminPromotionTemplateListItem) {
    actionPending.value = true
    try {
      await updatePromotion(promotion.id, { isActive: !promotion.isActive })
    } catch (err) {
      showError(err)
    } finally {
      actionPending.value = false
    }
  }

  async function handleDelete(promotion: AdminPromotionTemplateListItem) {
    actionPending.value = true
    try {
      await deletePromotion(promotion.id)
    } catch (err) {
      showError(err)
    } finally {
      actionPending.value = false
    }
  }

  return {
    data,
    pending,
    query,
    refresh,
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
  }
}

export const useFTAdminPromotionsTable = useFTAdminPromotionsPage
