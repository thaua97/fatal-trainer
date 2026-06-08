import type { Meta, StoryObj } from '@storybook/vue3'
import FTCitySelector from './FTCitySelector.vue'
import { storyFilters } from '../../../../../.storybook/mocks/catalog-filter-state'

const meta: Meta<typeof FTCitySelector> = {
  title: 'Composite/Catalog/FTCitySelector',
  component: FTCitySelector,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Seletor composto de cidade para o catálogo: ícone + input de busca + ListBox virtualizado, com detecção por geolocalização. Orquestra o filtro `city` da URL e persiste a localização escolhida.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof FTCitySelector>

export const Default: Story = {
  decorators: [
    () => {
      storyFilters.value = { ...storyFilters.value, city: undefined }
      return {
        components: { FTCitySelector },
        template: '<div class="max-w-md p-4"><FTCitySelector /></div>',
      }
    },
  ],
}

export const Selected: Story = {
  decorators: [
    () => {
      storyFilters.value = { ...storyFilters.value, city: 'São Paulo' }
      return {
        components: { FTCitySelector },
        template: '<div class="max-w-md p-4"><FTCitySelector /></div>',
      }
    },
  ],
  parameters: {
    docs: {
      description: {
        story: 'Estado com uma cidade já selecionada e refletida no filtro do catálogo.',
      },
    },
  },
}
