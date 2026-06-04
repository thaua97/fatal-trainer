/** Fotos fitness no Pexels — https://www.pexels.com/pt-br/ (uso gratuito, sem API key) */
const AVATAR_PHOTO_IDS = [
  1552109,
  1229356,
  6455772,
  4164761,
  3775549,
  8409998,
  863988,
  949131,
  2204196,
  407936,
  3823039,
  3757942,
  6455823,
  8412867,
  6583500,
  703014,
] as const

const GALLERY_PHOTO_IDS = [
  1954524,
  841130,
  1533829,
  17840,
  416475,
  2261487,
  3253494,
  260352,
  2827392,
  3823488,
  3825163,
  791764,
] as const

function buildPexelsUrl(photoId: number, width: number, height: number): string {
  const params = new URLSearchParams({
    auto: 'compress',
    cs: 'tinysrgb',
    w: String(width),
    h: String(height),
    fit: 'crop',
  })

  return `https://images.pexels.com/photos/${photoId}/pexels-photo-${photoId}.jpeg?${params}`
}

export function getMockAvatarUrl(index: number): string {
  const photoId = AVATAR_PHOTO_IDS[index % AVATAR_PHOTO_IDS.length]!
  return buildPexelsUrl(photoId, 400, 400)
}

export function getMockGalleryUrls(index: number, count = 3): string[] {
  const urls: string[] = []

  for (let offset = 0; offset < count; offset++) {
    const photoId = GALLERY_PHOTO_IDS[(index + offset) % GALLERY_PHOTO_IDS.length]!
    urls.push(buildPexelsUrl(photoId, 800, 600))
  }

  return urls
}
