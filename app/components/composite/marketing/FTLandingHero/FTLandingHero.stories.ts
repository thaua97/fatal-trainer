import type { Meta, StoryObj } from '@storybook/vue3'
import FTLandingHero from './FTLandingHero.vue'

const meta: Meta<typeof FTLandingHero> = {
  title: 'Composite/Marketing/FTLandingHero',
  component: FTLandingHero,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof FTLandingHero>

export const Default: Story = {}
