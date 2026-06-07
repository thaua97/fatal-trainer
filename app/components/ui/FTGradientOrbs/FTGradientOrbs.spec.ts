import { describe, it, expect } from 'vitest'
import { mountFT } from '@tests/helpers/mount-ft'
import FTGradientOrbs from './FTGradientOrbs.vue'

describe('FTGradientOrbs', () => {
  it('renders decorative orbs', () => {
    const wrapper = mountFT(FTGradientOrbs)
    expect(wrapper.find('[data-testid="gradient-orbs"]').exists()).toBe(true)
  })

  it('applies panel variant by default', () => {
    const wrapper = mountFT(FTGradientOrbs)
    expect(wrapper.find('[data-testid="gradient-orbs"]').classes().some(c => c.includes('panel'))).toBe(true)
  })
})
