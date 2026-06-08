import type { Meta, StoryObj } from '@storybook/vue3'
import FTLogo from './FTLogo.vue'

const meta: Meta<typeof FTLogo> = {
  title: 'UI/FTLogo',
  component: FTLogo,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
}

export default meta
type Story = StoryObj<typeof FTLogo>

export const Default: Story = {
  args: {
    size: 'md',
  },
}

export const Small: Story = {
  args: {
    size: 'sm',
  },
}

export const IconOnly: Story = {
  args: {
    size: 'sm',
    iconOnly: true,
  },
}

export const Large: Story = {
  args: {
    size: 'lg',
  },
}

export const WithHover: Story = {
  render: args => ({
    components: { FTLogo },
    setup: () => ({ args }),
    template: `
      <a href="/" class="group inline-flex rounded-lg p-4 transition-colors hover:bg-violet-50">
        <FTLogo v-bind="args" />
      </a>
    `,
  }),
  args: {
    size: 'md',
  },
}
