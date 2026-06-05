import { describe, it, expect } from 'vitest'
import { mountFT } from '@tests/helpers/mount-ft'
import FTStarRating from './FTStarRating.vue'


describe('FTStarRating', () => {
  it('renders', () => {
    const wrapper = mountFT(FTStarRating, { props: {"rating":4.9} })
    expect(wrapper.exists()).toBe(true)
  })
})
