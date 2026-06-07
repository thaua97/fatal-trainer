export function useFTProfileEditFieldUi() {
  const fieldBase = 'w-full rounded-2xl'

  function fullWidth(base: string) {
    return {
      root: 'w-full',
      base,
    }
  }

  const fieldUi = fullWidth(fieldBase)
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

  return {
    fieldUi,
    selectUi,
    professionUi,
    nameUi,
    priceUi,
    textareaUi,
    inputNumberUi,
    inputTimeUi,
    inputDateUi,
    listboxUi,
  }
}
