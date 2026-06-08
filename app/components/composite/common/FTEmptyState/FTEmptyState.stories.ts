import type { Meta, StoryObj } from '@storybook/vue3'
import FTEmptyState from './FTEmptyState.vue'

const meta: Meta<typeof FTEmptyState> = {
  title: 'Composite/Common/FTEmptyState',
  component: FTEmptyState,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FTEmptyState>

export const Default: Story = {
  args: { title: 'Nenhum personal trainer encontrado.', variant: 'search' },
  render: args => ({
    components: { FTEmptyState },
    setup: () => ({ args }),
    template: `
      <FTEmptyState v-bind="args">
        <button class="rounded-full bg-violet-600 px-6 py-2 text-sm font-semibold text-white">
          Limpar filtros
        </button>
      </FTEmptyState>
    `,
  }),
}

export const Filters: Story = {
  args: { title: 'Nenhum resultado com esses filtros.', variant: 'filters' },
}

export const Generic: Story = {
  args: { title: 'Nada por aqui ainda.', variant: 'generic' },
}
