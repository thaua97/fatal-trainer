import { describe, it, expect } from 'vitest'
import { mountFT } from '@tests/helpers/mount-ft'
import FTAdminUsersListView from './FTAdminUsersListView.vue'

const roleLabel = {
  student: 'Aluno',
  'personal-trainer': 'Personal',
  admin: 'Admin',
}

describe('FTAdminUsersListView', () => {
  it('renders list cards', () => {
    const wrapper = mountFT(FTAdminUsersListView, {
      props: {
        items: [{
          id: '1',
          name: 'Ana Aluno',
          email: 'ana@test.com',
          role: 'student',
          isActive: true,
          featured: false,
          createdAt: '2026-06-06T00:00:00.000Z',
        }],
        roleLabel,
      },
    })
    expect(wrapper.find('[data-testid="admin-users-list-view"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Ana Aluno')
  })
})
