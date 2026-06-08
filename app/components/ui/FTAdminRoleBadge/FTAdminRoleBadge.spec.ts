import { describe, it, expect } from 'vitest'
import { mountFT } from '@tests/helpers/mount-ft'
import FTAdminRoleBadge from './FTAdminRoleBadge.vue'

describe('FTAdminRoleBadge', () => {
  it('renders role label', () => {
    const wrapper = mountFT(FTAdminRoleBadge, {
      props: { role: 'admin', label: 'Admin' },
    })
    expect(wrapper.text()).toContain('Admin')
  })

  it('applies admin tone', () => {
    const wrapper = mountFT(FTAdminRoleBadge, {
      props: { role: 'admin', label: 'Admin' },
    })
    expect(wrapper.find('[data-testid="admin-role-badge"]').classes().some(c => c.includes('admin'))).toBe(true)
  })
})
