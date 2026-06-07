import { describe, it, expect } from 'vitest'
import { mountFT } from '@tests/helpers/mount-ft'
import FTAdminUserRowActions from './FTAdminUserRowActions.vue'

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
  it('renders action container', () => {
    const wrapper = mountFT(FTAdminUserRowActions, { props: { user } })
    expect(wrapper.find('[data-testid="admin-user-row-actions"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Acessar como')
  })
})
