export function parseBrazilianPrice(text: string): number {
  const match = text.match(/R\$\s*([\d.]+(?:,\d{1,2})?)/)
  if (!match?.[1]) return Number.NaN
  return Number(match[1].replace(/\./g, '').replace(',', '.'))
}

export function parseRating(text: string): number {
  const match = text.match(/(\d+[,.]\d+)/)
  if (!match?.[1]) return Number.NaN
  return Number(match[1].replace(',', '.'))
}

export function assertSortedAscending(values: number[]) {
  for (let index = 1; index < values.length; index += 1) {
    expect(values[index]).to.be.at.least(values[index - 1]!)
  }
}

export function assertSortedDescending(values: number[]) {
  for (let index = 1; index < values.length; index += 1) {
    expect(values[index]).to.be.at.most(values[index - 1]!)
  }
}
