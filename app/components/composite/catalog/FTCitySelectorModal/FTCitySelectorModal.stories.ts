import type { Meta, StoryObj } from '@storybook/vue3'
import FTCitySelectorModal from './FTCitySelectorModal.vue'
import { storyFilters } from '../../../../../.storybook/mocks/catalog-filter-state'

const meta: Meta<typeof FTCitySelectorModal> = {
  title: 'Composite/Catalog/FTCitySelectorModal',
  component: FTCitySelectorModal,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Modal de seleção de cidade exibida no carregamento do catálogo quando não há cidade na URL nem localização salva.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof FTCitySelectorModal>

export const Default: Story = {
  decorators: [
    () => {
      storyFilters.value = { ...storyFilters.value, city: undefined }
      return {
        components: { FTCitySelectorModal },
        template: '<FTCitySelectorModal />',
      }
    },
  ],
}
