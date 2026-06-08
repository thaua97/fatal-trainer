import type { AuthUser } from '#shared/domain/auth/entities/user'
import type { LoginRequest, RegisterRequest } from '#shared/types/api'
import type { LoginValidationErrors, RegisterValidationErrors } from '#shared/domain/auth/entities/auth-payloads'
import { authService } from '~/services/auth/auth.service'
import { parseApiError } from '~/services/api/extract-api-errors'

export function useAuth() {
  const user = useState<AuthUser | null>('auth-user', () => null)
  const pending = useState('auth-pending', () => false)
  const welcomePending = useState('auth-welcome-pending', () => false)
  const initialized = useState('auth-initialized', () => false)

  const isAuthenticated = computed(() => user.value !== null)
  const userName = computed(() => user.value?.name ?? '')
  const userRole = computed(() => user.value?.role ?? null)
  const userAvatarUrl = computed(() => user.value?.avatarUrl)

  function setUserAvatarUrl(avatarUrl: string | undefined) {
    if (!user.value) {
      return
    }

    user.value = {
      ...user.value,
      avatarUrl,
    }
  }

  async function fetchMe(): Promise<void> {
    try {
      const response = await authService.getMe()
      user.value = response.user
    } catch {
      user.value = null
    } finally {
      initialized.value = true
    }
  }

  async function login(
    payload: LoginRequest,
    redirectTo?: string | null,
  ): Promise<{ success: boolean, errors?: LoginValidationErrors, errorMessage?: string }> {
    pending.value = true
    try {
      const response = await authService.login(payload)
      user.value = response.user
      initialized.value = true
      welcomePending.value = true
      const { syncFromLocalStorage } = useTrainerBookmakers()
      await syncFromLocalStorage().catch(() => {})

      const destination = redirectTo?.startsWith('/') ? redirectTo : '/?welcome=1'
      await navigateTo(destination)
      return { success: true }
    } catch (err: unknown) {
      const parsed = parseApiError(err, 'auth.errors.submitFailed')
      return {
        success: false,
        errors: parsed.fieldErrors as LoginValidationErrors,
        errorMessage: parsed.message,
      }
    } finally {
      pending.value = false
    }
  }

  async function register(payload: RegisterRequest): Promise<{ success: boolean, errors?: RegisterValidationErrors, errorMessage?: string }> {
    pending.value = true
    try {
      const response = await authService.register(payload)
      user.value = response.user
      initialized.value = true
      welcomePending.value = true
      const { syncFromLocalStorage } = useTrainerBookmakers()
      await syncFromLocalStorage().catch(() => {})
      await navigateTo('/?welcome=1')
      return { success: true }
    } catch (err: unknown) {
      const parsed = parseApiError(err, 'auth.errors.submitFailed')
      return {
        success: false,
        errors: parsed.fieldErrors as RegisterValidationErrors,
        errorMessage: parsed.message,
      }
    } finally {
      pending.value = false
    }
  }

  async function logout(): Promise<void> {
    pending.value = true
    try {
      await authService.logout()
    } catch {
      // Clear local state even if request fails
    } finally {
      user.value = null
      welcomePending.value = false
      pending.value = false
    }
  }

  function consumeWelcome(): boolean {
    if (!welcomePending.value) {
      return false
    }
    welcomePending.value = false
    return true
  }

  return {
    user,
    pending,
    initialized,
    isAuthenticated,
    userName,
    userRole,
    userAvatarUrl,
    setUserAvatarUrl,
    fetchMe,
    login,
    register,
    logout,
    consumeWelcome,
  }
}
