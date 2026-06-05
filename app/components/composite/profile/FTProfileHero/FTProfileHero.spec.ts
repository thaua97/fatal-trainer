import { describe, expect, it } from 'vitest'
import { mountFT } from '@tests/helpers/mount-ft'
import FTProfileHero from './FTProfileHero.vue'
import { mockPromoTrainer, mockTrainer } from '@tests/helpers/mock-trainer'

describe('FTProfileHero', () => {
  it('renders trainer name and standard price', () => {
    const wrapper = mountFT(FTProfileHero, {
      props: { trainer: mockTrainer() },
      global: {
        stubs: {
          FTIconButton: true,
          FTRatingBadge: true,
        },
      },
    })

    expect(wrapper.text()).toContain('Ana Silva')
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
})
