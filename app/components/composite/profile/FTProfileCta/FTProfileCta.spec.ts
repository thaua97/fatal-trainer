import { describe, expect, it, vi, beforeEach } from 'vitest'
import { computed, ref } from 'vue'
import { mountFT } from '@tests/helpers/mount-ft'
import FTProfileCta from './FTProfileCta.vue'
import { mockPromoTrainer, mockTrainer } from '@tests/helpers/mock-trainer'

const mockOpenModal = vi.fn()
const mockHireUnavailableReason = ref<'inactive' | 'noPhone' | null>(null)

vi.mock('~/composables/components/useFTProfileCta', () => ({
  useFTProfileCta: () => ({
    label: 'Contratar personal',
    openModal: mockOpenModal,
    canHire: computed(() => mockHireUnavailableReason.value === null),
    hireUnavailableReason: mockHireUnavailableReason,
  }),
}))

describe('FTProfileCta', () => {
  beforeEach(() => {
    mockOpenModal.mockReset()
    mockHireUnavailableReason.value = null
  })

  it('renders hire button', () => {
    const wrapper = mountFT(FTProfileCta, {
      props: { trainer: mockTrainer() },
    })

    expect(wrapper.find('[data-testid="trainer-profile-cta"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="trainer-profile-hire-button"]').exists()).toBe(true)
  })

  it('opens hire modal when button is clicked', async () => {
    mockOpenModal.mockReset()

    const wrapper = mountFT(FTProfileCta, {
      props: { trainer: mockTrainer() },
    })

    await wrapper.find('[data-testid="trainer-profile-hire-button"]').trigger('click')

    expect(mockOpenModal).toHaveBeenCalled()
  })

  it('shows promotional price above cta when trainer is on promotion', () => {
    const wrapper = mountFT(FTProfileCta, {
      props: { trainer: mockPromoTrainer() },
    })

    expect(wrapper.find('[data-testid="promo-badge"]').exists()).toBe(true)
  })

  it('shows no-phone alert when trainer has no contact phone', () => {
    mockHireUnavailableReason.value = 'noPhone'

    const wrapper = mountFT(FTProfileCta, {
      props: { trainer: mockTrainer({ contactPhone: undefined }) },
    })

    expect(wrapper.find('[data-testid="trainer-profile-hire-button-no-phone-alert"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="trainer-profile-hire-button"]').exists()).toBe(false)
  })

  it('shows inactive alert when trainer is deactivated', () => {
    mockHireUnavailableReason.value = 'inactive'

    const wrapper = mountFT(FTProfileCta, {
      props: { trainer: mockTrainer({ isActive: false }) },
    })

    expect(wrapper.find('[data-testid="trainer-profile-hire-button-inactive-alert"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="trainer-profile-hire-button"]').exists()).toBe(false)
  })
})
