export function parseQueryArray(value: string | string[] | undefined): string[] | undefined {
  if (value == null) {
    return undefined
  }

  const raw = Array.isArray(value) ? value.join(',') : value
  const items = raw
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

  return items.length ? items : undefined
}

export function stringifyQueryArray(values: string[] | undefined): string | undefined {
  if (!values?.length) {
    return undefined
  }

  return values.join(',')
}

export function parseQueryBoolean(value: string | undefined): boolean | undefined {
  if (value === 'true') {
    return true
  }

  if (value === 'false') {
    return false
  }

  return undefined
}
