// @vitest-environment nuxt
import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { mockTrainer } from '@tests/helpers/mock-trainer'
import FTProfileEditHeader from './FTProfileEditHeader.vue'

describe('FTProfileEditHeader', () => {
  it('renders profile-shaped edit layout', async () => {
    const wrapper = await mountSuspended(FTProfileEditHeader, {
      props: { trainer: mockTrainer() },
      route: '/painel/perfil',
    })

    expect(wrapper.find('[data-testid="profile-edit-hero"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="profile-edit-location"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="trainer-info-submit"]').exists()).toBe(true)
  })
})
