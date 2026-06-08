import type { AdminUserListItem } from '#shared/types/admin'
import { formatBrazilianPhone, stripPhoneDigits } from './format-brazilian-phone'

export function formatAdminPhone(phone?: string): string | null {
  if (!phone) return null
  const digits = stripPhoneDigits(phone)
  if (digits.length === 10 || digits.length === 11) {
    return formatBrazilianPhone(digits)
  }
  return phone
}

export function formatAdminLocation(user: Pick<AdminUserListItem, 'city' | 'state'>): string | null {
  if (user.city && user.state) return `${user.city}, ${user.state}`
  return user.city ?? user.state ?? null
}

export function formatRelativeAccessTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime()
  const minutes = Math.floor(diffMs / 60_000)
  if (minutes < 1) return 'agora'
  if (minutes < 60) return `há ${minutes} min`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `há ${hours}h`
  const days = Math.floor(hours / 24)
  if (days === 1) return 'ontem'
  return `há ${days} dias`
}
