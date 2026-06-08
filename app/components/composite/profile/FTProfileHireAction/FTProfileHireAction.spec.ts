import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mountFT } from '@tests/helpers/mount-ft'
import FTProfileHireAction from './FTProfileHireAction.vue'

describe('FTProfileHireAction', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders hire button when trainer can be hired', () => {
    const wrapper = mountFT(FTProfileHireAction, {
      props: {
        label: 'Contratar personal',
        testId: 'trainer-profile-hire-button',
        unavailableReason: null,
      },
    })

    expect(wrapper.find('[data-testid="trainer-profile-hire-button"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="trainer-profile-hire-button-no-phone-alert"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="trainer-profile-hire-button-inactive-alert"]').exists()).toBe(false)
  })

  it('renders no-phone alert when contact is unavailable', () => {
    const wrapper = mountFT(FTProfileHireAction, {
      props: {
        label: 'Contratar personal',
        testId: 'trainer-profile-hire-button',
        unavailableReason: 'noPhone',
      },
    })

    const alert = wrapper.find('[data-testid="trainer-profile-hire-button-no-phone-alert"]')
    expect(alert.exists()).toBe(true)
    expect(alert.attributes('data-testid')).toBe('trainer-profile-hire-button-no-phone-alert')
    expect(wrapper.find('[data-testid="trainer-profile-hire-button"]').exists()).toBe(false)
  })

  it('renders inactive alert when trainer is deactivated', () => {
    const wrapper = mountFT(FTProfileHireAction, {
      props: {
        label: 'Contratar personal',
        testId: 'trainer-profile-hire-button',
        unavailableReason: 'inactive',
      },
    })

    const alert = wrapper.find('[data-testid="trainer-profile-hire-button-inactive-alert"]')
    expect(alert.exists()).toBe(true)
    expect(alert.attributes('data-testid')).toBe('trainer-profile-hire-button-inactive-alert')
    expect(wrapper.find('[data-testid="trainer-profile-hire-button"]').exists()).toBe(false)
  })

  it('emits click when hire button is clicked', async () => {
    const wrapper = mountFT(FTProfileHireAction, {
      props: {
        label: 'Contratar personal',
        testId: 'trainer-profile-hire-button',
        unavailableReason: null,
      },
    })

    await wrapper.find('[data-testid="trainer-profile-hire-button"]').trigger('click')

    expect(wrapper.emitted('click')).toHaveLength(1)
  })
})
