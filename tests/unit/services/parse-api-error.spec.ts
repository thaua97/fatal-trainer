import { describe, expect, it } from 'vitest'
import { parseApiError } from '~/services/api/extract-api-errors'

describe('parseApiError', () => {
  it('parses field errors and message code from fetch error', () => {
    const err = {
      statusCode: 400,
      data: {
        message: 'error.validation',
        errors: { email: 'invalidCredentials' },
      },
    }

    expect(parseApiError(err)).toEqual({
      statusCode: 400,
      message: 'error.validation',
      fieldErrors: { email: 'invalidCredentials' },
    })
  })

  it('falls back when error shape is unknown', () => {
    expect(parseApiError(null, 'error.network')).toEqual({
      message: 'error.network',
      fieldErrors: {},
    })
  })
})
