import { describe, expect, it, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { mountFT } from '@tests/helpers/mount-ft'
import FTFilterPanel from './FTFilterPanel.vue'

const mockUseFTFilterPanel = vi.fn()
const mockUseFTSortSelect = vi.fn()
const mockUseFTSpecialtyFilter = vi.fn()
const mockUseFTModalityFilter = vi.fn()
const mockUseFTPromotionFilter = vi.fn()

vi.mock('../../../../composables/components/useFTFilterPanel', () => ({
  useFTFilterPanel: () => mockUseFTFilterPanel(),
}))

vi.mock('../../../../composables/components/useFTSortSelect', () => ({
  useFTSortSelect: () => mockUseFTSortSelect(),
}))

vi.mock('../../../../composables/components/useFTSpecialtyFilter', () => ({
  useFTSpecialtyFilter: () => mockUseFTSpecialtyFilter(),
}))

vi.mock('../../../../composables/components/useFTModalityFilter', () => ({
  useFTModalityFilter: () => mockUseFTModalityFilter(),
}))

vi.mock('../../../../composables/components/useFTPromotionFilter', () => ({
  useFTPromotionFilter: () => mockUseFTPromotionFilter(),
}))

describe('FTFilterPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    mockUseFTFilterPanel.mockReturnValue({
      search: ref(''),
      clearFilters: vi.fn(),
    })

    mockUseFTSortSelect.mockReturnValue({
      sortKey: ref('name-asc'),
      sortItems: ref([{ label: 'Relevância', value: 'name-asc' }]),
    })

    mockUseFTSpecialtyFilter.mockReturnValue({
      options: ['Funcional', 'Musculação'],
      isSelected: (value: string) => value === 'Funcional',
      toggle: vi.fn(),
    })

    mockUseFTModalityFilter.mockReturnValue({
      options: ref([
        { value: 'presencial', label: 'Presencial' },
        { value: 'online', label: 'Online' },
      ]),
      isSelected: (value: string) => value === 'presencial',
      toggle: vi.fn(),
    })

    mockUseFTPromotionFilter.mockReturnValue({
      onPromotion: ref(true),
      label: ref('Apenas em promoção'),
    })
  })

  it('renders specialty, modality and promotion filters in sidebar mode', () => {
    const wrapper = mountFT(FTFilterPanel, {
      props: { mode: 'sidebar', showClear: true },
    })

    expect(wrapper.find('[data-testid="trainer-filters-sidebar"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="specialty-filter-Funcional"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="modality-filter-presencial"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="promotion-filter"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="clear-filters"]').exists()).toBe(true)
  })

  it('renders inline filters for mobile drawer', () => {
    const wrapper = mountFT(FTFilterPanel, {
      props: { mode: 'inline', showSearch: false },
    })

    expect(wrapper.find('[data-testid="trainer-filters"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="trainer-filters-sidebar"]').exists()).toBe(false)
  })
})
