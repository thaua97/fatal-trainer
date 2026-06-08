import type { AuthUser } from '#shared/domain/auth/entities/user'
import type { LoginRequest } from '#shared/types/api'
import { adminService } from '~/services/admin/admin.service'
import { parseApiError } from '~/services/api/extract-api-errors'

function syncAuthUser(user: AuthUser | null) {
  const authUser = useState<AuthUser | null>('auth-user')
  const authInitialized = useState('auth-initialized', () => false)
  authUser.value = user
  authInitialized.value = true
}

export function useAdminAuth() {
  const user = useState<AuthUser | null>('admin-user', () => null)
  const pending = useState('admin-auth-pending', () => false)
  const initialized = useState('admin-auth-initialized', () => false)

  const isAdminAuthenticated = computed(() => user.value?.role === 'admin')

  async function fetchAdminMe(): Promise<void> {
    try {
      const response = await adminService.getSessionUser()
      if (response.user.role === 'admin') {
        user.value = response.user
        syncAuthUser(response.user)
      } else {
        user.value = null
      }
    } catch {
      user.value = null
    } finally {
      initialized.value = true
    }
  }

  async function login(payload: LoginRequest): Promise<{ success: boolean, error?: string, errors?: Record<string, string> }> {
    pending.value = true
    try {
      const response = await adminService.adminLogin(payload)
      user.value = response.user
      syncAuthUser(response.user)
      initialized.value = true
      await navigateTo('/admin/usuarios')
      return { success: true }
    } catch (err: unknown) {
      const parsed = parseApiError(err, 'admin.errors.loginFailed')
      return {
        success: false,
        error: parsed.message,
        errors: parsed.fieldErrors,
      }
    } finally {
      pending.value = false
    }
  }

  async function logout(): Promise<void> {
    pending.value = true
    try {
      await adminService.adminLogout()
    } catch {
      // ignore
    } finally {
      user.value = null
      syncAuthUser(null)
      pending.value = false
      await navigateTo('/admin')
    }
  }

  return {
    user,
    pending,
    initialized,
    isAdminAuthenticated,
    fetchAdminMe,
    login,
    logout,
  }
}
