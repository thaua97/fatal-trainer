import { defineComponent, ref } from 'vue'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { mountFT } from '@tests/helpers/mount-ft'
import { useFTActiveFilterChips } from '@/composables/components/useFTActiveFilterChips'

const mockUpdateFilters = vi.fn()

vi.mock('../../../app/composables/catalog/useTrainerFilters', () => ({
  useTrainerFilters: () => ({
    filters: ref({
      search: 'ana',
      specialties: ['Funcional'],
      modalities: ['presencial'],
      onPromotion: true,
      sortBy: 'name',
      sortOrder: 'asc',
      page: 1,
      pageSize: 24,
    }),
    updateFilters: mockUpdateFilters,
  }),
}))

const Harness = defineComponent({
  setup() {
    return useFTActiveFilterChips()
  },
  template: '<div data-testid="chips-harness">{{ chips.length }}</div>',
})

describe('useFTActiveFilterChips', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('builds chips for active filters including promotion', () => {
    const wrapper = mountFT(Harness)
    const vm = wrapper.vm as unknown as ReturnType<typeof useFTActiveFilterChips>

    expect(vm.chips.map((chip) => chip.key)).toEqual([
      'search',
      'specialty-Funcional',
      'modality-presencial',
      'onPromotion',
    ])
  })

  it('dismisses promotion chip', () => {
    const wrapper = mountFT(Harness)
    const vm = wrapper.vm as unknown as ReturnType<typeof useFTActiveFilterChips>
    const promoChip = vm.chips.find((chip) => chip.key === 'onPromotion')

    expect(promoChip).toBeDefined()
    vm.dismissChip(promoChip!)

    expect(mockUpdateFilters).toHaveBeenCalledWith({
      onPromotion: undefined,
      page: 1,
    })
  })
})
