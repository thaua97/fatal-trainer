import { describe, it, expect } from 'vitest'
import { mountFT } from '@tests/helpers/mount-ft'
import FTAdminRecentAccessList from './FTAdminRecentAccessList.vue'

describe('FTAdminRecentAccessList', () => {
  it('renders empty state', () => {
    const wrapper = mountFT(FTAdminRecentAccessList, {
      props: {
        items: [],
        roleLabel: { student: 'Aluno', 'personal-trainer': 'Personal', admin: 'Admin' },
      },
    })
    expect(wrapper.find('[data-testid="admin-recent-access-list"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Nenhum acesso recente')
  })

  it('renders access items', () => {
    const wrapper = mountFT(FTAdminRecentAccessList, {
      props: {
        items: [{
          id: '1',
          targetUserId: 'u1',
          targetName: 'Carlos Personal',
          targetRole: 'personal-trainer',
          accessedAt: new Date().toISOString(),
        }],
        roleLabel: { student: 'Aluno', 'personal-trainer': 'Personal', admin: 'Admin' },
      },
    })
    expect(wrapper.text()).toContain('Carlos Personal')
  })
})
