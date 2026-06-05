import { describe, expect, it } from 'vitest'
import { mountFT } from '@tests/helpers/mount-ft'
import FTPromoBadge from './FTPromoBadge.vue'

describe('FTPromoBadge', () => {
  it('renders discount percent', () => {
    const wrapper = mountFT(FTPromoBadge, { props: { percent: 25 } })
    expect(wrapper.text()).toBe('-25%')
  })

  it('renders custom label', () => {
    const wrapper = mountFT(FTPromoBadge, { props: { label: 'Primeira sessão' } })
    expect(wrapper.text()).toBe('Primeira sessão')
  })

  it('prefers custom label over percent', () => {
    const wrapper = mountFT(FTPromoBadge, {
      props: { label: 'Oferta', percent: 20 },
    })

    expect(wrapper.text()).toBe('Oferta')
  })

  it('uses promo badge styles', () => {
    const wrapper = mountFT(FTPromoBadge, { props: { percent: 10 } })
    const badge = wrapper.get('[data-testid="promo-badge"]')

    expect(badge.classes().some((className) => className.includes('badge'))).toBe(true)
  })
})
