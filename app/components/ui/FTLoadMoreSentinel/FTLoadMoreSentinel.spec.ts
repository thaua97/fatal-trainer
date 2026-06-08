import { describe, it, expect } from 'vitest'
import { mountFT } from '@tests/helpers/mount-ft'
import FTLoadMoreSentinel from './FTLoadMoreSentinel.vue'


describe('FTLoadMoreSentinel', () => {
  it('renders', () => {
    const wrapper = mountFT(FTLoadMoreSentinel, { props: {"loading":true,"hasMore":true} })
    expect(wrapper.exists()).toBe(true)
  })
})
