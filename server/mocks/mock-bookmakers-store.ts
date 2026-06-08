const bookmakers = new Map<string, Set<string>>()

export function getBookmakerIds(userId: string): string[] {
  return [...(bookmakers.get(userId) ?? new Set())]
}

export function addBookmaker(userId: string, trainerId: string): void {
  const current = bookmakers.get(userId) ?? new Set<string>()
  current.add(trainerId)
  bookmakers.set(userId, current)
}

export function removeBookmaker(userId: string, trainerId: string): void {
  const current = bookmakers.get(userId)
  if (!current) {
    return
  }

  current.delete(trainerId)

  if (current.size === 0) {
    bookmakers.delete(userId)
    return
  }

  bookmakers.set(userId, current)
}

export function setBookmakers(userId: string, trainerIds: string[]): void {
  const current = bookmakers.get(userId) ?? new Set<string>()

  for (const trainerId of trainerIds) {
    current.add(trainerId)
  }

  bookmakers.set(userId, current)
}

export function resetBookmakersStore(): void {
  bookmakers.clear()
}
