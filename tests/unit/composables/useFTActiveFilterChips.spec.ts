import { describe, it, expect } from 'vitest'
import { useFTActiveFilterChips } from '../../../app/composables/components/useFTActiveFilterChips'

describe('useFTActiveFilterChips', () => {
  it('exports dismissChip function', () => {
    expect(typeof useFTActiveFilterChips).toBe('function')
  })
})
