import { computed } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mountFT } from '@tests/helpers/mount-ft'
import FTAdminUserRowActions from './FTAdminUserRowActions.vue'

const adminAuthState = vi.hoisted(() => {
  const { ref } = require('vue') as typeof import('vue')
  return {
    user: ref<{ id: string, name: string, email: string, role: 'admin', isActive: boolean } | null>(null),
  }
})

vi.mock('~/composables/admin/useAdminAuth', () => ({
  useAdminAuth: () => ({
    user: adminAuthState.user,
    isAdminAuthenticated: computed(() => adminAuthState.user.value?.role === 'admin'),
  }),
}))

const user = {
  id: '1',
  name: 'Carlos',
  email: 'carlos@test.com',
  role: 'personal-trainer' as const,
  isActive: true,
  featured: false,
  createdAt: '2026-06-06T00:00:00.000Z',
}

describe('FTAdminUserRowActions', () => {
  beforeEach(() => {
    adminAuthState.user.value = null
  })

  it('renders action container', () => {
    const wrapper = mountFT(FTAdminUserRowActions, { props: { user } })
    expect(wrapper.find('[data-testid="admin-user-row-actions"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Acessar como')
    expect(wrapper.find('[aria-label="Visualizar"]').exists()).toBe(true)
    expect(wrapper.find('[aria-label="Excluir usuário"]').exists()).toBe(true)
  })

  it('emits delete when trash button is clicked', async () => {
    const wrapper = mountFT(FTAdminUserRowActions, { props: { user } })
    await wrapper.find('[aria-label="Excluir usuário"]').trigger('click')
    expect(wrapper.emitted('delete')?.[0]).toEqual([user])
  })

  it('hides impersonate and delete actions for the signed-in admin', () => {
    adminAuthState.user.value = {
      id: 'admin-1',
      name: 'Admin Fatal',
      email: 'admin@test.com',
      role: 'admin',
      isActive: true,
    }

    const wrapper = mountFT(FTAdminUserRowActions, {
      props: { user: { ...user, id: 'admin-1', role: 'admin' } },
    })

    expect(wrapper.text()).not.toContain('Acessar como')
    expect(wrapper.find('[aria-label="Excluir usuário"]').exists()).toBe(false)
  })
})
