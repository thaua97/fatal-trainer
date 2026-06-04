import { describe, it, expect } from 'vitest'
import { mountFT } from '../../../../tests/helpers/mount-ft'
import FTPriceLabel from './FTPriceLabel.vue'

describe('FTPriceLabel', () => {
  it('formats BRL price', () => {
    const wrapper = mountFT(FTPriceLabel, { props: { price: 120 } })
    expect(wrapper.text()).toMatch(/R\$/)
    expect(wrapper.text()).toContain('por sessão')
  })
})
