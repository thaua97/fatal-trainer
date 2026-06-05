import type { Meta, StoryObj } from '@storybook/vue3'
import FTLandingFeatureGrid from './FTLandingFeatureGrid.vue'

const meta: Meta<typeof FTLandingFeatureGrid> = {
  title: 'Composite/Marketing/FTLandingFeatureGrid',
  component: FTLandingFeatureGrid,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof FTLandingFeatureGrid>

export const Default: Story = {}
