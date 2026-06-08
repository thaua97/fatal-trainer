import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { nextTick } from 'vue'
import { useLocalStorage } from '~/composables/core/useLocalStorage'

describe('useLocalStorage', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns the default value when the key is absent', () => {
    const value = useLocalStorage('ft:test', 'fallback')
    expect(value.value).toBe('fallback')
  })

  it('reads an existing serialized value', () => {
    window.localStorage.setItem('ft:test', JSON.stringify({ name: 'Ana' }))
    const value = useLocalStorage<{ name: string }>('ft:test', { name: '' })
    expect(value.value).toEqual({ name: 'Ana' })
  })

  it('writes back to localStorage when the ref changes', async () => {
    const value = useLocalStorage('ft:test', 'a')
    value.value = 'b'
    await nextTick()
    expect(window.localStorage.getItem('ft:test')).toBe(JSON.stringify('b'))
  })

  it('round-trips complex objects as JSON', async () => {
    const value = useLocalStorage<{ items: number[] }>('ft:test', { items: [] })
    value.value = { items: [1, 2, 3] }
    await nextTick()
    expect(JSON.parse(window.localStorage.getItem('ft:test') as string)).toEqual({
      items: [1, 2, 3],
    })
  })

  it('removes the key when the value becomes null', async () => {
    window.localStorage.setItem('ft:test', JSON.stringify('a'))
    const value = useLocalStorage<string | null>('ft:test', 'a')
    value.value = null
    await nextTick()
    expect(window.localStorage.getItem('ft:test')).toBeNull()
  })

  it('keeps the default when the stored payload is corrupted', () => {
    window.localStorage.setItem('ft:test', '{not-json')
    const value = useLocalStorage('ft:test', 'safe')
    expect(value.value).toBe('safe')
  })

  it('is SSR-safe and returns the default when window is unavailable', () => {
    vi.stubGlobal('window', undefined)
    const value = useLocalStorage('ft:test', 'ssr')
    expect(value.value).toBe('ssr')
  })

  it('does not throw when writing fails (e.g. quota exceeded)', async () => {
    const setItem = vi
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => {
        throw new Error('QuotaExceeded')
      })

    const value = useLocalStorage('ft:test', 'a')
    value.value = 'b'
    await expect(nextTick()).resolves.not.toThrow()

    setItem.mockRestore()
  })
})
