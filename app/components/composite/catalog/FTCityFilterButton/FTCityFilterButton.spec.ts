import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { mountFT } from '@tests/helpers/mount-ft'
import FTCityFilterButton from './FTCityFilterButton.vue'
import { resetMockTrainerFilters } from '@tests/helpers/mock-trainer-filters'

const mockOpenModal = vi.fn()
const mockCity = ref('')
const mockState = ref('')
const mockCities = ref<{ city: string, state: string, value: string, label: string }[]>([])

vi.mock('~/composables/catalog/useCatalogCityGate', () => ({
  useCatalogCityGate: () => ({
    openModal: mockOpenModal,
  }),
}))

vi.mock('~/composables/components/useFTCitySelector', () => ({
  useFTCitySelector: () => ({
    city: mockCity,
    state: mockState,
  }),
}))

vi.mock('~/composables/components/useFTBrazilianCities', () => ({
  useFTBrazilianCities: () => ({
    cities: mockCities,
  }),
}))

describe('FTCityFilterButton', () => {
  beforeEach(() => {
    resetMockTrainerFilters()
    mockOpenModal.mockReset()
    mockCity.value = ''
    mockState.value = ''
    mockCities.value = []
  })

  it('renders the city filter trigger with default label and placeholder', () => {
    const wrapper = mountFT(FTCityFilterButton)

    expect(wrapper.text()).toContain('Cidade')
    expect(wrapper.text()).toContain('Buscar cidade...')
    expect(wrapper.find('[data-testid="city-filter-button"]').exists()).toBe(true)
  })

  it('opens the city selector modal when clicked', async () => {
    const wrapper = mountFT(FTCityFilterButton)

    await wrapper.find('[data-testid="city-filter-button"]').trigger('click')

    expect(mockOpenModal).toHaveBeenCalledOnce()
  })

  it('shows the selected city when one is set', () => {
    mockCity.value = 'São Paulo'
    mockState.value = 'SP'
    mockCities.value = [
      { city: 'São Paulo', state: 'SP', value: 'sao-paulo-sp', label: 'São Paulo - SP' },
    ]

    const wrapper = mountFT(FTCityFilterButton)

    expect(wrapper.text()).toContain('São Paulo, SP')
  })
})
