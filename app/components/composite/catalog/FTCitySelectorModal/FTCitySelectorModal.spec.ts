import { describe, it, expect, vi, beforeEach } from 'vitest'
import { defineComponent } from 'vue'
import { mountFT } from '@tests/helpers/mount-ft'
import FTCitySelectorModal from './FTCitySelectorModal.vue'
import { resetMockTrainerFilters } from '@tests/helpers/mock-trainer-filters'

const mockResolveWithAll = vi.fn()
const mockModalOpen = { value: true }

vi.mock('~/composables/catalog/useCatalogCityGate', () => ({
  useCatalogCityGate: () => ({
    modalOpen: mockModalOpen,
    resolveWithAll: mockResolveWithAll,
  }),
}))

const FTCitySelectorStub = defineComponent({
  name: 'FTCitySelector',
  props: {
    testId: { type: String, default: undefined },
  },
  template: '<div data-testid="city-selector-stub" />',
})

const FTGradientBubblesStub = defineComponent({
  name: 'FTGradientBubbles',
  template: '<div data-testid="gradient-bubbles-stub" />',
})

const FTGradientOrbsStub = defineComponent({
  name: 'FTGradientOrbs',
  template: '<div data-testid="gradient-orbs-stub" />',
})

const UModalStub = defineComponent({
  name: 'UModal',
  props: {
    open: { type: Boolean, default: false },
    dismissible: { type: Boolean, default: true },
  },
  emits: ['update:open'],
  template: `
    <div v-if="open" data-testid="u-modal-stub">
      <slot name="content" />
    </div>
  `,
})

describe('FTCitySelectorModal', () => {
  beforeEach(() => {
    resetMockTrainerFilters()
    mockResolveWithAll.mockReset()
    mockModalOpen.value = true
  })

  it('renders the card content matching the catalog hero', () => {
    const wrapper = mountFT(FTCitySelectorModal, {
      global: {
        stubs: {
          FTCitySelector: FTCitySelectorStub,
          FTGradientBubbles: FTGradientBubblesStub,
          FTGradientOrbs: FTGradientOrbsStub,
          UModal: UModalStub,
        },
      },
    })

    expect(wrapper.find('[data-testid="city-selector-modal"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Perto de você')
    expect(wrapper.text()).toContain('Encontre personais na sua cidade')
    expect(wrapper.text()).toContain('Ver personais de todo o Brasil')
    expect(wrapper.find('[data-testid="gradient-bubbles-stub"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="gradient-orbs-stub"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="city-selector-stub"]').exists()).toBe(true)
  })

  it('calls resolveWithAll when skip is clicked', async () => {
    const wrapper = mountFT(FTCitySelectorModal, {
      global: {
        stubs: {
          FTCitySelector: FTCitySelectorStub,
          FTGradientBubbles: FTGradientBubblesStub,
          FTGradientOrbs: FTGradientOrbsStub,
          UModal: UModalStub,
        },
      },
    })

    await wrapper.find('[data-testid="city-modal-skip"]').trigger('click')

    expect(mockResolveWithAll).toHaveBeenCalled()
  })
})
