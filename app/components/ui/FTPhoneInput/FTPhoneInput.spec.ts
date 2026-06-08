import { describe, it, expect } from 'vitest'
import { mountFT } from '@tests/helpers/mount-ft'
import FTPhoneInput from './FTPhoneInput.vue'

describe('FTPhoneInput', () => {
  it('renders', () => {
    const wrapper = mountFT(FTPhoneInput, { props: { modelValue: '' } })
    expect(wrapper.exists()).toBe(true)
  })

  it('formats phone on input', async () => {
    const wrapper = mountFT(FTPhoneInput, { props: { modelValue: '' } })
    const input = wrapper.find('input')
    await input.setValue('11999998888')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['(11) 99999-8888'])
  })
})
