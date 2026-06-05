import { describe, expect, it } from 'vitest'
import { mountFT } from '@tests/helpers/mount-ft'
import FTPriceLabel from './FTPriceLabel.vue'

describe('FTPriceLabel', () => {
  it('formats BRL price', () => {
    const wrapper = mountFT(FTPriceLabel, { props: { price: 120 } })
    expect(wrapper.text()).toMatch(/R\$/)
    expect(wrapper.text()).toContain('por sessão')
  })

  it('shows monthly period label when priceView is monthly', () => {
    const wrapper = mountFT(FTPriceLabel, {
      props: { price: 960, priceView: 'monthly' },
    })

    expect(wrapper.text()).toContain('por mês')
  })

  it('shows promotional pricing with discount badge', () => {
    const wrapper = mountFT(FTPriceLabel, {
      props: {
        price: 200,
        promoPrice: 150,
        showDiscount: true,
      },
    })

    expect(wrapper.text()).toContain('R$')
    expect(wrapper.find('[data-testid="promo-badge"]').exists()).toBe(true)
    expect(wrapper.find('[class*="promoPrice"]').exists()).toBe(true)
  })

  it('keeps standard price styling without promotion', () => {
    const wrapper = mountFT(FTPriceLabel, { props: { price: 120 } })

    expect(wrapper.find('[class*="promoPrice"]').exists()).toBe(false)
    expect(wrapper.find('.text-violet-600').exists()).toBe(true)
  })
})
