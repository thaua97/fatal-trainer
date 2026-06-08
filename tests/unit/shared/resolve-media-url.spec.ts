import { describe, expect, it } from 'vitest'
import { getAssetsBaseUrl, resolveMediaUrl } from '#shared/utils/resolve-media-url'

describe('resolveMediaUrl', () => {
  it('returns absolute URLs unchanged', () => {
    expect(resolveMediaUrl('https://cdn.example.com/trainers/a.jpg')).toBe(
      'https://cdn.example.com/trainers/a.jpg',
    )
  })

  it('prefixes /uploads paths with API origin', () => {
    expect(
      resolveMediaUrl('/uploads/trainers/t1/a.png', {
        apiBaseUrl: 'http://localhost:3333/api',
      }),
    ).toBe('http://localhost:3333/uploads/trainers/t1/a.png')
  })

  it('uses assetsBaseUrl when provided', () => {
    expect(
      resolveMediaUrl('/uploads/trainers/t1/a.png', {
        apiBaseUrl: 'http://localhost:3333/api',
        assetsBaseUrl: 'https://assets.example.com',
      }),
    ).toBe('https://assets.example.com/uploads/trainers/t1/a.png')
  })

  it('getAssetsBaseUrl strips /api suffix', () => {
    expect(getAssetsBaseUrl('http://localhost:3333/api')).toBe('http://localhost:3333')
  })
})
