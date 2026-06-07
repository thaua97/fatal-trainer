import type { Meta, StoryObj } from '@storybook/vue3'
import FTAdminReportStatusBadge from './FTAdminReportStatusBadge.vue'

const meta: Meta<typeof FTAdminReportStatusBadge> = {
  title: 'UI/FTAdminReportStatusBadge',
  component: FTAdminReportStatusBadge,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FTAdminReportStatusBadge>

export const Default: Story = {
  render: () => ({
    components: { FTAdminReportStatusBadge },
    template: `
      <div class="flex flex-wrap gap-3 p-4">
        <FTAdminReportStatusBadge status="pending" label="Pendente" />
        <FTAdminReportStatusBadge status="in_review" label="Em análise" />
        <FTAdminReportStatusBadge status="resolved" label="Resolvida" />
        <FTAdminReportStatusBadge status="archived" label="Arquivada" />
      </div>
    `,
  }),
}
