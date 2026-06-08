import { describe, expect, it, beforeEach } from 'vitest'
import {
  createUserNote,
  listUserNotes,
  resetNotesStore,
} from '../../../server/mocks/mock-user-notes-store'

describe('mock-user-notes-store', () => {
  beforeEach(() => {
    resetNotesStore()
  })

  it('creates and lists notes for a user', () => {
    createUserNote('user-1', 'admin-1', 'Admin Fatal', 'Primeira anotação')
    createUserNote('user-1', 'admin-1', 'Admin Fatal', 'Segunda anotação')
    createUserNote('user-2', 'admin-1', 'Admin Fatal', 'Outro usuário')

    const notes = listUserNotes('user-1')

    expect(notes.items).toHaveLength(2)
    expect(notes.items[0]?.content).toBe('Segunda anotação')
  })

  it('rejects empty note content', () => {
    expect(() => createUserNote('user-1', 'admin-1', 'Admin', '   ')).toThrow()
  })
})
