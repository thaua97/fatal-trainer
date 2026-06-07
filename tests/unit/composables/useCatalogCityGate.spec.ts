import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import { mountFT } from '@tests/helpers/mount-ft'
import { useCatalogCityGate } from '~/composables/catalog/useCatalogCityGate'
import { useTrainerFilters } from '~/composables/catalog/useTrainerFilters'
import { mockTrainerFiltersState, mockUpdateTrainerFilters, mockUseTrainerFilters, resetMockTrainerFilters } from '@tests/helpers/mock-trainer-filters'

vi.mock('../../../app/composables/catalog/useTrainerFilters', () => ({
  useTrainerFilters: () => mockUseTrainerFilters(),
}))

const Harness = defineComponent({
  setup() {
    return useCatalogCityGate()
  },
  template: '<div />',
})

function resetCatalogGateState() {
  useState('catalog-fetch-enabled', () => false).value = false
  useState('catalog-city-modal-open', () => false).value = false
  useState('catalog-city-gate-initialized', () => false).value = false
}

describe('useCatalogCityGate', () => {
  beforeEach(() => {
    window.localStorage.clear()
    resetMockTrainerFilters()
    resetCatalogGateState()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('mock exposes city on filters ref', () => {
    mockTrainerFiltersState.value = {
      ...mockTrainerFiltersState.value,
      city: 'São Paulo',
    }

    const { filters } = useTrainerFilters()
    expect(filters.value.city).toBe('São Paulo')
  })

  it('opens the modal and disables fetch when no city is available', async () => {
    const wrapper = mountFT(Harness)
    await nextTick()

    expect(wrapper.vm.modalOpen).toBe(true)
    expect(wrapper.vm.fetchEnabled).toBe(false)
    expect(wrapper.vm.isAwaitingCity).toBe(true)
  })

  it('enables fetch immediately when the URL already has a city', async () => {
    mockTrainerFiltersState.value = {
      ...mockTrainerFiltersState.value,
      city: 'São Paulo',
    }
    resetCatalogGateState()

    mountFT(Harness)
    await nextTick()

    expect(useState('catalog-fetch-enabled').value).toBe(true)
    expect(useState('catalog-city-modal-open').value).toBe(false)
  })

  it('waits for restored location instead of opening the modal', async () => {
    window.localStorage.setItem(
      'ft:geo-location',
      JSON.stringify({ city: 'Pelotas', state: 'RS', value: 'pelotas-rs' }),
    )
    resetCatalogGateState()

    const wrapper = mountFT(Harness)
    await nextTick()

    expect(wrapper.vm.modalOpen).toBe(false)
    expect(wrapper.vm.fetchEnabled).toBe(false)
  })

  it('enables fetch when a city is selected', async () => {
    const wrapper = mountFT(Harness)
    await nextTick()

    mockUpdateTrainerFilters({ city: 'Curitiba' })
    await nextTick()

    expect(wrapper.vm.fetchEnabled).toBe(true)
    expect(wrapper.vm.modalOpen).toBe(false)
  })

  it('resolveWithAll enables fetch and clears the city filter', async () => {
    mockTrainerFiltersState.value = {
      ...mockTrainerFiltersState.value,
      city: 'São Paulo',
    }
    resetCatalogGateState()

    const wrapper = mountFT(Harness)
    await nextTick()

    wrapper.vm.resolveWithAll()
    await nextTick()

    expect(mockUpdateTrainerFilters).toHaveBeenCalledWith({ city: undefined })
    expect(wrapper.vm.fetchEnabled).toBe(true)
    expect(wrapper.vm.modalOpen).toBe(false)
  })

  it('closing the modal without a city resolves with all trainers', async () => {
    const wrapper = mountFT(Harness)
    await nextTick()

    wrapper.vm.modalOpen = false
    await nextTick()

    expect(wrapper.vm.fetchEnabled).toBe(true)
  })

  it('openModal sets modalOpen to true', async () => {
    mockTrainerFiltersState.value = {
      ...mockTrainerFiltersState.value,
      city: 'São Paulo',
    }
    resetCatalogGateState()

    const wrapper = mountFT(Harness)
    await nextTick()

    expect(wrapper.vm.modalOpen).toBe(false)

    wrapper.vm.openModal()
    await nextTick()

    expect(wrapper.vm.modalOpen).toBe(true)
  })
})
