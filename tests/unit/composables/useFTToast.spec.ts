import { describe, expect, it, vi } from 'vitest'
import { createFTToast, resolveToastMessage } from '~/composables/core/useFTToast'

describe('useFTToast', () => {
  const toastAdd = vi.fn()
  const t = vi.fn((key: string) => key)

  const toast = createFTToast({
    add: toastAdd,
    t,
  })

  it('resolves translated messages', () => {
    const translate = (key: string) => (key === 'toast.errors.generic' ? 'Erro genérico' : key)
    expect(resolveToastMessage(translate, 'toast.errors.generic')).toBe('Erro genérico')
    expect(resolveToastMessage(translate, 'Mensagem direta')).toBe('Mensagem direta')
  })

  it('shows success toast with default icon', () => {
    toastAdd.mockReset()
    toast.success('Salvo com sucesso')

    expect(toastAdd).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Salvo com sucesso',
      color: 'success',
      icon: 'i-lucide-circle-check',
    }))
  })

  it('shows error toast with description', () => {
    toastAdd.mockReset()
    toast.error('Falha ao enviar', 'Tente novamente')

    expect(toastAdd).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Falha ao enviar',
      description: 'Tente novamente',
      color: 'error',
      icon: 'i-lucide-circle-x',
    }))
  })

  it('shows warning and info toasts', () => {
    toastAdd.mockReset()
    toast.warning('Atenção')
    toast.info('Informação')

    expect(toastAdd).toHaveBeenNthCalledWith(1, expect.objectContaining({
      title: 'Atenção',
      color: 'warning',
      icon: 'i-lucide-triangle-alert',
    }))
    expect(toastAdd).toHaveBeenNthCalledWith(2, expect.objectContaining({
      title: 'Informação',
      color: 'info',
      icon: 'i-lucide-info',
    }))
  })

  it('aggregates multiple field errors', () => {
    toastAdd.mockReset()
    toast.fromFieldErrors(
      { email: 'invalid', password: 'required' },
      (field, code) => `${field}:${code}`,
    )

    expect(toastAdd).toHaveBeenCalledWith(expect.objectContaining({
      title: 'email:invalid',
      description: 'password:required',
      color: 'error',
    }))
  })

  it('extracts API error message', () => {
    toastAdd.mockReset()
    toast.fromApiError({
      data: { message: 'toast.errors.generic' },
    })

    expect(toastAdd).toHaveBeenCalledWith(expect.objectContaining({
      title: 'toast.errors.generic',
      color: 'error',
    }))
  })
})
