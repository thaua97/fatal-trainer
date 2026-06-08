import { defineComponent } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { mountFT } from '@tests/helpers/mount-ft'
import { useAuthRedirect } from '~/composables/auth/useAuthRedirect'

const { useRouteMock } = vi.hoisted(() => ({
  useRouteMock: vi.fn(),
}))

mockNuxtImport('useRoute', () => useRouteMock)

const TestHarness = defineComponent({
  setup() {
    return useAuthRedirect()
  },
  template: '<div />',
})

describe('useAuthRedirect', () => {
  beforeEach(() => {
    useRouteMock.mockReset()
  })

  it('uses redirect query when present', () => {
    useRouteMock.mockReturnValue({
      path: '/login',
      fullPath: '/login?redirect=%2Fpersonal-trainers%2Fabc',
      query: { redirect: '/personal-trainers/abc' },
    })

    const wrapper = mountFT(TestHarness)

    expect(wrapper.vm.redirectTarget).toBe('/personal-trainers/abc')
    expect(wrapper.vm.loginRoute).toEqual({
      path: '/login',
      query: { redirect: '/personal-trainers/abc' },
    })
    expect(wrapper.vm.registerRoute).toEqual({
      path: '/registro',
      query: { redirect: '/personal-trainers/abc' },
    })
  })

  it('uses current page as redirect outside auth pages', () => {
    useRouteMock.mockReturnValue({
      path: '/personal-trainers/abc',
      fullPath: '/personal-trainers/abc',
      query: {},
    })

    const wrapper = mountFT(TestHarness)

    expect(wrapper.vm.redirectTarget).toBe('/personal-trainers/abc')
    expect(wrapper.vm.loginRoute).toEqual({
      path: '/login',
      query: { redirect: '/personal-trainers/abc' },
    })
  })

  it('does not add redirect on auth pages without query', () => {
    useRouteMock.mockReturnValue({
      path: '/login',
      fullPath: '/login',
      query: {},
    })

    const wrapper = mountFT(TestHarness)

    expect(wrapper.vm.redirectTarget).toBeNull()
    expect(wrapper.vm.loginRoute).toEqual({ path: '/login' })
    expect(wrapper.vm.registerRoute).toEqual({ path: '/registro' })
  })
})
