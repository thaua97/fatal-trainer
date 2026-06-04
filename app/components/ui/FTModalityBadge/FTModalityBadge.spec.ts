import { describe, it, expect } from 'vitest'
import { mountFT } from '../../../../tests/helpers/mount-ft'
import FTModalityBadge from './FTModalityBadge.vue'


describe('FTModalityBadge', () => {
  it('renders', () => {
    const wrapper = mountFT(FTModalityBadge, { props: {"modality":"presencial"} })
    expect(wrapper.exists()).toBe(true)
  })
})
