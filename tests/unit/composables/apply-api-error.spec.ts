import { describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { applyApiError } from '~/composables/core/applyApiError'

describe('applyApiError', () => {
  it('shows toast for account deactivated without field errors', () => {
    const errors = ref<Record<string, string | undefined>>({})
    const toast = { error: vi.fn() }
    const translate = (key: string) => (
      key === 'error.accountDeactivated'
        ? 'Sua conta foi desativada.'
        : key
    )

    applyApiError({
      parsed: {
        message: 'error.accountDeactivated',
        fieldErrors: {},
      },
      errors,
      toast: toast as never,
      translate,
    })

    expect(errors.value).toEqual({})
    expect(toast.error).toHaveBeenCalledWith('Sua conta foi desativada.')
  })
})
