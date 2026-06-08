// @vitest-environment nuxt
import { computed } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import type { AuthUser } from '#shared/domain/auth/entities/user'
import FTAppHeader from './FTAppHeader.vue'

const authState = vi.hoisted(() => {
  const { ref } = require('vue') as typeof import('vue')
  return {
    initialized: ref(false),
    user: ref<AuthUser | null>(null),
  }
})

vi.mock('~/composables/auth/useAuth', () => ({
  useAuth: () => ({
    initialized: authState.initialized,
    user: authState.user,
    isAuthenticated: computed(() => authState.user.value !== null),
    pending: ref(false),
    userName: computed(() => authState.user.value?.name ?? ''),
    userRole: computed(() => authState.user.value?.role ?? null),
    userAvatarUrl: computed(() => authState.user.value?.avatarUrl),
    setUserAvatarUrl: vi.fn(),
    fetchMe: vi.fn(),
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    consumeWelcome: vi.fn(),
  }),
}))

describe('FTAppHeader', () => {
  beforeEach(() => {
    authState.initialized.value = false
    authState.user.value = null
  })

  async function mountHeader(route = '/') {
    return mountSuspended(FTAppHeader, {
      route,
      global: {
        stubs: {
          FTLocaleSwitcher: true,
          FTAppHeaderUserMenu: {
            template: '<div data-testid="app-header-user-menu" />',
          },
        },
      },
    })
  }

  it('renders logo linking to home', async () => {
    const wrapper = await mountHeader()
    const logo = wrapper.find('[data-testid="app-header-logo"]')
    expect(logo.exists()).toBe(true)
    expect(logo.attributes('href')).toBe('/')
  })

  it('renders desktop navigation links', async () => {
    const wrapper = await mountHeader()
    expect(wrapper.find('[data-testid="app-header-nav-trainers"]').attributes('href')).toBe('/personal-trainers')
    expect(wrapper.find('[data-testid="app-header-nav-favorites"]').attributes('href')).toBe('/personal-trainers/favoritos')
    expect(wrapper.find('[data-testid="app-header-nav-report"]').attributes('href')).toBe('/denuncia')
  })

  it('renders auth actions when guest session is resolved', async () => {
    authState.initialized.value = true

    const wrapper = await mountHeader()
    expect(wrapper.find('[data-testid="app-header-auth-register"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="app-header-auth-login"]').exists()).toBe(true)
  })

  it('hides auth actions while session is loading', async () => {
    authState.initialized.value = false

    const wrapper = await mountHeader()
    expect(wrapper.find('[data-testid="app-header-auth-register"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="app-header-auth-login"]').exists()).toBe(false)
  })

  it('renders user menu when authenticated session is resolved', async () => {
    authState.initialized.value = true
    authState.user.value = {
      id: '1',
      name: 'Thauã Borges',
      email: 'test@example.com',
      role: 'personal-trainer',
      isActive: true,
    }

    const wrapper = await mountHeader()
    expect(wrapper.find('[data-testid="app-header-user-menu"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="app-header-auth-login"]').exists()).toBe(false)
  })

  it('renders mobile menu trigger for guests', async () => {
    authState.initialized.value = true

    const wrapper = await mountHeader()
    expect(wrapper.find('[data-testid="app-header-menu"]').exists()).toBe(true)
  })

  it('hides mobile menu trigger when authenticated', async () => {
    authState.initialized.value = true
    authState.user.value = {
      id: '1',
      name: 'Thauã Borges',
      email: 'test@example.com',
      role: 'student',
      isActive: true,
    }

    const wrapper = await mountHeader()
    expect(wrapper.find('[data-testid="app-header-menu"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="app-header-user-menu"]').exists()).toBe(true)
  })

  it('applies blur header styles without border', async () => {
    const wrapper = await mountHeader()
    const header = wrapper.find('header')
    expect(header.classes()).toContain('backdrop-blur-md')
    expect(header.classes()).not.toContain('border-b')
  })
})
