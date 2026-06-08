import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { mountFT } from '@tests/helpers/mount-ft'
import FTProfileCompletionPrompt from './FTProfileCompletionPrompt.vue'

const mockShouldShow = ref(true)
const mockShowFab = ref(false)
const mockMinimize = vi.fn()
const mockExpand = vi.fn()

vi.mock('~/composables/profile/useFTProfileCompletionPrompt', () => ({
  useFTProfileCompletionPrompt: () => ({
    shouldShow: mockShouldShow,
    showFab: mockShowFab,
    minimize: mockMinimize,
    expand: mockExpand,
  }),
}))

describe('FTProfileCompletionPrompt', () => {
  beforeEach(() => {
    mockShouldShow.value = true
    mockShowFab.value = false
    mockMinimize.mockReset()
    mockExpand.mockReset()
  })

  it('renders expanded popup when shouldShow is true', () => {
    const wrapper = mountFT(FTProfileCompletionPrompt, {
      global: {
        stubs: {
          FTGradientBubbles: true,
          FTGradientOrbs: true,
          FTIconButton: {
            template: '<button v-bind="$attrs" @click="$emit(\'click\')"><slot /></button>',
          },
        },
      },
    })

    expect(wrapper.find('[data-testid="profile-completion-prompt"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="profile-completion-prompt-fab"]').exists()).toBe(false)
    expect(wrapper.text()).toContain('Complete seu perfil')
  })

  it('renders minimized fab when showFab is true', () => {
    mockShouldShow.value = false
    mockShowFab.value = true

    const wrapper = mountFT(FTProfileCompletionPrompt)

    expect(wrapper.find('[data-testid="profile-completion-prompt"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="profile-completion-prompt-fab"]').exists()).toBe(true)
  })

  it('hides both states when neither shouldShow nor showFab is true', () => {
    mockShouldShow.value = false
    mockShowFab.value = false

    const wrapper = mountFT(FTProfileCompletionPrompt)

    expect(wrapper.find('[data-testid="profile-completion-prompt"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="profile-completion-prompt-fab"]').exists()).toBe(false)
  })

  it('links cta to profile edit page', () => {
    const wrapper = mountFT(FTProfileCompletionPrompt, {
      global: {
        stubs: {
          FTGradientBubbles: true,
          FTGradientOrbs: true,
          FTIconButton: true,
          UButton: {
            props: ['to'],
            template: '<a v-if="to" :href="typeof to === \'string\' ? to : \'#\'" data-testid="profile-completion-prompt-cta"><slot /></a><button v-else data-testid="profile-completion-prompt-cta"><slot /></button>',
          },
        },
      },
    })

    const cta = wrapper.find('[data-testid="profile-completion-prompt-cta"]')
    expect(cta.exists()).toBe(true)
    expect(cta.attributes('href')).toBe('/painel/perfil')
    expect(cta.text()).toContain('Completar perfil')
  })

  it('calls minimize when minimize button is clicked', async () => {
    const wrapper = mountFT(FTProfileCompletionPrompt, {
      global: {
        stubs: {
          FTGradientBubbles: true,
          FTGradientOrbs: true,
          FTIconButton: {
            template: '<button v-bind="$attrs" @click="$emit(\'click\')"><slot /></button>',
          },
        },
      },
    })

    await wrapper.find('[data-testid="profile-completion-prompt-minimize"]').trigger('click')

    expect(mockMinimize).toHaveBeenCalled()
  })

  it('calls expand when fab is clicked', async () => {
    mockShouldShow.value = false
    mockShowFab.value = true

    const wrapper = mountFT(FTProfileCompletionPrompt)

    await wrapper.find('[data-testid="profile-completion-prompt-fab"]').trigger('click')

    expect(mockExpand).toHaveBeenCalled()
  })
})
