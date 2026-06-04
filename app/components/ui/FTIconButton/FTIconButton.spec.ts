import { describe, it, expect } from 'vitest'
import { mountFT } from '../../../../tests/helpers/mount-ft'
import FTIconButton from './FTIconButton.vue'


describe('FTIconButton', () => {
  it('renders', () => {
    const wrapper = mountFT(FTIconButton, { props: {"ariaLabel":"Voltar"} })
    expect(wrapper.exists()).toBe(true)
  })
})
