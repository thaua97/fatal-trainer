import type { Meta, StoryObj } from '@storybook/vue3'
import FTSortSelect from './FTSortSelect.vue'

const meta: Meta<typeof FTSortSelect> = {
  title: 'Composite/Catalog/FTSortSelect',
  component: FTSortSelect,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Seletor de ordenação do catálogo. Inclui preço efetivo, avaliações, desconto e experiência.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof FTSortSelect>

export const Default: Story = {
  decorators: [
    () => ({
      components: { FTSortSelect },
      template: '<div class="max-w-xs p-4"><FTSortSelect /></div>',
    }),
  ],
}
