import type { Meta, StoryObj } from '@storybook/vue3'
import FTFilterPanel from './FTFilterPanel.vue'
import { filterPanelDocsDescription } from '@tests/helpers/story-helpers'

const meta: Meta<typeof FTFilterPanel> = {
  title: 'Composite/Catalog/FTFilterPanel',
  component: FTFilterPanel,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: filterPanelDocsDescription,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof FTFilterPanel>

export const Sidebar: Story = {
  args: {
    mode: 'sidebar',
    showClear: true,
    showSearch: true,
    showSort: true,
  },
  decorators: [
    () => ({
      components: { FTFilterPanel },
      template: '<div class="max-w-xs p-4"><FTFilterPanel mode="sidebar" show-clear show-search show-sort /></div>',
    }),
  ],
}

export const Inline: Story = {
  args: {
    mode: 'inline',
    showSearch: false,
    showSort: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Variante usada no drawer mobile da listagem.',
      },
    },
  },
  decorators: [
    () => ({
      components: { FTFilterPanel },
      template: '<div class="max-w-md p-4"><FTFilterPanel mode="inline" :show-search="false" show-sort /></div>',
    }),
  ],
}
