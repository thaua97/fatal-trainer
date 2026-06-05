import { describe, it, expect } from 'vitest'
import { mountFT } from '@tests/helpers/mount-ft'
import FTProfileSection from './FTProfileSection.vue'


describe('FTProfileSection', () => {
  it('renders', () => {
    const wrapper = mountFT(FTProfileSection, { props: {"title":"Sobre"} })
    expect(wrapper.exists()).toBe(true)
  })
})
