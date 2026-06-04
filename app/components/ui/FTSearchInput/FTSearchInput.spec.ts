import { describe, it, expect } from 'vitest'
import { mountFT } from '../../../../tests/helpers/mount-ft'
import FTSearchInput from './FTSearchInput.vue'


describe('FTSearchInput', () => {
  it('renders', () => {
    const wrapper = mountFT(FTSearchInput, { props: {"modelValue":""} })
    expect(wrapper.exists()).toBe(true)
  })
})
