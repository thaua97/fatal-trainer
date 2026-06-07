import type {
  AdminUserListResponse,
  AdminUsersQuery,
  CreateAdminUserRequest,
  UpdateAdminUserRequest,
} from '#shared/types/admin'
import type { AuthUser } from '#shared/domain/auth/entities/user'
import { adminService } from '~/services/admin/admin.service'

export function useAdminUsers() {
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

  watch(
    () => [query.page, query.pageSize, query.search, query.role, query.isActive] as const,
    () => refresh(),
    { immediate: true },
  )

  async function createUser(payload: CreateAdminUserRequest) {
    await adminService.createAdminUser(payload)
    await refresh()
  }

  async function updateUser(id: string, payload: UpdateAdminUserRequest) {
    await adminService.updateAdminUser(id, payload)
    await refresh()
  }

  async function toggleFeatured(id: string, featured: boolean) {
    await adminService.toggleAdminUserFeatured(id, featured)
    await refresh()
  }

  async function impersonate(id: string): Promise<AuthUser> {
    const response = await adminService.impersonateAdminUser(id)
    const { fetchMe } = useAuth()
    const { fetchAdminMe } = useAdminAuth()
    await fetchMe()
    await fetchAdminMe()
    await navigateTo('/')
    return response.user
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
    impersonate,
  }
}
