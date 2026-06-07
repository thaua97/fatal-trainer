import type { Meta, StoryObj } from '@storybook/vue3'
import FTCityPicker from './FTCityPicker.vue'

const meta: Meta<typeof FTCityPicker> = {
  title: 'UI/FTCityPicker',
  component: FTCityPicker,
  tags: ['autodocs'],
  args: {
    city: '',
    state: '',
    label: 'Cidade',
    placeholder: 'Buscar cidade...',
  },
  parameters: {
    docs: {
      description: {
        component:
          'Primitivo de seleção de cidade: ícone líder + input de busca (UInputMenu) + ListBox virtualizado de cidades brasileiras, com botão opcional de geolocalização.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof FTCityPicker>

export const Default: Story = {}

export const Selected: Story = {
  args: {
    city: 'São Paulo',
    state: 'SP',
  },
}

export const WithGeolocation: Story = {
  args: {
    withGeolocation: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Exibe o botão de detecção por geolocalização ao lado do campo.',
      },
    },
  },
}

export const Detecting: Story = {
  args: {
    withGeolocation: true,
    detecting: true,
  },
}

export const WithError: Story = {
  args: {
    withGeolocation: true,
    geoError: 'Permissão de localização negada. Digite sua cidade.',
  },
}
