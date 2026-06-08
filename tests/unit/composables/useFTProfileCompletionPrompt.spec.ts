// @vitest-environment nuxt
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { computed, defineComponent, ref } from 'vue'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import type { AuthUser } from '#shared/domain/auth/entities/user'
import type { PersonalTrainer } from '#shared/domain/catalog/entities/personal-trainer'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { mockTrainer } from '@tests/helpers/mock-trainer'
import { useFTProfileCompletionPrompt } from '~/composables/profile/useFTProfileCompletionPrompt'

const authState = vi.hoisted(() => {
  const { ref } = require('vue') as typeof import('vue')
  return {
    initialized: ref(true),
    user: ref<AuthUser | null>(null),
  }
})

const trainerState = vi.hoisted(() => {
  const { ref } = require('vue') as typeof import('vue')
  return {
    trainer: ref<PersonalTrainer | null>(null),
  }
})

const routePath = vi.hoisted(() => {
  const { ref } = require('vue') as typeof import('vue')
  return ref('/')
})

const minimizedState = vi.hoisted(() => {
  const { ref } = require('vue') as typeof import('vue')
  return ref(false)
})

vi.mock('~/composables/auth/useAuth', () => ({
  useAuth: () => ({
    initialized: authState.initialized,
    user: authState.user,
    isAuthenticated: computed(() => authState.user.value !== null),
    userRole: computed(() => authState.user.value?.role ?? null),
  }),
}))

vi.mock('~/composables/dashboard/useMyTrainerProfile', () => ({
  useMyTrainerProfile: () => ({
    trainer: trainerState.trainer,
  }),
}))

vi.mock('~/composables/core/useLocalStorage', () => ({
  useLocalStorage: () => minimizedState,
}))

mockNuxtImport('useRoute', () => () => ({
  path: routePath.value,
}))

const TestHarness = defineComponent({
  setup() {
    return useFTProfileCompletionPrompt()
  },
  template: '<div />',
})

function setTrainerUser(overrides: Partial<AuthUser> = {}) {
  authState.user.value = {
    id: 'user-1',
    name: 'Personal Test',
    email: 'personal@test.com',
    role: 'personal-trainer',
    ...overrides,
  }
}

describe('useFTProfileCompletionPrompt', () => {
  beforeEach(() => {
    authState.initialized.value = true
    authState.user.value = null
    trainerState.trainer.value = null
    routePath.value = '/'
    minimizedState.value = false
  })

  it('shows prompt for personal-trainer without phone', async () => {
    setTrainerUser()
    const wrapper = await mountSuspended(TestHarness)

    expect(wrapper.vm.shouldShow).toBe(true)
    expect(wrapper.vm.showFab).toBe(false)
  })

  it('hides prompt for student role', async () => {
    authState.user.value = {
      id: 'user-2',
      name: 'Student',
      email: 'student@test.com',
      role: 'student',
    }

    const wrapper = await mountSuspended(TestHarness)

    expect(wrapper.vm.shouldShow).toBe(false)
    expect(wrapper.vm.showFab).toBe(false)
  })

  it('hides prompt when user has valid phone', async () => {
    setTrainerUser({ phoneNumber: '11987654321' })
    const wrapper = await mountSuspended(TestHarness)

    expect(wrapper.vm.shouldShow).toBe(false)
    expect(wrapper.vm.showFab).toBe(false)
  })

  it('hides prompt when trainer profile has valid contact phone', async () => {
    setTrainerUser()
    trainerState.trainer.value = mockTrainer({ contactPhone: '11987654321' })
    const wrapper = await mountSuspended(TestHarness)

    expect(wrapper.vm.shouldShow).toBe(false)
    expect(wrapper.vm.showFab).toBe(false)
  })

  it('hides prompt on profile edit route', async () => {
    setTrainerUser()
    routePath.value = '/painel/perfil'
    const wrapper = await mountSuspended(TestHarness)

    expect(wrapper.vm.shouldShow).toBe(false)
    expect(wrapper.vm.showFab).toBe(false)
  })

  it('shows fab when minimized', async () => {
    setTrainerUser()
    minimizedState.value = true
    const wrapper = await mountSuspended(TestHarness)

    expect(wrapper.vm.shouldShow).toBe(false)
    expect(wrapper.vm.showFab).toBe(true)
  })

  it('minimize and expand toggle minimized state', async () => {
    setTrainerUser()
    const wrapper = await mountSuspended(TestHarness)

    wrapper.vm.minimize()
    await wrapper.vm.$nextTick()
    expect(minimizedState.value).toBe(true)

    wrapper.vm.expand()
    await wrapper.vm.$nextTick()
    expect(minimizedState.value).toBe(false)
  })
})
