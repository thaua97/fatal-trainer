import { describe, it, expect } from 'vitest'
import { mountFT } from '@tests/helpers/mount-ft'
import FTSectionHeading from './FTSectionHeading.vue'


describe('FTSectionHeading', () => {
  it('renders', () => {
    const wrapper = mountFT(FTSectionHeading, { props: {} })
    expect(wrapper.exists()).toBe(true)
  })
})
