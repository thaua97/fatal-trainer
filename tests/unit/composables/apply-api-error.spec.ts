import { describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { applyApiError } from '~/composables/core/applyApiError'

describe('applyApiError', () => {
  it('sets inline field errors without toast when field errors exist', () => {
    const errors = ref<Record<string, string | undefined>>({})
    const toast = { error: vi.fn() }

    applyApiError({
      parsed: {
        message: 'error.validation',
        fieldErrors: { email: 'invalid' },
      },
      errors,
      toast: toast as never,
      translate: key => key,
    })

    expect(errors.value).toEqual({ email: 'invalid' })
    expect(toast.error).not.toHaveBeenCalled()
  })

  it('shows toast for global errors', () => {
    const errors = ref<Record<string, string | undefined>>({})
    const toast = { error: vi.fn() }

    applyApiError({
      parsed: {
        message: 'error.unauthorized',
        fieldErrors: {},
      },
      errors,
      toast: toast as never,
      translate: key => key,
    })

    expect(errors.value).toEqual({})
    expect(toast.error).toHaveBeenCalledWith('error.unauthorized')
  })
})
