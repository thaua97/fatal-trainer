import { defineComponent } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { mountFT } from '@tests/helpers/mount-ft'
import { useAuth } from '~/composables/auth/useAuth'

const { authService } = vi.hoisted(() => ({
  authService: {
    getMe: vi.fn(),
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  },
}))

vi.mock('~/services/auth/auth.service', () => ({
  authService,
}))

vi.mock('~/composables/catalog/useTrainerBookmakers', () => ({
  useTrainerBookmakers: () => ({
    syncFromLocalStorage: vi.fn().mockResolvedValue(undefined),
  }),
}))

const { navigateTo } = vi.hoisted(() => ({
  navigateTo: vi.fn().mockResolvedValue(undefined),
}))

mockNuxtImport('navigateTo', () => navigateTo)

const TestHarness = defineComponent({
  setup() {
    return useAuth()
  },
  template: '<div />',
})

describe('useAuth', () => {
  beforeEach(() => {
    authService.getMe.mockReset()
    authService.login.mockReset()
    authService.logout.mockReset()
    navigateTo.mockReset()
    navigateTo.mockResolvedValue(undefined)

    useState('auth-user', () => null)
    useState('auth-pending', () => false)
    useState('auth-welcome-pending', () => false)
    useState('auth-initialized', () => false)
  })

  it('fetchMe hydrates user from auth service', async () => {
    authService.getMe.mockResolvedValue({ user: { id: '1', name: 'Ana', role: 'student' } })

    const wrapper = mountFT(TestHarness)
    await wrapper.vm.fetchMe()

    expect(authService.getMe).toHaveBeenCalled()
    expect(wrapper.vm.user?.name).toBe('Ana')
    expect(wrapper.vm.initialized).toBe(true)
  })

  it('login delegates to auth service and navigates on success', async () => {
    authService.login.mockResolvedValue({ user: { id: '1', name: 'Ana', role: 'student' } })

    const wrapper = mountFT(TestHarness)
    const result = await wrapper.vm.login({ email: 'a@b.com', password: '123456' })

    expect(result.success).toBe(true)
    expect(authService.login).toHaveBeenCalledWith({ email: 'a@b.com', password: '123456' })
    expect(navigateTo).toHaveBeenCalledWith('/?welcome=1')
  })
})
