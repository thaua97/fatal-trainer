import { describe, it, expect } from 'vitest'
import { mountFT } from '@tests/helpers/mount-ft'
import FTAdminUsersTableView from './FTAdminUsersTableView.vue'

const roleLabel = {
  student: 'Aluno',
  'personal-trainer': 'Personal',
  admin: 'Admin',
}

const items = [{
  id: '1',
  name: 'Carlos Personal',
  email: 'personal@fataltrainer.com',
  role: 'personal-trainer' as const,
  phoneNumber: '53991625225',
  city: 'Pelotas',
  state: 'RS',
  servicePrice: 100,
  isActive: true,
  featured: false,
  createdAt: '2026-06-06T00:00:00.000Z',
}]

describe('FTAdminUsersTableView', () => {
  it('renders table with user data', () => {
    const wrapper = mountFT(FTAdminUsersTableView, {
      props: { items, roleLabel },
    })
    expect(wrapper.find('[data-testid="admin-users-table-view"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Carlos Personal')
    expect(wrapper.text()).toContain('Pelotas, RS')
    expect(wrapper.text()).toContain('personal@fataltrainer.com')
    expect(wrapper.text()).not.toContain('por sessão')
  })
})
