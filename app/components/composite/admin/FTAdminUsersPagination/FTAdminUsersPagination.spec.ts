import { describe, it, expect } from 'vitest'
import { mountFT } from '@tests/helpers/mount-ft'
import FTAdminUsersPagination from './FTAdminUsersPagination.vue'

describe('FTAdminUsersPagination', () => {
  it('renders range summary and pagination controls', () => {
    const wrapper = mountFT(FTAdminUsersPagination, {
      props: {
        page: 2,
        total: 45,
        pageSize: 10,
      },
    })

    expect(wrapper.find('[data-testid="admin-users-pagination"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Mostrando 11–20 de 45 usuários')
  })

  it('hides page controls when there is only one page', () => {
    const wrapper = mountFT(FTAdminUsersPagination, {
      props: {
        page: 1,
        total: 8,
        pageSize: 10,
      },
    })

    expect(wrapper.text()).toContain('Mostrando 1–8 de 8 usuários')
    expect(wrapper.find('[data-slot="list"]').exists()).toBe(false)
  })
})
