import type { Meta, StoryObj } from '@storybook/vue3'
import FTAdminShell from './FTAdminShell.vue'

const meta: Meta<typeof FTAdminShell> = {
  title: 'Composite/Admin/FTAdminShell',
  component: FTAdminShell,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof FTAdminShell>

export const Default: Story = {
  render: () => ({
    components: { FTAdminShell },
    setup() {
      useState('admin-user', () => ({
        id: '1',
        name: 'Admin Fatal',
        email: 'admin@fataltrainer.com',
        role: 'admin' as const,
      }))
      return {}
    },
    template: `
      <FTAdminShell title="Usuários">
        <div class="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-slate-500">
          Conteúdo do painel
        </div>
      </FTAdminShell>
    `,
  }),
}
