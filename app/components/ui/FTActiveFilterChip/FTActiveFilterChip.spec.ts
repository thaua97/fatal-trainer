import { describe, it, expect } from 'vitest'
import { mountFT } from '../../../../tests/helpers/mount-ft'
import FTActiveFilterChip from './FTActiveFilterChip.vue'


describe('FTActiveFilterChip', () => {
  it('renders', () => {
    const wrapper = mountFT(FTActiveFilterChip, { props: {"label":"Funcional"} })
    expect(wrapper.exists()).toBe(true)
  })
})
