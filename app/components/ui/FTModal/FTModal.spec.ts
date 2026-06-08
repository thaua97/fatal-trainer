import { describe, it, expect } from 'vitest'
import { mountFT } from '@tests/helpers/mount-ft'
import FTModal from './FTModal.vue'
import FTGradientBubbles from '../FTGradientBubbles/FTGradientBubbles.vue'
import FTGradientOrbs from '../FTGradientOrbs/FTGradientOrbs.vue'

const heroGlobal = {
  components: {
    FTGradientBubbles,
    FTGradientOrbs,
  },
}

describe('FTModal', () => {
  it('renders hero variant with tile, title, subtitle and default slot', () => {
    const wrapper = mountFT(FTModal, {
      props: {
        open: true,
        tile: 'Perto de você',
        title: 'Encontre personais na sua cidade',
        subtitle: 'Busque pela cidade ou use sua localização.',
        testId: 'ft-modal-hero',
      },
      slots: {
        default: '<input data-testid="modal-child" />',
      },
      global: heroGlobal,
    })

    expect(wrapper.find('[data-testid="ft-modal-hero"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Perto de você')
    expect(wrapper.text()).toContain('Encontre personais na sua cidade')
    expect(wrapper.text()).toContain('Busque pela cidade ou use sua localização.')
    expect(wrapper.find('[data-testid="modal-child"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="gradient-bubbles"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="gradient-orbs"]').exists()).toBe(true)
  })

  it('renders title-only variation without tile or subtitle', () => {
    const wrapper = mountFT(FTModal, {
      props: {
        open: true,
        title: 'Título simples',
      },
      slots: {
        default: '<p data-testid="modal-body">Conteúdo</p>',
      },
      global: heroGlobal,
    })

    expect(wrapper.text()).toContain('Título simples')
    expect(wrapper.text()).toContain('Conteúdo')
    expect(wrapper.find('.text-xs.font-semibold.uppercase').exists()).toBe(false)
  })

  it('renders media variant with dark surface and screen-reader title', () => {
    const wrapper = mountFT(FTModal, {
      props: {
        open: true,
        variant: 'media',
        title: 'Ana Silva',
        testId: 'ft-modal-media',
      },
      slots: {
        default: '<img data-testid="media-image" alt="Foto" />',
      },
    })

    const modal = wrapper.findComponent({ name: 'UModal' })
    const card = wrapper.find('[data-testid="ft-modal-media"]')

    expect(modal.props('fullscreen')).toBe(true)
    expect(card.exists()).toBe(true)
    expect(card.classes().join(' ')).toContain('bg-slate-950')
    expect(card.classes().join(' ')).toContain('h-full')
    expect(wrapper.find('[data-testid="gradient-bubbles"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="gradient-orbs"]').exists()).toBe(false)
    expect(wrapper.find('#ft-modal-title').classes()).toContain('sr-only')
    expect(wrapper.find('[data-testid="media-image"]').exists()).toBe(true)
  })

  it('renders plain variant without gradient decorations', () => {
    const wrapper = mountFT(FTModal, {
      props: {
        open: true,
        variant: 'plain',
        title: 'Editar usuário',
      },
      slots: {
        default: '<form data-testid="plain-form" />',
      },
    })

    expect(wrapper.find('.ft-modal-card').exists()).toBe(false)
    expect(wrapper.find('[data-testid="gradient-bubbles"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="gradient-orbs"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="plain-form"]').exists()).toBe(true)
  })

  it('renders footer slot content', () => {
    const wrapper = mountFT(FTModal, {
      props: {
        open: true,
        title: 'Modal com footer',
      },
      slots: {
        default: '<p>Body</p>',
        footer: '<button data-testid="modal-footer-action">Ação</button>',
      },
      global: heroGlobal,
    })

    expect(wrapper.find('[data-testid="modal-footer-action"]').exists()).toBe(true)
  })

  it('forwards open state to UModal', () => {
    const wrapper = mountFT(FTModal, {
      props: {
        open: true,
        title: 'Aberta',
      },
    })

    expect(wrapper.find('[data-testid="u-modal-stub"]').exists()).toBe(true)
  })

  it('forwards dismissible prop to UModal', () => {
    const wrapper = mountFT(FTModal, {
      props: {
        open: true,
        title: 'Não dismissível',
        dismissible: false,
      },
    })

    const modal = wrapper.findComponent({ name: 'UModal' })
    expect(modal.props('dismissible')).toBe(false)
    expect(wrapper.find('[data-testid="ft-modal-close"]').exists()).toBe(false)
  })

  it('renders close button and closes modal when dismissible', async () => {
    const wrapper = mountFT(FTModal, {
      props: {
        open: true,
        title: 'Modal dismissível',
        dismissible: true,
      },
      global: heroGlobal,
    })

    const closeButton = wrapper.find('[data-testid="ft-modal-close"]')
    expect(closeButton.exists()).toBe(true)
    expect(closeButton.attributes('aria-label')).toBe('Fechar')

    await closeButton.trigger('click')

    expect(wrapper.emitted('update:open')).toEqual([[false]])
  })
})
