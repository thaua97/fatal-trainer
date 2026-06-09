import { describe, it, expect } from 'vitest'
import { mountFT } from '@tests/helpers/mount-ft'
import FTAdminUsersPagination from './FTAdminUsersPagination.vue'

describe('FTAdminUsersPagination', () => {
  it('renders range summary and pagination controls', () => {
    const wrapper = mountFT(FTAdminUsersPagination, {
      props: {
        page: 2,
        pageSize: 10,
        total: 45,
      },
    })

    expect(wrapper.find('[data-testid="admin-users-pagination"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Mostrando 11–20 de 45 usuários')
    expect(wrapper.find('[data-testid="admin-users-page-size"]').exists()).toBe(true)
  })

  it('hides page controls when there is only one page', () => {
    const wrapper = mountFT(FTAdminUsersPagination, {
      props: {
        page: 1,
        pageSize: 10,
        total: 8,
      },
    })

    expect(wrapper.text()).toContain('Mostrando 1–8 de 8 usuários')
    expect(wrapper.find('[data-slot="list"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="admin-users-page-size"]').exists()).toBe(true)
  })

  it('emits update:pageSize when page size changes', async () => {
    const wrapper = mountFT(FTAdminUsersPagination, {
      props: {
        page: 1,
        pageSize: 20,
        total: 45,
      },
    })

    await wrapper.setProps({ pageSize: 10 })

    expect(wrapper.props('pageSize')).toBe(10)
  })
})
