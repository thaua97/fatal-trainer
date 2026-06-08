import { beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, ref } from 'vue'
import { mountFT } from '@tests/helpers/mount-ft'
import FTHireTrainerModal from './FTHireTrainerModal.vue'
import { mockTrainer } from '@tests/helpers/mock-trainer'

const mockHandleContact = vi.fn()
const mockModalOpen = ref(true)
const mockShowContactCta = ref(false)
const mockShowLoginCta = ref(true)
const mockCanContact = ref(true)

vi.mock('~/composables/profile/useProfileHireModal', () => ({
  useProfileHireModal: () => ({
    modalOpen: mockModalOpen,
    showContactCta: mockShowContactCta,
    showLoginCta: mockShowLoginCta,
    loginRoute: { path: '/login', query: { redirect: '/personal-trainers/trainer-001' } },
    canContact: mockCanContact,
    handleContact: mockHandleContact,
  }),
}))

const FTModalStub = defineComponent({
  name: 'FTModal',
  props: {
    open: { type: Boolean, default: false },
    tile: { type: String, default: undefined },
    title: { type: String, default: undefined },
    subtitle: { type: String, default: undefined },
    testId: { type: String, default: undefined },
    titleId: { type: String, default: undefined },
    dismissible: { type: Boolean, default: true },
  },
  emits: ['update:open'],
  template: `
    <div v-if="open" :data-testid="testId">
      <p v-if="tile">{{ tile }}</p>
      <h2 v-if="title" :id="titleId">{{ title }}</h2>
      <p v-if="subtitle">{{ subtitle }}</p>
      <slot />
    </div>
  `,
})

const UButtonStub = defineComponent({
  name: 'UButton',
  props: {
    to: { type: String, default: undefined },
    disabled: { type: Boolean, default: false },
    type: { type: String, default: 'button' },
  },
  emits: ['click'],
  template: `
    <a v-if="to" :href="to" v-bind="$attrs"><slot /></a>
    <button v-else :type="type" :disabled="disabled" v-bind="$attrs" @click="$emit('click')">
      <slot />
    </button>
  `,
})

describe('FTHireTrainerModal', () => {
  beforeEach(() => {
    mockHandleContact.mockReset()
    mockModalOpen.value = true
    mockShowContactCta.value = false
    mockShowLoginCta.value = true
    mockCanContact.value = true
  })

  it('renders tile, title and subtitle', () => {
    const wrapper = mountFT(FTHireTrainerModal, {
      props: { trainer: mockTrainer() },
      global: {
        stubs: {
          FTModal: FTModalStub,
          UButton: UButtonStub,
        },
      },
    })

    expect(wrapper.find('[data-testid="hire-trainer-modal"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Você está quase lá')
    expect(wrapper.text()).toContain('Bora colocar o corpo em movimento?')
    expect(wrapper.text()).toContain('O Fatal Trainer não tolera abuso')
  })

  it('shows login button for guests', () => {
    const wrapper = mountFT(FTHireTrainerModal, {
      props: { trainer: mockTrainer() },
      global: {
        stubs: {
          FTModal: FTModalStub,
          UButton: UButtonStub,
        },
      },
    })

    expect(wrapper.find('[data-testid="hire-modal-login"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="hire-modal-contact"]').exists()).toBe(false)
  })

  it('shows contact button for authenticated users', () => {
    mockShowContactCta.value = true
    mockShowLoginCta.value = false

    const wrapper = mountFT(FTHireTrainerModal, {
      props: { trainer: mockTrainer() },
      global: {
        stubs: {
          FTModal: FTModalStub,
          UButton: UButtonStub,
        },
      },
    })

    expect(wrapper.find('[data-testid="hire-modal-contact"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="hire-modal-login"]').exists()).toBe(false)
  })

  it('calls handleContact when contact button is clicked', async () => {
    mockShowContactCta.value = true
    mockShowLoginCta.value = false

    const wrapper = mountFT(FTHireTrainerModal, {
      props: { trainer: mockTrainer() },
      global: {
        stubs: {
          FTModal: FTModalStub,
          UButton: UButtonStub,
        },
      },
    })

    await wrapper.find('[data-testid="hire-modal-contact"]').trigger('click')

    expect(mockHandleContact).toHaveBeenCalled()
  })
})
