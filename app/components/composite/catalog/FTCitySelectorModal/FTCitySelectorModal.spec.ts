import { describe, it, expect, vi, beforeEach } from 'vitest'
import { defineComponent, ref } from 'vue'
import { mountFT } from '@tests/helpers/mount-ft'
import FTCitySelectorModal from './FTCitySelectorModal.vue'
import { resetMockTrainerFilters } from '@tests/helpers/mock-trainer-filters'

const mockResolveWithAll = vi.fn()
const mockModalOpen = ref(true)

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

const FTModalStub = defineComponent({
  name: 'FTModal',
  props: {
    open: { type: Boolean, default: false },
    tile: { type: String, default: undefined },
    title: { type: String, default: undefined },
    subtitle: { type: String, default: undefined },
    testId: { type: String, default: undefined },
    titleId: { type: String, default: undefined },
    dismissible: { type: Boolean, default: true },
  },
  emits: ['update:open'],
  template: `
    <div v-if="open" :data-testid="testId">
      <p v-if="tile">{{ tile }}</p>
      <h2 v-if="title" :id="titleId">{{ title }}</h2>
      <p v-if="subtitle">{{ subtitle }}</p>
      <slot />
      <slot name="footer" />
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
          FTModal: FTModalStub,
        },
      },
    })

    expect(wrapper.find('[data-testid="city-selector-modal"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Perto de você')
    expect(wrapper.text()).toContain('Encontre personais na sua cidade')
    expect(wrapper.text()).toContain('Ver personais de todo o Brasil')
    expect(wrapper.find('[data-testid="city-selector-stub"]').exists()).toBe(true)
  })

  it('calls resolveWithAll when skip is clicked', async () => {
    const wrapper = mountFT(FTCitySelectorModal, {
      global: {
        stubs: {
          FTCitySelector: FTCitySelectorStub,
          FTModal: FTModalStub,
        },
      },
    })

    await wrapper.find('[data-testid="city-modal-skip"]').trigger('click')

    expect(mockResolveWithAll).toHaveBeenCalled()
  })
})
