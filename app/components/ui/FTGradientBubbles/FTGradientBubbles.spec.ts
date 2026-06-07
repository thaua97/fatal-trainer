import { describe, it, expect } from 'vitest'
import { mountFT } from '@tests/helpers/mount-ft'
import FTGradientBubbles from './FTGradientBubbles.vue'


describe('FTGradientBubbles', () => {
  it('renders', () => {
    const wrapper = mountFT(FTGradientBubbles, { props: {} })
    expect(wrapper.find('[data-testid="gradient-bubbles"]').exists()).toBe(true)
  })
})
