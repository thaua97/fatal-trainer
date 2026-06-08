import type { Meta, StoryObj } from '@storybook/vue3'
import FTGradientOrbs from './FTGradientOrbs.vue'

const meta: Meta<typeof FTGradientOrbs> = {
  title: 'UI/FTGradientOrbs',
  component: FTGradientOrbs,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof FTGradientOrbs>

export const Panel: Story = {
  render: () => ({
    components: { FTGradientOrbs },
    template: `
      <div class="relative min-h-[420px] overflow-hidden rounded-3xl border border-slate-200 bg-white">
        <FTGradientOrbs variant="panel" />
        <div class="relative p-8">
          <p class="text-slate-600">Bolhas suaves no painel admin</p>
        </div>
      </div>
    `,
  }),
}

export const Card: Story = {
  render: () => ({
    components: { FTGradientOrbs },
    template: `
      <div class="relative w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
        <FTGradientOrbs variant="card" />
        <div class="relative h-16" />
        <div class="relative px-4 pb-4">
          <p class="font-semibold text-slate-900">Popover card</p>
        </div>
      </div>
    `,
  }),
}
