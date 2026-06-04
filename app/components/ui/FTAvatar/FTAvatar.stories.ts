import type { Meta, StoryObj } from '@storybook/vue3'
import FTAvatar from './FTAvatar.vue'

const meta: Meta<typeof FTAvatar> = {
  title: 'UI/FTAvatar',
  component: FTAvatar,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FTAvatar>

export const Default: Story = {
  args: {name:"Ana Silva",src:"https://i.pravatar.cc/150?u=ana"},

}
export const Initials: Story = { args: { name: 'Marcos Oliveira' } }

export const BrokenImage: Story = {
  args: {
    name: 'Ana Silva',
    src: 'https://example.com/image-not-found.jpg',
  },
}
