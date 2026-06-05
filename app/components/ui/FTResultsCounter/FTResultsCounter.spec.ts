import { describe, it, expect } from 'vitest'
import { mountFT } from '@tests/helpers/mount-ft'
import FTResultsCounter from './FTResultsCounter.vue'


describe('FTResultsCounter', () => {
  it('renders', () => {
    const wrapper = mountFT(FTResultsCounter, { props: {"total":42} })
    expect(wrapper.exists()).toBe(true)
  })
})
