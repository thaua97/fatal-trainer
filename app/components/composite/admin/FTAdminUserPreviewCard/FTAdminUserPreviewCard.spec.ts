import { describe, it, expect } from 'vitest'
import { mountFT } from '@tests/helpers/mount-ft'
import FTAdminUserPreviewCard from './FTAdminUserPreviewCard.vue'

describe('FTAdminUserPreviewCard', () => {
  it('renders user details', () => {
    const wrapper = mountFT(FTAdminUserPreviewCard, {
      props: {
        user: {
          id: '1',
          name: 'Carlos Personal',
          email: 'personal@fataltrainer.com',
          role: 'personal-trainer',
          phoneNumber: '53991625225',
          city: 'Pelotas',
          state: 'RS',
          servicePrice: 100,
          isActive: true,
          featured: false,
          createdAt: '2026-06-06T00:00:00.000Z',
        },
        roleLabel: 'Personal',
        x: 100,
        y: 100,
      },
    })
    expect(wrapper.text()).toContain('Carlos Personal')
    expect(wrapper.text()).toContain('Pelotas, RS')
    expect(wrapper.text()).toContain('R$')
    expect(wrapper.text()).not.toContain('NaN')
  })
})
