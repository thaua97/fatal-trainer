import { describe, it, expect } from 'vitest'
import { mountFT } from '@tests/helpers/mount-ft'
import FTRatingBadge from './FTRatingBadge.vue'


describe('FTRatingBadge', () => {
  it('renders', () => {
    const wrapper = mountFT(FTRatingBadge, { props: {"rating":4.8,"reviewCount":42} })
    expect(wrapper.exists()).toBe(true)
  })
})
