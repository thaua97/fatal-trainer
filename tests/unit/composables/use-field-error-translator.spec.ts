import { describe, expect, it } from 'vitest'
import { createFieldErrorTranslator } from '~/composables/core/useFieldErrorTranslator'

describe('createFieldErrorTranslator', () => {
  it('translates known field error codes', () => {
    const translate = (key: string) => {
      if (key === 'auth.errors.email.invalid') {
        return 'E-mail inválido'
      }
      return key
    }

    const errorMessage = createFieldErrorTranslator(translate, 'auth.errors')

    expect(errorMessage('email', 'invalid')).toBe('E-mail inválido')
  })

  it('returns undefined when code is missing', () => {
    const errorMessage = createFieldErrorTranslator(key => key, 'auth.errors')
    expect(errorMessage('email')).toBeUndefined()
  })

  it('falls back to raw code when translation is missing', () => {
    const errorMessage = createFieldErrorTranslator(key => key, 'auth.errors')
    expect(errorMessage('email', 'unknown')).toBe('unknown')
  })
})
