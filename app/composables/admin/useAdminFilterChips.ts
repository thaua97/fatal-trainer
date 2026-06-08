export interface AdminFilterChip {
  key: string
  label: string
  clear: () => void
}

export function useAdminFilterChips<T extends Record<string, unknown>>(
  query: Ref<T>,
  chips: Array<{
    key: string
    label: string | (() => string | undefined)
    when: (query: T) => boolean
    field: keyof T
  }>,
) {
  const activeFilterChips = computed<AdminFilterChip[]>(() => {
    return chips.flatMap((chip) => {
      if (!chip.when(query.value)) return []

      const label = typeof chip.label === 'function' ? chip.label() : chip.label
      if (!label) return []

      return [{
        key: chip.key,
        label,
        clear: () => {
          query.value = { ...query.value, [chip.field]: undefined }
        },
      }]
    })
  })

  return { activeFilterChips }
}
