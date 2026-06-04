import { describe, it, expect } from 'vitest'
import { mountFT } from '../../../../../tests/helpers/mount-ft'
import FTEmptyState from './FTEmptyState.vue'


describe('FTEmptyState', () => {
  it('renders', () => {
    const wrapper = mountFT(FTEmptyState, { props: {"title":"Nenhum resultado","variant":"search"} })
    expect(wrapper.exists()).toBe(true)
  })
})
