import type { Meta, StoryObj } from '@storybook/vue3'
import FTImpersonationBanner from './FTImpersonationBanner.vue'

const meta: Meta<typeof FTImpersonationBanner> = {
  title: 'Composite/Admin/FTImpersonationBanner',
  component: FTImpersonationBanner,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FTImpersonationBanner>

export const Default: Story = {
  decorators: [
    () => ({
      components: { FTImpersonationBanner },
      setup() {
        const user = useState('auth-user', () => ({
          id: '1',
          name: 'Carlos Personal',
          email: 'personal@fataltrainer.com',
          role: 'personal-trainer' as const,
          isImpersonating: true,
        }))
        return { user }
      },
      template: '<FTImpersonationBanner />',
    }),
  ],
}
