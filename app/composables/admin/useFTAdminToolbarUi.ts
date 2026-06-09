export function useFTAdminToolbarUi() {
  const searchBase = [
    'h-10 w-full rounded-full px-4 text-sm',
    'border border-slate-200 bg-white shadow-sm transition-all',
    'hover:border-violet-300',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/25 focus-visible:border-violet-300',
  ].join(' ')

  const searchUi = {
    root: 'w-full',
    base: searchBase,
  }

  const controlSize = 'md' as const

  const toolbarRowClass =
    'flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between'

  const searchWrapperClass =
    'w-full min-w-0 lg:max-w-sm xl:max-w-md lg:shrink-0'

  const actionsGroupClass =
    'flex flex-wrap items-center gap-2 lg:shrink-0'

  const viewToggleClass =
    'inline-flex h-10 items-center rounded-full border border-slate-200 bg-white p-1 shadow-sm'

  const actionButtonClass = 'h-10 rounded-full'

  const sortButtonClass = 'h-10 max-w-[9rem] truncate rounded-full sm:max-w-none'

  const ctaButtonClass = 'h-10 rounded-full font-semibold'

  return {
    searchUi,
    controlSize,
    toolbarRowClass,
    searchWrapperClass,
    actionsGroupClass,
    viewToggleClass,
    actionButtonClass,
    sortButtonClass,
    ctaButtonClass,
  }
}
