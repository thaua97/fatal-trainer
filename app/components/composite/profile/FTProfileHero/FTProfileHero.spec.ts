import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { ref } from 'vue'
import { mountFT } from '@tests/helpers/mount-ft'
import FTProfileHero from './FTProfileHero.vue'
import FTIconButton from '../../../ui/FTIconButton/FTIconButton.vue'
import { mockPromoTrainer, mockTrainer } from '@tests/helpers/mock-trainer'

const mockToggle = vi.fn()

vi.mock('../../../../composables/components/useFTFavoriteTrainer', () => ({
  useFTFavoriteTrainer: () => ({
    isFavorited: ref(false),
    toggle: mockToggle,
    pending: ref(false),
  }),
}))

describe('FTProfileHero', () => {
  beforeEach(() => {
    vi.stubGlobal('open', vi.fn())
    mockToggle.mockReset()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
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

  it('opens WhatsApp when message button is clicked', async () => {
    const wrapper = mountFT(FTProfileHero, {
      props: { trainer: mockTrainer() },
      global: {
        stubs: {
          FTRatingBadge: true,
        },
      },
    })

    const buttons = wrapper.findAll('[data-testid="profile-message-button"]')
    expect(buttons).toHaveLength(2)

    await buttons[0]!.trigger('click')

    expect(window.open).toHaveBeenCalledWith(
      expect.stringContaining('https://wa.me/5511999998888?text='),
      '_blank',
      'noopener,noreferrer',
    )
  })

  it('disables message button when trainer has no phone', () => {
    const wrapper = mountFT(FTProfileHero, {
      props: { trainer: mockTrainer({ contactPhone: undefined }) },
      global: {
        stubs: {
          FTRatingBadge: true,
        },
      },
    })

    const buttons = wrapper.findAll('[data-testid="profile-message-button"]')
    expect(buttons[0]!.attributes('disabled')).toBeDefined()
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
