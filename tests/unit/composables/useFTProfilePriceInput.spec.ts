import { defineComponent, ref } from 'vue'
import { describe, expect, it } from 'vitest'
import { mountFT } from '@tests/helpers/mount-ft'
import { SESSIONS_PER_MONTH } from '#shared/domain/catalog/services/trainer-pricing'
import { useFTProfilePriceInput } from '~/composables/components/useFTProfilePriceInput'

function mountPriceInput(initialPrice = 100) {
  const servicePrice = ref(initialPrice)

  const Harness = defineComponent({
    setup() {
      return {
        servicePrice,
        ...useFTProfilePriceInput(servicePrice),
      }
    },
    template: '<div />',
  })

  const wrapper = mountFT(Harness)

  return { wrapper, servicePrice }
}

describe('useFTProfilePriceInput', () => {
  it('shows session price by default', () => {
    const { wrapper } = mountPriceInput(100)

    expect(wrapper.vm.priceView).toBe('session')
    expect(wrapper.vm.displayPrice).toBe(100)
  })

  it('converts to monthly view for display', () => {
    const { wrapper } = mountPriceInput(100)

    wrapper.vm.selectPriceView('monthly')

    expect(wrapper.vm.displayPrice).toBe(100 * SESSIONS_PER_MONTH)
  })

  it('converts monthly input back to session price', () => {
    const { wrapper, servicePrice } = mountPriceInput(100)

    wrapper.vm.selectPriceView('monthly')
    wrapper.vm.displayPrice = 800

    expect(servicePrice.value).toBe(100)
  })

  it('keeps session price when editing in session view', () => {
    const { wrapper, servicePrice } = mountPriceInput(100)

    wrapper.vm.displayPrice = 150

    expect(servicePrice.value).toBe(150)
  })
})
