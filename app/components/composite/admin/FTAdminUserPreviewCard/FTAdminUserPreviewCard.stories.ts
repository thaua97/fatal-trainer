import type { Meta, StoryObj } from '@storybook/vue3'
import FTAdminUserPreviewCard from './FTAdminUserPreviewCard.vue'

const meta: Meta<typeof FTAdminUserPreviewCard> = {
  title: 'Composite/Admin/FTAdminUserPreviewCard',
  component: FTAdminUserPreviewCard,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof FTAdminUserPreviewCard>

export const Default: Story = {
  args: {
    user: {
      id: '1',
      name: 'Carlos Personal',
      email: 'personal@fataltrainer.com',
      role: 'personal-trainer',
      phoneNumber: '53991625225',
      city: 'Pelotas',
      state: 'RS',
      availability: 'Seg–Sex, 6h–21h',
      servicePrice: 100,
      promoPrice: 80,
      isActive: true,
      featured: true,
      createdAt: '2026-06-06T00:00:00.000Z',
    },
    roleLabel: 'Personal',
    x: 120,
    y: 120,
  },
}
