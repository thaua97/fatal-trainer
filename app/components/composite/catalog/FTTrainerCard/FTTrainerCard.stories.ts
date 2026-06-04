import type { Meta, StoryObj } from '@storybook/vue3'
import FTTrainerCard from './FTTrainerCard.vue'
import { mockTrainer } from '../../../../../tests/helpers/mock-trainer'
const trainer = mockTrainer()

const meta: Meta<typeof FTTrainerCard> = {
  title: 'Composite/Catalog/FTTrainerCard',
  component: FTTrainerCard,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FTTrainerCard>

export const Default: Story = {
  args: { trainer },

}
export const LongName: Story = { args: { trainer: mockTrainer({ name: 'Ana Carolina de Souza e Silva Mendonça' }) } }
