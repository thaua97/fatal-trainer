import type { AuthUser } from '#shared/domain/auth/entities/user'
import type { LoginRequest, RegisterRequest } from '#shared/types/api'
import type { LoginValidationErrors, RegisterValidationErrors } from '#shared/domain/auth/entities/auth-payloads'

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
      const response = await $fetch<{ user: AuthUser }>('/api/auth/me')
      user.value = response.user
    } catch {
      user.value = null
    } finally {
      initialized.value = true
    }
  }

  async function login(payload: LoginRequest): Promise<{ success: boolean, errors?: LoginValidationErrors }> {
    pending.value = true
    try {
      const response = await $fetch<{ user: AuthUser }>('/api/auth/login', {
        method: 'POST',
        body: payload,
      })
      user.value = response.user
      welcomePending.value = true
      await navigateTo('/?welcome=1')
      return { success: true }
    } catch (err: unknown) {
      const errors = extractFieldErrors<LoginValidationErrors>(err)
      return { success: false, errors }
    } finally {
      pending.value = false
    }
  }

  async function register(payload: RegisterRequest): Promise<{ success: boolean, errors?: RegisterValidationErrors }> {
    pending.value = true
    try {
      const response = await $fetch<{ user: AuthUser }>('/api/auth/register', {
        method: 'POST',
        body: payload,
      })
      user.value = response.user
      welcomePending.value = true
      await navigateTo('/?welcome=1')
      return { success: true }
    } catch (err: unknown) {
      const errors = extractFieldErrors<RegisterValidationErrors>(err)
      return { success: false, errors }
    } finally {
      pending.value = false
    }
  }

  async function logout(): Promise<void> {
    pending.value = true
    try {
      await $fetch('/api/auth/logout', { method: 'POST' })
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

function extractFieldErrors<T extends Record<string, string | undefined>>(err: unknown): T {
  if (err && typeof err === 'object' && 'data' in err) {
    const data = (err as { data?: { errors?: T } }).data
    if (data?.errors) {
      return data.errors
    }
  }
  return {} as T
}
