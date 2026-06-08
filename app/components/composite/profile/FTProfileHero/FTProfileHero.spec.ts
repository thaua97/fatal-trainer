import { describe, expect, it, vi, beforeEach } from 'vitest'
import { computed, ref } from 'vue'
import { mountFT } from '@tests/helpers/mount-ft'
import FTProfileHero from './FTProfileHero.vue'
import FTIconButton from '../../../ui/FTIconButton/FTIconButton.vue'
import { mockPromoTrainer, mockTrainer } from '@tests/helpers/mock-trainer'

const mockToggle = vi.fn()
const mockOpenHireModal = vi.fn()
const mockHireUnavailableReason = ref<'inactive' | 'noPhone' | null>(null)

vi.mock('../../../../composables/components/useFTFavoriteTrainer', () => ({
  useFTFavoriteTrainer: () => ({
    isFavorited: ref(false),
    toggle: mockToggle,
    pending: ref(false),
  }),
}))

vi.mock('../../../../composables/components/useFTProfileCta', () => ({
  useFTProfileCta: () => ({
    label: 'Contratar personal',
    openModal: mockOpenHireModal,
    canHire: computed(() => mockHireUnavailableReason.value === null),
    hireUnavailableReason: mockHireUnavailableReason,
  }),
}))

describe('FTProfileHero', () => {
  beforeEach(() => {
    mockToggle.mockReset()
    mockOpenHireModal.mockReset()
    mockHireUnavailableReason.value = null
  })

  it('renders trainer name and standard price', () => {
    const wrapper = mountFT(FTProfileHero, {
      props: { trainer: mockTrainer({ servicePrice: 120 }) },
      global: {
        stubs: {
          FTIconButton: true,
          FTRatingBadge: true,
        },
      },
    })

    expect(wrapper.text()).toContain('Ana Silva')
    expect(wrapper.text()).toMatch(/R\$\s*120,00/)
    expect(wrapper.text()).toMatch(/R\$\s*960,00/)
    expect(wrapper.text()).toContain('Por sessão')
    expect(wrapper.text()).toContain('Por mês')
    expect(wrapper.text()).toContain('8 sessões inclusas')
    expect(wrapper.find('[data-testid="promo-badge"]').exists()).toBe(false)
  })

  it('renders promotion details when trainer is on promotion', () => {
    const wrapper = mountFT(FTProfileHero, {
      props: { trainer: mockPromoTrainer() },
      global: {
        stubs: {
          FTIconButton: true,
          FTRatingBadge: true,
        },
      },
    })

    expect(wrapper.find('[data-testid="promo-badge"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Primeira sessão')
    expect(wrapper.text()).toContain('Válido até')
  })

  it('does not render WhatsApp message buttons', () => {
    const wrapper = mountFT(FTProfileHero, {
      props: { trainer: mockTrainer() },
      global: {
        stubs: {
          FTIconButton: true,
          FTRatingBadge: true,
        },
      },
    })

    expect(wrapper.find('[data-testid="profile-message-button"]').exists()).toBe(false)
  })

  it('opens hire modal when desktop hire button is clicked', async () => {
    const wrapper = mountFT(FTProfileHero, {
      props: { trainer: mockTrainer() },
      global: {
        stubs: {
          FTRatingBadge: true,
        },
      },
    })

    await wrapper.find('[data-testid="trainer-profile-hire-button-desktop"]').trigger('click')

    expect(mockOpenHireModal).toHaveBeenCalled()
  })

  it('shows no-phone alert on desktop when trainer has no contact phone', () => {
    mockHireUnavailableReason.value = 'noPhone'

    const wrapper = mountFT(FTProfileHero, {
      props: { trainer: mockTrainer({ contactPhone: undefined }) },
      global: {
        stubs: {
          FTRatingBadge: true,
        },
      },
    })

    expect(wrapper.find('[data-testid="trainer-profile-hire-button-desktop-no-phone-alert"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="trainer-profile-hire-button-desktop"]').exists()).toBe(false)
  })

  it('shows inactive alert on desktop when trainer is deactivated', () => {
    mockHireUnavailableReason.value = 'inactive'

    const wrapper = mountFT(FTProfileHero, {
      props: { trainer: mockTrainer({ isActive: false }) },
      global: {
        stubs: {
          FTRatingBadge: true,
        },
      },
    })

    expect(wrapper.find('[data-testid="trainer-profile-hire-button-desktop-inactive-alert"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="trainer-profile-hire-button-desktop"]').exists()).toBe(false)
  })

  it('calls toggle when favorite button is clicked', async () => {
    const wrapper = mountFT(FTProfileHero, {
      props: { trainer: mockTrainer() },
      global: {
        stubs: {
          FTRatingBadge: true,
        },
      },
    })

    const buttons = wrapper.findAll('[data-testid="profile-favorite-button"]')
    expect(buttons).toHaveLength(2)

    await buttons[0]!.trigger('click')
    expect(mockToggle).toHaveBeenCalledOnce()
  })

  it('links report button to denuncia page with trainer pre-selected', () => {
    const trainer = mockTrainer({ id: 'trainer-001' })
    const wrapper = mountFT(FTProfileHero, {
      props: { trainer },
      global: {
        stubs: {
          FTRatingBadge: true,
        },
      },
    })

    const reportButtons = wrapper.findAllComponents(FTIconButton).filter(
      (button) => typeof button.props('to') === 'string' && button.props('to').includes('denuncia'),
    )
    expect(reportButtons).toHaveLength(2)
    expect(reportButtons[0]!.props('to')).toBe('/denuncia?trainer=trainer-001')
  })
})
