import { describe, expect, it } from 'vitest'
import { mountFT } from '@tests/helpers/mount-ft'
import FTServicePricing from './FTServicePricing.vue'

describe('FTServicePricing', () => {
  it('renders session and monthly prices', () => {
    const wrapper = mountFT(FTServicePricing, {
      props: {
        sessionPrice: 120,
        monthlyPrice: 960,
      },
    })

    expect(wrapper.find('[data-testid="service-pricing-session"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="service-pricing-monthly"]').exists()).toBe(true)
    expect(wrapper.text()).toMatch(/R\$\s*120,00/)
    expect(wrapper.text()).toMatch(/R\$\s*960,00/)
    expect(wrapper.text()).toContain('Por sessão')
    expect(wrapper.text()).toContain('Por mês')
    expect(wrapper.text()).toContain('8 sessões inclusas')
  })

  it('shows promotional pricing with footer note', () => {
    const wrapper = mountFT(FTServicePricing, {
      props: {
        sessionPrice: 200,
        sessionPromoPrice: 150,
        monthlyPrice: 1600,
        monthlyPromoPrice: 1200,
        discountPercent: 25,
        promotionLabel: 'Primeira sessão',
        promotionValidity: 'Válido até 30/06',
      },
    })

    expect(wrapper.find('[data-testid="promo-badge"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Primeira sessão')
    expect(wrapper.text()).toContain('Válido até 30/06')
  })
})
