import type { Meta, StoryObj } from '@storybook/vue3'
import FTAdminUserStatusBadge from './FTAdminUserStatusBadge.vue'

const meta: Meta<typeof FTAdminUserStatusBadge> = {
  title: 'UI/FTAdminUserStatusBadge',
  component: FTAdminUserStatusBadge,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FTAdminUserStatusBadge>

export const Default: Story = {
  render: () => ({
    components: { FTAdminUserStatusBadge },
    template: `
      <div class="flex gap-3 p-4">
        <FTAdminUserStatusBadge :active="true" />
        <FTAdminUserStatusBadge :active="false" />
      </div>
    `,
  }),
}
