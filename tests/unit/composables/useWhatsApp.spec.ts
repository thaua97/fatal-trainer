import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { defineComponent, ref } from 'vue'
import { mountFT } from '@tests/helpers/mount-ft'
import { useWhatsApp } from '~/composables/profile/useWhatsApp'

const TestHarness = defineComponent({
  setup() {
    const phone = ref<string | undefined>('11999998888')
    const trainerName = ref('Ana Silva')
    const { openChat, canContact, message } = useWhatsApp({ phone, trainerName })

    return {
      phone,
      trainerName,
      openChat,
      canContact,
      message,
    }
  },
  template: '<div />',
})

describe('useWhatsApp', () => {
  beforeEach(() => {
    vi.stubGlobal('open', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns canContact true for valid phone', () => {
    const wrapper = mountFT(TestHarness)
    expect(wrapper.vm.canContact).toBe(true)
  })

  it('returns canContact false when phone is missing', async () => {
    const wrapper = mountFT(TestHarness)
    wrapper.vm.phone = undefined
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.canContact).toBe(false)
  })

  it('builds localized message with trainer name', () => {
    const wrapper = mountFT(TestHarness)
    expect(wrapper.vm.message).toBe(
      'Olá Ana Silva, vi seu perfil no Fatal Trainer e gostaria de agendar uma aula experimental',
    )
  })

  it('opens WhatsApp url in a new tab', () => {
    const wrapper = mountFT(TestHarness)
    wrapper.vm.openChat()

    expect(window.open).toHaveBeenCalledWith(
      'https://wa.me/5511999998888?text=Ol%C3%A1%20Ana%20Silva%2C%20vi%20seu%20perfil%20no%20Fatal%20Trainer%20e%20gostaria%20de%20agendar%20uma%20aula%20experimental',
      '_blank',
      'noopener,noreferrer',
    )
  })

  it('does not open WhatsApp when phone is invalid', async () => {
    const wrapper = mountFT(TestHarness)
    wrapper.vm.phone = '123'
    await wrapper.vm.$nextTick()
    wrapper.vm.openChat()

    expect(window.open).not.toHaveBeenCalled()
  })

  it('builds authenticated message when userName is provided', async () => {
    const AuthenticatedHarness = defineComponent({
      setup() {
        const phone = ref<string | undefined>('11999998888')
        const trainerName = ref('Ana Silva')
        const userName = ref('João Aluno')
        const { message } = useWhatsApp({ phone, trainerName, userName })

        return { message, userName }
      },
      template: '<div />',
    })

    const wrapper = mountFT(AuthenticatedHarness)

    expect(wrapper.vm.message).toBe(
      'Olá Ana Silva, sou João Aluno. Vi seu perfil no Fatal Trainer e gostaria de agendar uma aula experimental',
    )
  })
})
