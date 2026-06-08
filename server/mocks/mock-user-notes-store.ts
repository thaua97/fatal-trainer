import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { randomUUID } from 'node:crypto'
import type { AdminUserNote, AdminUserNotesResponse } from '#shared/types/admin'

const DATA_DIR = join(process.cwd(), 'server/data')
const NOTES_FILE = join(DATA_DIR, 'user-notes.json')

let cachedNotes: AdminUserNote[] | null = null

function ensureDataDir(): void {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true })
  }
}

function loadNotes(): AdminUserNote[] {
  if (cachedNotes) {
    return cachedNotes
  }

  if (existsSync(NOTES_FILE)) {
    const raw = readFileSync(NOTES_FILE, 'utf-8')
    cachedNotes = JSON.parse(raw) as AdminUserNote[]
    return cachedNotes
  }

  cachedNotes = []
  return cachedNotes
}

function saveNotes(notes: AdminUserNote[]): void {
  ensureDataDir()
  writeFileSync(NOTES_FILE, `${JSON.stringify(notes, null, 2)}\n`, 'utf-8')
  cachedNotes = notes
}

export function listUserNotes(userId: string): AdminUserNotesResponse {
  const items = loadNotes()
    .filter(note => note.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return { items }
}

export function createUserNote(
  userId: string,
  authorId: string,
  authorName: string,
  content: string,
): AdminUserNote {
  const trimmed = content.trim()
  if (!trimmed) {
    throw new Error('Note content is required')
  }

  const notes = loadNotes()
  const note: AdminUserNote = {
    id: randomUUID(),
    userId,
    authorId,
    authorName,
    content: trimmed,
    createdAt: new Date().toISOString(),
  }

  notes.unshift(note)
  saveNotes(notes)
  return note
}

export function countUserNotes(userId: string): number {
  return loadNotes().filter(note => note.userId === userId).length
}

export function deleteUserNotes(userId: string): void {
  const notes = loadNotes().filter(note => note.userId !== userId)
  saveNotes(notes)
}

export function resetNotesStore(): void {
  cachedNotes = []
  if (existsSync(NOTES_FILE)) {
    writeFileSync(NOTES_FILE, '[]\n', 'utf-8')
  }
}
