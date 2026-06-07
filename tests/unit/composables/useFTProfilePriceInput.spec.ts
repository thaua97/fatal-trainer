import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import { SESSIONS_PER_MONTH } from '#shared/domain/catalog/services/trainer-pricing'
import { useFTProfilePriceInput } from '~/composables/components/useFTProfilePriceInput'

describe('useFTProfilePriceInput', () => {
  it('shows session price by default', () => {
    const servicePrice = ref(100)
    const { displayPrice, priceView } = useFTProfilePriceInput(servicePrice)

    expect(priceView.value).toBe('session')
    expect(displayPrice.value).toBe(100)
  })

  it('converts to monthly view for display', () => {
    const servicePrice = ref(100)
    const { displayPrice, selectPriceView } = useFTProfilePriceInput(servicePrice)

    selectPriceView('monthly')

    expect(displayPrice.value).toBe(100 * SESSIONS_PER_MONTH)
  })

  it('converts monthly input back to session price', () => {
    const servicePrice = ref(100)
    const { displayPrice, selectPriceView } = useFTProfilePriceInput(servicePrice)

    selectPriceView('monthly')
    displayPrice.value = 800

    expect(servicePrice.value).toBe(100)
  })

  it('keeps session price when editing in session view', () => {
    const servicePrice = ref(100)
    const { displayPrice } = useFTProfilePriceInput(servicePrice)

    displayPrice.value = 150

    expect(servicePrice.value).toBe(150)
  })
})
