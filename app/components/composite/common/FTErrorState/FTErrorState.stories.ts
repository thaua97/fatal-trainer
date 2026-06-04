import type { Meta, StoryObj } from '@storybook/vue3'
import FTErrorState from './FTErrorState.vue'

const meta: Meta<typeof FTErrorState> = {
  title: 'Composite/Common/FTErrorState',
  component: FTErrorState,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FTErrorState>

export const Default: Story = {
  args: {message:"Não foi possível carregar."},

}

