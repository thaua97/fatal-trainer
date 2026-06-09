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
    expect(wrapper.text()).toContain('Destaque')
    expect(wrapper.text()).not.toContain('por sessão')
  })

  it('wraps table in a scrollable container', () => {
    const wrapper = mountFT(FTAdminUsersTableView, {
      props: { items, roleLabel },
    })

    const scrollContainer = wrapper.find('.overflow-y-auto')
    expect(scrollContainer.exists()).toBe(true)
    expect(scrollContainer.classes()).toContain('max-h-[calc(100vh-18rem)]')
  })

  it('shows featured toggle only for personal trainers', () => {
    const wrapper = mountFT(FTAdminUsersTableView, {
      props: {
        items: [
          ...items,
          {
            id: '2',
            name: 'Ana Aluno',
            email: 'ana@test.com',
            role: 'student' as const,
            isActive: true,
            featured: false,
            createdAt: '2026-06-06T00:00:00.000Z',
          },
        ],
        roleLabel,
      },
    })

    const switches = wrapper.findAllComponents({ name: 'USwitch' })
    expect(switches).toHaveLength(3)
    expect(wrapper.emitted('toggleFeatured')).toBeUndefined()
  })
})
