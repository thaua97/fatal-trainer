import { describe, it, expect } from 'vitest'
import { mountFT } from '@tests/helpers/mount-ft'
import FTAdminUsersToolbar from './FTAdminUsersToolbar.vue'

describe('FTAdminUsersToolbar', () => {
  it('renders toolbar with search', () => {
    const wrapper = mountFT(FTAdminUsersToolbar, {
      props: {
        viewMode: 'table',
        sortBy: 'createdAt',
        sortOrder: 'desc',
        query: { search: '', page: 1, pageSize: 20 },
        activeFilterCount: 0,
      },
    })
    expect(wrapper.find('[data-testid="admin-users-toolbar"]').exists()).toBe(true)
    expect(wrapper.find('input').exists()).toBe(true)
  })
})
