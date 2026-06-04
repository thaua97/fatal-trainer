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
  args: {title:"Nenhum resultado",variant:"search"},

}
export const Filters: Story = { args: { title: 'Sem filtros', variant: 'filters' } }
