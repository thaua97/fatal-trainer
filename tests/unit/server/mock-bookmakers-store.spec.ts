import { describe, expect, it, beforeEach } from 'vitest'
import {
  addBookmaker,
  getBookmakerIds,
  removeBookmaker,
  resetBookmakersStore,
  setBookmakers,
} from '../../../server/mocks/mock-bookmakers-store'

describe('mock-bookmakers-store', () => {
  beforeEach(() => {
    resetBookmakersStore()
  })

  it('starts empty for unknown users', () => {
    expect(getBookmakerIds('user-1')).toEqual([])
  })

  it('adds and removes bookmakers', () => {
    addBookmaker('user-1', 'trainer-a')
    addBookmaker('user-1', 'trainer-b')
    expect(getBookmakerIds('user-1')).toEqual(['trainer-a', 'trainer-b'])

    removeBookmaker('user-1', 'trainer-a')
    expect(getBookmakerIds('user-1')).toEqual(['trainer-b'])
  })

  it('merges trainer ids on bulk set', () => {
    addBookmaker('user-1', 'trainer-a')
    setBookmakers('user-1', ['trainer-b', 'trainer-c'])
    expect(getBookmakerIds('user-1')).toEqual(['trainer-a', 'trainer-b', 'trainer-c'])
  })
})
