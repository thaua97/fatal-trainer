import type {
  AdminPromotionListResponse,
  AdminPromotionsQuery,
  CreateAdminPromotionRequest,
  UpdateAdminPromotionRequest,
} from '#shared/types/admin'
import { adminService } from '~/services/admin/admin.service'

export function useAdminPromotions() {
  const { t } = useI18n()
  const toast = useFTToast()

  const query = reactive<AdminPromotionsQuery>({
    page: 1,
    pageSize: 10,
    search: '',
  })

  const data = useState<AdminPromotionListResponse | null>('admin-promotions-data', () => null)
  const pending = useState('admin-promotions-pending', () => false)
  const error = useState<Error | null>('admin-promotions-error', () => null)

  async function refresh(): Promise<void> {
    pending.value = true
    error.value = null
    try {
      data.value = await adminService.listAdminPromotions({ ...query })
      const maxPage = Math.max(
        1,
        Math.ceil((data.value.total || 0) / (data.value.pageSize || query.pageSize || 10)),
      )
      if ((query.page ?? 1) > maxPage) {
        query.page = maxPage
      }
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Failed to load promotions')
      data.value = null
      toast.error(t('toast.errors.loadFailed'))
    } finally {
      pending.value = false
    }
  }

  watch(
    () => [query.search, query.isActive, query.status] as const,
    () => {
      query.page = 1
    },
  )

  if (import.meta.client) {
    watch(
      () => [query.page, query.pageSize, query.search, query.isActive, query.status] as const,
      () => refresh(),
      { immediate: true },
    )
  }

  const { showError } = useAdminApiError()

  async function createPromotion(payload: CreateAdminPromotionRequest) {
    try {
      await adminService.createAdminPromotion(payload)
      await refresh()
    } catch (err) {
      showError(err)
      throw err
    }
  }

  async function updatePromotion(id: string, payload: UpdateAdminPromotionRequest) {
    try {
      await adminService.updateAdminPromotion(id, payload)
      await refresh()
    } catch (err) {
      showError(err)
      throw err
    }
  }

  async function deletePromotion(id: string) {
    try {
      await adminService.deleteAdminPromotion(id)
      await refresh()
    } catch (err) {
      showError(err)
      throw err
    }
  }

  return {
    query,
    data,
    pending,
    error,
    refresh,
    createPromotion,
    updatePromotion,
    deletePromotion,
  }
}
