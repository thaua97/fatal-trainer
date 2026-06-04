import type { Meta, StoryObj } from '@storybook/vue3'
import FTProfileHero from './FTProfileHero.vue'

const meta: Meta<typeof FTProfileHero> = {
  title: 'Composite/FTProfileHero',
  component: FTProfileHero,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FTProfileHero>

export const Default: Story = {}
