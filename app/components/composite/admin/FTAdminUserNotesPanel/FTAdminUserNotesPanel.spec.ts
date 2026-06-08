import { describe, it, expect } from 'vitest'
import { mountFT } from '@tests/helpers/mount-ft'
import FTAdminUserNotesPanel from './FTAdminUserNotesPanel.vue'

describe('FTAdminUserNotesPanel', () => {
  it('renders existing notes', () => {
    const wrapper = mountFT(FTAdminUserNotesPanel, {
      props: {
        notes: {
          items: [{
            id: 'note-1',
            userId: 'user-1',
            authorId: 'admin-1',
            authorName: 'Admin Fatal',
            content: 'Observação importante',
            createdAt: '2026-06-01T00:00:00.000Z',
          }],
        },
      },
    })

    expect(wrapper.find('[data-testid="admin-user-notes-panel"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Observação importante')
  })

  it('emits submit with note content', async () => {
    const wrapper = mountFT(FTAdminUserNotesPanel, {
      props: {
        notes: { items: [] },
      },
      global: {
        stubs: {
          UTextarea: {
            props: ['modelValue'],
            emits: ['update:modelValue'],
            template: '<textarea data-testid="note-textarea" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
          },
        },
      },
    })

    const addButton = wrapper.findAll('button').find(button => button.text().includes('Adicionar'))
    expect(addButton).toBeDefined()
    await addButton!.trigger('click')

    await wrapper.find('textarea').setValue('Nova anotação')
    await wrapper.find('[data-testid="note-submit"]').trigger('click')

    expect(wrapper.emitted('submit')?.[0]).toEqual(['Nova anotação'])
  })
})
