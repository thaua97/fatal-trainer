import type { Meta, StoryObj } from '@storybook/vue3'
import FTAdminLoginForm from './FTAdminLoginForm.vue'

const meta: Meta<typeof FTAdminLoginForm> = {
  title: 'Composite/Admin/FTAdminLoginForm',
  component: FTAdminLoginForm,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FTAdminLoginForm>

export const Default: Story = {
  decorators: [
    () => ({
      template: '<div class="max-w-md p-6"><story /></div>',
    }),
  ],
}
