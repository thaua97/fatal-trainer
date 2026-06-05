import { describe, it, expect } from 'vitest'
import { mountFT } from '@tests/helpers/mount-ft'
import FTDistanceLabel from './FTDistanceLabel.vue'


describe('FTDistanceLabel', () => {
  it('renders', () => {
    const wrapper = mountFT(FTDistanceLabel, { props: {"distanceKm":2.3} })
    expect(wrapper.exists()).toBe(true)
  })
})
