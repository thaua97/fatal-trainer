export function mergeLocaleMessages(
  ...sources: Record<string, unknown>[]
): Record<string, unknown> {
  return sources.reduce<Record<string, unknown>>((merged, source) => {
    for (const [key, value] of Object.entries(source)) {
      if (
        value
        && typeof value === 'object'
        && !Array.isArray(value)
        && merged[key]
        && typeof merged[key] === 'object'
        && !Array.isArray(merged[key])
      ) {
        merged[key] = mergeLocaleMessages(
          merged[key] as Record<string, unknown>,
          value as Record<string, unknown>,
        )
      }
      else {
        merged[key] = value
      }
    }

    return merged
  }, {})
}
