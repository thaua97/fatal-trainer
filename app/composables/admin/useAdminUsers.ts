import type {
  AdminUserListResponse,
  AdminUsersQuery,
  CreateAdminUserRequest,
  UpdateAdminUserRequest,
} from '#shared/types/admin'
import type { AuthUser } from '#shared/domain/auth/entities/user'
import { adminService } from '~/services/admin/admin.service'

export function useAdminUsers() {
  const { t } = useI18n()
  const toast = useFTToast()
  const { startImpersonation } = useImpersonation()

  const query = reactive<AdminUsersQuery>({
    page: 1,
    pageSize: 10,
    search: '',
  })

  const data = useState<AdminUserListResponse | null>('admin-users-data', () => null)
  const pending = useState('admin-users-pending', () => false)
  const error = useState<Error | null>('admin-users-error', () => null)

  async function refresh(): Promise<void> {
    pending.value = true
    error.value = null
    try {
      data.value = await adminService.listAdminUsers({ ...query })
      const maxPage = Math.max(1, Math.ceil((data.value.total || 0) / (data.value.pageSize || query.pageSize || 10)))
      if (query.page > maxPage) {
        query.page = maxPage
      }
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Failed to load users')
      data.value = null
      toast.error(t('toast.errors.loadFailed'))
    } finally {
      pending.value = false
    }
  }

  watch(
    () => [query.search, query.role, query.isActive] as const,
    () => {
      query.page = 1
    },
  )

  if (import.meta.client) {
    watch(
      () => [query.page, query.pageSize, query.search, query.role, query.isActive] as const,
      () => refresh(),
      { immediate: true },
    )
  }

  const { showError } = useAdminApiError()

  async function createUser(payload: CreateAdminUserRequest) {
    try {
      await adminService.createAdminUser(payload)
      toast.success(t('toast.admin.userCreated'))
      await refresh()
    } catch (err) {
      showError(err)
      throw err
    }
  }

  async function updateUser(id: string, payload: UpdateAdminUserRequest) {
    try {
      await adminService.updateAdminUser(id, payload)
      if (payload.isActive !== undefined && Object.keys(payload).length === 1) {
        toast.success(payload.isActive ? t('toast.admin.userActivated') : t('toast.admin.userDeactivated'))
      } else {
        toast.success(t('toast.admin.userUpdated'))
      }
      await refresh()
    } catch (err) {
      showError(err)
      throw err
    }
  }

  async function toggleFeatured(id: string, featured: boolean) {
    try {
      await adminService.toggleAdminUserFeatured(id, featured)
      toast.success(featured ? t('toast.admin.userFeatured') : t('toast.admin.userUnfeatured'))
      await refresh()
    } catch (err) {
      showError(err)
      throw err
    }
  }

  async function deleteUser(id: string) {
    try {
      await adminService.deleteAdminUser(id)
      toast.success(t('toast.admin.userDeleted'))
      await refresh()
    } catch (err) {
      showError(err)
      throw err
    }
  }

  async function impersonate(id: string): Promise<AuthUser> {
    try {
      return await startImpersonation(id)
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
    createUser,
    updateUser,
    toggleFeatured,
    deleteUser,
    impersonate,
  }
}
