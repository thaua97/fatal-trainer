import type { Meta, StoryObj } from '@storybook/vue3'
import FTCityFilterButton from './FTCityFilterButton.vue'
import { storyFilters } from '../../../../../.storybook/mocks/catalog-filter-state'

const meta: Meta<typeof FTCityFilterButton> = {
  title: 'Composite/Catalog/FTCityFilterButton',
  component: FTCityFilterButton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Gatilho de filtro de cidade no painel lateral: mesmo visual do city picker, mas abre a modal de seleção ao clicar.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof FTCityFilterButton>

export const Default: Story = {
  decorators: [
    () => {
      storyFilters.value = { ...storyFilters.value, city: undefined }
      return {
        components: { FTCityFilterButton },
        template: '<div class="max-w-md p-4"><FTCityFilterButton /></div>',
      }
    },
  ],
}

export const Selected: Story = {
  decorators: [
    () => {
      storyFilters.value = { ...storyFilters.value, city: 'São Paulo' }
      return {
        components: { FTCityFilterButton },
        template: '<div class="max-w-md p-4"><FTCityFilterButton /></div>',
      }
    },
  ],
}
