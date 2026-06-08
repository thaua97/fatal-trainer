import { describe, it, expect } from 'vitest'
import { mountFT } from '@tests/helpers/mount-ft'
import FTProfileLocationRow from './FTProfileLocationRow.vue'
import { mockTrainer } from '@tests/helpers/mock-trainer'

describe('FTProfileLocationRow', () => {
  it('renders location text without avatar or report button', () => {
    const wrapper = mountFT(FTProfileLocationRow, {
      props: { trainer: mockTrainer({ city: 'São Paulo', state: 'SP', id: 'trainer-001' }) },
      global: {
        stubs: {
          FTProfileSection: {
            template: '<div><slot /></div>',
          },
        },
      },
    })

    expect(wrapper.text()).toContain('Personal Trainer')
    expect(wrapper.text()).toContain('São Paulo, SP')
    expect(wrapper.findComponent({ name: 'FTAvatar' }).exists()).toBe(false)
    expect(wrapper.find('[data-testid="profile-location-report-button"]').exists()).toBe(false)
  })
})
