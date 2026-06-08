export function useFTFormFieldUi() {
  const fieldBase = [
    'w-full rounded-2xl min-h-12 px-4 py-3.5 text-sm',
    'border border-slate-200 bg-white shadow-sm transition-all',
    'hover:border-violet-300',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/25 focus-visible:border-violet-300',
  ].join(' ')

  const authFieldBase = `${fieldBase} bg-slate-50/80`

  function fullWidth(base: string) {
    return {
      root: 'w-full',
      base,
    }
  }

  const fieldUi = fullWidth(fieldBase)
  const authFieldUi = fullWidth(authFieldBase)
  const selectUi = fullWidth(fieldBase)
  const professionUi = fullWidth(`${fieldBase} text-sm`)
  const nameUi = fullWidth(`${fieldBase} text-xl font-bold lg:text-2xl`)
  const priceUi = fullWidth(`${fieldBase} text-2xl font-bold text-primary`)
  const textareaUi = fullWidth(`${fieldBase} leading-relaxed`)
  const inputNumberUi = fullWidth(fieldBase)
  const inputTimeUi = fullWidth(fieldBase)
  const inputDateUi = fullWidth(fieldBase)
  const listboxUi = {
    root: 'w-full max-h-64',
    base: 'w-full',
  }

  const inputSize = 'lg' as const

  return {
    fieldUi,
    authFieldUi,
    selectUi,
    professionUi,
    nameUi,
    priceUi,
    textareaUi,
    inputNumberUi,
    inputTimeUi,
    inputDateUi,
    listboxUi,
    inputSize,
  }
}
