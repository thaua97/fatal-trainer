import type { Meta, StoryObj } from '@storybook/vue3'
import FTLandingTrainersSection from './FTLandingTrainersSection.vue'

const meta: Meta<typeof FTLandingTrainersSection> = {
  title: 'Composite/Marketing/FTLandingTrainersSection',
  component: FTLandingTrainersSection,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof FTLandingTrainersSection>

export const Default: Story = {}
