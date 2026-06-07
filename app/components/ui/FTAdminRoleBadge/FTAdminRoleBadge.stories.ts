import type { Meta, StoryObj } from '@storybook/vue3'
import FTAdminRoleBadge from './FTAdminRoleBadge.vue'

const meta: Meta<typeof FTAdminRoleBadge> = {
  title: 'UI/FTAdminRoleBadge',
  component: FTAdminRoleBadge,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FTAdminRoleBadge>

export const Default: Story = {
  render: () => ({
    components: { FTAdminRoleBadge },
    template: `
      <div class="flex flex-wrap gap-3 p-4">
        <FTAdminRoleBadge role="admin" label="Admin" />
        <FTAdminRoleBadge role="student" label="Aluno" />
        <FTAdminRoleBadge role="personal-trainer" label="Personal" />
      </div>
    `,
  }),
}

export const Small: Story = {
  render: () => ({
    components: { FTAdminRoleBadge },
    template: `
      <FTAdminRoleBadge role="personal-trainer" label="Personal" size="sm" />
    `,
  }),
}
