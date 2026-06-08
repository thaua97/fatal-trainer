import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import FTModal from './FTModal.vue'

const meta: Meta<typeof FTModal> = {
  title: 'UI/FTModal',
  component: FTModal,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Modal padronizada sobre UModal com variantes hero (gradientes) e plain (admin). Suporta tile, title, subtitle, children e footer opcionais.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof FTModal>

export const HeroFull: Story = {
  render: () => ({
    components: { FTModal },
    setup() {
      const open = ref(true)
      return { open }
    },
    template: `
      <div>
        <button type="button" class="rounded-full bg-violet-600 px-4 py-2 text-white" @click="open = true">
          Abrir modal
        </button>
        <FTModal
          v-model:open="open"
          tile="Perto de você"
          title="Encontre personais na sua cidade"
          subtitle="Busque pela cidade ou use sua localização. Você pode alterar isso depois nos filtros."
          test-id="story-hero-modal"
        >
          <label class="block text-sm font-medium text-slate-700">
            Sua cidade
            <input
              type="text"
              placeholder="Digite ou busque sua cidade..."
              class="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
            />
          </label>
          <template #footer>
            <button type="button" class="text-sm text-slate-600 underline underline-offset-4">
              Ver personais de todo o Brasil
            </button>
          </template>
        </FTModal>
      </div>
    `,
  }),
}

export const TitleAndChildren: Story = {
  render: () => ({
    components: { FTModal },
    setup() {
      const open = ref(true)
      return { open }
    },
    template: `
      <div>
        <button type="button" class="rounded-full bg-violet-600 px-4 py-2 text-white" @click="open = true">
          Abrir modal
        </button>
        <FTModal v-model:open="open" title="Confirme sua ação">
          <p class="text-sm text-slate-600">Esta é uma modal mínima com apenas título e conteúdo.</p>
        </FTModal>
      </div>
    `,
  }),
}

export const PlainAdmin: Story = {
  render: () => ({
    components: { FTModal },
    setup() {
      const open = ref(true)
      return { open }
    },
    template: `
      <div>
        <button type="button" class="rounded-full bg-violet-600 px-4 py-2 text-white" @click="open = true">
          Abrir modal admin
        </button>
        <FTModal v-model:open="open" variant="plain" title="Novo usuário">
          <form class="flex flex-col gap-4">
            <label class="text-sm font-medium text-slate-700">
              Nome
              <input type="text" class="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm" />
            </label>
            <label class="text-sm font-medium text-slate-700">
              E-mail
              <input type="email" class="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm" />
            </label>
            <div class="mt-2 flex justify-end gap-2">
              <button type="button" class="rounded-full px-4 py-2 text-sm text-slate-600" @click="open = false">
                Cancelar
              </button>
              <button type="submit" class="rounded-full bg-violet-600 px-4 py-2 text-sm text-white">
                Salvar
              </button>
            </div>
          </form>
        </FTModal>
      </div>
    `,
  }),
}

export const WithTrigger: Story = {
  render: () => ({
    components: { FTModal },
    setup() {
      const open = ref(false)
      return { open }
    },
    template: `
      <FTModal v-model:open="open" title="Modal com trigger">
        <template #trigger>
          <button type="button" class="rounded-full bg-violet-600 px-4 py-2 text-white">
            Abrir via trigger
          </button>
        </template>
        <p class="text-sm text-slate-600">Conteúdo aberto pelo slot trigger.</p>
      </FTModal>
    `,
  }),
}
