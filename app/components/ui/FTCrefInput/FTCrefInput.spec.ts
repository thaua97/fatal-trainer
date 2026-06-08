import { describe, it, expect } from 'vitest'
import { mountFT } from '@tests/helpers/mount-ft'
import FTCrefInput from './FTCrefInput.vue'

describe('FTCrefInput', () => {
  it('renders', () => {
    const wrapper = mountFT(FTCrefInput, { props: { modelValue: '' } })
    expect(wrapper.exists()).toBe(true)
  })

  it('formats cref on input', async () => {
    const wrapper = mountFT(FTCrefInput, { props: { modelValue: '' } })
    const input = wrapper.find('input')
    await input.setValue('123456GSP')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['123456-G/SP'])
  })
})
