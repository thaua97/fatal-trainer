// @vitest-environment nuxt
import { computed, defineComponent, ref } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { useFTAdminUserActionConfirm } from '~/composables/admin/useFTAdminUserActionConfirm'
import type { AdminUserListItem } from '#shared/types/admin'

const adminAuthState = vi.hoisted(() => {
  const { ref } = require('vue') as typeof import('vue')
  return {
    user: ref<{ id: string } | null>(null),
  }
})

vi.mock('~/composables/admin/useAdminAuth', () => ({
  useAdminAuth: () => ({
    user: adminAuthState.user,
    isAdminAuthenticated: computed(() => adminAuthState.user.value !== null),
  }),
}))

const baseUser: AdminUserListItem = {
  id: 'user-1',
  name: 'Carlos',
  email: 'carlos@test.com',
  role: 'personal-trainer',
  isActive: true,
  featured: false,
  createdAt: '2026-06-06T00:00:00.000Z',
}

async function mountConfirmHook(actionPending = ref(false)) {
  let api!: ReturnType<typeof useFTAdminUserActionConfirm>

  const TestComponent = defineComponent({
    setup() {
      api = useFTAdminUserActionConfirm({
        updateUser: vi.fn(),
        toggleFeatured: vi.fn(),
        impersonate: vi.fn(),
        deleteUser: vi.fn(),
        actionPending,
      })
      return () => null
    },
  })

  await mountSuspended(TestComponent)
  return api
}

describe('useFTAdminUserActionConfirm', () => {
  beforeEach(() => {
    adminAuthState.user.value = null
  })

  it('opens deactivate confirmation when toggling active user', async () => {
    const { confirmOpen, pendingAction, requestToggleActive } = await mountConfirmHook()

    requestToggleActive(baseUser)

    expect(confirmOpen.value).toBe(true)
    expect(pendingAction.value?.action).toBe('deactivate')
    expect(pendingAction.value?.user.id).toBe('user-1')
  })

  it('opens feature confirmation for personal trainer', async () => {
    const { pendingAction, requestToggleFeatured } = await mountConfirmHook()

    requestToggleFeatured(baseUser)

    expect(pendingAction.value?.action).toBe('feature')
  })

  it('calls deleteUser on confirm delete', async () => {
    const actionPending = ref(false)
    const deleteUser = vi.fn().mockResolvedValue(undefined)
    let api!: ReturnType<typeof useFTAdminUserActionConfirm>

    const TestComponent = defineComponent({
      setup() {
        api = useFTAdminUserActionConfirm({
          updateUser: vi.fn(),
          toggleFeatured: vi.fn(),
          impersonate: vi.fn(),
          deleteUser,
          actionPending,
        })
        return () => null
      },
    })

    await mountSuspended(TestComponent)

    api.requestDelete(baseUser)
    await api.confirmAction()

    expect(deleteUser).toHaveBeenCalledWith('user-1')
    expect(api.confirmOpen.value).toBe(false)
    expect(api.pendingAction.value).toBeNull()
  })

  it('ignores delete and impersonate requests for the signed-in admin', async () => {
    adminAuthState.user.value = { id: 'admin-1' }
    const { confirmOpen, requestDelete, requestImpersonate } = await mountConfirmHook()

    requestDelete({ ...baseUser, id: 'admin-1', role: 'admin' })
    requestImpersonate({ ...baseUser, id: 'admin-1', role: 'admin' })

    expect(confirmOpen.value).toBe(false)
  })
})
