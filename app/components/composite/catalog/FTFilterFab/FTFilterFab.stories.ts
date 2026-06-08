import type { Meta, StoryObj } from '@storybook/vue3'
import FTFilterFab from './FTFilterFab.vue'

const meta: Meta<typeof FTFilterFab> = {
  title: 'Composite/Catalog/FTFilterFab',
  component: FTFilterFab,
  tags: ['autodocs'],
  argTypes: {
    badgeCount: {
      control: 'number',
      description: 'Quantidade de filtros ativos exibida no badge',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'FAB mobile para abrir o drawer de filtros. Exibe badge quando há filtros ativos.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof FTFilterFab>

export const Default: Story = {
  args: { badgeCount: 0 },
  decorators: [
    (_, { args }) => ({
      components: { FTFilterFab },
      setup: () => ({ args }),
      template: '<div class="relative h-40"><FTFilterFab v-bind="args" /></div>',
    }),
  ],
}

export const WithActiveFilters: Story = {
  args: { badgeCount: 3 },
  decorators: [
    (_, { args }) => ({
      components: { FTFilterFab },
      setup: () => ({ args }),
      template: '<div class="relative h-40"><FTFilterFab v-bind="args" /></div>',
    }),
  ],
}
