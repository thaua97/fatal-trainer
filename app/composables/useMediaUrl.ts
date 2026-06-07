import { resolveMediaUrl } from '#shared/utils/resolve-media-url'

export function useMediaUrl() {
  const config = useRuntimeConfig()

  function toMediaUrl(url: string | undefined | null): string {
    return resolveMediaUrl(url, {
      apiBaseUrl: config.public.apiBaseUrl as string,
      assetsBaseUrl: config.public.assetsBaseUrl as string | undefined,
    })
  }

  return { toMediaUrl }
}
