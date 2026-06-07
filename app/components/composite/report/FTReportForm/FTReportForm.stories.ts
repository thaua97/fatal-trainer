import type { Meta, StoryObj } from '@storybook/vue3'
import FTReportForm from './FTReportForm.vue'

const meta: Meta<typeof FTReportForm> = {
  title: 'Composite/Report/FTReportForm',
  component: FTReportForm,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FTReportForm>

export const Default: Story = {}
