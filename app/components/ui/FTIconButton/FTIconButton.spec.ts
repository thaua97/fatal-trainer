import { describe, it, expect } from 'vitest'
import { mountFT } from '@tests/helpers/mount-ft'
import FTIconButton from './FTIconButton.vue'

describe('FTIconButton', () => {
  it('renders neutral variant by default', () => {
    const wrapper = mountFT(FTIconButton, { props: { ariaLabel: 'Voltar' } })
    expect(wrapper.exists()).toBe(true)
  })

  it('applies whatsapp variant class', () => {
    const wrapper = mountFT(FTIconButton, {
      props: { ariaLabel: 'WhatsApp', variant: 'whatsapp' },
    })

    expect(wrapper.classes().some((className) => className.includes('whatsapp'))).toBe(true)
  })

  it('applies active favorite variant class', () => {
    const wrapper = mountFT(FTIconButton, {
      props: { ariaLabel: 'Favoritar', variant: 'favorite', active: true },
    })

    expect(wrapper.classes().some((className) => className.includes('favoriteActive'))).toBe(true)
  })
})
