import { describe, it, expect } from 'vitest'
import { mountFT } from '@tests/helpers/mount-ft'
import FTErrorState from './FTErrorState.vue'


describe('FTErrorState', () => {
  it('renders', () => {
    const wrapper = mountFT(FTErrorState, { props: {"message":"Não foi possível carregar."} })
    expect(wrapper.exists()).toBe(true)
  })
})
